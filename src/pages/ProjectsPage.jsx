import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, CirclePlus, MapPin } from "lucide-react";

const statusTone = (status) =>
  ({
    Planning: "planning",
    "Awaiting Availability": "awaiting",
    Tentative: "tentative",
    Scheduled: "scheduled",
    "In Progress": "progress",
    Complete: "complete",
    "On Hold": "hold",
  })[status] || "planning";

const dateKey = (value) => {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function ProjectsPage({ projects, onNewProject, loading, error }) {
  const [cursor, setCursor] = useState(new Date());
  const [selectedId, setSelectedId] = useState(projects[0]?.ProjectID || "");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthName = cursor.toLocaleString([], { month: "long", year: "numeric" });

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const start = new Date(year, month, 1 - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [year, month]);

  const selected = projects.find((project) => project.ProjectID === selectedId) || projects[0];

  const projectsForDate = (day) => {
    const key = dateKey(day.toISOString().slice(0, 10));
    return projects.filter((project) => {
      const start = dateKey(project.StartDate);
      const end = dateKey(project.EndDate || project.StartDate);
      return start && key >= start && key <= end;
    });
  };

  return (
    <div className="projects-layout">
      <section className="panel calendar-panel">
        <header className="panel-header calendar-header">
          <div>
            <h3>Projects Calendar</h3>
            <p>Shared schedule for projects and appointments</p>
          </div>
          <div className="calendar-actions">
            <button className="icon-button calendar-nav" onClick={() => setCursor(new Date(year, month - 1, 1))}><ChevronLeft /></button>
            <strong>{monthName}</strong>
            <button className="icon-button calendar-nav" onClick={() => setCursor(new Date(year, month + 1, 1))}><ChevronRight /></button>
            <button className="button primary" onClick={onNewProject}><CirclePlus size={16} /> New Project</button>
          </div>
        </header>

        {error && <div className="banner projects-banner">{error}</div>}

        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}
        </div>

        <div className="calendar-grid">
          {cells.map((day) => {
            const items = projectsForDate(day);
            const isCurrentMonth = day.getMonth() === month;
            const isToday = new Date().toDateString() === day.toDateString();

            return (
              <div className={`calendar-day ${isCurrentMonth ? "" : "muted-day"} ${isToday ? "today" : ""}`} key={day.toISOString()}>
                <span className="day-number">{day.getDate()}</span>
                <div className="day-projects">
                  {items.slice(0, 3).map((project) => (
                    <button
                      key={`${project.ProjectID}-${day.toISOString()}`}
                      className={`calendar-project ${statusTone(project.Status)}`}
                      onClick={() => setSelectedId(project.ProjectID)}
                    >
                      {project.ProjectName}
                    </button>
                  ))}
                  {items.length > 3 && <small>+{items.length - 3} more</small>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="projects-sidebar">
        <section className="panel project-list-panel">
          <header className="panel-header">
            <div><h3>Project List</h3><p>{projects.length} projects</p></div>
            <CalendarDays size={18} />
          </header>

          <div className="project-list">
            {loading && <div className="empty">Loading projects...</div>}
            {!loading && !projects.length && <div className="empty">No projects yet. Create the first one.</div>}
            {projects.map((project) => (
              <button
                key={project.ProjectID || project.ProjectName}
                className={selected?.ProjectID === project.ProjectID ? "selected" : ""}
                onClick={() => setSelectedId(project.ProjectID)}
              >
                <div>
                  <strong>{project.ProjectName}</strong>
                  <small>{project.Customer}</small>
                </div>
                <span className={`project-status ${statusTone(project.Status)}`}>{project.Status}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="panel project-detail-panel">
          <header className="panel-header"><div><h3>Project Details</h3><p>Operations view</p></div></header>
          {selected ? (
            <div className="project-detail">
              <h3>{selected.ProjectName}</h3>
              <p className="muted">{selected.Customer}</p>

              <div className="detail-grid">
                <div className="detail-card"><label>Status</label><div>{selected.Status}</div></div>
                <div className="detail-card"><label>Assigned</label><div>{selected.AssignedTo}</div></div>
                <div className="detail-card"><label>Start</label><div>{selected.StartDate || "TBD"}</div></div>
                <div className="detail-card"><label>End</label><div>{selected.EndDate || "TBD"}</div></div>
                <div className="detail-card"><label>Priority</label><div>{selected.Priority}</div></div>
                <div className="detail-card"><label>Hours</label><div>{selected.EstimatedHours || "—"}</div></div>
              </div>

              {selected.Address && <div className="project-address"><MapPin size={16} /> {selected.Address}</div>}
              <section className="detail-section"><h4>Contact</h4><p>{selected.ContactName || "—"} {selected.ContactPhone ? `· ${selected.ContactPhone}` : ""}</p></section>
              <section className="detail-section"><h4>Notes</h4><p>{selected.Notes || "—"}</p></section>
            </div>
          ) : <div className="empty">Select a project.</div>}
        </section>
      </aside>
    </div>
  );
}
