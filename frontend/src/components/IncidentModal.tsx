"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useIncidentStore, Incident } from "@/store/useIncidentStore";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentToEdit?: Incident | null;
}

export function IncidentModal({ isOpen, onClose, incidentToEdit }: IncidentModalProps) {
  const { addIncident, updateIncident } = useIncidentStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium",
    status: "open",
    assigned_to: ""
  });
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (incidentToEdit) {
      setFormData({
        title: incidentToEdit.title,
        description: incidentToEdit.description,
        severity: incidentToEdit.severity,
        status: incidentToEdit.status,
        assigned_to: incidentToEdit.assigned_to || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        severity: "medium",
        status: "open",
        assigned_to: ""
      });
    }
  }, [incidentToEdit, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Fetch users in the same team for assignment
      api.get("/users").then((res) => {
        setUsers(res.data);
      }).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (incidentToEdit) {
        const res = await api.put(`/incidents/${incidentToEdit._id}`, formData);
        updateIncident(incidentToEdit._id, res.data);
      } else {
        const res = await api.post("/incidents", formData);
        addIncident(res.data);
      }
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save incident");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            {incidentToEdit ? "Update Incident" : "Create New Incident"}
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Title</label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Database connection timeout"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
            <textarea
              required
              className="flex w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:text-neutral-50 min-h-[100px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the incident..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Severity</label>
              <select
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:text-neutral-50"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              >
                <option value="low" className="text-black">Low</option>
                <option value="medium" className="text-black">Medium</option>
                <option value="high" className="text-black">High</option>
              </select>
            </div>
            
            {incidentToEdit && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
                <select
                  className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:text-neutral-50"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="open" className="text-black">Open</option>
                  <option value="investigating" className="text-black">Investigating</option>
                  <option value="resolved" className="text-black">Resolved</option>
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Assign To</label>
              <select
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:text-neutral-50"
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              >
                <option value="" className="text-black">Unassigned</option>
                {users.map(user => (
                  <option key={user._id} value={user._id} className="text-black">{user.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-neutral-200 dark:border-neutral-800">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Incident"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
