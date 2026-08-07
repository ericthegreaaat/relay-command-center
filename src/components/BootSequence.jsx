import { useEffect, useRef, useState } from "react";
import "../styles/BootSequence.css";

const bootChecks = [
  "POWER CONDUIT CHECK",
  "CORE TEMPERATURE",
  "MEMORY ARRAY",
  "PRIMARY NETWORK LINK",
  "BACKUP NETWORK LINK",
  "STORAGE ARRAY",
  "SECURITY PROTOCOL",
  "USER AUTHENTICATION",
  "ARCHITECT AUTHORIZATION",
];

const subsystems = [
  "COMMUNICATIONS ARRAY",
  "OPERATIONS DATABASE",
  "SIGNAL PROCESSOR",
  "CENTRAL CORE",
];

const wait = (milliseconds) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export default function BootSequence({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [stage, setStage] = useState("standby");
  const [systemIndex, setSystemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(3);

  const audioRef = useRef(null);

  const initiateSystem = async () => {
    if (started) return;

    const audio = audioRef.current;

    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.75;

      try {
        await audio.play();
      } catch (error) {
        console.warn("Relay startup audio could not play:", error);
      }
    }

    setStarted(true);
    setStage("systems");
    setProgress(0);
  };

  useEffect(() => {
    if (!started) return undefined;

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [started]);

  useEffect(() => {
    if (!started) return undefined;

    let cancelled = false;

    const runSequence = async () => {
      setStage("systems");

      await wait(650);

      for (let index = 0; index < subsystems.length; index += 1) {
        if (cancelled) return;

        setSystemIndex(index);
        setProgress(0);

        for (let value = 0; value <= 100; value += 2) {
          if (cancelled) return;

          setProgress(value);
          await wait(75);
        }

        await wait(350);
      }

      if (cancelled) return;

      setStage("access");
      await wait(1500);

      if (cancelled) return;

      setStage("welcome");
      await wait(1900);

      if (cancelled) return;

      setStage("ready");
      await wait(1700);

      if (cancelled) return;

      setStage("exit");
      await wait(1000);

      if (!cancelled && typeof onComplete === "function") {
        onComplete();
      }
    };

    runSequence();

    return () => {
      cancelled = true;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [started, onComplete]);

  const displayProgress = started ? progress : 72;

  const formatUptime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const remainingSeconds = String(seconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${remainingSeconds}`;
  };

  const getCheckStatus = (check, index) => {
    if (check === "CORE TEMPERATURE") {
      return "36.2 C";
    }

    if (check === "USER AUTHENTICATION") {
      return started ? "VERIFIED" : "PENDING";
    }

    if (check === "ARCHITECT AUTHORIZATION") {
      return started ? "VERIFIED" : "REQUIRED";
    }

    if (!started) {
      return "OK";
    }

    const completedThreshold =
      (systemIndex / Math.max(subsystems.length - 1, 1)) *
      bootChecks.length;

    return index <= completedThreshold ? "OK" : "CHECK";
  };

  return (
    <div className={`relay-boot-screen relay-boot-${stage}`}>
      <audio
        ref={audioRef}
        src="/audio/relay-startup.mp3"
        preload="auto"
      />

      <div className="relay-boot-grid" />
      <div className="relay-boot-scanline" />
      <div className="relay-screen-flicker" />

      <main className="relay-terminal">
        <header className="relay-terminal-header">
          <div className="relay-header-row">
            <span>RELAY COMMAND OS v2.7.1</span>
            <span>NOSTROMO INTERFACE UNIT</span>
          </div>

          <div className="relay-header-divider">
            +--------------------------------------------------------------+
          </div>

          <div className="relay-header-row">
            <span>| SECURE BOOT SEQUENCE</span>
            <span>SYS-ID: PAX-RELAY-01 |</span>
          </div>

          <div className="relay-header-divider">
            +--------------------------------------------------------------+
          </div>
        </header>

        <section className="relay-upper-layout">
          <div className="relay-boot-checks">
            <h2>
              {started ? "> INITIATING SYSTEM..." : "> SYSTEM STANDBY"}
            </h2>

            <div className="relay-check-list">
              {bootChecks.map((check, index) => {
                const status = getCheckStatus(check, index);
                const warning =
                  status === "PENDING" ||
                  status === "REQUIRED" ||
                  status === "CHECK";

                return (
                  <div className="relay-check-row" key={check}>
                    <span>{check}</span>

                    <strong className={warning ? "relay-warning" : ""}>
                      [ {status} ]
                    </strong>
                  </div>
                );
              })}
            </div>

            <div className="relay-command-cursor">
              <span>&gt;</span>
              <i />
            </div>
          </div>

          <aside className="relay-diagnostics-panel">
            <h3>SYSTEM DIAGNOSTICS</h3>
            <div className="relay-panel-rule" />

            <div className="relay-diagnostic-row">
              <span>CPU USAGE</span>
              <strong>{started ? "18%" : "04%"}</strong>
            </div>

            <div className="relay-diagnostic-row">
              <span>MEMORY</span>
              <strong>{started ? "24%" : "012%"}</strong>
            </div>

            <div className="relay-diagnostic-row">
              <span>NET IN</span>
              <strong>{started ? "12.4 KB/S" : "00.0 KB/S"}</strong>
            </div>

            <div className="relay-diagnostic-row">
              <span>NET OUT</span>
              <strong>{started ? "08.7 KB/S" : "00.0 KB/S"}</strong>
            </div>

            <div className="relay-diagnostic-row">
              <span>UPTIME</span>
              <strong>{formatUptime(elapsedSeconds)}</strong>
            </div>

            <div className="relay-panel-divider" />

            <h3>SUBSYSTEM STATUS</h3>
            <div className="relay-panel-rule" />

            {[
              "LIFE SUPPORT",
              "ENV MONITOR",
              "GRAV STABILIZER",
              "NAVIGATION",
              "COMMS ARRAY",
              "PAYLOAD SYS",
            ].map((item) => (
              <div className="relay-diagnostic-row" key={item}>
                <span>{item}</span>
                <strong>[ OK ]</strong>
              </div>
            ))}
          </aside>
        </section>

        <section className="relay-core-layout">
          <div className="relay-core-side relay-core-side-left">
            <span>RELAY COMMAND</span>
            <span>OPERATING SYSTEM</span>
            <span>v2.7.1</span>
          </div>

          <div className="relay-core-display">
            <div className="relay-core-crosshair relay-crosshair-top" />
            <div className="relay-core-crosshair relay-crosshair-right" />
            <div className="relay-core-crosshair relay-crosshair-bottom" />
            <div className="relay-core-crosshair relay-crosshair-left" />

            <div className="relay-core-bracket relay-bracket-top-left" />
            <div className="relay-core-bracket relay-bracket-top-right" />
            <div className="relay-core-bracket relay-bracket-bottom-left" />
            <div className="relay-core-bracket relay-bracket-bottom-right" />

            <div className="relay-core-ring relay-core-ring-outer" />
            <div className="relay-core-ring relay-core-ring-middle" />
            <div className="relay-core-ring relay-core-ring-inner" />

            <div className="relay-core-eye">
              <span className="relay-core-small-line" />
              <strong>
                {stage === "access"
                  ? "ACCESS\nGRANTED"
                  : stage === "welcome"
                    ? "WELCOME"
                    : stage === "ready" || stage === "exit"
                      ? "COMMAND\nREADY"
                      : started
                        ? "CORE\nLOADING"
                        : "CORE\nONLINE"}
              </strong>
              <span className="relay-core-small-line" />
            </div>
          </div>

          <div className="relay-core-side relay-core-side-right">
            <span>ARCHITECT LEVEL</span>
            <span>{started ? "ACCESS VERIFIED" : "ACCESS REQUIRED"}</span>
          </div>
        </section>

        <section className="relay-loading-section">
          <h2>
            &gt;{" "}
            {started
              ? `LOADING ${subsystems[systemIndex]}...`
              : "LOADING CORE SYSTEM MODULES..."}
          </h2>

          <div className="relay-loading-row">
            <div className="relay-progress-track">
              <span style={{ width: `${displayProgress}%` }} />
            </div>

            <strong>{displayProgress}%</strong>
          </div>

          <p>
            EST. TIME REMAINING:{" "}
            {started && displayProgress < 100 ? "00:00:18" : "00:00:00"}
          </p>
        </section>

        <button
          type="button"
          className="relay-initiate"
          onClick={initiateSystem}
          disabled={started}
        >
          <span>RELAY COMMAND OS</span>

          <strong>
            &gt;{" "}
            {started
              ? stage === "access"
                ? "ACCESS GRANTED"
                : stage === "welcome"
                  ? "WELCOME ARCHITECT"
                  : stage === "ready" || stage === "exit"
                    ? "COMMAND READY"
                    : "INITIALIZING SYSTEM"
              : "INITIATE SYSTEM"}
          </strong>

          <i />

          <small>
            {started
              ? "SECURE BOOT SEQUENCE IN PROGRESS"
              : "ARCHITECT AUTHORIZATION REQUIRED"}
          </small>
        </button>

        <footer className="relay-terminal-footer">
          <span>RELAY COMMAND OS</span>
          <span>|</span>
          <span>SECURE</span>
          <span>|</span>
          <span>© 2026 PAXTELECOM</span>
        </footer>
      </main>
    </div>
  );
}