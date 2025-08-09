"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";

export default function DashboardLayout ({children}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {/* Sidebar */}
                <Sidebar />

                {/* Page Content */}
                <div className="flex-1 lg:ml-0">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
};