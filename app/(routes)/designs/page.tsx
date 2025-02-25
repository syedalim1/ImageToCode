"use client";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";
import React, { useEffect, useState } from "react";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface Design {
  id: number;
  uid: string;
  model: string;
  imageUrl: string;
  code: unknown;
  description: string | null;
  createdAt: string;
  options: unknown;
}

function DesignsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);

  useEffect(() => {
    console.log(user, "user");
  }, [user]);

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
              imagetocodeTable.createdAt,
              user.primaryEmailAddress?.emailAddress ?? ""
            )
          )
          .orderBy(desc(imagetocodeTable.uid));

        for (let i = 0; i < result.length; i++) {
          if (result[i].code != null) {
            setDesigns(result as Design[]);
          }
        }
      }
    } catch (err) {
      setError("Failed to fetch designs. Please try again later.");
      console.error("Error fetching designs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 text-lg">{error}</p>
        <Button onClick={fetchDesigns}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-blue-100 to-blue-50">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Your Designs</h1>

      {designs.length === 0 ? (
        <div className="text-center text-gray-500">
          No designs found. Create your first design!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design, key) => (
            <div
              key={key}
              className="border rounded-lg p-4 hover:shadow-xl transition-shadow transform hover:scale-105"
            >
              <Link href={`/designs/${design.uid}`}>
                <img
                  src={design.imageUrl}
                  alt="Design preview"
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h3 className="font-semibold mb-2">
                  {design.description ? design.description.substring(0, 20) : "Untitled Design"}
                </h3>
                <p className="text-sm text-gray-500">
                  Created: {design.createdAt}
                </p>
                <p className="text-sm text-gray-500">Model: {design.model}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DesignsPage;
