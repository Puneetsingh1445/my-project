import React, { useEffect, useState } from "react";

export default function BrainScrollOverlay() {
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0,
    position: "fixed",
    pointerEvents: "none",
    zIndex: 40,
  });

  useEffect(() => {
    let ticking = false;

    const updatePosition = () => {
      const p1 = document.getElementById("hero-brain-placeholder");
      const p2 = document.getElementById("features-brain-placeholder");
      const features = document.getElementById("features");

      if (!p1 || !p2 || !features) return;

      const rect1 = p1.getBoundingClientRect();
      const rect2 = p2.getBoundingClientRect();
      const featuresRect = features.getBoundingClientRect();

      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      // Absolute document positions
      const docTop1 = rect1.top + scrollY;
      const docLeft1 = rect1.left + scrollX;
      
      const docTop2 = rect2.top + scrollY;
      const docLeft2 = rect2.left + scrollX;

      const S = scrollY;
      // Define the scroll target where progress reaches 1.0
      // We'll use the point where the features section top is 120px from the viewport top
      const S_end = Math.max(1, featuresRect.top + scrollY - 120);
      
      let p = S / S_end;
      p = Math.max(0, Math.min(1, p));
      
      // easeInOutCubic for organic fluid movement
      const t = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      // Start viewport coordinates (when S=0)
      const v1_top = docTop1;
      const v1_left = docLeft1;
      const v1_width = p1.offsetWidth;
      const v1_height = p1.offsetHeight;

      // End viewport coordinates (when S=S_end)
      const v2_top = docTop2 - S_end;
      const v2_left = docLeft2;
      const v2_width = p2.offsetWidth;
      const v2_height = p2.offsetHeight;

      // Interpolate
      const current_top = v1_top + (v2_top - v1_top) * t;
      const current_left = v1_left + (v2_left - v1_left) * t;
      const current_width = v1_width + (v2_width - v1_width) * t;
      const current_height = v1_height + (v2_height - v1_height) * t;
      const current_rotation = 0 + (-6 - 0) * t;

      if (p >= 1) {
        // Snap to absolute positioning in the document so it flows naturally if scrolled further
        setStyle({
          opacity: 1,
          position: "absolute",
          top: `${docTop2}px`,
          left: `${docLeft2}px`,
          width: `${v2_width}px`,
          height: `${v2_height}px`,
          transform: `rotate(-6deg)`,
          zIndex: 40,
          pointerEvents: "none",
        });
      } else {
        // Fixed positioning in the viewport during transition
        setStyle({
          opacity: 1,
          position: "fixed",
          top: `${current_top}px`,
          left: `${current_left}px`,
          width: `${current_width}px`,
          height: `${current_height}px`,
          transform: `rotate(${current_rotation}deg)`,
          zIndex: 40,
          pointerEvents: "none",
        });
      }

      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    // Initial positioning
    updatePosition();
    
    // Listeners
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    // A small timeout to ensure images and layout are fully loaded
    const timeout = setTimeout(updatePosition, 100);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <img
      src="/brain-hero.png"
      alt="Floating 3D brain model"
      className="object-contain drop-shadow-2xl floating-object"
      style={style}
      onError={(e) => {
        e.currentTarget.src = "https://images.unsplash.com/photo-1559757147-947ae61a5202?auto=format&fit=crop&w=520&q=80";
        e.currentTarget.onerror = null;
      }}
    />
  );
}
