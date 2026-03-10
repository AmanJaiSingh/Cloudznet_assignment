"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useIncidentStore, Incident } from "@/store/useIncidentStore";
import { IncidentTable } from "@/components/IncidentTable";
import { IncidentModal } from "@/components/IncidentModal";
import { Button } from "@/components/ui/Button";
import { Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { setIncidents, addIncident, updateIncident, removeIncident } = useIncidentStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incidentToEdit, setIncidentToEdit] = useState<Incident | null>(null);
  
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterStatus ? `/incidents?status=${filterStatus}` : "/incidents";
      const res = await api.get(url);
      setIncidents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, setIncidents]);

  useEffect(() => {
    fetchIncidents();

    // Setup SSE for real-time updates
    const token = localStorage.getItem("token");
    if (!token) return;

    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.29.78:5000";
    const eventSource = new EventSource(`${baseURL}/incidents/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "connected") return;
        
        // Ensure filter matches if there's an active filter
        if (filterStatus && data.payload?.status && data.payload.status !== filterStatus) {
           if (data.type !== "incident_deleted") {
             // If updated to a different status than current filter, remove it from view
             removeIncident(data.payload._id);
             return;
           }
        }

        switch (data.type) {
          case "incident_created":
            addIncident(data.payload);
            break;
          case "incident_updated":
            updateIncident(data.payload._id, data.payload);
            break;
          case "incident_deleted":
            removeIncident(data.payload._id);
            break;
        }
      } catch (err) {
        console.error("Error parsing SSE data", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [fetchIncidents, addIncident, updateIncident, removeIncident, filterStatus]);

  const handleCreateNew = () => {
    setIncidentToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (incident: Incident) => {
    setIncidentToEdit(incident);
    setIsModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Dashboard</h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your team's incidents and track resolutions.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <select
              className="h-10 pl-9 pr-4 rounded-md border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 appearance-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Incident
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 dark:border-neutral-800 dark:border-t-neutral-50"></div>
        </div>
      ) : (
        <IncidentTable onEdit={handleEdit} />
      )}

      <IncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        incidentToEdit={incidentToEdit}
      />
    </motion.div>
  );
}
