import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { GirlData } from "../data/girls";

const isMobile = window.innerWidth < 768;

const GRADIENTS = [
  { id: "g1", from: "#FFB6C1", to: "#FF69B4" },
  { id: "g2", from: "#FFC0CB", to: "#E91E63" },
  { id: "g3", from: "#F8BBD0", to: "#EC407A" },
  { id: "g4", from: "#FFD1DC", to: "#F06292" },
  { id: "g5", from: "#FFCDD2", to: "#EF5350" },
  { id: "g6", from: "#FCE4EC", to: "#F48FB1" },
];

interface BloomFlower {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  petals: number;
  gradIdx: number;
  layer: 0 | 1 | 2;
  exitX: number;
  exitY: number;
  sway: number;
}

const BLOOM_FLOWERS: BloomFlower[] = [
  { id: 0,  x: 5,   y: 2,   size: 110, delay: 0.0,  petals: 7, gradIdx: 0, layer: 2, exitX: -120, exitY: 80,   sway: 2 },
  { id: 1,  x: 18,  y: 0,   size: 130, delay: 0.05, petals: 8, gradIdx: 1, layer: 2, exitX: -90,  exitY: 100,  sway: 1.5 },
  { id: 2,  x: 33,  y: 3,   size: 120, delay: 0.1,  petals: 6, gradIdx: 2, layer: 2, exitX: -40,  exitY: 110,  sway: 2.5 },
  { id: 3,  x: 48,  y: 0,   size: 140, delay: 0.08, petals: 8, gradIdx: 3, layer: 2, exitX: 0,    exitY: 120,  sway: 1.8 },
  { id: 4,  x: 63,  y: 2,   size: 125, delay: 0.12, petals: 7, gradIdx: 4, layer: 2, exitX: 40,   exitY: 110,  sway: 2.2 },
  { id: 5,  x: 78,  y: 0,   size: 130, delay: 0.06, petals: 8, gradIdx: 5, layer: 2, exitX: 90,   exitY: 100,  sway: 1.6 },
  { id: 6,  x: 93,  y: 3,   size: 115, delay: 0.04, petals: 6, gradIdx: 0, layer: 2, exitX: 120,  exitY: 80,   sway: 2.1 },
  { id: 39, x: 8,   y: 10,  size: 105, delay: 0.09, petals: 6, gradIdx: 3, layer: 1, exitX: -100, exitY: 90,   sway: 1.7 },
  { id: 40, x: 25,  y: 8,   size: 115, delay: 0.11, petals: 7, gradIdx: 5, layer: 2, exitX: -55,  exitY: 95,   sway: 2.3 },
  { id: 41, x: 42,  y: 11,  size: 110, delay: 0.13, petals: 8, gradIdx: 1, layer: 1, exitX: -15,  exitY: 100,  sway: 1.9 },
  { id: 42, x: 56,  y: 9,   size: 120, delay: 0.1,  petals: 6, gradIdx: 4, layer: 2, exitX: 20,   exitY: 95,   sway: 2.1 },
  { id: 43, x: 70,  y: 11,  size: 108, delay: 0.14, petals: 7, gradIdx: 2, layer: 1, exitX: 65,   exitY: 90,   sway: 1.6 },
  { id: 44, x: 87,  y: 8,   size: 112, delay: 0.07, petals: 8, gradIdx: 0, layer: 2, exitX: 105,  exitY: 85,   sway: 2.4 },
  { id: 7,  x: 10,  y: 18,  size: 120, delay: 0.15, petals: 7, gradIdx: 1, layer: 2, exitX: -110, exitY: 50,   sway: 1.8 },
  { id: 8,  x: 28,  y: 16,  size: 135, delay: 0.18, petals: 8, gradIdx: 2, layer: 1, exitX: -60,  exitY: 60,   sway: 2.0 },
  { id: 9,  x: 45,  y: 20,  size: 125, delay: 0.2,  petals: 7, gradIdx: 3, layer: 2, exitX: -10,  exitY: 70,   sway: 1.5 },
  { id: 10, x: 60,  y: 17,  size: 130, delay: 0.22, petals: 8, gradIdx: 4, layer: 1, exitX: 30,   exitY: 65,   sway: 2.3 },
  { id: 11, x: 77,  y: 19,  size: 120, delay: 0.17, petals: 6, gradIdx: 5, layer: 2, exitX: 80,   exitY: 55,   sway: 1.7 },
  { id: 12, x: 92,  y: 16,  size: 110, delay: 0.14, petals: 7, gradIdx: 0, layer: 1, exitX: 120,  exitY: 45,   sway: 2.4 },
  { id: 45, x: 6,   y: 27,  size: 108, delay: 0.22, petals: 7, gradIdx: 4, layer: 1, exitX: -115, exitY: 35,   sway: 2.0 },
  { id: 46, x: 22,  y: 25,  size: 118, delay: 0.24, petals: 6, gradIdx: 0, layer: 1, exitX: -75,  exitY: 40,   sway: 1.8 },
  { id: 47, x: 40,  y: 28,  size: 112, delay: 0.26, petals: 8, gradIdx: 2, layer: 0, exitX: -25,  exitY: 45,   sway: 2.3 },
  { id: 48, x: 55,  y: 26,  size: 122, delay: 0.25, petals: 7, gradIdx: 5, layer: 1, exitX: 15,   exitY: 42,   sway: 1.6 },
  { id: 49, x: 70,  y: 28,  size: 110, delay: 0.27, petals: 6, gradIdx: 3, layer: 0, exitX: 60,   exitY: 38,   sway: 2.1 },
  { id: 50, x: 86,  y: 25,  size: 115, delay: 0.23, petals: 8, gradIdx: 1, layer: 1, exitX: 105,  exitY: 35,   sway: 1.9 },
  { id: 13, x: 3,   y: 35,  size: 100, delay: 0.28, petals: 6, gradIdx: 1, layer: 1, exitX: -130, exitY: 20,   sway: 2.0 },
  { id: 14, x: 20,  y: 33,  size: 125, delay: 0.3,  petals: 7, gradIdx: 2, layer: 1, exitX: -80,  exitY: 25,   sway: 1.6 },
  { id: 15, x: 38,  y: 36,  size: 115, delay: 0.32, petals: 8, gradIdx: 3, layer: 0, exitX: -30,  exitY: 30,   sway: 2.2 },
  { id: 16, x: 55,  y: 34,  size: 130, delay: 0.35, petals: 7, gradIdx: 4, layer: 1, exitX: 20,   exitY: 30,   sway: 1.9 },
  { id: 17, x: 72,  y: 37,  size: 120, delay: 0.3,  petals: 6, gradIdx: 5, layer: 0, exitX: 70,   exitY: 25,   sway: 2.1 },
  { id: 18, x: 88,  y: 33,  size: 110, delay: 0.26, petals: 7, gradIdx: 0, layer: 1, exitX: 110,  exitY: 20,   sway: 1.7 },
  { id: 51, x: 12,  y: 43,  size: 112, delay: 0.35, petals: 6, gradIdx: 2, layer: 0, exitX: -110, exitY: 5,    sway: 2.2 },
  { id: 52, x: 32,  y: 45,  size: 118, delay: 0.37, petals: 7, gradIdx: 4, layer: 1, exitX: -50,  exitY: 10,   sway: 1.7 },
  { id: 53, x: 50,  y: 43,  size: 125, delay: 0.38, petals: 8, gradIdx: 0, layer: 0, exitX: 0,    exitY: 8,    sway: 2.0 },
  { id: 54, x: 68,  y: 45,  size: 115, delay: 0.36, petals: 6, gradIdx: 3, layer: 1, exitX: 50,   exitY: 5,    sway: 1.8 },
  { id: 55, x: 85,  y: 42,  size: 108, delay: 0.34, petals: 7, gradIdx: 5, layer: 0, exitX: 100,  exitY: 0,    sway: 2.3 },
  { id: 19, x: 8,   y: 52,  size: 115, delay: 0.4,  petals: 7, gradIdx: 1, layer: 0, exitX: -120, exitY: -10,  sway: 2.3 },
  { id: 20, x: 25,  y: 50,  size: 120, delay: 0.42, petals: 6, gradIdx: 2, layer: 1, exitX: -70,  exitY: -5,   sway: 1.5 },
  { id: 21, x: 42,  y: 53,  size: 130, delay: 0.45, petals: 8, gradIdx: 3, layer: 0, exitX: -20,  exitY: -15,  sway: 2.0 },
  { id: 22, x: 58,  y: 51,  size: 125, delay: 0.43, petals: 7, gradIdx: 4, layer: 1, exitX: 25,   exitY: -10,  sway: 1.8 },
  { id: 23, x: 75,  y: 54,  size: 115, delay: 0.4,  petals: 6, gradIdx: 5, layer: 0, exitX: 80,   exitY: -20,  sway: 2.5 },
  { id: 24, x: 92,  y: 50,  size: 105, delay: 0.38, petals: 7, gradIdx: 0, layer: 1, exitX: 130,  exitY: -15,  sway: 1.6 },
  { id: 56, x: 5,   y: 61,  size: 105, delay: 0.48, petals: 6, gradIdx: 3, layer: 0, exitX: -115, exitY: -35,  sway: 1.9 },
  { id: 57, x: 30,  y: 60,  size: 115, delay: 0.5,  petals: 7, gradIdx: 1, layer: 0, exitX: -55,  exitY: -40,  sway: 2.1 },
  { id: 58, x: 50,  y: 62,  size: 120, delay: 0.51, petals: 8, gradIdx: 5, layer: 0, exitX: 0,    exitY: -45,  sway: 1.7 },
  { id: 59, x: 70,  y: 60,  size: 110, delay: 0.49, petals: 6, gradIdx: 2, layer: 0, exitX: 55,   exitY: -40,  sway: 2.4 },
  { id: 60, x: 90,  y: 62,  size: 100, delay: 0.47, petals: 7, gradIdx: 4, layer: 0, exitX: 120,  exitY: -35,  sway: 1.6 },
  { id: 25, x: 15,  y: 70,  size: 100, delay: 0.52, petals: 6, gradIdx: 1, layer: 0, exitX: -100, exitY: -50,  sway: 2.0 },
  { id: 26, x: 40,  y: 68,  size: 110, delay: 0.55, petals: 7, gradIdx: 3, layer: 0, exitX: -30,  exitY: -60,  sway: 1.8 },
  { id: 27, x: 65,  y: 72,  size: 105, delay: 0.53, petals: 6, gradIdx: 5, layer: 0, exitX: 40,   exitY: -55,  sway: 2.2 },
  { id: 28, x: 85,  y: 69,  size: 95,  delay: 0.5,  petals: 7, gradIdx: 2, layer: 0, exitX: 110,  exitY: -45,  sway: 1.5 },
  { id: 61, x: 10,  y: 78,  size: 105, delay: 0.58, petals: 7, gradIdx: 0, layer: 0, exitX: -105, exitY: -70,  sway: 2.0 },
  { id: 62, x: 30,  y: 77,  size: 110, delay: 0.59, petals: 6, gradIdx: 4, layer: 0, exitX: -45,  exitY: -75,  sway: 1.8 },
  { id: 63, x: 52,  y: 79,  size: 115, delay: 0.6,  petals: 8, gradIdx: 2, layer: 0, exitX: 10,   exitY: -80,  sway: 2.3 },
  { id: 64, x: 72,  y: 77,  size: 100, delay: 0.58, petals: 6, gradIdx: 5, layer: 0, exitX: 65,   exitY: -75,  sway: 1.6 },
  { id: 65, x: 92,  y: 79,  size: 108, delay: 0.57, petals: 7, gradIdx: 1, layer: 0, exitX: 120,  exitY: -70,  sway: 2.1 },
  { id: 29, x: 5,   y: 86,  size: 110, delay: 0.6,  petals: 7, gradIdx: 4, layer: 0, exitX: -120, exitY: -80,  sway: 1.9 },
  { id: 30, x: 22,  y: 84,  size: 120, delay: 0.63, petals: 8, gradIdx: 1, layer: 0, exitX: -80,  exitY: -90,  sway: 2.1 },
  { id: 31, x: 40,  y: 88,  size: 115, delay: 0.65, petals: 6, gradIdx: 5, layer: 0, exitX: -30,  exitY: -95,  sway: 1.7 },
  { id: 32, x: 55,  y: 85,  size: 125, delay: 0.62, petals: 7, gradIdx: 3, layer: 0, exitX: 15,   exitY: -100, sway: 2.3 },
  { id: 33, x: 72,  y: 87,  size: 110, delay: 0.66, petals: 8, gradIdx: 0, layer: 0, exitX: 60,   exitY: -90,  sway: 1.6 },
  { id: 34, x: 88,  y: 84,  size: 105, delay: 0.61, petals: 6, gradIdx: 2, layer: 0, exitX: 110,  exitY: -85,  sway: 2.0 },
  { id: 66, x: 15,  y: 93,  size: 100, delay: 0.68, petals: 6, gradIdx: 3, layer: 0, exitX: -95,  exitY: -100, sway: 1.8 },
  { id: 67, x: 45,  y: 94,  size: 108, delay: 0.7,  petals: 7, gradIdx: 0, layer: 0, exitX: -10,  exitY: -110, sway: 2.2 },
  { id: 68, x: 65,  y: 93,  size: 105, delay: 0.69, petals: 8, gradIdx: 4, layer: 0, exitX: 45,   exitY: -105, sway: 1.5 },
  { id: 69, x: 82,  y: 95,  size: 100, delay: 0.71, petals: 6, gradIdx: 1, layer: 0, exitX: 95,   exitY: -100, sway: 2.0 },
  { id: 35, x: 12,  y: 98,  size: 100, delay: 0.7,  petals: 7, gradIdx: 5, layer: 0, exitX: -100, exitY: -110, sway: 1.8 },
  { id: 36, x: 35,  y: 100, size: 110, delay: 0.72, petals: 6, gradIdx: 1, layer: 0, exitX: -40,  exitY: -120, sway: 2.2 },
  { id: 37, x: 58,  y: 98,  size: 105, delay: 0.71, petals: 8, gradIdx: 4, layer: 0, exitX: 30,   exitY: -115, sway: 1.5 },
  { id: 38, x: 80,  y: 100, size: 110, delay: 0.73, petals: 7, gradIdx: 2, layer: 0, exitX: 90,   exitY: -110, sway: 2.0 },
];

const StaticFlowerSvg = ({
  petals,
  gradIdx,
  size,
}: {
  petals: number;
  gradIdx: number;
  size: number;
}) => {
  const r = size / 2;
  const petalLen = r * 0.72;
  const petalW = r * 0.32;
  const centerR = r * 0.22;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <defs>
        {GRADIENTS.map((g) => (
          <linearGradient key={g.id} id={`${g.id}-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={g.from} stopOpacity={0.92} />
            <stop offset="100%" stopColor={g.to} stopOpacity={0.7} />
          </linearGradient>
        ))}
        <radialGradient id={`center-${size}`}>
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="50%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FFB300" />
        </radialGradient>
      </defs>
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (360 / petals) * i - 90;
        const grad = GRADIENTS[(gradIdx + i) % GRADIENTS.length];
        return (
          <path
            key={i}
            d={`
              M ${r},${r}
              C ${r + petalW * 0.8},${r - petalLen * 0.3}
                ${r + petalW},${r - petalLen * 0.8}
                ${r},${r - petalLen}
              C ${r - petalW},${r - petalLen * 0.8}
                ${r - petalW * 0.8},${r - petalLen * 0.3}
                ${r},${r}
              Z
            `}
            fill={`url(#${grad.id}-${size})`}
            transform={`rotate(${angle}, ${r}, ${r})`}
          />
        );
      })}
      <circle cx={r} cy={r} r={centerR} fill={`url(#center-${size})`} />
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (360 / 5) * i - 90;
        const rad = (a * Math.PI) / 180;
        return (
          <circle
            key={`d-${i}`}
            cx={r + Math.cos(rad) * centerR * 0.6}
            cy={r + Math.sin(rad) * centerR * 0.6}
            r={centerR * 0.25}
            fill="#FFB300"
            opacity={0.8}
          />
        );
      })}
    </svg>
  );
};

const layerStyles = {
  0: { opacity: 0.5, blur: 2, scale: 0.85 },
  1: { opacity: 0.75, blur: 0.5, scale: 1.0 },
  2: { opacity: 1, blur: 0, scale: 1.15 },
};

const AnimatedFlower = ({
  flower,
  phase,
}: {
  flower: BloomFlower;
  phase: "wave-in" | "wave-hold" | "wave-out";
}) => {
  const ls = layerStyles[flower.layer];

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${flower.x}vw`,
        bottom: `${flower.y}vh`,
        width: flower.size * ls.scale,
        height: flower.size * ls.scale,
        marginLeft: -(flower.size * ls.scale) / 2,
        marginBottom: -(flower.size * ls.scale) / 2,
        zIndex: flower.layer,
        filter: ls.blur > 0 ? `blur(${ls.blur}px)` : "none",
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
      initial={{ scale: 0, opacity: 0, x: 0, y: 0, rotate: -30 }}
      animate={
        phase === "wave-out"
          ? {
              x: flower.exitX,
              y: flower.exitY,
              opacity: 0,
              scale: 0.3,
              rotate: flower.exitX > 0 ? 45 : -45,
            }
          : {
              scale: 1,
              opacity: ls.opacity,
              x: 0,
              y: 0,
              rotate: 0,
            }
      }
      transition={
        phase === "wave-out"
          ? { duration: 0.9, delay: flower.delay * 0.5, ease: [0.4, 0, 0.2, 1] }
          : { delay: flower.delay, type: "spring", stiffness: 80, damping: 8, mass: 0.6 }
      }
    >
      <motion.div
        animate={{ rotate: [-flower.sway, flower.sway] }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2 + flower.sway * 0.5,
          ease: "easeInOut",
        }}
      >
        <StaticFlowerSvg
          petals={flower.petals}
          gradIdx={flower.gradIdx}
          size={Math.round(flower.size * ls.scale)}
        />
      </motion.div>
    </motion.div>
  );
};

const MobileWave = ({ phase }: { phase: "wave-in" | "wave-hold" | "wave-out" }) => {
const waves = [
  {
    path: "M0,60 C80,20 160,80 250,40 C340,0 420,60 500,30 L500,800 L0,800 Z",
    color1: "#FFF0F3",
    color2: "#FCCDD5",
    delay: 0,
    exitDelay: 0.12,
  },
  {
    path: "M0,45 C60,80 180,10 300,50 C380,75 440,20 500,55 L500,800 L0,800 Z",
    color1: "#FFE4EC",
    color2: "#F8B4C8",
    delay: 0.15,
    exitDelay: 0.06,
  },
  {
    path: "M0,55 C100,15 200,70 320,35 C400,10 460,50 500,40 L500,800 L0,800 Z",
    color1: "#FFF5F7",
    color2: "#F0C6D0",
    delay: 0.3,
    exitDelay: 0,
  },
];

  return (
    <>
      {waves.map((wave, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "115%",
            zIndex: i,
            willChange: "transform",
            transform: "translateZ(0)",
          }}
          initial={{ y: "100%" }}
          animate={
            phase === "wave-out"
              ? { y: "-100%" }
              : { y: "0%" }
          }
          transition={
            phase === "wave-out"
              ? { duration: 0.7, delay: wave.exitDelay, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.8, delay: wave.delay, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <svg
            viewBox="0 0 500 800"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "block",
            }}
          >
            <defs>
              <linearGradient id={`wave-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={wave.color1} stopOpacity={0.95} />
                <stop offset="100%" stopColor={wave.color2} stopOpacity={0.85} />
              </linearGradient>
            </defs>
            <path d={wave.path} fill={`url(#wave-grad-${i})`} />
          </svg>
        </motion.div>
      ))}
    </>
  );
};

interface PetalData {
  x: number;
  w: number;
  h: number;
  duration: number;
  initialProgress: number;
  sway: number[];
  color: string;
  blur: number;
  opacity: number;
  rotation: number[];
}

const PETAL_COLORS = ["#FFB6C1", "#FF69B4", "#FFC0CB", "#FFD1DC", "#F8A4B8", "#F48FB1"];

const PETAL_COUNT = isMobile ? 10 : 24;

const FALLING_PETALS: PetalData[] = Array.from({ length: PETAL_COUNT }, (_, i) => {
  const layer = i % 3;
  const sizeK = layer === 0 ? 0.7 : layer === 1 ? 1 : 1.3;
  const baseW = 7 + (i % 5) * 2.5;
  const amp = 10 + (i % 4) * 5;

  return {
    x: (i * 17 + 3) % 100,
    w: baseW * sizeK,
    h: baseW * 1.3 * sizeK,
    duration: 10 + (i % 6) * 3,
    initialProgress: (i / PETAL_COUNT) * 100,
    sway: [0, amp * 0.4, amp, amp * 0.6, 0, -amp * 0.4, -amp, -amp * 0.6, 0],
    color: PETAL_COLORS[i % PETAL_COLORS.length],
    blur: isMobile ? 0 : (layer === 0 ? 2 : layer === 1 ? 0.5 : 0),
    opacity: layer === 0 ? 0.15 : layer === 1 ? 0.28 : 0.4,
    rotation: [0, 12, -8, 15, -12, 6, 0],
  };
});

const FallingPetal = ({ data }: { data: PetalData }) => {
  const totalDist = window.innerHeight + 60;
  const startY = -(totalDist * data.initialProgress) / 100;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${data.x}%`,
        top: -30,
        width: data.w,
        height: data.h,
        borderRadius: "50% 50% 50% 0%",
        background: `linear-gradient(135deg, ${data.color}, ${data.color}66)`,
        pointerEvents: "none",
        filter: data.blur > 0 ? `blur(${data.blur}px)` : "none",
        willChange: "transform",
        transform: "translateZ(0)",
        opacity: data.opacity,
      }}
      initial={{ y: startY }}
      animate={{
        y: [startY, totalDist],
        x: data.sway,
        rotate: data.rotation,
      }}
      transition={{
        y: {
          duration: data.duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        },
        x: {
          duration: data.duration * 0.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        },
        rotate: {
          duration: data.duration * 0.6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        },
      }}
    />
  );
};

const AnimatedText = ({ text, delay }: { text: string; delay: number }) => {
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.045, delayChildren: delay },
    },
  };

  const word: Variants = {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  return (
    <motion.p
      style={{
        fontSize: "clamp(0.9rem, 3vw, 1.05rem)",
        lineHeight: 2,
        color: "#555",
        fontWeight: 300,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 6px",
      }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word}>
          {w}
        </motion.span>
      ))}
    </motion.p>
  );
};

type Phase = "wave-in" | "wave-hold" | "wave-out" | "greeting";

interface Props {
  girl: GirlData;
}

export const Reveal = ({ girl }: Props) => {
  const [phase, setPhase] = useState<Phase>("wave-in");

  useEffect(() => {
    const timers = isMobile
      ? [
          setTimeout(() => setPhase("wave-hold"), 1000),
          setTimeout(() => setPhase("wave-out"), 1800),
          setTimeout(() => setPhase("greeting"), 2200),
        ]
      : [
          setTimeout(() => setPhase("wave-hold"), 1800),
          setTimeout(() => setPhase("wave-out"), 2800),
          setTimeout(() => setPhase("greeting"), 3800),
        ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          phase === "greeting"
            ? "linear-gradient(180deg, #fff5f7 0%, #fff 50%, #fff5f7 100%)"
            : "#ffffff",
        transition: "background 1s ease",
      }}
    >
      <AnimatePresence>
        {phase !== "greeting" && (
          <motion.div
            key="bg"
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 80%, rgba(248,187,208,0.3) 0%, transparent 70%)",
              zIndex: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase !== "greeting" && (
          <motion.div
            key="bloom-container"
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMobile ? (
              <MobileWave phase={phase === "wave-hold" ? "wave-in" : phase} />
            ) : (
              BLOOM_FLOWERS.map((f) => (
                <AnimatedFlower
                  key={f.id}
                  flower={f}
                  phase={phase === "wave-hold" ? "wave-in" : phase}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "greeting" && (
          <motion.div
            key="greeting"
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
              {FALLING_PETALS.map((p, i) => (
                <FallingPetal key={i} data={p} />
              ))}
            </div>

            <motion.div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "32px 24px",
                textAlign: "center",
                maxWidth: 420,
                zIndex: 1,
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.1 }}
            >
              <motion.div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid rgba(248,164,184,0.6)",
                  boxShadow: "0 10px 50px rgba(240,98,146,0.2)",
                  marginBottom: 28,
                  flexShrink: 0,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.2 }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${girl.avatar}`}
                  alt={girl.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </motion.div>

              <motion.h2
                style={{
                  fontSize: "clamp(1.5rem, 5vw, 2rem)",
                  fontWeight: 500,
                  color: "#2d2d2d",
                  marginBottom: 20,
                  fontFamily: "'Playfair Display', serif",
                }}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {girl.name}
              </motion.h2>

              <AnimatedText text={girl.message} delay={0.8} />

              <motion.div
                style={{
                  marginTop: 32,
                  fontSize: "0.85rem",
                  color: "#ccc",
                  fontStyle: "italic",
                  letterSpacing: "0.5px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
              >
                <span>с любовью от </span>
                <motion.a
                  href="https://t.me/Vovchenskii"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    color: "#e0879a",
                    textDecoration: "none",
                    fontStyle: "italic",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  whileHover="hover"
                  initial="initial"
                >
                  <motion.span
                    variants={{
                      initial: { color: "#e0879a" },
                      hover: { color: "#d4627a" },
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    меня
                  </motion.span>
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      position: "absolute",
                      right: -16,
                      color: "#e0879a",
                    }}
                    variants={{
                      initial: { opacity: 0, x: -4, y: 4 },
                      hover: { opacity: 1, x: 0, y: 0 },
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </motion.svg>
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};