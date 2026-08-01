import { Bot } from "lucide-react";

export default function AssistantPage() {
  const examples = [
    "Summarize today's tickets",
    "Which tickets need attention first?",
    "Show all Critical network incidents",
    "Which customers submit the most requests?",
  ];

  return (
    <section className="panel simple-page assistant-page">
      <Bot size={42} />
      <h3>Ask Relay</h3>
      <p className="muted">The conversational operations assistant is the next focused enhancement.</p>
      <div className="assistant-prompts">
        {examples.map((example) => <button key={example}>{example}</button>)}
      </div>
      <div className="assistant-input">
        <input disabled placeholder="Ask Relay about your operations..." />
        <button className="button primary" disabled>Ask</button>
      </div>
    </section>
  );
}
