import { useState } from "react";
import { X } from "lucide-react";

export default function NewTicketModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    customerName: "", companyName: "", customerEmail: "", subject: "", body: ""
  });
  const [message, setMessage] = useState("");

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setMessage("Creating ticket...");
    try {
      await onCreate(form);
      setMessage("Ticket created.");
      setTimeout(onClose, 650);
    } catch (error) {
      setMessage(`The create-ticket workflow is not active yet. ${error.message}`);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={submit}>
        <header>
          <div><h3>New Relay Ticket</h3><p>Submit a request directly to the AI dispatch engine.</p></div>
          <button type="button" className="icon-button" onClick={onClose}><X /></button>
        </header>

        <div className="form-grid">
          <label>Customer name<input required value={form.customerName} onChange={(e) => update("customerName", e.target.value)} /></label>
          <label>Company<input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} /></label>
          <label className="wide">Customer email<input required type="email" value={form.customerEmail} onChange={(e) => update("customerEmail", e.target.value)} /></label>
          <label className="wide">Subject<input required value={form.subject} onChange={(e) => update("subject", e.target.value)} /></label>
          <label className="wide">Issue<textarea required rows="6" value={form.body} onChange={(e) => update("body", e.target.value)} /></label>
        </div>

        {message && <div className="form-message">{message}</div>}
        <footer>
          <button type="button" className="button secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="button primary">Create Ticket</button>
        </footer>
      </form>
    </div>
  );
}
