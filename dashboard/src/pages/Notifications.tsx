import { useEffect, useState } from "react";
import { crudApi } from "../services/api";
import NotificationForm from "../components/forms/NotificationForm";
import { notificationTemplates, type NotificationTemplate } from "../schemas/notification.schema";

interface Notification {
    id: number;
    userId: number;
    message: string;
    notificationType: string;
    status: string;
    createdAt: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Stats
    const [stats, setStats] = useState({
        today: 0,
        thisWeek: 0,
        total: 0,
        readRate: 0,
    });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await crudApi.notifications.getAll();
            const sortedData = (data as Notification[]).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setNotifications(sortedData);

            // Calculate stats immediately after setting notifications
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            const todayCount = sortedData.filter(
                (n) => new Date(n.createdAt) >= today
            ).length;

            const weekCount = sortedData.filter(
                (n) => new Date(n.createdAt) >= weekAgo
            ).length;

            const readCount = sortedData.filter((n) => n.status === "READ").length;
            const readRate = sortedData.length > 0
                ? Math.round((readCount / sortedData.length) * 100)
                : 0;

            setStats({
                today: todayCount,
                thisWeek: weekCount,
                total: sortedData.length,
                readRate,
            });
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateClick = (template: NotificationTemplate) => {
        setSelectedTemplate(template);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setSelectedTemplate(null);
        fetchNotifications();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this notification?")) return;

        try {
            await crudApi.notifications.delete(id);
            setNotifications(notifications.filter((n) => n.id !== id));
        } catch (error) {
            console.error("Failed to delete notification:", error);
            alert("Failed to delete notification");
        }
    };

    // Filtering
    const filteredNotifications = notifications.filter((notification) => {
        const statusMatch = filterStatus === "all" || notification.status === filterStatus;
        const typeMatch = filterType === "all" || notification.notificationType === filterType;
        const searchMatch =
            searchQuery === "" ||
            notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notification.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notification.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notification.user.email.toLowerCase().includes(searchQuery.toLowerCase());

        return statusMatch && typeMatch && searchMatch;
    });

    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            WORKOUT: "💪",
            MEAL: "🍽️",
            APPOINTMENT: "📅",
            PROGRESS: "📊",
            MESSAGE: "💬",
            ANNOUNCEMENT: "📢",
            INFO: "ℹ️",
            WARNING: "⚠️",
            REMINDER: "🔔",
        };
        return icons[type] || "📬";
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            WORKOUT: "bg-blue-100 text-blue-700",
            MEAL: "bg-green-100 text-green-700",
            APPOINTMENT: "bg-purple-100 text-purple-700",
            PROGRESS: "bg-orange-100 text-orange-700",
            MESSAGE: "bg-yellow-100 text-yellow-700",
            ANNOUNCEMENT: "bg-red-100 text-red-700",
            INFO: "bg-gray-100 text-gray-700",
            WARNING: "bg-amber-100 text-amber-700",
            REMINDER: "bg-indigo-100 text-indigo-700",
        };
        return colors[type] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-white/60 mt-1">Send and manage push notifications</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                    </svg>
                    {showForm ? "Hide Form" : "Send Notification"}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-dark-card rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/60">Sent Today</p>
                            <p className="text-2xl font-bold text-white mt-2">{stats.today}</p>
                        </div>
                        <div className="bg-blue-600/20 p-3 rounded-full">
                            <svg
                                className="w-6 h-6 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-dark-card rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/60">This Week</p>
                            <p className="text-2xl font-bold text-white mt-2">{stats.thisWeek}</p>
                        </div>
                        <div className="bg-green-600/20 p-3 rounded-full">
                            <svg
                                className="w-6 h-6 text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-dark-card rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/60">Total Sent</p>
                            <p className="text-2xl font-bold text-white mt-2">{stats.total}</p>
                        </div>
                        <div className="bg-purple-600/20 p-3 rounded-full">
                            <svg
                                className="w-6 h-6 text-purple-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-dark-card rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/60">Read Rate</p>
                            <p className="text-2xl font-bold text-white mt-2">{stats.readRate}%</p>
                        </div>
                        <div className="bg-orange-600/20 p-3 rounded-full">
                            <svg
                                className="w-6 h-6 text-orange-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Send Notification Form */}
            {showForm && (
                <div className="bg-dark-card rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        {selectedTemplate ? `Send ${selectedTemplate.name}` : "Send New Notification"}
                    </h2>
                    <NotificationForm
                        selectedTemplate={selectedTemplate}
                        onSuccess={handleFormSuccess}
                        onCancel={() => {
                            setShowForm(false);
                            setSelectedTemplate(null);
                        }}
                    />
                </div>
            )}

            {/* Quick Templates */}
            {!showForm && (
                <div>
                    <h2 className="text-lg font-semibold text-white/80 mb-4">Quick Templates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {notificationTemplates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => handleTemplateClick(template)}
                                className={`${template.color} text-white rounded-lg p-4 text-left hover:opacity-90 transition-opacity shadow-md`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl">{template.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                                        <p className="text-sm text-white/90 line-clamp-2">{template.message}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters and Search */}
            <div className="bg-dark-card rounded-lg shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 bg-dark-input border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-dark-input border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="UNREAD">Unread</option>
                        <option value="READ">Read</option>
                    </select>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 bg-dark-input border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Types</option>
                        <option value="WORKOUT">Workout</option>
                        <option value="MEAL">Meal</option>
                        <option value="APPOINTMENT">Appointment</option>
                        <option value="PROGRESS">Progress</option>
                        <option value="MESSAGE">Message</option>
                        <option value="ANNOUNCEMENT">Announcement</option>
                        <option value="INFO">Info</option>
                        <option value="WARNING">Warning</option>
                        <option value="REMINDER">Reminder</option>
                    </select>
                    <button
                        onClick={fetchNotifications}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-dark-card rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700/30">
                        <thead className="bg-gray-800/40">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Recipient
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Message
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Sent At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-dark-card divide-y divide-gray-700/30">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-white/60">
                                        Loading notifications...
                                    </td>
                                </tr>
                            ) : filteredNotifications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-white/60">
                                        No notifications found
                                    </td>
                                </tr>
                            ) : (
                                filteredNotifications.map((notification) => (
                                    <tr key={notification.id} className="hover:bg-gray-700/20">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.notificationType)}`}>
                                                {getTypeIcon(notification.notificationType)} {notification.notificationType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="font-medium text-white">
                                                    {notification.user.firstName} {notification.user.lastName}
                                                </div>
                                                <div className="text-white/60">{notification.user.email}</div>
                                                <div className="text-xs text-white/40">{notification.user.role}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-white max-w-md">
                                                {notification.message}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${notification.status === "READ"
                                                ? "bg-green-600/20 text-green-400"
                                                : "bg-yellow-600/20 text-yellow-400"
                                                }`}>
                                                {notification.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="text-red-400 hover:text-red-300 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
