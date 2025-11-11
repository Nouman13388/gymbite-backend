import { useState, useEffect } from "react";
import {
    Server,
    Database,
    Shield,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Clock,
    Activity,
    Globe,
    Code,
} from "lucide-react";
import { crudApi } from "../services/api";
import { format } from "date-fns";

interface SystemHealth {
    database: {
        users: number;
        trainers: number;
        clients: number;
        appointments: number;
        progressRecords: number;
        feedback: number;
        notifications: number;
        workoutPlans: number;
        mealPlans: number;
    };
    health: string;
    timestamp: string;
}

export default function Settings() {
    const [healthData, setHealthData] = useState<SystemHealth | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastChecked, setLastChecked] = useState<Date>(new Date());

    const fetchHealthData = async () => {
        setLoading(true);
        try {
            const response = (await crudApi.analytics.systemHealth()) as {
                data: SystemHealth;
            };
            setHealthData(response.data);
            setLastChecked(new Date());
        } catch (error) {
            console.error("Error fetching system health:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealthData();
    }, []);

    const isHealthy = healthData?.health === "healthy";

    // Environment variables
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "N/A";
    const environment = import.meta.env.MODE || "development";

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">
                        System configuration and health monitoring
                    </p>
                </div>
                <button
                    onClick={fetchHealthData}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">System Status</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overall Health */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            {isHealthy ? (
                                <CheckCircle className="text-green-600" size={32} />
                            ) : (
                                <AlertCircle className="text-red-600" size={32} />
                            )}
                            <div>
                                <p className="text-sm text-gray-600">System Health</p>
                                <p
                                    className={`text-2xl font-bold ${isHealthy ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {loading ? "Checking..." : isHealthy ? "Healthy" : "Offline"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Last Checked */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Clock className="text-gray-600" size={32} />
                            <div>
                                <p className="text-sm text-gray-600">Last Checked</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {format(lastChecked, "hh:mm:ss a")}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {format(lastChecked, "MMM dd, yyyy")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Server className="text-purple-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">
                        System Information
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* API URL */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe size={18} className="text-blue-600" />
                            <p className="text-sm font-semibold text-gray-700">Backend API</p>
                        </div>
                        <p className="text-sm text-gray-900 font-mono break-all">
                            {apiUrl}
                        </p>
                    </div>

                    {/* Environment */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Code size={18} className="text-green-600" />
                            <p className="text-sm font-semibold text-gray-700">Environment</p>
                        </div>
                        <p className="text-sm text-gray-900">
                            <span
                                className={`px-2 py-1 rounded ${environment === "production"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                            >
                                {environment.toUpperCase()}
                            </span>
                        </p>
                    </div>

                    {/* Firebase Project */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={18} className="text-orange-600" />
                            <p className="text-sm font-semibold text-gray-700">
                                Firebase Project
                            </p>
                        </div>
                        <p className="text-sm text-gray-900 font-mono">{firebaseProjectId}</p>
                    </div>

                    {/* Database Status */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Database size={18} className="text-purple-600" />
                            <p className="text-sm font-semibold text-gray-700">
                                Database Status
                            </p>
                        </div>
                        <p className="text-sm">
                            {loading ? (
                                <span className="text-gray-500">Checking...</span>
                            ) : healthData ? (
                                <span className="flex items-center gap-2 text-green-600">
                                    <CheckCircle size={16} />
                                    Connected
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 text-red-600">
                                    <AlertCircle size={16} />
                                    Disconnected
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Database Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Database className="text-green-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">
                        Database Statistics
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <RefreshCw className="animate-spin text-gray-400" size={32} />
                        <p className="text-gray-500 ml-3">Loading database stats...</p>
                    </div>
                ) : healthData ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {/* Users */}
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                            <p className="text-sm text-blue-600 font-medium mb-1">Users</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {healthData.database.users}
                            </p>
                        </div>

                        {/* Trainers */}
                        <div className="p-4 bg-purple-50 rounded-lg text-center">
                            <p className="text-sm text-purple-600 font-medium mb-1">
                                Trainers
                            </p>
                            <p className="text-3xl font-bold text-purple-900">
                                {healthData.database.trainers}
                            </p>
                        </div>

                        {/* Clients */}
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                            <p className="text-sm text-green-600 font-medium mb-1">Clients</p>
                            <p className="text-3xl font-bold text-green-900">
                                {healthData.database.clients}
                            </p>
                        </div>

                        {/* Appointments */}
                        <div className="p-4 bg-orange-50 rounded-lg text-center">
                            <p className="text-sm text-orange-600 font-medium mb-1">
                                Appointments
                            </p>
                            <p className="text-3xl font-bold text-orange-900">
                                {healthData.database.appointments}
                            </p>
                        </div>

                        {/* Progress Records */}
                        <div className="p-4 bg-pink-50 rounded-lg text-center">
                            <p className="text-sm text-pink-600 font-medium mb-1">Progress</p>
                            <p className="text-3xl font-bold text-pink-900">
                                {healthData.database.progressRecords}
                            </p>
                        </div>

                        {/* Feedback */}
                        <div className="p-4 bg-yellow-50 rounded-lg text-center">
                            <p className="text-sm text-yellow-600 font-medium mb-1">
                                Feedback
                            </p>
                            <p className="text-3xl font-bold text-yellow-900">
                                {healthData.database.feedback}
                            </p>
                        </div>

                        {/* Notifications */}
                        <div className="p-4 bg-indigo-50 rounded-lg text-center">
                            <p className="text-sm text-indigo-600 font-medium mb-1">
                                Notifications
                            </p>
                            <p className="text-3xl font-bold text-indigo-900">
                                {healthData.database.notifications}
                            </p>
                        </div>

                        {/* Workout Plans */}
                        <div className="p-4 bg-red-50 rounded-lg text-center">
                            <p className="text-sm text-red-600 font-medium mb-1">
                                Workout Plans
                            </p>
                            <p className="text-3xl font-bold text-red-900">
                                {healthData.database.workoutPlans}
                            </p>
                        </div>

                        {/* Meal Plans */}
                        <div className="p-4 bg-teal-50 rounded-lg text-center">
                            <p className="text-sm text-teal-600 font-medium mb-1">
                                Meal Plans
                            </p>
                            <p className="text-3xl font-bold text-teal-900">
                                {healthData.database.mealPlans}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <AlertCircle className="mx-auto text-red-400 mb-3" size={48} />
                        <p className="text-gray-500">Failed to load database statistics</p>
                    </div>
                )}
            </div>

            {/* Configuration Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="text-indigo-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">Configuration</h2>
                </div>

                <div className="space-y-4">
                    {/* CORS */}
                    <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                            CORS Settings
                        </p>
                        <p className="text-sm text-gray-600">
                            Cross-Origin Resource Sharing is enabled for all origins in
                            development mode
                        </p>
                    </div>

                    {/* Authentication */}
                    <div className="p-4 border-l-4 border-green-500 bg-green-50">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                            Authentication
                        </p>
                        <p className="text-sm text-gray-600">
                            Firebase Authentication with role-based access control (CLIENT,
                            TRAINER, ADMIN)
                        </p>
                    </div>

                    {/* Notifications */}
                    <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                            Push Notifications
                        </p>
                        <p className="text-sm text-gray-600">
                            Firebase Cloud Messaging (FCM) enabled for real-time notifications
                        </p>
                    </div>

                    {/* Default Settings */}
                    <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                            Default Settings
                        </p>
                        <p className="text-sm text-gray-600">
                            Appointment Duration: 60 minutes | Auto-calculate BMI on progress
                            entries
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                            Read-Only Mode
                        </p>
                        <p className="text-sm text-blue-700">
                            Settings page is currently in read-only mode. Configuration
                            management features will be added in future updates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
