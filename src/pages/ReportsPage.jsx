import { Activity, Clock3, ShieldAlert, Wrench } from "lucide-react";

export default function ReportsPage({ tickets }) {
  const critical = tickets.filter((t) => t.Priority === "Critical").length;
  const onsite = tickets.filter((t) => t.OnsiteRecommended === true).length;
  const labor = tickets.reduce((sum, t) => sum + Number(t.EstimatedLaborHours || 0), 0);
  const criticalRate = tickets.length ? Math.round((critical / tickets.length) * 100) : 0;

  const cards = [
    [Activity, "Ticket Volume", tickets.length, "Total stored tickets"],
    [ShieldAlert, "Critical Rate", `${criticalRate}%`, "Tickets marked Critical"],
    [Wrench, "Onsite Work", onsite, "Onsite visits recommended"],
    [Clock3, "Estimated Labor", `${labor} hrs`, "Current estimated workload"],
  ];

  return (
    <section className="report-grid">
      {cards.map(([Icon, label, value, description]) => (
        <article className="panel report-card" key={label}>
          <Icon />
          <h3>{label}</h3>
          <strong>{value}</strong>
          <p>{description}</p>
        </article>
      ))}
    </section>
  );
}
