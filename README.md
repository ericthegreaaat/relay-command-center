# Relay Command Center v2.0

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
