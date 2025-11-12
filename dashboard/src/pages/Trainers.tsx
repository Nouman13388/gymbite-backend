import { useState, useEffect, useMemo } from "react";
import { Users, TrendingUp, Star, UserPlus, Search, RefreshCw, Trash2, Eye, Edit } from "lucide-react";
import { crudApi } from "../services/api";
import { apiWithNotifications } from "../services/apiWithNotifications";
import { TrainerDetailModal } from "../components/modals/TrainerDetailModal";
import { AssignClientModal } from "../components/modals/AssignClientModal";
import { EditTrainerModal } from "../components/modals/EditTrainerModal";
import type { TrainerWithRelations, TrainerStats } from "../schemas/trainer.schema";
import { TRAINER_SPECIALTIES } from "../schemas/trainer.schema";

export default function Trainers() {
    const [trainers, setTrainers] = useState<TrainerWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Modal states
    const [selectedTrainer, setSelectedTrainer] = useState<TrainerWithRelations | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
    const [ratingFilter, setRatingFilter] = useState<number>(0);
    const [sortBy, setSortBy] = useState<"name" | "clients" | "rating" | "experience">("name");

    // Fetch trainers
    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await crudApi.trainers.getAll();
                const trainersData = Array.isArray(response) ? response : [];
                setTrainers(trainersData);
            } catch (err) {
                console.error("Failed to fetch trainers:", err);
                setError(err instanceof Error ? err.message : "Failed to load trainers");
            } finally {
                setLoading(false);
            }
        };

        fetchTrainers();
    }, [refreshKey]);

    // Calculate stats
    const stats: TrainerStats = useMemo(() => {
        const total = trainers.length;
        const active = trainers.filter((t) => (t._count?.clients || 0) > 0).length;
        const totalClients = trainers.reduce((sum, t) => sum + (t._count?.clients || 0), 0);
        const ratingsSum = trainers.reduce((sum, t) => sum + (t.averageRating || 0), 0);
        const trainersWithRatings = trainers.filter((t) => (t.averageRating || 0) > 0).length;
        const averageRating = trainersWithRatings > 0 ? ratingsSum / trainersWithRatings : 0;

        return { total, active, totalClients, averageRating };
    }, [trainers]);

    // Filter and sort trainers
    const filteredTrainers = useMemo(() => {
        const filtered = trainers.filter((trainer) => {
            // Search filter
            const matchesSearch =
                trainer.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                trainer.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (trainer.specialty || "").toLowerCase().includes(searchTerm.toLowerCase());

            // Specialty filter
            const matchesSpecialty =
                specialtyFilter === "all" || trainer.specialty === specialtyFilter;

            // Rating filter
            const matchesRating = ratingFilter === 0 || (trainer.averageRating || 0) >= ratingFilter;

            return matchesSearch && matchesSpecialty && matchesRating;
        });

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.user.name.localeCompare(b.user.name);
                case "clients":
                    return (b._count?.clients || 0) - (a._count?.clients || 0);
                case "rating":
                    return (b.averageRating || 0) - (a.averageRating || 0);
                case "experience":
                    return (b.experience || 0) - (a.experience || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [trainers, searchTerm, specialtyFilter, ratingFilter, sortBy]);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleViewDetails = (trainer: TrainerWithRelations) => {
        setSelectedTrainer(trainer);
        setShowDetailModal(true);
    };

    const handleEdit = (trainer: TrainerWithRelations) => {
        setSelectedTrainer(trainer);
        setShowEditModal(true);
    };

    const handleAssignClient = (trainer: TrainerWithRelations) => {
        setSelectedTrainer(trainer);
        setShowAssignModal(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await apiWithNotifications.trainers.delete(id);
            handleRefresh();
            setDeleteConfirm(null);
        } catch (err) {
            console.error("Failed to delete trainer:", err);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading trainers...</p>
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
                    <p className="text-white/60 mt-1">Manage trainers and client assignments</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-dark-card p-6 rounded-lg border border-gray-700/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60 mb-1">Total Trainers</p>
                            <p className="text-3xl font-bold text-white">{stats.total}</p>
                        </div>
                        <div className="bg-blue-600/20 p-3 rounded-full">
                            <Users size={24} className="text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-dark-card p-6 rounded-lg border border-gray-700/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60 mb-1">Active Trainers</p>
                            <p className="text-3xl font-bold text-white">{stats.active}</p>
                            <p className="text-xs text-white/40 mt-1">With assigned clients</p>
                        </div>
                        <div className="bg-green-600/20 p-3 rounded-full">
                            <TrendingUp size={24} className="text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-dark-card p-6 rounded-lg border border-gray-700/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60 mb-1">Total Clients</p>
                            <p className="text-3xl font-bold text-white">{stats.totalClients}</p>
                            <p className="text-xs text-white/40 mt-1">Across all trainers</p>
                        </div>
                        <div className="bg-purple-600/20 p-3 rounded-full">
                            <Users size={24} className="text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-dark-card p-6 rounded-lg border border-gray-700/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60 mb-1">Average Rating</p>
                            <div className="flex items-center gap-2">
                                <p className="text-3xl font-bold text-white">
                                    {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "N/A"}
                                </p>
                                {stats.averageRating > 0 && (
                                    <Star size={20} className="text-yellow-500 fill-yellow-500" />
                                )}
                            </div>
                        </div>
                        <div className="bg-yellow-600/20 p-3 rounded-full">
                            <Star size={24} className="text-yellow-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-dark-card rounded-lg shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search trainers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-dark-input border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Specialty Filter */}
                    <select
                        value={specialtyFilter}
                        onChange={(e) => setSpecialtyFilter(e.target.value)}
                        className="px-4 py-2 bg-dark-input border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Specialties</option>
                        {TRAINER_SPECIALTIES.map((specialty) => (
                            <option key={specialty} value={specialty}>
                                {specialty}
                            </option>
                        ))}
                    </select>

                    {/* Rating Filter */}
                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(parseInt(e.target.value))}
                        className="px-4 py-2 bg-dark-input border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value={0}>All Ratings</option>
                        <option value={4}>4+ Stars</option>
                        <option value={3}>3+ Stars</option>
                        <option value={2}>2+ Stars</option>
                    </select>

                    {/* Sort By */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="px-4 py-2 bg-dark-input border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="clients">Sort by Clients</option>
                        <option value="rating">Sort by Rating</option>
                        <option value="experience">Sort by Experience</option>
                    </select>
                </div>
            </div>

            {/* Trainers Table */}
            <div className="bg-dark-card rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800/40 border-b border-gray-700/30">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                                    Trainer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                                    Specialty
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                                    Experience
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                                    Clients
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                                    Rating
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/30">
                            {filteredTrainers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Users size={48} className="mx-auto text-gray-400 mb-4" />
                                        <p className="text-white/80 text-lg">No trainers found</p>
                                        <p className="text-white/60 text-sm mt-1">
                                            {searchTerm || specialtyFilter !== "all" || ratingFilter > 0
                                                ? "Try adjusting your filters"
                                                : "No trainers have been created yet"}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTrainers.map((trainer) => (
                                    <tr key={trainer.id} className="hover:bg-gray-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-white">{trainer.user.name}</p>
                                                <p className="text-sm text-white/60">{trainer.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-600/20 text-blue-400 rounded-full">
                                                {trainer.specialty || "General"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white">
                                                {trainer.experience ? `${trainer.experience} years` : "N/A"}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-gray-400" />
                                                <p className="font-medium text-white">{trainer._count?.clients || 0}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {trainer.averageRating && trainer.averageRating > 0 ? (
                                                <div className="flex items-center gap-1">
                                                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                                    <p className="font-medium text-white">
                                                        {trainer.averageRating.toFixed(1)}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-white/60">No ratings</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(trainer)}
                                                    className="p-2 text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(trainer)}
                                                    className="p-2 text-orange-400 hover:bg-orange-600/20 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleAssignClient(trainer)}
                                                    className="p-2 text-green-400 hover:bg-green-600/20 rounded-lg transition-colors"
                                                    title="Assign Client"
                                                >
                                                    <UserPlus size={18} />
                                                </button>
                                                {deleteConfirm === trainer.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleDelete(trainer.id)}
                                                            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirm(trainer.id)}
                                                        className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Results Summary */}
            <div className="text-center text-sm text-gray-600">
                Showing {filteredTrainers.length} of {trainers.length} trainers
            </div>

            {/* Modals */}
            {showDetailModal && selectedTrainer && (
                <TrainerDetailModal
                    trainer={selectedTrainer}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedTrainer(null);
                    }}
                    onAssignClient={() => {
                        setShowDetailModal(false);
                        setShowAssignModal(true);
                    }}
                />
            )}

            {showAssignModal && selectedTrainer && (
                <AssignClientModal
                    trainerId={selectedTrainer.id}
                    trainerName={selectedTrainer.user.name}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedTrainer(null);
                    }}
                    onSuccess={() => {
                        handleRefresh();
                    }}
                />
            )}

            {showEditModal && selectedTrainer && (
                <EditTrainerModal
                    trainer={selectedTrainer}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedTrainer(null);
                    }}
                    onSuccess={() => {
                        handleRefresh();
                    }}
                />
            )}
        </div>
    );
}
