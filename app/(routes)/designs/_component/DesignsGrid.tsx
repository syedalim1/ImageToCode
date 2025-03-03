import React from "react";
import { AnimatePresence } from "framer-motion";
import DesignCard from "./DesignCard";
import { Design } from "./types";

interface DesignsGridProps {
  designs: Design[];
}

function DesignsGrid({ designs }: DesignsGridProps) {
  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design, index) => (
          <DesignCard key={design.uid} design={design} index={index} />
        ))}
      </div>
    </AnimatePresence>
  );
}

export default DesignsGrid;
