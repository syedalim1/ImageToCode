"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";
import { eq, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import LoadingState from "./_component/LoadingState";
import ErrorState from "./_component/ErrorState";
import Header from "./_component/Header";
import StatsBar from "./_component/StatsBar";
import EmptyState from "./_component/EmptyState";
import DesignsGrid from "./_component/DesignsGrid";
import DesignsList from "./_component/DesignsList";


function DesignsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [designs, setDesigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterModel, setFilterModel] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get unique models for filter dropdown
  const uniqueModels = [...new Set(designs.map((design) => design.model))];

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError("");
      if (user && user.id) {
        const result = await db
          .select()
          .from(imagetocodeTable)
          .where(
            eq(
              imagetocodeTable.email,
              user.primaryEmailAddress?.emailAddress ?? ""
            )
          )
          .orderBy(desc(imagetocodeTable.uid));

        // Add some sample designs for demonstration if none exist
        if (result.length === 0) {
          const sampleDesigns = [
            {
              id: 1,
              uid: "sample-1",
              model: "GPT-4",
              imageUrl:
                "https://placehold.co/600x400/5271ff/ffffff?text=Sample+Design+1",
              code: { content: "<div>Sample code</div>" },
              description: "Sample Login Page",
              createdAt: new Date().toISOString(),
              options: {},
            },
            {
              id: 2,
              uid: "sample-2",
              model: "Claude",
              imageUrl:
                "https://placehold.co/600x400/ff5271/ffffff?text=Sample+Design+2",
              code: { content: "<div>Sample code</div>" },
              description: "Sample Dashboard",
              createdAt: "2025-02-25T00:00:00.000Z", // 1 day ago
              options: {},
            },
            {
              id: 3,
              uid: "sample-3",
              model: "GPT-4",
              imageUrl:
                "https://placehold.co/600x400/52ff71/ffffff?text=Sample+Design+3",
              code: { content: "<div>Sample code</div>" },
              description: "Sample Product Page",
              createdAt: "2025-02-24T00:00:00.000Z", // 2 days ago
              options: {},
            },
          ];
          setDesigns(sampleDesigns);
        } else {
          const validDesigns = result.filter((design) => design.code != null);
          setDesigns(validDesigns);
        }
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
    fetchDesigns();
  }, [user]);

  // Filter and sort designs
  const filteredAndSortedDesigns = designs
    // First ensure there are no duplicate UIDs
    .filter(
      (design, index, self) =>
        index === self.findIndex((d) => d.uid === design.uid)
    )
    .filter((design) => {
      // Apply search filter
      const matchesSearch =
        !searchTerm ||
        (design.description &&
          design.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        design.model.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply model filter
      const matchesModel = !filterModel || design.model === filterModel;

      return matchesSearch && matchesModel;
    })
    .sort((a, b) => {
      // Sort by creation date
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} retryFn={fetchDesigns} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          filterModel={filterModel}
          setFilterModel={setFilterModel}
          uniqueModels={uniqueModels}
          isRefreshing={isRefreshing}
          handleRefresh={handleRefresh}
        />

        <StatsBar
          designsCount={designs.length}
          generatedCodeCount={designs.filter((d) => d.code).length}
          thisWeekCount={
            designs.filter((d) => {
              const date = new Date(d.createdAt);
              const now = new Date();
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return date >= weekAgo;
            }).length
          }
          filteredResultsCount={filteredAndSortedDesigns.length}
        />

        {filteredAndSortedDesigns.length === 0 ? (
          <EmptyState hasSearchOrFilter={!!(searchTerm || filterModel)} />
        ) : viewMode === "grid" ? (
          <DesignsGrid designs={filteredAndSortedDesigns} />
        ) : (
          <DesignsList designs={filteredAndSortedDesigns} />
        )}
      </div>
    </div>
  );
}

export default DesignsPage;
