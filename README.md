# Relay Command Center v4.2 — Light Calendar Actions

The stable demo-ready frontend for the Relay AI Support Dispatcher.

## Included

- Live n8n ticket feed
- Relay AI briefing and confidence gauge
- Executive dashboard metrics
- Searchable and filterable ticket queue
- Full AI dispatch analysis
- Customer profiles
- Operations reports
- Ask Relay preview
- Live activity and technician workload
- New Ticket interface
- Configurable GET and POST webhooks
- Responsive dark interface
- Relay icon and public assets

## Netlify

Build command:

`npm run build`

Publish directory:

`dist`

## Current live GET endpoint

`https://ericthegreaaat.app.n8n.cloud/webhook/relay-tickets`

## Next focused backend enhancement

Create the POST workflow:

`https://ericthegreaaat.app.n8n.cloud/webhook/relay-create-ticket`

The interface already sends:

```json
{
  "customerName": "Eric",
  "companyName": "PAX Telecom",
  "customerEmail": "eric@example.com",
  "subject": "Phones down",
  "body": "All phones are unavailable."
}
```

Use test data until login and webhook authentication are added.


## v3 Enterprise additions

- Demo login experience
- Automatic 15-second ticket refresh
- New-ticket notification counter
- Last-updated timestamp
- Ticket event timeline
- Priority-distribution analytics
- Improved mobile presentation
- Existing n8n GET ticket workflow remains unchanged

The included login is presentation-only. It does not provide production authentication or protect the n8n endpoint.


## v4 Operations additions

- Shared Projects menu
- Month calendar view
- Multi-day projects
- New Project form
- Project list and detail panel
- Tentative and Awaiting Availability statuses
- Technician assignment and estimated labor
- Separate GET and POST project webhook settings
- Ticket workflow remains unchanged

Expected project endpoints:

- GET `https://ericthegreaaat.app.n8n.cloud/webhook/relay-projects`
- POST `https://ericthegreaaat.app.n8n.cloud/webhook/relay-create-project`

The GET Projects workflow may be connected first. Until the POST workflow is active, the New Project form will show that the project workflow is not ready.


## v4.1
- Clickable calendar dates
- Visible event count badges
- Project names shown on scheduled dates
- Daily agenda panel
- Supports full n8n date/time values


## v4.2 visual changes

- White calendar cells for easier reading
- Light calendar background and darker date text
- Schedule action styled green
- Cancel action styled orange
- Delete action styled red
- Cancelled status styling included for future update workflow
