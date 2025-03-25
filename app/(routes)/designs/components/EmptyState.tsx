import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  hasSearchOrFilter: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasSearchOrFilter }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow p-8 text-center"
    >
      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FolderOpen className="w-10 h-10 text-purple-500" />
      </div>
      
      {hasSearchOrFilter ? (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching designs found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No designs yet</h3>
          <p className="text-gray-600 mb-4">
            Upload an image to get started with your first design conversion.
          </p>
        </>
      )}
    </motion.div>
  );
};

export default EmptyState;
