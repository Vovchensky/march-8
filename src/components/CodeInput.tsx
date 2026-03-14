import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { findByCode, type GirlData } from "../data/girls";

interface Props {
  onFound: (girl: GirlData) => void;
}

const POEM_PAIRS = [
  ["Обычные открытки — это слишком скучно.", "Вы заслуживаете большего."],
  ["Специально для наших любимых девочек,", "я создал это небольшое пространство."],
  ["Там внутри — слова, написанные лично для тебя.", "И больше никто их не увидит."],
  ["Готова?", "Тогда вводи свой код..."],
];

const TIME_PER_LINE = 2500;
const FADE_BETWEEN_PAIRS = 800;

interface FloatingPetal {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
  blur: number;
  opacity: number;
}

const PETAL_COLORS = ["#FFB6C1", "#FFC0CB", "#FFD1DC", "#F8BBD0", "#F48FB1"];

const AMBIENT_PETALS: FloatingPetal[] = Array.from({ length: 12 }, (_, i) => ({
  x: (i * 29 + 10) % 100,
  y: 20 + ((i * 17) % 60),
  size: 6 + (i % 4) * 3,
  duration: 6 + (i % 4) * 2,
  delay: i * 0.4,
  drift: 15 + (i % 3) * 10,
  color: PETAL_COLORS[i % PETAL_COLORS.length],
  blur: i % 3 === 0 ? 2 : i % 3 === 1 ? 1 : 0,
  opacity: i % 3 === 0 ? 0.15 : i % 3 === 1 ? 0.25 : 0.35,
}));

const AmbientPetal = ({ petal }: { petal: FloatingPetal }) => (
  <motion.div
    style={{
      position: "absolute",
      left: `${petal.x}%`,
      top: `${petal.y}%`,
      width: petal.size,
      height: petal.size * 1.2,
      borderRadius: "50% 50% 50% 0%",
      background: petal.color,
      opacity: petal.opacity,
      filter: petal.blur > 0 ? `blur(${petal.blur}px)` : "none",
      pointerEvents: "none",
    }}
    animate={{
      y: [-petal.drift, petal.drift],
      x: [-petal.drift * 0.6, petal.drift * 0.6],
      rotate: [0, 180, 360],
    }}
    transition={{
      y: { duration: petal.duration, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: petal.delay },
      x: { duration: petal.duration * 1.3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: petal.delay },
      rotate: { duration: petal.duration * 2, ease: "linear", repeat: Infinity, delay: petal.delay },
    }}
  />
);

type Phase = "poem" | "fade-out" | "input";

export const CodeInput = ({ onFound }: Props) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [phase, setPhase] = useState<Phase>("poem");
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const totalSteps = POEM_PAIRS.length * 2;
  const currentPair = Math.floor(step / 2);
  const activeLineInPair = step % 2;

  const startFadeOut = useCallback(() => {
    if (phase !== "poem") return;
    setPhase("fade-out");
    setTimeout(() => setPhase("input"), 400); 
  }, [phase]);

  useEffect(() => {
    if (phase !== "poem" || transitioning) return;

    if (step >= totalSteps) {
      const timer = setTimeout(startFadeOut, 100); 
      return () => clearTimeout(timer);
    }

    const nextStep = step + 1;
    const currentPairIdx = Math.floor(step / 2);
    const nextPairIdx = Math.floor(nextStep / 2);
    const isChangingPair = nextPairIdx !== currentPairIdx;

    const timer = setTimeout(() => {
      if (isChangingPair) {
        setTransitioning(true);
        setTimeout(() => {
          setStep(nextStep);
          setTransitioning(false);
        }, FADE_BETWEEN_PAIRS);
      } else {
        setStep(nextStep);
      }
    }, TIME_PER_LINE);

    return () => clearTimeout(timer);
  }, [step, phase, totalSteps, startFadeOut, transitioning]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const girl = findByCode(code);
    if (girl) {
      onFound(girl);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        position: "relative",
        background: "linear-gradient(180deg, #ffffff 0%, #fff8fa 50%, #fff0f3 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {AMBIENT_PETALS.map((p, i) => (
          <AmbientPetal key={i} petal={p} />
        ))}
      </div>

      {(phase === "poem" || phase === "fade-out") && (
        <>
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 24px",
              zIndex: 2,
              minHeight: 100,
            }}
            animate={{
              opacity: phase === "fade-out" ? 0 : 1,
              filter: phase === "fade-out" ? "blur(8px)" : "blur(0px)",
            }}
            transition={{ duration: 0.4 }}
          >
            {currentPair < POEM_PAIRS.length && (
              <motion.div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{
                  opacity: transitioning ? 0 : 1,
                  filter: transitioning ? "blur(6px)" : "blur(0px)",
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {POEM_PAIRS[currentPair].map((line, i) => (
                  <motion.span
                    key={`${currentPair}-${i}`}
                    style={{
                      display: "block",
                      fontSize: "clamp(1rem, 3.5vw, 1.25rem)",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 400,
                      lineHeight: 1.8,
                      textAlign: "center",
                    }}
                    // ДОБАВИЛИ initial СЮДА:
                    initial={{
                      opacity: i === 0 ? 1 : 0.35,
                      filter: i === 0 ? "blur(0px)" : "blur(2.5px)",
                      color: i === 0 ? "#d4627a" : "#e0b0b8",
                    }}
                    animate={{
                      opacity: i === activeLineInPair ? 1 : 0.35,
                      filter: i === activeLineInPair ? "blur(0px)" : "blur(2.5px)",
                      color: i === activeLineInPair ? "#d4627a" : "#e0b0b8",
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    {line}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>

          {phase === "poem" && (
            <motion.button
              onClick={startFadeOut}
              style={{
                position: "absolute",
                bottom: 32,
                right: 32,
                padding: "8px 20px",
                fontSize: "0.75rem",
                border: "none",
                borderRadius: 50,
                background: "transparent",
                color: "#ccc",
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "1px",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#e0879a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#ccc";
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              пропустить →
            </motion.button>
          )}
        </>
      )}

      {phase === "input" && (
        <motion.div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 2,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            style={{
              width: 60,
              height: 1,
              background: "linear-gradient(90deg, transparent, #f0c6d0, transparent)",
              marginBottom: 24,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />

          <motion.p
            style={{
              fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
              color: "#bbb",
              marginBottom: 36,
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 300,
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            введите код
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              animate={error ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
            >
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setCode(value);
              }}
              autoFocus
              style={{
                width: 220,
                padding: "16px 0",
                fontSize: "1.1rem",
                border: "none",
                borderBottom: `1.5px solid ${error ? "#ff6b6b" : "#e8c4cc"}`,
                outline: "none",
                textAlign: "center",
                fontFamily: "inherit",
                transition: "border-color 0.3s",
                background: "transparent",
                color: "#333",
                letterSpacing: "4px",
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderBottomColor = "#f06292";
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderBottomColor = "#e8c4cc";
              }}
            />
            </motion.div>

            <button
              type="submit"
              style={{
                padding: "13px 52px",
                fontSize: "0.85rem",
                border: "1px solid #e8c4cc",
                borderRadius: 50,
                background: "transparent",
                color: "#d4919f",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 400,
                letterSpacing: "2px",
                textTransform: "uppercase",
                transition: "color 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#e8788e";
                e.currentTarget.style.borderColor = "#e8788e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#d4919f";
                e.currentTarget.style.borderColor = "#e8c4cc";
              }}
            >
              открыть
            </button>
          </motion.form>

          <motion.div
            style={{
              width: 60,
              height: 1,
              background: "linear-gradient(90deg, transparent, #f0c6d0, transparent)",
              marginTop: 36,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};