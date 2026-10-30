# Roadmap

## Administrator sign-in (in progress)

- [x] Restore missing database permissions on the bank tables
- [x] Administrator sign-in page at `/admin/login` (creates the first admin when none exists)
- [x] Homepage entry point: header link, mobile menu, footer "Staff" column
- [x] Protected console: overview with live bank totals
- [ ] Re-verify customers / transactions / loans / support / audit pages in the browser (they 404'd on a direct load while the route tree was still rebuilding; a plain server check now returns them fine)
- [ ] Confirm an approve/reject decision is recorded in the audit trail
- [ ] Decide what happens to the test administrator account `ceo@varentabank.com` (created by me to verify the console; email was confirmed directly because no sender domain is configured)

## Notes

- The console's data is the sample book already in the database (24 customers, 39 accounts, 160 transactions).
- New signups need to confirm by email before they can sign in; with no email domain set up, that confirmation may not arrive. Ask the user whether to allow instant sign-in for admin setup.
