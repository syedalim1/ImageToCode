"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, RefreshCw, XCircle, AlertTriangle, ArrowRight } from "lucide-react";

type StatusType = "loading" | "success" | "error" | "info";

interface StatusNotificationProps {
  type: StatusType;
  title: string;
  message: string;
  onAction?: () => void;
  actionLabel?: string;
  visible: boolean;
}

const StatusNotification: React.FC<StatusNotificationProps> = ({
  type,
  title,
  message,
  onAction,
  actionLabel,
  visible,
}) => {
  const getStatusStyles = () => {
    switch (type) {
      case "loading":
        return {
          bg: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-800 dark:text-blue-200",
          subtext: "text-blue-700 dark:text-blue-300",
          icon: <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
          iconAnimation: { rotate: 360 },
          iconTransition: { duration: 1.5, repeat: Infinity, ease: "linear" },
          buttonBg: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
          shadow: "shadow-md shadow-blue-200 dark:shadow-blue-900/30",
        };
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20",
          border: "border-green-200 dark:border-green-800",
          text: "text-green-800 dark:text-green-200",
          subtext: "text-green-700 dark:text-green-300",
          icon: <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />,
          iconAnimation: { scale: [1, 1.2, 1] },
          iconTransition: { duration: 0.7, repeat: 1 },
          buttonBg: "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600",
          shadow: "shadow-md shadow-green-200 dark:shadow-green-900/30",
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-800 dark:text-red-200",
          subtext: "text-red-700 dark:text-red-300",
          icon: <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />,
          iconAnimation: { x: [0, -3, 3, -3, 0] },
          iconTransition: { duration: 0.5, repeat: 1 },
          buttonBg: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
          shadow: "shadow-md shadow-red-200 dark:shadow-red-900/30",
        };
      case "info":
      default:
        return {
          bg: "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20",
          border: "border-amber-200 dark:border-amber-800",
          text: "text-amber-800 dark:text-amber-200",
          subtext: "text-amber-700 dark:text-amber-300",
          icon: <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
          iconAnimation: { y: [0, -3, 0] },
          iconTransition: { duration: 0.5, repeat: 2 },
          buttonBg: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600",
          shadow: "shadow-md shadow-amber-200 dark:shadow-amber-900/30",
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`p-4 ${styles.bg} border ${styles.border} rounded-lg flex items-start space-x-4 mb-4 ${styles.shadow}`}
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="pt-1 flex-shrink-0"
            animate={styles.iconAnimation}
            transition={styles.iconTransition}
          >
            {styles.icon}
          </motion.div>
          <div className="flex-1">
            <motion.p 
              className={`font-semibold text-lg ${styles.text}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.p>
            <motion.p 
              className={`text-sm mt-1 ${styles.subtext}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
            {onAction && actionLabel && (
              <motion.button
                onClick={onAction}
                className={`mt-3 px-4 py-1.5 rounded-md text-sm text-white font-medium ${styles.buttonBg} flex items-center space-x-1 transition-all`}
                whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span>{actionLabel}</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusNotification;
