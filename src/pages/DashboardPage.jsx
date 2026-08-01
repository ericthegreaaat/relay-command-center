import { Activity, Wrench, Zap } from "lucide-react";
import MetricCard from "../components/MetricCard";
import TicketQueue from "../components/TicketQueue";
import TicketDetail from "../components/TicketDetail";

export default function DashboardPage(props) {
  const { tickets, filteredTickets, selectedTicket, selectedId, onSelect,
    search, onSearch, priority, onPriority, status, onStatus } = props;

  const open = tickets.filter((t) => !["Closed", "Resolved"].includes(t.Status)).length;
  const critical = tickets.filter((t) => t.Priority === "Critical").length;
  const high = tickets.filter((t) => t.Priority === "High").length;
  const onsite = tickets.filter((t) => t.OnsiteRecommended === true).length;
  const labor = tickets.reduce((sum, t) => sum + Number(t.EstimatedLaborHours || 0), 0);
  const confidence = tickets.length
    ? Math.round(tickets.reduce((sum, t) => sum + Number(t.Confidence || 0), 0) / tickets.length)
    : 0;

  const urgent = tickets.filter((t) => ["Critical", "High"].includes(t.Priority));
  const briefing = urgent.length
    ? `${urgent.length} ticket${urgent.length === 1 ? "" : "s"} require priority attention. Review ${urgent[0].TicketID} first: ${urgent[0].IssueSummary}`
    : `There are ${open} open tickets and no Critical or High incidents.`;

  return (
    <>
      <section className="ai-briefing">
        <div>
          <div className="eyebrow"><Zap size={15} /> Relay AI Briefing</div>
          <h3>{briefing}</h3>
          <p>Relay is reviewing severity, business impact, and dispatch requirements.</p>
        </div>
        <div className="confidence-ring" style={{ "--score": `${confidence * 3.6}deg` }}>
          <div><strong>{confidence}%</strong><small>Avg. confidence</small></div>
        </div>
      </section>

      <section className="metrics">
        <MetricCard label="Open Tickets" value={open} />
        <MetricCard label="Critical" value={critical} tone="critical" />
        <MetricCard label="High" value={high} tone="high" />
        <MetricCard label="Onsite" value={onsite} tone="medium" />
        <MetricCard label="Est. Labor" value={`${labor}h`} tone="low" />
      </section>

      <section className="workspace">
        <TicketQueue tickets={filteredTickets} selectedId={selectedId} onSelect={onSelect}
          search={search} onSearch={onSearch} priority={priority} onPriority={onPriority}
          status={status} onStatus={onStatus} />
        <TicketDetail ticket={selectedTicket} />
      </section>

      <section className="dashboard-bottom">
        <article className="panel compact-panel">
          <header className="panel-header"><div><h3>Live Activity</h3><p>Latest Relay events</p></div><Activity size={18} /></header>
          <div className="activity-list">
            {tickets.slice(0, 5).map((ticket) => (
              <div className="activity-row" key={ticket.TicketID}>
                <span className={`activity-dot ${ticket.Priority.toLowerCase()}`} />
                <div><strong>{ticket.TicketID} entered the queue</strong><small>{ticket.CustomerName} · {ticket.Priority}</small></div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel compact-panel">
          <header className="panel-header"><div><h3>Technician Workload</h3><p>Current estimated effort</p></div><Wrench size={18} /></header>
          <div className="workload">
            <div className="technician-avatar">E</div>
            <div><h3>Eric</h3><p>{open} active tickets · {labor} estimated hours</p>
              <div className="progress"><span style={{ width: `${Math.min(100, labor * 8)}%` }} /></div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
