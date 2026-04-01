"use client";

import FlagIcon from "./FlagIcon";

const BackgroundLayers: React.FC = () => {
  return (
    <div className="bg-tg">
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <div className="bg-lines" />
      <div className="bg-vignette" />
      
      {/* Global Corner Flag - always in front */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9990] pointer-events-none opacity-90 brightness-150 transition-opacity block">
          <FlagIcon className="w-10 h-6 md:w-16 md:h-10 shadow-2xl skew-x-2" />
      </div>
    </div>
  );
};

export default BackgroundLayers;
