"use client";

import FlagIcon from "./FlagIcon";

const BackgroundLayers: React.FC = () => {
  return (
    <div className="bg-tg">
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <div className="bg-lines" />
      <div className="bg-vignette" />
      
      {/* Background layers only - no flag here */}
    </div>
  );
};

export default BackgroundLayers;
