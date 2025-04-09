// types.js
import React from "react";

export interface Template {
    id: string;
    content: string;
    title: string;
    createdAt: number;
    category?: string;
}

export interface AiSuggestion {
    id: string;
    content: string;
    category: string;
    icon: React.ReactNode;
}