# Roadmap

## Administrator sign-in

- [x] Restore missing database permissions on the bank tables
- [x] Administrator sign-in page at `/admin/login` (creates the first admin when none exists)
- [x] Homepage entry point: header link, mobile menu, footer "Staff" column
- [x] Protected console: overview, customers, transactions, loans, support, audit
- [x] Approve / reject / complete decisions persist and are written to the audit trail
- [x] Sign-out returns to the sign-in page; the console stays shut while signed out
- [x] Mobile menu carries the administrator link
- [ ] Decide what happens to the test administrator account `ceo@varentabank.com` (created to verify the console; its email was confirmed directly because no sender domain is configured)
- [ ] Decide how new signups verify: set up an email domain, or allow instant sign-in so the first administrator can be created without waiting for a confirmation email

## Notes

- Console figures come from the sample book already in the database: 24 customers, 39 accounts, 160 transactions.
- The preview server had to be restarted once: it was still handing the browser an out-of-date page list, so the new console pages 404'd in the preview.
