import { Search } from "lucide-react";
import { priorityClass } from "../utils/formatters";

export default function TicketQueue({
  tickets, selectedId, onSelect, search, onSearch,
  priority, onPriority, status, onStatus
}) {
  return (
    <section className="panel">
      <header className="panel-header">
        <div><h3>Ticket Queue</h3><p>{tickets.length} tickets</p></div>
        <div className="filters">
          <label className="search-box">
            <Search size={16} />
            <input placeholder="Search tickets..." value={search} onChange={(e) => onSearch(e.target.value)} />
          </label>
          <select value={priority} onChange={(e) => onPriority(e.target.value)}>
            <option value="">All priorities</option>
            <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
          </select>
          <select value={status} onChange={(e) => onStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option>New</option><option>Open</option><option>In Progress</option>
            <option>Waiting</option><option>Resolved</option><option>Closed</option>
          </select>
        </div>
      </header>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Ticket</th><th>Customer</th><th>Priority</th><th>Issue</th><th>Status</th></tr></thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.TicketID} className={selectedId === ticket.TicketID ? "selected" : ""} onClick={() => onSelect(ticket.TicketID)}>
                <td><strong>{ticket.TicketID}</strong><small>{ticket.Category}</small></td>
                <td>{ticket.CustomerName}<small>{ticket.CompanyName}</small></td>
                <td><span className={`priority ${priorityClass(ticket.Priority)}`}>{ticket.Priority}</span></td>
                <td>{ticket.IssueSummary}</td>
                <td>{ticket.Status}</td>
              </tr>
            ))}
            {!tickets.length && <tr><td colSpan="5" className="empty">No tickets match your filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
