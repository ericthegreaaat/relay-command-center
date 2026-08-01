import { formatDate, priorityClass, yesNo } from "../utils/formatters";
import TicketTimeline from "./TicketTimeline";

const Card = ({ label, children }) => <div className="detail-card"><label>{label}</label><div>{children}</div></div>;
const Section = ({ label, children }) => <section className="detail-section"><h4>{label}</h4><p>{children}</p></section>;

export default function TicketDetail({ ticket }) {
  return (
    <section className="panel ticket-detail-panel">
      <header className="panel-header"><div><h3>AI Dispatch Analysis</h3><p>Relay ticket intelligence</p></div></header>
      {!ticket ? <div className="empty detail-empty">Select a ticket to view Relay's analysis.</div> : (
        <div className="ticket-detail">
          <h3>{ticket.TicketID}</h3>
          <p className="muted">{ticket.CustomerName} · {ticket.CompanyName}</p>

          <div className="detail-grid">
            <Card label="Priority"><span className={`priority ${priorityClass(ticket.Priority)}`}>{ticket.Priority}</span></Card>
            <Card label="Status">{ticket.Status}</Card>
            <Card label="Dispatch">{ticket.DispatchAction || "—"}</Card>
            <Card label="Technician">{ticket.RecommendedTechnician || "—"}</Card>
            <Card label="Remote">{yesNo(ticket.RemotePossible)}</Card>
            <Card label="Onsite">{yesNo(ticket.OnsiteRecommended)}</Card>
            <Card label="Security">{ticket.SecurityRisk || "—"}</Card>
            <Card label="Labor">{ticket.EstimatedLaborHours || "—"} hrs</Card>
          </div>

          <Section label="Issue Summary">{ticket.IssueSummary}</Section>
          <Section label="Executive Summary">{ticket.ExecutiveSummary || "—"}</Section>
          <Section label="Likely Cause">{ticket.LikelyCause || "—"}</Section>
          <Section label="AI Confidence">{ticket.Confidence !== "" ? `${ticket.Confidence}%` : "—"}</Section>
          <Section label="Internal Notes">{ticket.InternalNotes || "—"}</Section>
          <Section label="Customer Reply">{ticket.CustomerReply || "—"}</Section>
          <Section label="Created">{formatDate(ticket.Created)}</Section><section className="detail-section"><h4>Ticket Timeline</h4><TicketTimeline ticket={ticket} /></section>
        </div>
      )}
    </section>
  );
}
