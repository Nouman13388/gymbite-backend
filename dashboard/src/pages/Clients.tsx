import { useState, useEffect, useMemo } from "react";
import { Users, UserCheck, UserX, TrendingUp, Search, RefreshCw, Trash2, Eye, UserPlus, Edit } from "lucide-react";
import { crudApi } from "../services/api";
import { apiWithNotifications } from "../services/apiWithNotifications";
import { ClientDetailModal } from "../components/modals/ClientDetailModal";
import { AssignTrainerModal } from "../components/modals/AssignTrainerModal";
import { EditClientModal } from "../components/modals/EditClientModal";
import type { ClientWithRelations, ClientStats } from "../schemas/client.schema";
import { ACTIVITY_LEVELS, getBMICategory } from "../schemas/client.schema";

export default function Clients() {
    const [clients, setClients] = useState<ClientWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Modal states
    const [selectedClient, setSelectedClient] = useState<ClientWithRelations | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [trainerFilter, setTrainerFilter] = useState<string>("all");
    const [activityFilter, setActivityFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unassigned">("all");
    const [sortBy, setSortBy] = useState<"name" | "trainer" | "activity" | "bmi" | "recent">("name");

    // Fetch clients
    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await crudApi.clients.getAll();
                const clientsData = Array.isArray(response) ? response : [];
                setClients(clientsData);
            } catch (err) {
                console.error("Failed to fetch clients:", err);
                setError(err instanceof Error ? err.message : "Failed to load clients");
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [refreshKey]);

    // Calculate stats
    const stats: ClientStats = useMemo(() => {
        const total = clients.length;
        const active = clients.filter((c) => c.trainerId !== null).length;
        const unassigned = clients.filter((c) => c.trainerId === null).length;
        const progressEntries = clients.reduce((sum, c) => sum + (c._count?.progressRecords || 0), 0);

        return { total, active, unassigned, progressEntries };
    }, [clients]);

    // Get unique trainers for filter
    const trainers = useMemo(() => {
        const trainerMap = new Map();
        clients.forEach((client) => {
            if (client.trainer) {
                trainerMap.set(client.trainer.id, client.trainer);
            }
        });
        return Array.from(trainerMap.values());
    }, [clients]);

    // Filter and sort clients
    const filteredClients = useMemo(() => {
        const filtered = clients.filter((client) => {
            // Search filter
            const matchesSearch =
                client.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (client.goals || "").toLowerCase().includes(searchTerm.toLowerCase());

            // Trainer filter
            const matchesTrainer =
                trainerFilter === "all" ||
                (trainerFilter === "unassigned" && !client.trainer) ||
                (client.trainer && client.trainer.id.toString() === trainerFilter);

            // Activity filter
            const matchesActivity =
                activityFilter === "all" || client.activityLevel === activityFilter;

            // Status filter
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && client.trainerId !== null) ||
                (statusFilter === "unassigned" && client.trainerId === null);

            return matchesSearch && matchesTrainer && matchesActivity && matchesStatus;
        });

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.user.name.localeCompare(b.user.name);
                case "trainer":
                    return (a.trainer?.user.name || "").localeCompare(b.trainer?.user.name || "");
                case "activity":
                    return (a.activityLevel || "").localeCompare(b.activityLevel || "");
                case "bmi":
                    return (b.latestProgress?.bmi || 0) - (a.latestProgress?.bmi || 0);
                case "recent":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });

        return filtered;
    }, [clients, searchTerm, trainerFilter, activityFilter, statusFilter, sortBy]);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleViewDetails = (client: ClientWithRelations) => {
        setSelectedClient(client);
        setShowDetailModal(true);
    };

    const handleEdit = (client: ClientWithRelations) => {
        setSelectedClient(client);
        setShowEditModal(true);
    };

    const handleAssignTrainer = (client: ClientWithRelations) => {
        setSelectedClient(client);
        setShowAssignModal(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await apiWithNotifications.clients.delete(id);
            handleRefresh();
            setDeleteConfirm(null);
        } catch (err) {
            console.error("Failed to delete client:", err);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading clients...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-2 text-red-600 hover:text-red-700 font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-600 mt-1">Manage clients and trainer assignments</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Clients</p>
                            <p className="text-3xl font-bold text-purple-700">{stats.total}</p>
                        </div>
                        <div className="bg-purple-200 p-3 rounded-full">
                            <Users size={24} className="text-purple-700" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Active Clients</p>
                            <p className="text-3xl font-bold text-green-700">{stats.active}</p>
                            <p className="text-xs text-gray-600 mt-1">With assigned trainer</p>
                        </div>
                        <div className="bg-green-200 p-3 rounded-full">
                            <UserCheck size={24} className="text-green-700" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Unassigned</p>
                            <p className="text-3xl font-bold text-yellow-700">{stats.unassigned}</p>
                            <p className="text-xs text-gray-600 mt-1">Need trainer</p>
                        </div>
                        <div className="bg-yellow-200 p-3 rounded-full">
                            <UserX size={24} className="text-yellow-700" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Progress Entries</p>
                            <p className="text-3xl font-bold text-blue-700">{stats.progressEntries}</p>
                            <p className="text-xs text-gray-600 mt-1">Total records</p>
                        </div>
                        <div className="bg-blue-200 p-3 rounded-full">
                            <TrendingUp size={24} className="text-blue-700" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Trainer Filter */}
                    <select
                        value={trainerFilter}
                        onChange={(e) => setTrainerFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="all">All Trainers</option>
                        <option value="unassigned">Unassigned</option>
                        {trainers.map((trainer) => (
                            <option key={trainer.id} value={trainer.id.toString()}>
                                {trainer.user.name}
                            </option>
                        ))}
                    </select>

                    {/* Activity Filter */}
                    <select
                        value={activityFilter}
                        onChange={(e) => setActivityFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="all">All Activity Levels</option>
                        {ACTIVITY_LEVELS.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active (Has Trainer)</option>
                        <option value="unassigned">Unassigned</option>
                    </select>

                    {/* Sort By */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="trainer">Sort by Trainer</option>
                        <option value="activity">Sort by Activity</option>
                        <option value="bmi">Sort by BMI</option>
                        <option value="recent">Sort by Recent</option>
                    </select>
                </div>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Trainer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Activity Level
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Current Stats
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Progress
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Users size={48} className="mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-600 text-lg">No clients found</p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {searchTerm || trainerFilter !== "all" || activityFilter !== "all" || statusFilter !== "all"
                                                ? "Try adjusting your filters"
                                                : "No clients have been created yet"}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => {
                                    const bmiCategory = getBMICategory(client.latestProgress?.bmi || null);

                                    return (
                                        <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{client.user.name}</p>
                                                    <p className="text-sm text-gray-600">{client.user.email}</p>
                                                    {client.goals && (
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{client.goals}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {client.trainer ? (
                                                    <div>
                                                        <p className="font-medium text-gray-900">{client.trainer.user.name}</p>
                                                        {client.trainer.specialty && (
                                                            <p className="text-xs text-purple-600">{client.trainer.specialty}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {client.activityLevel ? (
                                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                        {client.activityLevel}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">Not set</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {client.latestProgress ? (
                                                    <div className="text-sm">
                                                        {client.latestProgress.weight && (
                                                            <p className="text-gray-900">
                                                                <span className="font-medium">{client.latestProgress.weight}</span> kg
                                                            </p>
                                                        )}
                                                        {client.latestProgress.bmi && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <span className="text-gray-600">BMI:</span>
                                                                <span className="font-medium text-gray-900">
                                                                    {client.latestProgress.bmi.toFixed(1)}
                                                                </span>
                                                                {bmiCategory && (
                                                                    <span className={`text-xs ${bmiCategory.color}`}>
                                                                        ({bmiCategory.label})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No data</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp size={16} className="text-gray-400" />
                                                    <p className="font-medium text-gray-900">
                                                        {client._count?.progressRecords || 0}
                                                    </p>
                                                    <span className="text-xs text-gray-500">records</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(client)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(client)}
                                                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAssignTrainer(client)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Assign Trainer"
                                                    >
                                                        <UserPlus size={18} />
                                                    </button>
                                                    {deleteConfirm === client.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleDelete(client.id)}
                                                                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirm(client.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Results Summary */}
            <div className="text-center text-sm text-gray-600">
                Showing {filteredClients.length} of {clients.length} clients
            </div>

            {/* Modals */}
            {showDetailModal && selectedClient && (
                <ClientDetailModal
                    client={selectedClient}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedClient(null);
                    }}
                    onAssignTrainer={() => {
                        setShowDetailModal(false);
                        setShowAssignModal(true);
                    }}
                />
            )}

            {showAssignModal && selectedClient && (
                <AssignTrainerModal
                    clientId={selectedClient.id}
                    clientName={selectedClient.user.name}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedClient(null);
                    }}
                    onSuccess={() => {
                        handleRefresh();
                    }}
                />
            )}

            {showEditModal && selectedClient && (
                <EditClientModal
                    client={selectedClient}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedClient(null);
                    }}
                    onSuccess={() => {
                        handleRefresh();
                    }}
                />
            )}
        </div>
    );
}
