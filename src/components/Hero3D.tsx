import { motion } from "framer-motion";
import walkieTalkie from "@/assets/walkie-talkie.png";
import "./Hero.css";

export function Hero3D() {
  return (
    <div className="relative h-[420px] md:h-[560px] w-full perspective">
      {/* rotating glow ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="hero-ring animate-spin-slow" />
      </div>
      {/* radial glow */}
      <div className="absolute inset-0 bg-gradient-radial opacity-80 animate-pulse-glow" />

      {/* floating walkie-talkie with 3D tilt */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateY: -20 }}
        animate={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="hero-tilt animate-float"
          whileHover={{ rotateY: 12, rotateX: -8, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <img
            src={walkieTalkie}
            alt="Professional walkie-talkie rental device"
            width={1024}
            height={1024}
            className="h-[380px] md:h-[520px] w-auto drop-shadow-[0_40px_60px_hsl(var(--primary)/0.5)]"
          />
        </motion.div>
      </motion.div>

      {/* scanning signal pulses */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <span className="signal-pulse" style={{ animationDelay: "0s" }} />
        <span className="signal-pulse" style={{ animationDelay: "1.2s" }} />
        <span className="signal-pulse" style={{ animationDelay: "2.4s" }} />
      </div>
    </div>
  );
}
