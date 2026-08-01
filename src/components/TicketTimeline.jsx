import { Bot, Mail, Send, TicketCheck, UserCheck } from "lucide-react";
import { formatDate } from "../utils/formatters";

export default function TicketTimeline({ ticket }) {
  const events = [
    [Mail, "Customer request received", ticket.Subject || ticket.IssueSummary],
    [Bot, "Relay analyzed the issue", `${ticket.Priority} priority · ${ticket.Category}`],
    [TicketCheck, "Ticket created", ticket.TicketID],
    [UserCheck, "Dispatch recommendation generated", ticket.DispatchAction || "Awaiting action"],
    [Send, "Customer acknowledgment prepared", ticket.CustomerReply ? "Reply available" : "No reply stored"],
  ];

  return <div className="timeline">{events.map(([Icon, title, detail], index) => (
    <div className="timeline-row" key={title}>
      <div className="timeline-marker"><Icon size={15} /></div>
      <div><strong>{title}</strong><p>{detail}</p><small>{index === 0 ? formatDate(ticket.Created) : "Automated by Relay"}</small></div>
    </div>
  ))}</div>;
}
