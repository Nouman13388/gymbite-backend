import { useState } from "react";
import { X, Edit, AlertCircle } from "lucide-react";
import { apiWithNotifications } from "../../services/apiWithNotifications";
import { ACTIVITY_LEVELS } from "../../schemas/client.schema";
import type { ClientWithRelations } from "../../schemas/client.schema";

interface EditClientModalProps {
    client: ClientWithRelations;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditClientModal({ client, onClose, onSuccess }: EditClientModalProps) {
    const [goals, setGoals] = useState<string>(client.goals || "");
    const [activityLevel, setActivityLevel] = useState<string>(client.activityLevel || "");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError(null);

            await apiWithNotifications.clients.update(client.id, {
                goals: goals || null,
                activityLevel: activityLevel || null,
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to update client:", err);
            setError(err instanceof Error ? err.message : "Failed to update client");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-card rounded-lg shadow-xl max-w-md w-full">
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
                            <Edit size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Edit Client</h2>
                            <p className="text-purple-100 text-sm">{client.user.name}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-600/20 border border-red-700/50 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Goals */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Fitness Goals
                        </label>
                        <textarea
                            value={goals}
                            onChange={(e) => setGoals(e.target.value)}
                            maxLength={1000}
                            rows={4}
                            placeholder="What are your fitness goals?"
                            className="w-full px-4 py-2 bg-dark-input border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                        <p className="text-xs text-white/40 mt-1">
                            {goals.length}/1000 characters
                        </p>
                    </div>

                    {/* Activity Level */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Activity Level
                        </label>
                        <select
                            value={activityLevel}
                            onChange={(e) => setActivityLevel(e.target.value)}
                            className="w-full px-4 py-2 bg-dark-input border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">Select activity level...</option>
                            {ACTIVITY_LEVELS.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-white/40 mt-1">
                            How active are you on a daily basis?
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {submitting ? "Updating..." : "Update Client"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-500 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
