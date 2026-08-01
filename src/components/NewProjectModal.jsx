import { useState } from "react";
import { X } from "lucide-react";

export default function NewProjectModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    projectName: "",
    customer: "",
    address: "",
    contactName: "",
    contactPhone: "",
    startDate: "",
    endDate: "",
    status: "Planning",
    assignedTo: "Eric",
    estimatedHours: "",
    priority: "Medium",
    notes: "",
  });
  const [message, setMessage] = useState("");

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setMessage("Creating project...");
    try {
      await onCreate(form);
      setMessage("Project created.");
      setTimeout(onClose, 700);
    } catch (error) {
      setMessage(`Project workflow is not ready yet. ${error.message}`);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="modal project-modal" onSubmit={submit}>
        <header>
          <div>
            <h3>New Project</h3>
            <p>Add a shared project or appointment to Relay Operations.</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <X />
          </button>
        </header>

        <div className="form-grid">
          <label className="wide">
            Project name
            <input required value={form.projectName} onChange={(e) => update("projectName", e.target.value)} />
          </label>

          <label>
            Customer
            <input required value={form.customer} onChange={(e) => update("customer", e.target.value)} />
          </label>

          <label>
            Assigned to
            <select value={form.assignedTo} onChange={(e) => update("assignedTo", e.target.value)}>
              <option>Eric</option>
              <option>Unassigned</option>
            </select>
          </label>

          <label className="wide">
            Address
            <input value={form.address} onChange={(e) => update("address", e.target.value)} />
          </label>

          <label>
            Contact name
            <input value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
          </label>

          <label>
            Contact phone
            <input value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
          </label>

          <label>
            Start date
            <input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} />
          </label>

          <label>
            End date
            <input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} />
          </label>

          <label>
            Status
            <select value={form.status} onChange={(e) => update("status", e.target.value)}>
              <option>Planning</option>
              <option>Awaiting Availability</option>
              <option>Tentative</option>
              <option>Scheduled</option>
              <option>In Progress</option>
              <option>Complete</option>
              <option>On Hold</option>
            </select>
          </label>

          <label>
            Priority
            <select value={form.priority} onChange={(e) => update("priority", e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </label>

          <label>
            Estimated hours
            <input type="number" min="0" step="0.5" value={form.estimatedHours} onChange={(e) => update("estimatedHours", e.target.value)} />
          </label>

          <label className="wide">
            Notes
            <textarea rows="5" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </label>
        </div>

        {message && <div className="form-message">{message}</div>}

        <footer>
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button primary">
            Create Project
          </button>
        </footer>
      </form>
    </div>
  );
}
