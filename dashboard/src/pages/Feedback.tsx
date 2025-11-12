import { useState, useEffect, useMemo } from "react";
import {
    Search,
    Filter,
    Trash2,
    Eye,
    RefreshCw,
    Star,
    TrendingUp,
    Calendar,
    MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { crudApi } from "../services/api";
import type {
    FeedbackWithRelations,
    FeedbackStats,
} from "../schemas/feedback.schema";
import StarRating from "../components/ui/StarRating";
import FeedbackDetailModal from "../components/modals/FeedbackDetailModal";

export default function Feedback() {
    const [feedbacks, setFeedbacks] = useState<FeedbackWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTrainerId, setSelectedTrainerId] = useState<number | "">("");
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">(
        "recent"
    );
    const [selectedFeedback, setSelectedFeedback] =
        useState<FeedbackWithRelations | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    // Fetch feedbacks
    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const response = await crudApi.feedback.getAll() as { data: FeedbackWithRelations[] };
            setFeedbacks(response.data);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // Get unique trainers for filter
    const trainers = useMemo(() => {
        const trainerMap = new Map();
        feedbacks.forEach((f) => {
            if (!trainerMap.has(f.trainerId)) {
                trainerMap.set(f.trainerId, f.trainer);
            }
        });
        return Array.from(trainerMap.values());
    }, [feedbacks]);

    // Calculate stats
    const stats: FeedbackStats = useMemo(() => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const recentCount = feedbacks.filter(
            (f) => new Date(f.createdAt) >= sevenDaysAgo
        ).length;

        const totalRating = feedbacks.reduce((sum, f) => sum + f.rating, 0);
        const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;

        // Find top rated trainer
        const trainerRatings = new Map<number, { name: string; ratings: number[] }>();
        feedbacks.forEach((f) => {
            if (!trainerRatings.has(f.trainerId)) {
                trainerRatings.set(f.trainerId, { name: f.trainer.name, ratings: [] });
            }
            trainerRatings.get(f.trainerId)!.ratings.push(f.rating);
        });

        let topRatedTrainer = null;
        let highestAvg = 0;
        trainerRatings.forEach((data) => {
            const avg = data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length;
            if (avg > highestAvg) {
                highestAvg = avg;
                topRatedTrainer = { name: data.name, rating: avg };
            }
        });

        return {
            total: feedbacks.length,
            averageRating,
            recentCount,
            topRatedTrainer,
        };
    }, [feedbacks]);

    // Filtered and sorted feedbacks
    const filteredFeedbacks = useMemo(() => {
        let filtered = feedbacks;

        // Search filter (trainer or client name)
        if (searchTerm) {
            filtered = filtered.filter(
                (f) =>
                    f.trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    f.user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Trainer filter
        if (selectedTrainerId) {
            filtered = filtered.filter((f) => f.trainerId === selectedTrainerId);
        }

        // Rating filter
        if (selectedRatings.length > 0) {
            filtered = filtered.filter((f) => selectedRatings.includes(f.rating));
        }

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === "recent") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else if (sortBy === "highest") {
                return b.rating - a.rating;
            } else {
                return a.rating - b.rating;
            }
        });

        return sorted;
    }, [feedbacks, searchTerm, selectedTrainerId, selectedRatings, sortBy]);

    // Handle delete
    const handleDelete = async (id: number) => {
        try {
            await crudApi.feedback.delete(id);
            setFeedbacks((prev) => prev.filter((f) => f.id !== id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    };

    // Toggle rating filter
    const toggleRating = (rating: number) => {
        setSelectedRatings((prev) =>
            prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
        );
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={fetchFeedbacks}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Feedback */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Feedback</p>
                            <p className="text-3xl font-bold mt-2">{stats.total}</p>
                        </div>
                        <MessageSquare size={40} className="text-blue-200 opacity-80" />
                    </div>
                </div>

                {/* Average Rating */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Average Rating</p>
                            <div className="flex items-center gap-2 mt-2">
                                <p className="text-3xl font-bold">
                                    {stats.averageRating.toFixed(1)}
                                </p>
                                <Star size={24} fill="currentColor" className="text-yellow-300" />
                            </div>
                        </div>
                        <TrendingUp size={40} className="text-green-200 opacity-80" />
                    </div>
                </div>

                {/* Recent Feedback */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Last 7 Days</p>
                            <p className="text-3xl font-bold mt-2">{stats.recentCount}</p>
                        </div>
                        <Calendar size={40} className="text-purple-200 opacity-80" />
                    </div>
                </div>

                {/* Top Rated Trainer */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
                    <div>
                        <p className="text-orange-100 text-sm font-medium">Top Rated Trainer</p>
                        {stats.topRatedTrainer ? (
                            <>
                                <p className="text-xl font-bold mt-2 truncate">
                                    {stats.topRatedTrainer.name}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    <StarRating
                                        rating={stats.topRatedTrainer.rating}
                                        size="sm"
                                        showNumber
                                    />
                                </div>
                            </>
                        ) : (
                            <p className="text-orange-200 text-sm mt-2">No data</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-dark-card p-6 rounded-lg shadow-md space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Filter size={20} className="text-gray-400" />
                    <h2 className="text-lg font-semibold text-white">Filters</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search trainer or client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-dark-input border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Trainer Filter */}
                    <select
                        value={selectedTrainerId}
                        onChange={(e) =>
                            setSelectedTrainerId(e.target.value ? Number(e.target.value) : "")
                        }
                        className="px-4 py-2 bg-dark-input border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Trainers</option>
                        {trainers.map((trainer) => (
                            <option key={trainer.id} value={trainer.id}>
                                {trainer.name}
                            </option>
                        ))}
                    </select>

                    {/* Sort By */}
                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value as "recent" | "highest" | "lowest")
                        }
                        className="px-4 py-2 bg-dark-input border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                    </select>

                    {/* Rating Filters */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => toggleRating(rating)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedRatings.includes(rating)
                                    ? "bg-yellow-500 text-white"
                                    : "bg-gray-700 text-white hover:bg-gray-600"
                                    }`}
                            >
                                {rating}⭐
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Filters Summary */}
                {(selectedTrainerId || selectedRatings.length > 0 || searchTerm) && (
                    <div className="flex items-center gap-2 text-sm text-white/60">
                        <span className="font-medium">Active filters:</span>
                        {searchTerm && <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded">Search: {searchTerm}</span>}
                        {selectedTrainerId && (
                            <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded">
                                Trainer: {trainers.find((t) => t.id === selectedTrainerId)?.name}
                            </span>
                        )}
                        {selectedRatings.length > 0 && (
                            <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
                                Ratings: {selectedRatings.join(", ")}⭐
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedTrainerId("");
                                setSelectedRatings([]);
                            }}
                            className="text-red-400 hover:text-red-300 font-medium ml-2"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Feedback Table */}
            <div className="bg-dark-card rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700/30">
                        <thead className="bg-gray-800/40">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Trainer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Rating
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Comment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-dark-card divide-y divide-gray-700/30">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <RefreshCw className="animate-spin mx-auto text-gray-400" size={32} />
                                        <p className="text-white/60 mt-2">Loading feedback...</p>
                                    </td>
                                </tr>
                            ) : filteredFeedbacks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-white/60">
                                        No feedback found
                                    </td>
                                </tr>
                            ) : (
                                filteredFeedbacks.map((feedback) => (
                                    <tr key={feedback.id} className="hover:bg-gray-700/20 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="font-medium text-white">{feedback.user.name}</p>
                                                <p className="text-sm text-white/60">{feedback.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="font-medium text-white">{feedback.trainer.name}</p>
                                                {feedback.trainer.specialization && (
                                                    <p className="text-sm text-white/60">
                                                        {feedback.trainer.specialization}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StarRating rating={feedback.rating} size="sm" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white truncate max-w-xs">
                                                {feedback.comments || (
                                                    <span className="text-gray-400 italic">No comment</span>
                                                )}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                                            {format(new Date(feedback.createdAt), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedFeedback(feedback)}
                                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {deleteConfirm === feedback.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleDelete(feedback.id)}
                                                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirm(feedback.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
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
            <div className="text-sm text-gray-600 text-center">
                Showing {filteredFeedbacks.length} of {stats.total} feedback
                {filteredFeedbacks.length !== stats.total && " (filtered)"}
            </div>

            {/* Feedback Detail Modal */}
            {selectedFeedback && (
                <FeedbackDetailModal
                    feedback={selectedFeedback}
                    onClose={() => setSelectedFeedback(null)}
                />
            )}
        </div>
    );
}
