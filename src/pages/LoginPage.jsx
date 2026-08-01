import { useState } from "react";
import { LockKeyhole, Radio, ShieldCheck, Zap } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("eric@paxtelecom.net");
  const [password, setPassword] = useState("relay-demo");

  const submit = (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    sessionStorage.setItem("relaySession", email.trim());
    onLogin(email.trim());
  };

  return (
    <div className="login-shell">
      <section className="login-brand-panel">
        <img src="/relay-mark.svg" alt="" />
        <div className="eyebrow"><Zap size={15} /> Relay v3 Enterprise</div>
        <h1>The One AI Dispatch Platform</h1>
        <p>One inbox. One dispatcher. One command center for support operations.</p>
        <div className="login-capabilities">
          <div><Radio /><span><strong>Live Operations</strong><small>Real-time ticket intelligence</small></span></div>
          <div><ShieldCheck /><span><strong>Role Ready</strong><small>Foundation for employee access</small></span></div>
          <div><LockKeyhole /><span><strong>PAX Telecom</strong><small>Powered by Relay AI</small></span></div>
        </div>
      </section>

      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">
          <img src="/relay-mark.svg" alt="" />
          <div><h2>Welcome to Relay</h2><p>Sign in to the Command Center</p></div>
        </div>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="button primary login-button" type="submit">Sign In</button>
        <small className="login-note">Demo login only. Production authentication comes later.</small>
      </form>
    </div>
  );
}
