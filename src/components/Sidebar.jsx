import {
  BarChart3, Bot, CalendarDays, LayoutDashboard, Settings, TicketCheck, Users
} from "lucide-react";

const items = [
  ["dashboard", "🌉 Bridge", LayoutDashboard],
  ["signals", "📡 Signals", TicketCheck],
  ["tickets", "🎫 Operations", TicketCheck],
  ["projects", "🎯 Missions", CalendarDays],
  ["customers", "👥 Clients", Users],
  ["reports", "📊 Intel", BarChart3],
  ["assistant", "🤖 Relay Core", Bot],
  ["settings", "⚙ Engineering", Settings],
];

export default function Sidebar({ active, onChange, connection }) {
  const label =
    connection === "online" ? "Relay AI Online" :
    connection === "demo" ? "Demo Mode" :
    connection === "offline" ? "Relay Offline" : "Connecting...";

  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="/relay-mark.svg" alt="" />
        <div><h1>Relay</h1><p>PAX Telecom</p></div>
      </div>

      <nav>
        {items.map(([id, text, Icon]) => (
          <button key={id} className={active === id ? "active" : ""} onClick={() => onChange(id)}>
            <Icon size={18} /> {text}
          </button>
        ))}
      </nav>

      <div className="relay-status">
        <span className={`status-dot ${connection}`} />
        <div><strong>{label}</strong><small>Dispatcher: Eric</small></div>
      </div>
    </aside>
  );
}
