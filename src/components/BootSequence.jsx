import { useEffect, useRef, useState } from "react";
import "../styles/BootSequence.css";

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
  const [stage, setStage] = useState("systems");
  const [systemIndex, setSystemIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const audioContextRef = useRef(null);
  const humRef = useRef(null);

  const createTone = ({
    frequency = 220,
    endFrequency,
    duration = 0.2,
    volume = 0.05,
    type = "sine",
    delay = 0,
  }) => {
    const context = audioContextRef.current;
    if (!context) return;

    const startTime = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(
        endFrequency,
        startTime + duration
      );
    }

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      startTime + duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.05);
  };

  const startHum = () => {
    const context = audioContextRef.current;

    if (!context || humRef.current) return;

    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    oscillator.type = "sawtooth";
    oscillator.frequency.value = 46;

    filter.type = "lowpass";
    filter.frequency.value = 155;

    gain.gain.value = 0.016;

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);

    oscillator.start();

    humRef.current = { oscillator, gain };
  };

  const stopHum = () => {
    const context = audioContextRef.current;
    const hum = humRef.current;

    if (!context || !hum) return;

    const now = context.currentTime;

    try {
      hum.gain.gain.setValueAtTime(
        Math.max(hum.gain.gain.value, 0.0001),
        now
      );

      hum.gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.8
      );

      hum.oscillator.stop(now + 0.9);
    } catch {
      // The oscillator may already be stopped.
    }

    humRef.current = null;
  };

  const playStartupSound = () => {
    startHum();

    // Mechanical power relays
    createTone({
      frequency: 82,
      duration: 0.09,
      volume: 0.1,
      type: "square",
    });

    createTone({
      frequency: 120,
      duration: 0.07,
      volume: 0.07,
      type: "square",
      delay: 0.18,
    });

    // Ship-computer wake-up sweep
    createTone({
      frequency: 95,
      endFrequency: 680,
      duration: 1.25,
      volume: 0.055,
      type: "sawtooth",
      delay: 0.35,
    });

    // Sensor chirps
    createTone({
      frequency: 760,
      duration: 0.12,
      volume: 0.045,
      delay: 1.75,
    });

    createTone({
      frequency: 1120,
      duration: 0.1,
      volume: 0.04,
      delay: 2.02,
    });
  };

  const playOnlineTone = () => {
    createTone({
      frequency: 410,
      duration: 0.08,
      volume: 0.038,
      type: "square",
    });

    createTone({
      frequency: 690,
      duration: 0.16,
      volume: 0.04,
      delay: 0.08,
    });
  };

  const playAccessGrantedTone = () => {
    createTone({
      frequency: 68,
      endFrequency: 52,
      duration: 0.65,
      volume: 0.12,
    });

    createTone({
      frequency: 440,
      duration: 0.22,
      volume: 0.05,
      delay: 0.34,
    });

    createTone({
      frequency: 660,
      duration: 0.4,
      volume: 0.045,
      delay: 0.53,
    });
  };

  const playCommandReadyTone = () => {
    createTone({
      frequency: 330,
      duration: 0.25,
      volume: 0.045,
    });

    createTone({
      frequency: 495,
      duration: 0.32,
      volume: 0.04,
      delay: 0.2,
    });

    createTone({
      frequency: 742,
      duration: 0.5,
      volume: 0.035,
      delay: 0.43,
    });
  };

  const initiateSystem = async () => {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (AudioContextClass) {
      const context = new AudioContextClass();
      audioContextRef.current = context;

      await context.resume();
      playStartupSound();
    }

    setStarted(true);
  };

  useEffect(() => {
    if (!started) return undefined;

    let cancelled = false;

    const runSequence = async () => {
      setStage("systems");

      for (let index = 0; index < subsystems.length; index += 1) {
        if (cancelled) return;

        setSystemIndex(index);
        setProgress(0);

        for (let value = 0; value < 100; value += 8) {
          if (cancelled) return;

          setProgress(value);
          await wait(80);
        }

        setProgress(100);
        playOnlineTone();
        await wait(320);
      }

      if (cancelled) return;

      setStage("access");
      playAccessGrantedTone();
      await wait(1500);

      if (cancelled) return;

      setStage("welcome");
      await wait(2300);

      if (cancelled) return;

      setStage("ready");
      playCommandReadyTone();
      await wait(1500);

      if (cancelled) return;

      setStage("exit");
      stopHum();
      await wait(900);

      if (!cancelled) {
        onComplete();
      }
    };

    runSequence();

    return () => {
      cancelled = true;
      stopHum();
    };
  }, [started, onComplete]);

  return (
    <div className={`relay-boot-screen relay-boot-${stage}`}>
      <div className="relay-boot-grid" />
      <div className="relay-boot-scanline" />

      {!started ? (
        <button
          type="button"
          className="relay-initiate"
          onClick={initiateSystem}
        >
          <span>RELAY COMMAND OS</span>
          <strong>INITIATE SYSTEM</strong>
          <small>ARCHITECT AUTHORIZATION REQUIRED</small>
        </button>
      ) : (
        <main className="relay-boot-console">
          <header className="relay-boot-header">
            <span>RELAY COMMAND OS</span>
            <span>BUILD 5.0 // SECURE</span>
          </header>

          <section className="relay-core-display">
            <div className="relay-core-ring relay-core-ring-outer" />
            <div className="relay-core-ring relay-core-ring-inner" />

            <div className="relay-core-eye">
              <span />
            </div>

            <p>CENTRAL CORE</p>
          </section>

          {stage === "systems" && (
            <section
              className="relay-system-panel"
              key={subsystems[systemIndex]}
            >
              <div className="relay-system-heading">
                <strong>{subsystems[systemIndex]}</strong>
                <span>
                  {progress === 100 ? "ONLINE" : "INITIALIZING"}
                </span>
              </div>

              <div className="relay-progress-track">
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

          {stage === "access" && (
            <section className="relay-final-message">
              <p>SECURITY CLEARANCE VERIFIED</p>
              <h1>ACCESS GRANTED</h1>
              <strong>CENTRAL CORE LINK ESTABLISHED</strong>
            </section>
          )}

          {stage === "welcome" && (
            <section className="relay-final-message">
              <p>IDENTITY VERIFIED</p>
              <h1>WELCOME</h1>
              <strong>ERIC MARTINEZ // THE ARCHITECT</strong>
            </section>
          )}

          {(stage === "ready" || stage === "exit") && (
            <section className="relay-final-message">
              <p>ALL SYSTEMS NOMINAL</p>
              <h1>COMMAND READY</h1>
              <strong>CENTRAL CORE ONLINE</strong>
            </section>
          )}
        </main>
      )}
    </div>
  );
}