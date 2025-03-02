import React from "react";
import { AnimatePresence } from "framer-motion";
import DesignListItem from "./DesignListItem";

function DesignsList({ designs }) {
  return (
    <AnimatePresence>
      <div className="space-y-4">
        {designs.map((design, index) => (
          <DesignListItem key={design.uid} design={design} index={index} />
        ))}
      </div>
    </AnimatePresence>
  );
}

export default DesignsList;
