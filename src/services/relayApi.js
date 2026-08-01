export const DEFAULT_TICKETS_URL =
  "https://ericthegreaaat.app.n8n.cloud/webhook/relay-tickets";

export const DEFAULT_CREATE_URL =
  "https://ericthegreaaat.app.n8n.cloud/webhook/relay-create-ticket";

const pick = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) return source[key];
  }
  return "";
};

const normalizeBoolean = (value) => {
  if ([true, "true", 1, "1"].includes(value)) return true;
  if ([false, "false", 0, "0"].includes(value)) return false;
  return null;
};

export function normalizeTicket(raw) {
  return {
    TicketID: pick(raw, "TicketID", "ticketId"),
    CustomerName:
      pick(raw, "CustomerName", "customerName") ||
      pick(raw, "CustomerEmail", "customerEmail") ||
      "Unknown",
    CompanyName: pick(raw, "CompanyName", "companyName") || "Unknown",
    CustomerEmail: pick(raw, "CustomerEmail", "customerEmail"),
    Subject: pick(raw, "Subject", "subject"),
    Priority: pick(raw, "Priority", "priority") || "Unclassified",
    Category: pick(raw, "Category", "category") || "Other",
    Status: pick(raw, "Status", "status") || "Open",
    DispatchStatus: pick(raw, "DispatchStatus", "dispatchStatus") || "New",
    IssueSummary:
      pick(raw, "IssueSummary", "issueSummary") ||
      pick(raw, "Subject", "subject") ||
      "No issue summary available",
    ExecutiveSummary: pick(raw, "ExecutiveSummary", "executiveSummary"),
    SecurityRisk: pick(raw, "SecurityRisk", "securityRisk"),
    DispatchAction: pick(raw, "DispatchAction", "dispatchAction"),
    RecommendedTechnician: pick(raw, "RecommendedTechnician", "recommendedTechnician"),
    EstimatedResponse: pick(raw, "EstimatedResponse", "estimatedResponse"),
    EstimatedLaborHours: pick(raw, "EstimatedLaborHours", "estimatedLaborHours"),
    OnsiteRecommended: normalizeBoolean(pick(raw, "OnsiteRecommended", "onsiteRecommended")),
    RemotePossible: normalizeBoolean(pick(raw, "RemotePossible", "remotePossible")),
    LikelyCause: pick(raw, "LikelyCause", "likelyCause", "LikleyCause"),
    Confidence: pick(raw, "Confidence", "confidence"),
    InternalNotes: pick(raw, "InternalNotes", "internalNotes"),
    CustomerReply: pick(raw, "CustomerReply", "customerReply"),
    Created: pick(raw, "Created", "created", "createdAt"),
  };
}

function unpack(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.body)) return data.body;
  if (data && typeof data === "object") return [data];
  return [];
}

export async function fetchTickets(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Tickets webhook returned ${response.status}`);

  return unpack(await response.json())
    .map(normalizeTicket)
    .filter((ticket) => ticket.TicketID)
    .sort((a, b) => new Date(b.Created || 0) - new Date(a.Created || 0));
}

export async function createTicket(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Create-ticket webhook returned ${response.status}`);
  return response.json();
}
