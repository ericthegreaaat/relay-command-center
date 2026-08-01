import { Building2 } from "lucide-react";

export default function CustomersPage({ tickets }) {
  const map = new Map();
  tickets.forEach((ticket) => {
    const key = ticket.CompanyName !== "Unknown"
      ? ticket.CompanyName
      : ticket.CustomerEmail || ticket.CustomerName;
    if (!map.has(key)) map.set(key, {
      name: key, contact: ticket.CustomerName, email: ticket.CustomerEmail,
      tickets: 0, critical: 0
    });
    const item = map.get(key);
    item.tickets += 1;
    if (ticket.Priority === "Critical") item.critical += 1;
  });

  const customers = [...map.values()].sort((a, b) => b.tickets - a.tickets);

  return (
    <section className="panel simple-page">
      <h3>Customers</h3>
      <p className="muted">Profiles generated automatically from Relay ticket history.</p>
      <div className="customer-grid">
        {customers.map((customer) => (
          <article className="customer-card" key={customer.name}>
            <Building2 />
            <h3>{customer.name}</h3>
            <p>{customer.contact}</p>
            <small>{customer.email}</small>
            <footer><span>{customer.tickets} tickets</span><span>{customer.critical} critical</span></footer>
          </article>
        ))}
      </div>
    </section>
  );
}
