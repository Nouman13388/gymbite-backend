import { X, User, Star, Calendar, TrendingUp, Clock, Mail, Award, Users } from "lucide-react";
import { format } from "date-fns";
import type { TrainerWithRelations, TrainerMetrics } from "../../schemas/trainer.schema";
import { useEffect, useState } from "react";
import { crudApi } from "../../services/api";

interface TrainerDetailModalProps {
    trainer: TrainerWithRelations;
    onClose: () => void;
    onAssignClient?: () => void;
}

export function TrainerDetailModal({ trainer, onClose, onAssignClient }: TrainerDetailModalProps) {
    const [metrics, setMetrics] = useState<TrainerMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const response = await crudApi.trainers.getMetrics(trainer.id);
                setMetrics(response as TrainerMetrics);
            } catch (error) {
                console.error("Failed to fetch trainer metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [trainer.id]);

    const activeClients = trainer._count?.clients || 0;
    const totalAppointments = trainer._count?.appointments || 0;
    const avgRating = trainer.averageRating || metrics?.averageRating || 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white bg-opacity-20 p-3 rounded-full">
                                <User size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{trainer.user.name}</h2>
                                <p className="text-blue-100 mt-1">{trainer.specialty || "General Fitness"}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Mail size={14} className="text-blue-200" />
                                    <span className="text-sm text-blue-100">{trainer.user.email}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {/* Profile Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Profile Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Experience</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {trainer.experience ? `${trainer.experience} years` : "Not specified"}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Join Date</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {format(new Date(trainer.createdAt), "MMM dd, yyyy")}
                                </p>
                            </div>
                        </div>
                        {trainer.bio && (
                            <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-sm text-gray-600 mb-2 font-semibold">Bio</p>
                                <p className="text-gray-800">{trainer.bio}</p>
                            </div>
                        )}
                    </div>

                    {/* Performance Metrics */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-green-600" />
                            Performance Metrics
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users size={16} className="text-blue-600" />
                                    <p className="text-sm text-gray-600">Active Clients</p>
                                </div>
                                <p className="text-2xl font-bold text-blue-700">{activeClients}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar size={16} className="text-purple-600" />
                                    <p className="text-sm text-gray-600">Appointments</p>
                                </div>
                                <p className="text-2xl font-bold text-purple-700">{totalAppointments}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={16} className="text-green-600" />
                                    <p className="text-sm text-gray-600">Completed</p>
                                </div>
                                <p className="text-2xl font-bold text-green-700">
                                    {loading ? "..." : metrics?.completedAppointments || 0}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star size={16} className="text-yellow-600" />
                                    <p className="text-sm text-gray-600">Avg Rating</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <p className="text-2xl font-bold text-yellow-700">
                                        {avgRating > 0 ? avgRating.toFixed(1) : "N/A"}
                                    </p>
                                    {avgRating > 0 && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Clients */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Users size={20} className="text-blue-600" />
                                Assigned Clients ({activeClients})
                            </h3>
                            {onAssignClient && (
                                <button
                                    onClick={onAssignClient}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                    Assign Client
                                </button>
                            )}
                        </div>
                        {trainer.clients && trainer.clients.length > 0 ? (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {trainer.clients.map((client) => (
                                    <div
                                        key={client.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{client.user.name}</p>
                                            <p className="text-sm text-gray-600">{client.user.email}</p>
                                            {client.goals && (
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{client.goals}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">
                                                Since {format(new Date(client.createdAt), "MMM yyyy")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <Users size={32} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-gray-600">No clients assigned yet</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Feedback */}
                    {metrics && metrics.recentFeedback && metrics.recentFeedback.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award size={20} className="text-yellow-600" />
                                Recent Feedback ({metrics.totalFeedback})
                            </h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {metrics.recentFeedback.map((feedback) => (
                                    <div key={feedback.id} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-900">{feedback.client.user.name}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className={
                                                                i < feedback.rating
                                                                    ? "text-yellow-500 fill-yellow-500"
                                                                    : "text-gray-300"
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {format(new Date(feedback.createdAt), "MMM dd, yyyy")}
                                            </p>
                                        </div>
                                        {feedback.comments && (
                                            <p className="text-sm text-gray-700">{feedback.comments}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Appointments */}
                    {trainer.appointments && trainer.appointments.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar size={20} className="text-purple-600" />
                                Recent Appointments
                            </h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {trainer.appointments.slice(0, 5).map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {appointment.client?.user.name || "Unknown Client"}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {format(new Date(appointment.appointmentTime), "MMM dd, yyyy 'at' hh:mm a")}
                                            </p>
                                        </div>
                                        <div>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === "COMPLETED"
                                                        ? "bg-green-100 text-green-800"
                                                        : appointment.status === "CANCELLED"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-blue-100 text-blue-800"
                                                    }`}
                                            >
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
