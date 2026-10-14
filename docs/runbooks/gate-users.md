# Add or remove a tester

1. Create the entry: `node scripts/gate-user.mjs name@example.com 'password'`
2. Build the new list: all current entries plus the new one, comma-separated. To remove a tester, leave their entry out.
3. `npx wrangler secret put GATE_USERS` and paste the list.
4. Share the password with the tester outside the repository.

To sign everybody out, change `GATE_SECRET` the same way.
