import { useEffect, useMemo, useState } from "react";
import { CirclePlus, RefreshCw } from "lucide-react";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import ReportsPage from "./pages/ReportsPage";
import AssistantPage from "./pages/AssistantPage";
import TicketQueue from "./components/TicketQueue";
import TicketDetail from "./components/TicketDetail";
import NewTicketModal from "./components/NewTicketModal";
import { createTicket, DEFAULT_CREATE_URL, DEFAULT_TICKETS_URL, fetchTickets } from "./services/relayApi";

const demoTickets = [{
  TicketID: "PAX-DEMO-001", CustomerName: "Eric", CompanyName: "PAX Telecom",
  CustomerEmail: "Eric@paxtelecom.net", Subject: "Network closet fire",
  Priority: "Critical", Category: "Network", Status: "Open", DispatchStatus: "New",
  IssueSummary: "Network closet fire and damaged equipment.",
  ExecutiveSummary: "Immediate escalation and onsite inspection are required.",
  DispatchAction: "Escalate", SecurityRisk: "Critical", RecommendedTechnician: "Eric",
  EstimatedLaborHours: 8, OnsiteRecommended: true, RemotePossible: false,
  LikelyCause: "Physical equipment damage", Confidence: 98,
  InternalNotes: "Confirm the area is safe before entering.",
  CustomerReply: "Thank you for contacting PAX Telecom. Your request has been flagged for priority review.",
  Created: new Date().toISOString()
}];

export default function App() {
  const [view, setView] = useState("dashboard");
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [connection, setConnection] = useState("connecting");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [showNewTicket, setShowNewTicket] = useState(false);

  const [ticketsUrl, setTicketsUrl] = useState(localStorage.getItem("relayTicketsUrl") || DEFAULT_TICKETS_URL);
  const [createUrl, setCreateUrl] = useState(localStorage.getItem("relayCreateUrl") || DEFAULT_CREATE_URL);
  const [demoFallback, setDemoFallback] = useState(localStorage.getItem("relayDemoFallback") !== "false");

  const loadTickets = async () => {
    setConnection("connecting");
    setNotice("");
    try {
      const rows = await fetchTickets(ticketsUrl);
      if (!rows.length) throw new Error("The ticket webhook returned no rows.");
      setTickets(rows);
      setSelectedId((current) => rows.some((ticket) => ticket.TicketID === current) ? current : rows[0].TicketID);
      setConnection("online");
    } catch (error) {
      setTickets(demoFallback ? demoTickets : []);
      setSelectedId(demoFallback ? demoTickets[0].TicketID : "");
      setConnection(demoFallback ? "demo" : "offline");
      setNotice(`${demoFallback ? "Showing demo data. " : ""}${error.message}`);
    }
  };

  useEffect(() => { loadTickets(); }, []);

  const filteredTickets = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const searchable = Object.values(ticket).join(" ").toLowerCase();
      return (!term || searchable.includes(term)) &&
        (!priority || ticket.Priority === priority) &&
        (!status || ticket.Status === status);
    });
  }, [tickets, search, priority, status]);

  const selectedTicket = tickets.find((ticket) => ticket.TicketID === selectedId);

  const queueProps = {
    tickets: filteredTickets, selectedId, onSelect: setSelectedId,
    search, onSearch: setSearch, priority, onPriority: setPriority,
    status, onStatus: setStatus,
  };

  const submitTicket = async (payload) => {
    await createTicket(createUrl, payload);
    await loadTickets();
  };

  const saveSettings = (event) => {
    event.preventDefault();
    localStorage.setItem("relayTicketsUrl", ticketsUrl);
    localStorage.setItem("relayCreateUrl", createUrl);
    localStorage.setItem("relayDemoFallback", String(demoFallback));
    setNotice("Relay connection settings were saved.");
    loadTickets();
  };

  const title = {
    dashboard: "Command Center", tickets: "Tickets", customers: "Customers",
    assistant: "Ask Relay", reports: "Reports", settings: "Settings"
  }[view];

  return (
    <div className="app-shell">
      <Sidebar active={view} onChange={setView} connection={connection} />

      <main className="main-content">
        <header className="topbar">
          <div><h2>{title}</h2><p>AI-assisted support operations for PAX Telecom</p></div>
          <div className="top-actions">
            <button className="button secondary" onClick={loadTickets}><RefreshCw size={16} /> Refresh</button>
            <button className="button primary" onClick={() => setShowNewTicket(true)}><CirclePlus size={17} /> New Ticket</button>
            <div className="avatar">EM</div>
          </div>
        </header>

        {notice && <div className="banner">{notice}</div>}

        {view === "dashboard" && (
          <DashboardPage tickets={tickets} filteredTickets={filteredTickets}
            selectedTicket={selectedTicket} selectedId={selectedId} onSelect={setSelectedId}
            search={search} onSearch={setSearch} priority={priority} onPriority={setPriority}
            status={status} onStatus={setStatus} />
        )}

        {view === "tickets" && <section className="workspace"><TicketQueue {...queueProps} /><TicketDetail ticket={selectedTicket} /></section>}
        {view === "customers" && <CustomersPage tickets={tickets} />}
        {view === "assistant" && <AssistantPage />}
        {view === "reports" && <ReportsPage tickets={tickets} />}

        {view === "settings" && (
          <form className="panel settings-page" onSubmit={saveSettings}>
            <h3>Relay Connections</h3>
            <label>Tickets GET webhook<input value={ticketsUrl} onChange={(e) => setTicketsUrl(e.target.value)} /></label>
            <label>Create Ticket POST webhook<input value={createUrl} onChange={(e) => setCreateUrl(e.target.value)} /></label>
            <label className="check-row"><input type="checkbox" checked={demoFallback} onChange={(e) => setDemoFallback(e.target.checked)} /> Use demo data if n8n is unavailable</label>
            <button className="button primary" type="submit">Save Settings</button>
          </form>
        )}
      </main>

      {showNewTicket && <NewTicketModal onClose={() => setShowNewTicket(false)} onCreate={submitTicket} />}
    </div>
  );
}
