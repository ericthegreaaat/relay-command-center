export const DEFAULT_PROJECTS_URL =
  "https://ericthegreaaat.app.n8n.cloud/webhook/relay-projects";

export const DEFAULT_CREATE_PROJECT_URL =
  "https://ericthegreaaat.app.n8n.cloud/webhook/relay-create-project";

const pick = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) return source[key];
  }
  return "";
};

export function normalizeProject(raw) {
  return {
    ProjectID: pick(raw, "ProjectID", "projectId"),
    ProjectName: pick(raw, "ProjectName", "projectName") || "Untitled Project",
    Customer: pick(raw, "Customer", "customerName", "CustomerName") || "Unknown",
    Address: pick(raw, "Address", "address"),
    ContactName: pick(raw, "ContactName", "contactName"),
    ContactPhone: pick(raw, "ContactPhone", "contactPhone"),
    StartDate: pick(raw, "StartDate", "startDate"),
    EndDate: pick(raw, "EndDate", "endDate"),
    Status: pick(raw, "Status", "status") || "Planning",
    AssignedTo: pick(raw, "AssignedTo", "assignedTo") || "Unassigned",
    EstimatedHours: Number(pick(raw, "EstimatedHours", "estimatedHours") || 0),
    Priority: pick(raw, "Priority", "priority") || "Medium",
    Notes: pick(raw, "Notes", "notes"),
    Created: pick(raw, "Created", "created", "createdAt"),
    Updated: pick(raw, "Updated", "updated", "updatedAt"),
  };
}

function unpack(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.body)) return data.body;
  if (data && typeof data === "object") return [data];
  return [];
}

export async function fetchProjects(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Projects webhook returned ${response.status}`);
  }

  return unpack(await response.json())
    .map(normalizeProject)
    .filter((project) => project.ProjectID || project.ProjectName);
}

export async function createProject(url, project) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error(`Create-project webhook returned ${response.status}`);
  }

  return response.json();
}
