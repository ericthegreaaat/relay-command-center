# Relay Command Center React v1

## Included
- Live n8n ticket feed
- Dashboard metrics
- Ticket queue, search, and filters
- AI dispatch detail panel
- Customer profiles
- Reports
- Ask Relay preview
- Settings
- New Ticket form wired to a future POST webhook

## Run locally
1. Install Node.js.
2. Open a terminal in this folder.
3. Run:
   npm install
   npm run dev

## Deploy to Netlify
Recommended:
- Push this folder to GitHub and import it into Netlify.
- Build command: npm run build
- Publish directory: dist

Or build locally with:
   npm install
   npm run build

Then upload the generated dist folder to Netlify.

## Existing GET webhook
https://ericthegreaaat.app.n8n.cloud/webhook/relay-tickets

## Next workflow
Create an n8n POST webhook at:
https://ericthegreaaat.app.n8n.cloud/webhook/relay-create-ticket

It should accept customerName, companyName, customerEmail, subject, and body; then run Relay AI, create the Ticket ID, insert the row, and return JSON.

Use test data only until authentication is added.
