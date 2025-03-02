"use client";
import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";

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
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
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
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-teal-400">
        <div className="p-8 bg-white rounded-lg shadow-xl text-center">
          <div className="text-blue-500 text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Required
          </h2>
          <div className="text-gray-600 mb-4">
            No user data found. Please sign in.
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const [firstName, lastName] = userData.name
    ? userData.name.split(" ")
    : [user.firstName, user.lastName];

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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            User Profile
          </motion.h1>
          <div className="flex items-center mt-4">
            <motion.div
              className="h-20 w-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold mr-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            >
              {firstName.charAt(0)}
              {lastName.charAt(0)}
            </motion.div>
            <div>
              <div className="text-xl font-semibold">
                {firstName} {lastName}
              </div>
              <div className="text-blue-100">
                {user.emailAddresses[0]?.emailAddress}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="inline-block bg-blue-100 p-2 rounded-full text-blue-500 mr-2">
                  👤
                </span>
                Personal Info
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    First Name
                  </label>
                  <div className="text-gray-900 font-medium">{firstName}</div>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    Last Name
                  </label>
                  <div className="text-gray-900 font-medium">{lastName}</div>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    Email
                  </label>
                  <div className="text-gray-900 font-medium">
                    {user.emailAddresses[0]?.emailAddress}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    Phone Number
                  </label>
                  <div className="text-gray-900 font-medium">
                    {userData.phoneNumber || "Not set"}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    Country
                  </label>
                  <div className="text-gray-900 font-medium">
                    {userData.country || "Not set"}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="inline-block bg-purple-100 p-2 rounded-full text-purple-500 mr-2">
                  💰
                </span>
                Account Details
              </h2>
              <div className="mb-4">
                <label className="block text-gray-500 text-sm mb-1">
                  Account Credits
                </label>
                <div className="relative">
                  <div className="text-3xl font-bold text-gray-900">
                    {userData.credits}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-lg opacity-20"></div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center shadow-md hover:bg-red-600 transition-colors"
                >
                  <span className="mr-2">🚪</span> Logout
                </motion.button>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="inline-block bg-indigo-100 p-2 rounded-full text-indigo-500 mr-2">
                ✏️
              </span>
              Update Profile
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Full Name
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={newUsername}
                  onChange={handleUsernameChange}
                  placeholder="Full Name"
                  className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="Phone Number"
                  className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Country
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={country}
                  onChange={handleCountryChange}
                  placeholder="Country"
                  className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdateProfile}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center"
              >
                <span className="mr-2">💾</span> Update Profile
              </motion.button>
            </div>
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
