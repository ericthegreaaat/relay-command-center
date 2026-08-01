export function priorityClass(priority) {
  return ["Critical", "High", "Medium", "Low"].includes(priority)
    ? priority.toLowerCase()
    : "unclassified";
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function yesNo(value) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "—";
}
