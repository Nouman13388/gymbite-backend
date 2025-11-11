import { useState, useEffect } from "react";
import { X, UserCog, Calendar, AlertCircle } from "lucide-react";
import { crudApi } from "../../services/api";
import { apiWithNotifications } from "../../services/apiWithNotifications";

interface Trainer {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    specialty: string | null;
    experience: number | null;
    _count?: {
        clients: number;
    };
}

interface AssignTrainerModalProps {
    clientId: number;
    clientName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function AssignTrainerModal({
    clientId,
    clientName,
    onClose,
    onSuccess,
}: AssignTrainerModalProps) {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [notes, setNotes] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                setError("Failed to load trainers. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrainers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedTrainerId) {
            setError("Please select a trainer");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            await apiWithNotifications.clients.update(clientId, {
                trainerId: selectedTrainerId,
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to assign trainer:", err);
            setError(
                err instanceof Error ? err.message : "Failed to assign trainer"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-lg relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <UserCog size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Assign Trainer</h2>
                            <p className="text-purple-100 text-sm">{clientName}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                            <p className="text-gray-600 text-sm mt-2">Loading trainers...</p>
                        </div>
                    ) : trainers.length === 0 ? (
                        <div className="text-center py-8">
                            <UserCog size={48} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600">No trainers available</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Create a trainer first to assign to this client
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Trainer Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Trainer <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedTrainerId || ""}
                                    onChange={(e) => setSelectedTrainerId(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Choose a trainer...</option>
                                    {trainers.map((trainer) => (
                                        <option key={trainer.id} value={trainer.id}>
                                            {trainer.user.name}
                                            {trainer.specialty && ` - ${trainer.specialty}`}
                                            {trainer._count && ` (${trainer._count.clients} clients)`}
                                        </option>
                                    ))}
                                </select>
                                {selectedTrainerId && (
                                    <p className="text-xs text-gray-600 mt-1">
                                        {trainers.find((t) => t.id === selectedTrainerId)?.user.email}
                                    </p>
                                )}
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <Calendar
                                        size={18}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    maxLength={500}
                                    rows={3}
                                    placeholder="Add any notes about this assignment..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {notes.length}/500 characters
                                </p>
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    {!loading && trainers.length > 0 && (
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={submitting || !selectedTrainerId}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {submitting ? "Assigning..." : "Assign Trainer"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={submitting}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
