import { useIncidentStore } from "@/store/useIncidentStore";
import { motion } from "framer-motion";
import { Activity, AlertCircle, CheckCircle2, AlertTriangle, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export function DashboardSummary() {
    const { incidents } = useIncidentStore();
    const { user } = useAuthStore();

    const total = incidents.length;
    const open = incidents.filter((i) => i.status === "open").length;
    const investigating = incidents.filter((i) => i.status === "investigating").length;
    const resolved = incidents.filter((i) => i.status === "resolved").length;

    const stats = [
        {
            title: "Total Incidents",
            value: total,
            icon: <Activity className="h-5 w-5 text-blue-500" />,
            bg: "bg-blue-50 dark:bg-blue-500/10",
            border: "border-blue-100 dark:border-blue-500/20",
        },
        {
            title: "Open",
            value: open,
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
            bg: "bg-red-50 dark:bg-red-500/10",
            border: "border-red-100 dark:border-red-500/20",
        },
        {
            title: "Investigating",
            value: investigating,
            icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
            bg: "bg-yellow-50 dark:bg-yellow-500/10",
            border: "border-yellow-100 dark:border-yellow-500/20",
        },
        {
            title: "Resolved",
            value: resolved,
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            bg: "bg-green-50 dark:bg-green-500/10",
            border: "border-green-100 dark:border-green-500/20",
        },
    ];

    return (
        <div className="space-y-4">
            {user && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-full">
                            <User className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">{user.name}</h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</p>
                        </div>
                    </div>
                    {typeof user.team_id === "object" && user.team_id?.name && (
                        <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold tracking-wide border border-blue-100 dark:border-blue-500/20">
                            Department: {user.team_id.name}
                        </div>
                    )}
                </motion.div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border ${stat.bg} ${stat.border}`}
                    >
                        <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                {stat.title}
                            </p>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                {stat.value}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
