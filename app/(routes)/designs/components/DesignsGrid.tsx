import React, { useState, MouseEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Heart, Share2, Download, Star, Info, Code, ExternalLink, Sparkles, Image as ImageIcon, ShieldAlert, AlertTriangle } from 'lucide-react';
import { toast, ToastOptions } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Design } from '@/types/design';
import { COLORS } from '@/constants/colors';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface DesignsGridProps {
  designs: Design[];
  onDelete: (uid: string) => Promise<void>;
}

const DesignsGrid: React.FC<DesignsGridProps> = ({ designs, onDelete }) => {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showQuickView, setShowQuickView] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for hover effects
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteDesigns');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleDesignClick = (uid: string) => {
    router.push(`/designs/${uid}`);
  };

  const handleDeleteClick = (e: MouseEvent, uid: string) => {
    e.stopPropagation();
    setDeleteConfirm(uid);
  };

  const confirmDelete = (uid: string) => {
    onDelete(uid)
      .then(() => {
        toast.success("Design deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        } as ToastOptions);
      })
      .catch(() => {
        toast.error("Failed to delete design", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        } as ToastOptions);
      })
      .finally(() => {
        setDeleteConfirm(null);
      });
  };

  const parseDate = (dateString: string): Date | null => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };

  return (
    <>
      {/* Floating interactive background element */}
      <motion.div
        className="fixed w-80 h-80 rounded-full filter blur-3xl opacity-10 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          zIndex: 0,
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
        }}
        animate={{
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
        }}
        transition={{
          type: "spring",
          damping: 20,
          mass: 0.8
        }}
      />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5  gap-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {designs.map((design) => (
          <motion.div
            key={design.uid}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.98 }}
            className="backdrop-blur-sm bg-white/90 rounded-xl  overflow-hidden shadow-lg dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer relative group"
            onClick={() => handleDesignClick(design.uid)}
          >



            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">


              <img
                src={design.imageUrl}
                alt={design.description || "Design preview"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400/5271ff/ffffff?text=Image+Not+Available";
                }}
              />

            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <motion.h3
                  className="font-semibold text-lg truncate text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {design.description || "Untitled Design"}
                </motion.h3>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <motion.span
                    className="inline-block mr-1"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </motion.span>
                  {parseDate(design.createdAt)
                    ? new Date(design.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </span>

                <div className="flex space-x-1">
                  {design.options &&
                    design.options
                      .slice(0, 3)
                      .map((option: string, idx: number) => (
                        <motion.span
                          key={idx}
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          whileHover={{ scale: 1.5 }}
                          whileTap={{ scale: 0.8 }}
                        ></motion.span>
                      ))}
                </div>
              </div>

              {/* Action buttons */}


              <motion.button
                className=" w-full py-1.5 px-2 rounded-md text-sm font-medium bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md transition-all flex items-center justify-center gap-1 group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => handleDeleteClick(e, design.uid)}
              >
                <Trash2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                Delete
              </motion.button>
{deleteConfirm !== null && deleteConfirm === design.uid ?
        <AnimatePresence >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setDeleteConfirm(null)}
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
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    Delete Design?
                  </h3>

                
                </motion.div>

                <div className="flex justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={() => setDeleteConfirm(null)}
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
                      onClick={() => confirmDelete(deleteConfirm as string)}
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
        : null}
            </div>
          </motion.div>
        ))}
      </motion.div>

   

     
      
    </>
  );
};

export default DesignsGrid;
