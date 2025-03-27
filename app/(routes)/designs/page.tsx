"use client";
import React, { useEffect, useState } from "react";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import confetti from "canvas-confetti";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Design } from "@/types/design";

import LoadingState from "./_component/LoadingState";
// import ErrorState from "./_component/ErrorState";

import {
  DesignsHeader,
  DesignsFilters,
  DesignsGrid,
  DesignsList,
  SignedOutView,
  EmptyState,
} from "./components";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";

// Helper function to parse dates
const parseDate = (dateString: string): Date | null => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

function DesignsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError("");

      // Get the current user's email
      const userEmail = user?.emailAddresses?.[0]?.emailAddress;

      // BUG FIX: Only show designs belonging to the current user instead of all designs
      // This addresses the issue where all designs were being shown to everyone
      let result;
      if (userEmail) {
        // If user is logged in, fetch only their designs
        result = await db
          .select()
          .from(imagetocodeTable)
          .where(eq(imagetocodeTable.email, userEmail))
          .orderBy(desc(imagetocodeTable.createdAt))
          .limit(50);
      } else {
        // If no email (shouldn't happen if logged in), fetch with no email filter
        result = await db
          .select()
          .from(imagetocodeTable)
          .orderBy(desc(imagetocodeTable.createdAt))
          .limit(50);
      }

      if (result) {
        const validDesigns = result
          .filter((design): design is Design => {
            if (!design.code || typeof design.code !== "object") return false;
            const code = design.code as { content?: string };
            return typeof code.content === "string";
          })
          .map((design) => ({
            ...design,
            code:
              typeof design.code === "string"
                ? { content: design.code }
                : (design.code as { content: string }),
            options: Array.isArray(design.options) ? design.options : [],
          }));
        setDesigns(validDesigns);
      }
    } catch (err) {
      setError("Failed to fetch designs. Please try again later.");
      console.error("Error fetching designs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDesigns();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchDesigns();
    }
  }, [user, isSignedIn]);


  const weeklyData = Array(7)
    .fill(0)
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      return {
        name: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()],
        count: designs.filter((design) => {
          const designDate = parseDate(design.createdAt);
          return (
            designDate && designDate.toISOString().split("T")[0] === dateStr
          );
        }).length,
      };
    });

  const handleDelete = async (uid: string) => {
    try {
      // Delete the design from the database
      await db.delete(imagetocodeTable).where(eq(imagetocodeTable.uid, uid));

      // Update the local state to remove the deleted design
      setDesigns((prevDesigns) =>
        prevDesigns.filter((design) => design.uid !== uid)
      );

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff0000", "#ff6b6b", "#ffd93d"],
        shapes: ["circle", "square"],
        scalar: 0.8,
        ticks: 200,
        gravity: 0.5,
        drift: 0,
      });

      // Show success toast with custom styling
      toast.success("Design deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "linear-gradient(to right, #ff6b6b, #ff8e8e)",
          color: "white",
          borderRadius: "8px",
          padding: "12px 24px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      });
    } catch (error) {
      console.error("Error deleting design:", error);
      setError("Failed to delete design. Please try again.");

      // Show error toast with custom styling
      toast.error("Failed to delete design", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "linear-gradient(to right, #ff4444, #ff6b6b)",
          color: "white",
          borderRadius: "8px",
          padding: "12px 24px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      });
    }
  };

 
  if (loading && isSignedIn) {
    return <LoadingState />;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className=" mx-auto p-4 sm:p-6 lg:p-8">
        <SignedIn>
          {/* Header Component */}
          <DesignsHeader
            isRefreshing={isRefreshing}
      
            showFilters={showFilters}
            handleRefresh={handleRefresh}
            toggleFilters={() => setShowFilters(!showFilters)}
          />

          {/* Filters Component */}
          {showFilters && (
            <DesignsFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          )}

          {/* Designs Display */}
          {designs.length === 0 ? (
            <EmptyState hasSearchOrFilter={!!(searchTerm )} />
          ) : viewMode === "grid" ? (
            <DesignsGrid
              designs={designs}
              onDelete={handleDelete}
            />
          ) : (
                <DesignsList designs={designs} onDelete={handleDelete}  />
          )}
        </SignedIn>

        <SignedOut>
          {/* Content only visible to signed out users */}
          <SignedOutView />
        </SignedOut>
      </div>
    </div>
  );
}

export default DesignsPage;
