import { useEffect, useState } from "react";
import "../styles/BootSequence.css";

const subsystems = [
  "COMMUNICATIONS",
  "OPERATIONS",
  "SIGNAL ARRAY",
  "CENTRAL CORE",
];

export default function BootSequence({ onComplete }) {
  const [systemIndex, setSystemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("booting");

  useEffect(() => {
    let progressTimer;
    let transitionTimer;

    if (phase === "booting") {
      progressTimer = window.setInterval(() => {
        setProgress((current) => {
          const next = current + 5;

          if (next >= 100) {
            window.clearInterval(progressTimer);

            transitionTimer = window.setTimeout(() => {
              if (systemIndex < subsystems.length - 1) {
                setSystemIndex((currentIndex) => currentIndex + 1);
                setProgress(0);
              } else {
                setPhase("granted");
              }
            }, 300);

            return 100;
          }

          return next;
        });
      }, 55);
    }

    if (phase === "granted") {
      transitionTimer = window.setTimeout(() => {
        setPhase("ready");
      }, 900);
    }

    if (phase === "ready") {
      transitionTimer = window.setTimeout(() => {
        setPhase("exit");
      }, 1150);
    }

    if (phase === "exit") {
      transitionTimer = window.setTimeout(() => {
        onComplete();
      }, 700);
    }

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(transitionTimer);
    };
  }, [phase, systemIndex, onComplete]);

  return (
    <div className={`boot-screen boot-${phase}`}>
      <div className="boot-grid" />
      <div className="boot-scanline" />

      <main className="boot-v3">
        <header className="boot-v3-header">
          <span>RELAY COMMAND OS</span>
          <span>BUILD 5.0 // SECURE</span>
        </header>

        <section className="boot-v3-core">
          <div className="core-ring core-ring-outer" />
          <div className="core-ring core-ring-inner" />

          <div className="core-eye">
            <span />
          </div>

          <p>CENTRAL CORE</p>
        </section>

        {phase === "booting" && (
          <section className="boot-system">
            <div className="boot-system-heading">
              <strong>{subsystems[systemIndex]}</strong>
              <span>{progress === 100 ? "ONLINE" : "INITIALIZING"}</span>
            </div>

            <div className="boot-bar">
              <span style={{ width: `${progress}%` }} />
            </div>

            <footer>
              <span>
                SYSTEM {String(systemIndex + 1).padStart(2, "0")} /{" "}
                {String(subsystems.length).padStart(2, "0")}
              </span>
              <span>{progress}%</span>
            </footer>
          </section>
        )}

        {phase === "granted" && (
          <section className="boot-final-message">
           <p>SECURITY CLEARANCE VERIFIED</p>
<h1>ACCESS GRANTED</h1>
<strong>CENTRAL CORE LINK ESTABLISHED</strong>
          </section>
        )}

        {(phase === "ready" || phase === "exit") && (
          <section className="boot-final-message">
           <p>WELCOME</p>
<h1>ARCHITECT</h1>
<strong>ERIC MARTINEZ // COMMAND AUTHORITY VERIFIED</strong>
          </section>
        )}
      </main>
    </div>
  );
}