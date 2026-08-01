import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, CirclePlus, Clock3, MapPin, UserRound } from "lucide-react";

const statusTone = (status) => ({
  Planning: "planning",
  "Awaiting Availability": "awaiting",
  Tentative: "tentative",
  Scheduled: "scheduled",
  "In Progress": "progress",
  Complete: "complete",
  "On Hold": "hold",
})[status] || "planning";

const parseDate = (value) => {
  if (!value) return null;
  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;
  const short = String(value).slice(0, 10);
  const fallback = new Date(`${short}T12:00:00`);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const dateKey = (value) => {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return "";
  return [date.getFullYear(), String(date.getMonth()+1).padStart(2,"0"), String(date.getDate()).padStart(2,"0")].join("-");
};

const readableDate = (date) => date.toLocaleDateString([], { weekday:"long", month:"long", day:"numeric", year:"numeric" });

export default function ProjectsPage({ projects, onNewProject, loading, error }) {
  const [cursor, setCursor] = useState(new Date());
  const [selectedId, setSelectedId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!selectedId && projects[0]?.ProjectID) setSelectedId(projects[0].ProjectID);
  }, [projects, selectedId]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthName = cursor.toLocaleString([], { month:"long", year:"numeric" });

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const start = new Date(year, month, 1-first.getDay());
    return Array.from({length:42}, (_,i) => { const d=new Date(start); d.setDate(start.getDate()+i); return d; });
  }, [year, month]);

  const projectsForDate = (day) => {
    const key = dateKey(day);
    return projects.filter((project) => {
      const start = dateKey(project.StartDate);
      const end = dateKey(project.EndDate || project.StartDate);
      return start && key >= start && key <= end;
    });
  };

  const selectedDayProjects = useMemo(() => projectsForDate(selectedDate), [projects, selectedDate]);
  const selected = projects.find((p)=>p.ProjectID===selectedId) || selectedDayProjects[0] || projects[0];

  const selectDay = (day) => {
    setSelectedDate(day);
    const items = projectsForDate(day);
    if (items[0]?.ProjectID) setSelectedId(items[0].ProjectID);
  };

  return <div className="projects-page-stack">
    <div className="projects-layout">
      <section className="panel calendar-panel">
        <header className="panel-header calendar-header">
          <div><h3>Projects Calendar</h3><p>Click any date to view that day’s schedule</p></div>
          <div className="calendar-actions">
            <button className="icon-button calendar-nav" onClick={()=>setCursor(new Date(year,month-1,1))}><ChevronLeft/></button>
            <strong>{monthName}</strong>
            <button className="icon-button calendar-nav" onClick={()=>setCursor(new Date(year,month+1,1))}><ChevronRight/></button>
            <button className="button primary" onClick={onNewProject}><CirclePlus size={16}/> New Project</button>
          </div>
        </header>
        {error && <div className="banner projects-banner">{error}</div>}
        <div className="calendar-weekdays">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><span key={d}>{d}</span>)}</div>
        <div className="calendar-grid">
          {cells.map((day)=>{
            const items=projectsForDate(day);
            const isCurrentMonth=day.getMonth()===month;
            const isToday=new Date().toDateString()===day.toDateString();
            const isSelected=selectedDate.toDateString()===day.toDateString();
            return <button type="button" className={`calendar-day ${isCurrentMonth?"":"muted-day"} ${isToday?"today":""} ${isSelected?"selected-day":""}`} key={day.toISOString()} onClick={()=>selectDay(day)}>
              <div className="calendar-day-top"><span className="day-number">{day.getDate()}</span>{items.length>0&&<span className="day-event-count">{items.length}</span>}</div>
              <div className="day-projects">{items.slice(0,3).map(p=><span key={`${p.ProjectID}-${day.toISOString()}`} className={`calendar-project ${statusTone(p.Status)}`}>{p.ProjectName}</span>)}{items.length>3&&<small>+{items.length-3} more</small>}</div>
            </button>;
          })}
        </div>
      </section>

      <aside className="projects-sidebar">
        <section className="panel project-list-panel">
          <header className="panel-header"><div><h3>Project List</h3><p>{projects.length} projects</p></div><CalendarDays size={18}/></header>
          <div className="project-list">
            {loading&&<div className="empty">Loading projects...</div>}
            {!loading&&!projects.length&&<div className="empty">No projects yet. Create the first one.</div>}
            {projects.map(p=><button key={p.ProjectID||p.ProjectName} className={selected?.ProjectID===p.ProjectID?"selected":""} onClick={()=>{setSelectedId(p.ProjectID); const d=parseDate(p.StartDate); if(d){setSelectedDate(d);setCursor(new Date(d.getFullYear(),d.getMonth(),1));}}}><div><strong>{p.ProjectName}</strong><small>{p.Customer}</small></div><span className={`project-status ${statusTone(p.Status)}`}>{p.Status}</span></button>)}
          </div>
        </section>

        <section className="panel project-detail-panel">
          <header className="panel-header"><div><h3>Project Details</h3><p>Operations view</p></div></header>
          {selected?<div className="project-detail">
            <h3>{selected.ProjectName}</h3><p className="muted">{selected.Customer}</p>
            <div className="detail-grid">
              <div className="detail-card"><label>Status</label><div>{selected.Status}</div></div>
              <div className="detail-card"><label>Assigned</label><div>{selected.AssignedTo}</div></div>
              <div className="detail-card"><label>Start</label><div>{dateKey(selected.StartDate)||"TBD"}</div></div>
              <div className="detail-card"><label>End</label><div>{dateKey(selected.EndDate)||"TBD"}</div></div>
              <div className="detail-card"><label>Priority</label><div>{selected.Priority}</div></div>
              <div className="detail-card"><label>Hours</label><div>{selected.EstimatedHours||"—"}</div></div>
            </div>
            {selected.Address&&<div className="project-address"><MapPin size={16}/>{selected.Address}</div>}
            <section className="detail-section"><h4>Contact</h4><p>{selected.ContactName||"—"}{selected.ContactPhone?` · ${selected.ContactPhone}`:""}</p></section>
            <section className="detail-section"><h4>Notes</h4><p>{selected.Notes||"—"}</p></section>
          </div>:<div className="empty">Select a project.</div>}
        </section>
      </aside>
    </div>

    <section className="panel day-agenda-panel">
      <header className="panel-header"><div><h3>{readableDate(selectedDate)}</h3><p>{selectedDayProjects.length} scheduled item{selectedDayProjects.length===1?"":"s"}</p></div><button className="button primary" onClick={onNewProject}><CirclePlus size={16}/> Add to This Day</button></header>
      <div className="day-agenda">
        {!selectedDayProjects.length&&<div className="empty day-empty">Nothing scheduled for this day.</div>}
        {selectedDayProjects.map(p=><button key={p.ProjectID||p.ProjectName} className="agenda-project" onClick={()=>setSelectedId(p.ProjectID)}><span className={`agenda-status-dot ${statusTone(p.Status)}`}/><div className="agenda-main"><strong>{p.ProjectName}</strong><small>{p.Customer}</small></div><div className="agenda-meta"><span><UserRound size={14}/>{p.AssignedTo}</span><span><Clock3 size={14}/>{p.EstimatedHours||"—"} hrs</span><span className={`project-status ${statusTone(p.Status)}`}>{p.Status}</span></div></button>)}
      </div>
    </section>
  </div>;
}
