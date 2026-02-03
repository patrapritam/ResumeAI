import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import "./SplashScreen.css";

function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(1); // 1: logo, 2: tagline, 3: fade out

  useEffect(() => {
    // Phase 2: Show tagline after logo animation
    const timer1 = setTimeout(() => setPhase(2), 1200);

    // Phase 3: Start fade out
    const timer2 = setTimeout(() => setPhase(3), 2800);

    // Complete and unmount
    const timer3 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${phase === 3 ? "fade-out" : ""}`}>
      {/* Animated Background */}
      <div className="splash-bg">
        <div className="splash-orb orb-1"></div>
        <div className="splash-orb orb-2"></div>
        <div className="splash-orb orb-3"></div>
      </div>

      {/* Lens Animation */}
      <div className="splash-lens">
        <div className="lens-ring outer"></div>
        <div className="lens-ring middle"></div>
        <div className="lens-ring inner"></div>
        <div className="lens-core">
          <Sparkles size={28} />
        </div>
      </div>

      {/* Brand Name */}
      <h1 className={`splash-title ${phase >= 1 ? "visible" : ""}`}>
        <span className="letter">T</span>
        <span className="letter">a</span>
        <span className="letter">l</span>
        <span className="letter">e</span>
        <span className="letter">n</span>
        <span className="letter">t</span>
        <span className="letter">L</span>
        <span className="letter">e</span>
        <span className="letter">n</span>
        <span className="letter">s</span>
      </h1>

      {/* Tagline */}
      <p className={`splash-tagline ${phase >= 2 ? "visible" : ""}`}>
        Created by <span className="author">Pritam Patra</span>
      </p>

      {/* Loading bar */}
      <div className="splash-loader">
        <div className="loader-bar"></div>
      </div>
    </div>
  );
}

export default SplashScreen;
