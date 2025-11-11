import { useState, useEffect } from "react";
import { X, UserPlus, AlertCircle } from "lucide-react";
import { crudApi } from "../../services/api";
import type { AssignClientFormData } from "../../schemas/trainer.schema";

interface Client {
    id: number;
    userId: number;
    trainerId: number | null;
    user: {
        name: string;
        email: string;
    };
    goals?: string;
}

interface AssignClientModalProps {
    trainerId: number;
    trainerName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function AssignClientModal({ trainerId, trainerName, onClose, onSuccess }: AssignClientModalProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<AssignClientFormData>({
        clientId: 0,
        trainerId,
        startDate: new Date().toISOString().split("T")[0],
        notes: "",
    });

    useEffect(() => {
        const fetchUnassignedClients = async () => {
            try {
                setLoading(true);
                const response = await crudApi.clients.getAll();
                // Filter unassigned clients (trainerId is null)
                const allClients = Array.isArray(response) ? response : [];
                const unassigned = allClients.filter((client: Client) => !client.trainerId);
                setClients(unassigned);
            } catch (err) {
                console.error("Failed to fetch clients:", err);
                setError("Failed to load clients");
            } finally {
                setLoading(false);
            }
        };

        fetchUnassignedClients();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.clientId) {
            setError("Please select a client");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            // Update client with new trainerId
            await crudApi.clients.update(formData.clientId, {
                trainerId: formData.trainerId,
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to assign client:", err);
            setError(err instanceof Error ? err.message : "Failed to assign client");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <UserPlus size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Assign Client</h2>
                            <p className="text-sm text-gray-600 mt-1">Assign a client to {trainerName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle size={18} className="text-red-600" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-2">Loading clients...</p>
                        </div>
                    ) : clients.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <UserPlus size={32} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600">No unassigned clients available</p>
                            <p className="text-sm text-gray-500 mt-1">All clients are already assigned to trainers</p>
                        </div>
                    ) : (
                        <>
                            {/* Client Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Select Client *
                                </label>
                                <select
                                    value={formData.clientId}
                                    onChange={(e) =>
                                        setFormData({ ...formData, clientId: parseInt(e.target.value) })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value={0}>Choose a client...</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.user.name} ({client.user.email})
                                            {client.goals && ` - ${client.goals.substring(0, 50)}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Start Date */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Start Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Notes */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Add any initial notes about this assignment..."
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.notes?.length || 0}/500 characters
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting || !formData.clientId}
                                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {submitting ? "Assigning..." : "Assign Client"}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
