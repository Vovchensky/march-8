import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CodeInput } from "./components/CodeInput";
import { Reveal } from "./components/Reveal";
import type { GirlData } from "./data/girls";
import "./App.css";

function App() {
  const [girl, setGirl] = useState<GirlData | null>(null);

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {!girl ? (
          <CodeInput key="input" onFound={setGirl} />
        ) : (
          <Reveal key="reveal" girl={girl} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;