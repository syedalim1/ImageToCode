"use client";
import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Globe, Phone, Save, User } from "lucide-react";

interface UserProfileProps {}

const UserProfile: React.FC<UserProfileProps> = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value);
  };
  console.log(user, "user ");

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      // Update user profile in Clerk
      await user.update({
        firstName: (newUsername.split(" ")[0] || user.firstName) ?? "",
        lastName: (newUsername.split(" ")[1] || user.lastName) ?? "",
      });

      // Update custom user data in the database
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user.emailAddresses[0]?.emailAddress,
          userName: newUsername || `${user.firstName} ${user.lastName}`.trim(),
          phoneNumber,
          country,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data in the database");
      }

      // Update local state
      setUserData({
        ...userData,
        name: newUsername || `${user.firstName} ${user.lastName}`.trim(),
        phoneNumber,
        country,
      });

      // Show success animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (userLoaded && user) {
        try {
          const response = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userEmail: user.emailAddresses[0]?.emailAddress,
              userName: `${user.firstName} ${user.lastName}`.trim(),
              phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || "",
              country: "",
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          setUserData(data);
          setNewUsername(
            data.name || `${user.firstName} ${user.lastName}`.trim()
          );
          setPhoneNumber(
            data.phoneNumber || user.phoneNumbers?.[0]?.phoneNumber || ""
          );
          setCountry(data.country || "");
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else if (userLoaded) {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, userLoaded]);

  if (!userLoaded || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
        <div className="rounded-full h-32 w-32 border-2 border-white flex items-center justify-center text-white text-xl">
          Loading
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <div className="p-8 bg-white rounded-lg shadow-xl">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Oops!</h2>
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-teal-500 to-cyan-600 p-4">
      <div className="relative w-full max-w-md">
        {/* Floating glass card with enhanced effects */}
        <div
          className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-teal-500 
        rounded-xl blur-lg opacity-75 animate-pulse"
        ></div>

        <div
          className="relative bg-white/80 backdrop-blur-lg rounded-xl 
        shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Gradient border accent */}
          <div
            className="absolute inset-x-0 top-0 h-1 
          bg-gradient-to-r from-blue-500 via-teal-400 to-cyan-500"
          ></div>

          <div className="p-8 text-center space-y-6">
            {/* Animated lock icon */}
            <div className="flex justify-center mb-4">
              <div
                className="p-4 bg-blue-100/50 rounded-full 
              animate-bounce-slow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            {/* Heading and Subtext */}
            <div>
              <h2
                className="text-3xl font-bold text-gray-800 mb-3 
              bg-clip-text text-transparent 
              bg-gradient-to-r from-blue-600 to-teal-500"
              >
                Access Required
              </h2>
              <p className="text-gray-600 mb-6 text-base">
                Authentication is necessary to access this feature. Please sign
                in to continue.
              </p>
            </div>

            {/* Sign In Button with Interactive Effects */}
            <button
              onClick={() => {
                /* Add sign in logic */
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 
              text-white font-semibold rounded-lg 
              transform transition-all duration-300 
              hover:scale-105 hover:shadow-xl 
              active:scale-95 focus:outline-none 
              focus:ring-4 focus:ring-blue-300/50"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>;
  }
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

  const [firstName, lastName] = userData.name
    ? userData.name.split(" ")
    : [user?.firstName, user?.lastName];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6 text-white overflow-hidden shadow-lg">
          {/* Subtle animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-purple-700/20 animate-pulse opacity-20"></div>

          {/* Main content container */}
          <div className="relative z-10">
            <motion.h1
              className="text-4xl font-extrabold tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
            >
              User Profile
            </motion.h1>

            <div className="flex items-center mt-5 space-x-5">
              <motion.div
                className="h-24 w-24 rounded-2xl bg-white/20 backdrop-blur-sm 
          text-white flex items-center justify-center text-4xl font-bold 
          border-2 border-white/30 shadow-xl"
                initial={{
                  scale: 0,
                  rotate: -180,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.3,
                  duration: 0.7,
                  type: "spring",
                  bounce: 0.5,
                }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-purple-600">
                  {firstName.charAt(0)}
                  {lastName.charAt(0)}
                </span>
              </motion.div>

              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.5,
                  }}
                  className="text-2xl font-bold tracking-wide"
                >
                  {firstName} {lastName}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.6,
                    duration: 0.5,
                  }}
                  className="text-blue-100/80 text-base flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-200/70"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.265 1.562A8 8 0 1120 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {user?.emailAddresses[0]?.emailAddress}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="bg-gradient-to-br from-white via-blue-50 to-purple-100 
    p-6 rounded-2xl shadow-2xl border border-purple-100/50 
    overflow-hidden relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
            >
              {/* Subtle animated background effect */}
              <div className="absolute -top-10 -right-10 w-32 h-32  bg-purple-300/20 rounded-full blur-2xl animate-pulse"></div>

              <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.5,
                    type: "spring",
                    stiffness: 300,
                  }}
                  className="mr-3 bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-xl shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </motion.span>
                Personal Information
              </h2>

              <div className="space-y-4">
                {[
                  { label: "First Name", value: firstName },
                  { label: "Last Name", value: lastName },
                  {
                    label: "Email",
                    value: user?.emailAddresses[0]?.emailAddress,
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Phone Number",
                    value: userData.phoneNumber || "Not set",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.036 11.036 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Country",
                    value: userData.country || "Not set",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 01-1 1H2a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ),
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.6 + index * 0.1,
                      duration: 0.5,
                    }}
                    className="flex items-center bg-white/60 backdrop-blur-sm 
          p-3 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    {item.icon && <div className="mr-3">{item.icon}</div>}
                    <div>
                      <label className="block text-gray-500 text-xs mb-1">
                        {item.label}
                      </label>
                      <div className="text-gray-900 font-medium">
                        {item.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100  p-6 rounded-2xl shadow-2xl border border-purple-100/50  overflow-hidden relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
            >
              {/* Animated background effect */}
              <div className="absolute -top-10 -right-10 w-32 h-32   bg-purple-300/20 rounded-full blur-2xl animate-pulse"></div>

              {/* Section Header */}
              <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center  bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.6,
                    type: "spring",
                    stiffness: 300,
                  }}
                  className="mr-3 bg-gradient-to-br from-purple-100 to-pink-100    p-3 rounded-xl shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.span>
                Account Details
              </h2>

              {/* Credits Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.7,
                  duration: 0.5,
                }}
                className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-md mb-6"
              >
                <label className="block text-gray-500 text-xs mb-2 uppercase tracking-wider">
                  Account Credits
                </label>
                <div className="relative flex items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.8,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className="text-4xl font-extrabold    bg-clip-text text-transparent   bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {userData.credits}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ delay: 0.9 }}
                    className="absolute inset-0 bg-gradient-to-r 
          from-yellow-400 to-yellow-200 
          rounded-lg blur-sm"
                  ></motion.div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between space-x-4">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 
        bg-gradient-to-r from-red-500 to-pink-500 
        text-white rounded-xl 
        flex items-center justify-center 
        shadow-lg hover:shadow-xl 
        transition-all duration-300 
        transform hover:-translate-y-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl shadow-2xl border border-gray-100"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              className="flex items-center mb-6 space-x-4"
              variants={itemVariants}
            >
              <div className="bg-gradient-to-br from-indigo-200 to-indigo-300 p-3 rounded-full shadow-md">
                <User className="text-indigo-700" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                Update Profile
              </h2>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-6"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <label className="block text-gray-600 text-sm font-medium mb-2 ml-1">
                  Full Name
                </label>
                <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                  <motion.input
                    type="text"
                    value={newUsername}
                    onChange={handleUsernameChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                         focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 
                         transition-all duration-300 ease-in-out"
                    initial={{ borderColor: "#E5E7EB" }}
                    whileFocus={{
                      borderColor: "#6366F1",
                      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)",
                    }}
                  />
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 
                         text-gray-400 transition-colors"
                    size={20}
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-gray-600 text-sm font-medium mb-2 ml-1">
                  Phone Number
                </label>
                <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                  <motion.input
                    type="text"
                    value={phoneNumber}
                    readOnly
                    placeholder="Enter phone number"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                         focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 
                         transition-all duration-300 ease-in-out"
                    initial={{ borderColor: "#E5E7EB" }}
                    whileFocus={{
                      borderColor: "#6366F1",
                      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)",
                    }}
                  />
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 
                         text-gray-400 transition-colors"
                    size={20}
                  />
                </motion.div>
              </motion.div>

              <motion.div className="md:col-span-2" variants={itemVariants}>
                <label className="block text-gray-600 text-sm font-medium mb-2 ml-1">
                  Country
                </label>
                <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                  <motion.input
                    type="text"
                    value={country}
                    onChange={handleCountryChange}
                    placeholder="Enter your country"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                         focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 
                         transition-all duration-300 ease-in-out"
                    initial={{ borderColor: "#E5E7EB" }}
                    whileFocus={{
                      borderColor: "#6366F1",
                      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)",
                    }}
                  />
                  <Globe
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 
                         text-gray-400 transition-colors"
                    size={20}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-8 flex justify-center"
              variants={itemVariants}
            >
              <motion.button
                onClick={handleUpdateProfile}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 
                     text-white rounded-xl shadow-xl hover:shadow-2xl 
                     transform transition-all duration-300 
                     flex items-center space-x-3 
                     hover:from-indigo-700 hover:to-blue-700"
              >
                <Save size={20} />
                <span className="font-semibold">Update Profile</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          position: absolute;
          animation: confetti 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
