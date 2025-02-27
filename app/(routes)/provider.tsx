"use client";
import React, { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

function DashboardProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user?.user && user.user) return router.replace("/");

    user?.user && checkUser();
  }, [user]);

  const checkUser = async () => {
    const result = await axios.post("/api/user", {
      userName: user?.user?.displayName,
      userEmail: user?.user?.email,
    });
    console.log(user);
  };

  return (
    <motion.div 
      className="w-full max-w-full overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export default DashboardProvider;
