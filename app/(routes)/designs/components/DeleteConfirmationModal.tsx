import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  designUid: string | null;
  onClose: () => void;
  onConfirm: (uid: string) => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  designUid,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !designUid) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300 
          }}
          className="relative bg-white/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl"></div>
          
          <div className="relative text-center">
            <motion.div 
              className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-rose-700 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden"
              initial={{ rotate: 0 }}
              animate={{ 
                rotate: [0, -5, 0, 5, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/40 to-transparent"></div>
              <Trash2 className="w-10 h-10 text-white drop-shadow-lg" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Delete Design?
              </h3>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    This action <span className="font-semibold">cannot be undone</span>. 
                    This will permanently delete the design and all associated data.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <div className="flex justify-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={onClose}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-5 py-2 rounded-lg shadow-sm transition-all duration-200"
                >
                  Cancel
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.97 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-lg blur opacity-60 group-hover:opacity-80 transition duration-200"></div>
                <Button
                  onClick={() => onConfirm(designUid)}
                  className="relative bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-200"
                >
                  Delete
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
