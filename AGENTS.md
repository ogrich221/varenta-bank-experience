<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Admin dashboard lives under `/admin` (`src/routes/admin*.tsx`, client-only); its `beforeLoad` checks the `has_role(..., 'admin')` RPC. Why: database RLS is the real security boundary; the route guard is only UX.
- Admin writes go through `useUpdate` in `src/lib/admin.ts`, which also records an `audit_logs` row. Why: every sensitive action must be traceable.
- The first account to sign up gets the admin role through a database trigger; later sign-ups get `user`. Why: lets the CEO claim the console without a manual setup step.
