import React from 'react'

function dummy() {
    
      // Enhanced sidebar animations
      const sidebarVariants = {
        open: {
          x: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
        closed: {
          x: "-100%",
          opacity: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            staggerChildren: 0.05,
            staggerDirection: -1,
          },
        },
      };
    
      const sidebarItemVariants = {
        open: {
          x: 0,
          opacity: 1,
        },
        closed: {
          x: -20,
          opacity: 0,
        },
      };
    
      const backdropVariants = {
        open: {
          opacity: 1,
          transition: {
            duration: 0.3,
          },
        },
        closed: {
          opacity: 0,
          transition: {
            duration: 0.3,
          },
        },
      };
        // Additional items for mobile sidebar
        const sidebarItems = [
          {
            id: "dashboard",
            label: "Home",
            icon: Home,
            color: "from-blue-500 to-cyan-500",
          },
          {
            id: "designs",
            label: "My Designs",
            icon: Layers,
            color: "from-violet-500 to-purple-600",
          },
          {
            id: "credits",
            label: "Pricing",
            icon: Crown,
            color: "from-amber-500 to-orange-500",
          },
          {
            id: "profile",
            label: "Settings",
            icon: Settings,
            color: "from-gray-600 to-gray-800",
          },
        ];
      
  return (
    <div>
   {/* Mobile Sidebar with enhanced styling and animations */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop with enhanced blur effect */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={backdropVariants}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Enhanced Sidebar */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed top-0 left-0 bottom-0 w-72 bg-gradient-to-b from-indigo-900 via-purple-900 to-violet-900 z-50 rounded-r-2xl shadow-2xl overflow-hidden mobile-sidebar md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Enhanced Header with glow effect */}
                <div className="flex items-center justify-between p-4 border-b border-purple-700/50 relative">
                  <Link href="/" className="flex items-center">
                    <div className="p-2 rounded-lg bg-white/10 mr-3 shadow-inner shadow-purple-800/50">
                      <Image className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      ImageToCode
                    </span>
                  </Link>
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-full hover:bg-purple-800/50"
                  >
                    <X className="h-5 w-5 text-white" />
                  </motion.button>

                  {/* Decorative glow element */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"></div>
                </div>

                {/* Enhanced menu items with staggered animation and visual indicators */}
                <div className="flex-grow overflow-y-auto py-4 space-y-2 px-3">
                  {sidebarItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={sidebarItemVariants}
                      custom={index}
                      whileHover={{
                        x: 5,
                        backgroundColor: "rgba(255,255,255,0.1)",
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={`/${item.id}`}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium relative overflow-hidden
                          ${
                            activeTab === item.id
                              ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                              : "text-white hover:shadow-md hover:shadow-purple-800/20"
                          }`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                      >
                        {activeTab === item.id && (
                          <motion.div
                            className="absolute inset-0 opacity-20"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                              scale: [1, 1.5, 1.2],
                              opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          />
                        )}
                        <div className="flex items-center z-10">
                          <div
                            className={`p-2 rounded-lg ${
                              activeTab === item.id
                                ? "bg-white/20"
                                : "bg-white/10"
                            } mr-3`}
                          >
                            <item.icon className="w-4 h-4" />
                          </div>
                          {item.label}
                        </div>
                        <ChevronRight className="w-4 h-4 z-10" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Version info */}
                <div className="p-4 text-white/50 text-xs text-center border-t border-purple-700/30">
                  <p>ImageToCode v2.5.0</p>
                  <p className="mt-1">Transform designs into code with AI</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}

export default dummy