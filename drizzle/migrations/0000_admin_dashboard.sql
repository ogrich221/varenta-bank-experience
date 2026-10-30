create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role public.app_role not null, unique(user_id,role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role public.app_role) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user_role() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if not exists (select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id,role) values (new.id,'admin');
  else
    insert into public.user_roles(user_id,role) values (new.id,'user');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_role after insert on auth.users for each row execute function public.handle_new_user_role();

create table public.customers (id uuid primary key default gen_random_uuid(), full_name text not null, email text not null, phone text, country text, status text not null default 'active' check (status in ('active','frozen','closed')), kyc_verified boolean not null default false, created_at timestamptz not null default now());
create table public.accounts (id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id) on delete cascade, account_number text not null unique, account_type text not null default 'checking', balance numeric(14,2) not null default 0, currency text not null default 'USD', status text not null default 'active' check (status in ('active','frozen','closed')), created_at timestamptz not null default now());
create table public.transactions (id uuid primary key default gen_random_uuid(), reference text not null unique, customer_id uuid references public.customers(id) on delete set null, account_id uuid references public.accounts(id) on delete set null, txn_type text not null check (txn_type in ('deposit','withdrawal','transfer','payment')), amount numeric(14,2) not null check (amount>0), status text not null default 'pending' check (status in ('pending','approved','rejected','completed')), counterparty text, description text, reviewed_by uuid, reviewed_at timestamptz, created_at timestamptz not null default now());
create table public.loans (id uuid primary key default gen_random_uuid(), customer_id uuid references public.customers(id) on delete cascade, amount numeric(14,2) not null, interest_rate numeric(5,2) not null, term_months int not null, purpose text, status text not null default 'pending' check (status in ('pending','approved','rejected','active','repaid')), created_at timestamptz not null default now());
create table public.cards (id uuid primary key default gen_random_uuid(), customer_id uuid references public.customers(id) on delete cascade, last4 text not null, brand text not null, card_type text not null, status text not null default 'active' check (status in ('active','frozen','blocked')), spend_limit numeric(14,2) not null default 5000, created_at timestamptz not null default now());
create table public.notifications (id uuid primary key default gen_random_uuid(), title text not null, body text, level text not null default 'info' check (level in ('info','success','warning','critical')), is_read boolean not null default false, created_at timestamptz not null default now());
create table public.support_tickets (id uuid primary key default gen_random_uuid(), customer_id uuid references public.customers(id) on delete set null, subject text not null, message text, priority text not null default 'medium' check (priority in ('low','medium','high','urgent')), status text not null default 'open' check (status in ('open','in_progress','resolved')), created_at timestamptz not null default now());
create table public.audit_logs (id uuid primary key default gen_random_uuid(), actor_id uuid not null, actor_email text, action text not null, target text, details jsonb, created_at timestamptz not null default now());

do $$ declare t text; begin
  foreach t in array array['customers','accounts','transactions','loans','cards','notifications','support_tickets'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "Admins manage %1$s" on public.%1$I for all to authenticated using (public.has_role(auth.uid(),''admin'')) with check (public.has_role(auth.uid(),''admin''))', t);
  end loop;
end $$;
grant select, insert on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;
create policy "Admins read audit" on public.audit_logs for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins write own audit" on public.audit_logs for insert to authenticated with check (public.has_role(auth.uid(),'admin') and actor_id = auth.uid());

alter publication supabase_realtime add table public.transactions;
alter publication supabase_realtime add table public.notifications;

insert into public.customers(full_name,email,phone,country,status,kyc_verified,created_at)
select n, lower(replace(n,' ','.'))||'@mail.com', '+1 555 '||(1000+i*37), c,
  case when i%9=0 then 'frozen' when i=23 then 'closed' else 'active' end, i%7<>0, now()-((i*17)%400||' days')::interval
from unnest(array['Amara Okafor','Daniel Reyes','Sofia Laurent','Liam Chen','Noah Patel','Emma Schmidt','Yuki Tanaka','Lucas Silva','Olivia Brown','Mateo Rossi','Aisha Khan','Ethan Walker','Chloe Martin','Omar Haddad','Isabella Garcia','Jonas Berg','Mia Kowalski','Arjun Mehta','Hana Kim','Leo Dubois','Zara Ali','Ben Carter','Nina Petrova','Kofi Mensah'],
 array['Nigeria','Mexico','France','Singapore','India','Germany','Japan','Brazil','UK','Italy','UAE','USA','France','UAE','Spain','Norway','Poland','India','South Korea','France','UAE','USA','Bulgaria','Ghana']) with ordinality as x(n,c,i);
insert into public.accounts(customer_id,account_number,account_type,balance,status,created_at)
select id, 'VB'||(4000000000+row_number() over ()*7919), t, round((random()*240000+500)::numeric,2), case when status='active' then 'active' else 'frozen' end, created_at
from public.customers, lateral (select unnest(case when length(full_name)%2=0 then array['checking','savings'] else array['checking'] end) t) a;
insert into public.transactions(reference,customer_id,account_id,txn_type,amount,status,counterparty,description,created_at)
select 'TX'||(100000+g), a.customer_id, a.id,
  (array['deposit','deposit','withdrawal','transfer','payment','deposit','withdrawal','transfer'])[1+g%8],
  round((random()*24000+20)::numeric,2),
  case when g<25 then 'pending' when g%11=0 then 'rejected' when g%5=0 then 'approved' else 'completed' end,
  (array['Lumen Co.','Bloom Grocery','Northwind Ltd','Atlas Rentals','Orbit Telecom','Vela Airlines','Kite Payroll','Cobalt Energy'])[1+g%8],
  (array['Mobile app','Branch','Online banking','ATM'])[1+g%4],
  now()-((g*31)%(180*24)||' hours')::interval - (case when g<25 then interval '0' else interval '4 days' end)
from generate_series(1,160) g
cross join lateral (select id, customer_id from public.accounts order by md5(id::text||g) limit 1) a;
insert into public.loans(customer_id,amount,interest_rate,term_months,purpose,status,created_at)
select id, (5+(row_number() over ())*13%195)*1000, round((3.5+random()*7.5)::numeric,2), (array[12,24,36,60])[1+(row_number() over ())::int%4],
 (array['Home renovation','Business expansion','Car purchase','Education','Debt consolidation'])[1+(row_number() over ())::int%5],
 (array['pending','pending','approved','active','rejected','repaid'])[1+(row_number() over ())::int%6], now()-(random()*90||' days')::interval
from (select id from public.customers order by full_name limit 12) c;
insert into public.cards(customer_id,last4,brand,card_type,status,spend_limit)
select id, lpad((1000+(random()*8999)::int)::text,4,'0'), case when random()>.5 then 'Visa' else 'Mastercard' end,
 (array['debit','credit','metal'])[1+(random()*2)::int], case when full_name like 'M%' then 'frozen' when full_name like 'B%' then 'blocked' else 'active' end,
 (array[2000,5000,10000,25000])[1+(random()*3)::int]
from public.customers where status<>'closed';
insert into public.notifications(title,body,level,created_at) values
('Large withdrawal flagged','A withdrawal over $20,000 needs review.','warning',now()-interval '20 minutes'),
('Suspicious login attempt','Blocked sign-in from an unknown device in Lagos.','critical',now()-interval '2 hours'),
('Loan applications received','New loan applications are waiting for approval.','info',now()-interval '5 hours'),
('New customer onboarded','Kofi Mensah completed identity checks.','success',now()-interval '1 day'),
('Daily settlement complete','All clearing hubs settled successfully.','success',now()-interval '1 day'),
('Card frozen by customer','Mia Kowalski froze her debit card.','info',now()-interval '2 days');
insert into public.support_tickets(customer_id,subject,message,priority,status,created_at)
select (select id from public.customers order by md5(s) limit 1), s, m, p, st, now()-(h||' hours')::interval from (values
('Can''t log in to app','I keep getting an error after the update.','high','open',3),
('Card declined abroad','My card was declined in Tokyo.','urgent','open',1),
('Statement request','Please send my March statement.','low','in_progress',30),
('Update phone number','I changed my number.','medium','resolved',70),
('Transfer delayed','My transfer to Germany hasn''t arrived.','high','in_progress',12)) v(s,m,p,st,h);