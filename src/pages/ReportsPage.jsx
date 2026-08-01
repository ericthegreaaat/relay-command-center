import { Activity, Clock3, ShieldAlert, Wrench } from "lucide-react";

export default function ReportsPage({ tickets }) {
  const count = (priority) => tickets.filter((t) => t.Priority === priority).length;
  const critical = count("Critical");
  const onsite = tickets.filter((t) => t.OnsiteRecommended === true).length;
  const labor = tickets.reduce((sum, t) => sum + Number(t.EstimatedLaborHours || 0), 0);
  const max = Math.max(1, ...["Critical","High","Medium","Low"].map(count));

  return <>
    <section className="report-grid">
      {[
        [Activity, "Ticket Volume", tickets.length, "Total stored tickets"],
        [ShieldAlert, "Critical Rate", `${tickets.length ? Math.round(critical / tickets.length * 100) : 0}%`, "Tickets marked Critical"],
        [Wrench, "Onsite Work", onsite, "Onsite visits recommended"],
        [Clock3, "Estimated Labor", `${labor} hrs`, "Current estimated workload"],
      ].map(([Icon,label,value,description]) => (
        <article className="panel report-card" key={label}><Icon /><h3>{label}</h3><strong>{value}</strong><p>{description}</p></article>
      ))}
    </section>
    <section className="panel analytics-panel">
      <header className="panel-header"><div><h3>Priority Distribution</h3><p>Current ticket mix</p></div></header>
      <div className="bar-chart">
        {["Critical","High","Medium","Low"].map((p) => (
          <div className="bar-row" key={p}><span>{p}</span><div><i className={p.toLowerCase()} style={{width:`${count(p)/max*100}%`}} /></div><strong>{count(p)}</strong></div>
        ))}
      </div>
    </section>
  </>;
}
