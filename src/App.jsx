import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CirclePlus, RefreshCw } from "lucide-react";
import Sidebar from "./components/Sidebar";
import BootSequence from "./components/BootSequence";
import DashboardPage from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import ReportsPage from "./pages/ReportsPage";
import AssistantPage from "./pages/AssistantPage";
import ProjectsPage from "./pages/ProjectsPage";

import TicketQueue from "./components/TicketQueue";
import TicketDetail from "./components/TicketDetail";
import NewTicketModal from "./components/NewTicketModal";
import NewProjectModal from "./components/NewProjectModal";
import { createTicket, DEFAULT_CREATE_URL, DEFAULT_TICKETS_URL, fetchTickets } from "./services/relayApi";
import { createProject, DEFAULT_CREATE_PROJECT_URL, DEFAULT_PROJECTS_URL, fetchProjects } from "./services/projectsApi";

const demoTickets = [{
  TicketID:"PAX-DEMO-001",CustomerName:"Eric",CompanyName:"PAX Telecom",
  CustomerEmail:"Eric@paxtelecom.net",Subject:"Network closet fire",
  Priority:"Critical",Category:"Network",Status:"Open",DispatchStatus:"New",
  IssueSummary:"Network closet fire and damaged equipment.",
  ExecutiveSummary:"Immediate escalation and onsite inspection are required.",
  DispatchAction:"Escalate",SecurityRisk:"Critical",RecommendedTechnician:"Eric",
  EstimatedLaborHours:8,OnsiteRecommended:true,RemotePossible:false,
  LikelyCause:"Physical equipment damage",Confidence:98,
  InternalNotes:"Confirm the area is safe before entering.",
  CustomerReply:"Thank you for contacting PAX Telecom. Your request has been flagged for priority review.",
  Created:new Date().toISOString()
}];

export default function App() {
  
  const [user] = useState("Architect");
  const [bootComplete, setBootComplete] = useState(
  sessionStorage.getItem("relayBootComplete") === "true"
);
  const [view,setView]=useState("dashboard");
  const [tickets,setTickets]=useState([]);
  const [selectedId,setSelectedId]=useState("");
  const [connection,setConnection]=useState("connecting");
  const [notice,setNotice]=useState("");
  const [search,setSearch]=useState("");
  const [priority,setPriority]=useState("");
  const [status,setStatus]=useState("");
  const [showNewTicket,setShowNewTicket]=useState(false);
  const [showNewProject,setShowNewProject]=useState(false);
  const [projects,setProjects]=useState([]);
  const [projectsLoading,setProjectsLoading]=useState(false);
  const [projectsError,setProjectsError]=useState("");
  const [lastUpdated,setLastUpdated]=useState(null);
  const [newCount,setNewCount]=useState(0);
  const priorIds=useRef(new Set());

  const [ticketsUrl,setTicketsUrl]=useState(localStorage.getItem("relayTicketsUrl")||DEFAULT_TICKETS_URL);
  const [createUrl,setCreateUrl]=useState(localStorage.getItem("relayCreateUrl")||DEFAULT_CREATE_URL);
  const [demoFallback,setDemoFallback]=useState(localStorage.getItem("relayDemoFallback")!=="false");
  const [autoRefresh,setAutoRefresh]=useState(localStorage.getItem("relayAutoRefresh")!=="false");
  const [projectsUrl,setProjectsUrl]=useState(localStorage.getItem("relayProjectsUrl")||DEFAULT_PROJECTS_URL);
  const [createProjectUrl,setCreateProjectUrl]=useState(localStorage.getItem("relayCreateProjectUrl")||DEFAULT_CREATE_PROJECT_URL);

  const loadTickets=async(silent=false)=>{
    if(!silent){setConnection("connecting");setNotice("")}
    try{
      const rows=await fetchTickets(ticketsUrl);
      if(!rows.length)throw new Error("The ticket webhook returned no rows.");

      if(priorIds.current.size){
        const additions=rows.filter((ticket)=>!priorIds.current.has(ticket.TicketID));
        if(additions.length)setNewCount((count)=>count+additions.length);
      }
      priorIds.current=new Set(rows.map((ticket)=>ticket.TicketID));

      setTickets(rows);
      setSelectedId((current)=>rows.some((ticket)=>ticket.TicketID===current)?current:rows[0].TicketID);
      setConnection("online");
      setLastUpdated(new Date());
    }catch(error){
      setTickets(demoFallback?demoTickets:[]);
      setSelectedId(demoFallback?demoTickets[0].TicketID:"");
      setConnection(demoFallback?"demo":"offline");
      if(!silent)setNotice(`${demoFallback?"Showing demo data. ":""}${error.message}`);
    }
  };


  const loadProjects=async()=>{
    setProjectsLoading(true);
    setProjectsError("");
    try{
      const rows=await fetchProjects(projectsUrl);
      setProjects(rows);
    }catch(error){
      setProjectsError(`Projects are not connected yet. ${error.message}`);
      setProjects([]);
    }finally{
      setProjectsLoading(false);
    }
  };

  useEffect(()=>{if(user){loadTickets();loadProjects()}},[user]);

  useEffect(()=>{
    if(!user||!autoRefresh)return;
    const timer=window.setInterval(()=>{loadTickets(true);loadProjects();},1200000);
    return()=>window.clearInterval(timer);
  },[user,autoRefresh,ticketsUrl,demoFallback]);

  const filteredTickets=useMemo(()=>{
    const term=search.trim().toLowerCase();
    return tickets.filter((ticket)=>{
      const searchable=Object.values(ticket).join(" ").toLowerCase();
      return(!term||searchable.includes(term))&&
        (!priority||ticket.Priority===priority)&&
        (!status||ticket.Status===status);
    });
  },[tickets,search,priority,status]);

  const selectedTicket=tickets.find((ticket)=>ticket.TicketID===selectedId);
  const queueProps={
    tickets:filteredTickets,selectedId,onSelect:setSelectedId,
    search,onSearch:setSearch,priority,onPriority:setPriority,
    status,onStatus:setStatus
  };

  const saveSettings=(event)=>{
    event.preventDefault();
    localStorage.setItem("relayTicketsUrl",ticketsUrl);
    localStorage.setItem("relayCreateUrl",createUrl);
    localStorage.setItem("relayDemoFallback",String(demoFallback));
    localStorage.setItem("relayAutoRefresh",String(autoRefresh));
    localStorage.setItem("relayProjectsUrl",projectsUrl);
    localStorage.setItem("relayCreateProjectUrl",createProjectUrl);
    setNotice("Relay settings saved.");
    loadTickets();
  };

  if (!bootComplete) {
  return (
    <BootSequence
      onComplete={() => {
        sessionStorage.setItem("relayBootComplete", "true");
        setBootComplete(true);
      }}
    />
  );
}

  const title = {
  dashboard: "🌉 Bridge",
  signals: "📡 Signals",
  tickets: "🎫 Operations Desk",
  projects: "🎯 Mission Control",
  customers: "👥 Clients",
  assistant: "🤖 Relay Core",
  reports: "📊 Intel",
  settings: "⚙ Engineering",
}[view];

  return <div className="app-shell">
    <Sidebar active={view} onChange={setView} connection={connection}/>

    <main className="main-content">
      <header className="topbar">
        <div>
          <h2>{title}</h2>
          <p>
            Relay Command & Control Platform for PAX Telecom
            {lastUpdated&&<span className="last-updated"> · Last sync {lastUpdated.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>}
          </p>
        </div>

        <div className="top-actions">
  <button
    className="notification-button"
    onClick={() => setNewCount(0)}
    title="New ticket notifications"
  >
    <Bell size={17} />
    {newCount > 0 && <span>{newCount}</span>}
  </button>

  <button
    className="button secondary"
    onClick={() => loadTickets()}
  >
    <RefreshCw size={16} />
    Refresh
  </button>

  <button
    className="button primary"
    onClick={() => setShowNewTicket(true)}
  >
    <CirclePlus size={17} />
    New Signal
  </button>
</div>
      </header>

      {notice&&<div className="banner">{notice}</div>}

      {view==="dashboard"&&
        <DashboardPage tickets={tickets} filteredTickets={filteredTickets}
          selectedTicket={selectedTicket} selectedId={selectedId} onSelect={setSelectedId}
          search={search} onSearch={setSearch} priority={priority} onPriority={setPriority}
          status={status} onStatus={setStatus}/>
      }

      {view==="tickets"&&
        <section className="workspace">
          <TicketQueue {...queueProps}/>
          <TicketDetail ticket={selectedTicket}/>
        </section>
      }

      {view==="projects"&&<ProjectsPage projects={projects} loading={projectsLoading} error={projectsError} onNewProject={()=>setShowNewProject(true)}/>} 
      {view==="customers"&&<CustomersPage tickets={tickets}/>} 
      {(view==="assistant" || view==="signals") && <AssistantPage />}
      {view==="reports"&&<ReportsPage tickets={tickets}/>}

      {view==="settings"&&
        <form className="panel settings-page" onSubmit={saveSettings}>
          <h3>Relay Connections</h3><div className="sync-note">Relay refreshes automatically every 20 minutes. Use Refresh anytime for an immediate sync.</div>
          <label>
            Tickets GET webhook
            <input value={ticketsUrl} onChange={(event)=>setTicketsUrl(event.target.value)}/>
          </label>
          <label>
            Create Ticket POST webhook
            <input value={createUrl} onChange={(event)=>setCreateUrl(event.target.value)}/>
          </label>
          <label>
            Projects GET webhook
            <input value={projectsUrl} onChange={(event)=>setProjectsUrl(event.target.value)}/>
          </label>
          <label>
            Create Project POST webhook
            <input value={createProjectUrl} onChange={(event)=>setCreateProjectUrl(event.target.value)}/>
          </label>
          <label className="check-row">
            <input type="checkbox" checked={demoFallback} onChange={(event)=>setDemoFallback(event.target.checked)}/>
            Use demo data if n8n is unavailable
          </label>
          <label className="check-row">
            <input type="checkbox" checked={autoRefresh} onChange={(event)=>setAutoRefresh(event.target.checked)}/>
            Refresh tickets and projects every 20 minutes
          </label>
          <button className="button primary" type="submit">Save Settings</button>
        </form>
      }
    </main>

    {showNewProject&&
      <NewProjectModal
        onClose={()=>setShowNewProject(false)}
        onCreate={async(payload)=>{
          await createProject(createProjectUrl,payload);
          await loadProjects();
        }}
      />
    }

    {showNewTicket&&
      <NewTicketModal
        onClose={()=>setShowNewTicket(false)}
        onCreate={async(payload)=>{
          await createTicket(createUrl,payload);
          await loadTickets();
        }}
      />
    }
  </div>;
}
