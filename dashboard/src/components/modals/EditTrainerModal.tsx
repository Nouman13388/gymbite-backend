import { useState } from "react";
import { X, Edit, AlertCircle } from "lucide-react";
import { apiWithNotifications } from "../../services/apiWithNotifications";
import { TRAINER_SPECIALTIES } from "../../schemas/trainer.schema";
import type { TrainerWithRelations } from "../../schemas/trainer.schema";

interface EditTrainerModalProps {
    trainer: TrainerWithRelations;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditTrainerModal({ trainer, onClose, onSuccess }: EditTrainerModalProps) {
    const [specialty, setSpecialty] = useState<string>(trainer.specialty || "");
    const [experience, setExperience] = useState<number>(trainer.experience || 0);
    const [bio, setBio] = useState<string>(trainer.bio || "");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError(null);

            await apiWithNotifications.trainers.update(trainer.id, {
                specialty: specialty || null,
                experience: experience > 0 ? experience : null,
                bio: bio || null,
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to update trainer:", err);
            setError(err instanceof Error ? err.message : "Failed to update trainer");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-card rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg relative">
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
                            <h2 className="text-xl font-bold">Edit Trainer</h2>
                            <p className="text-blue-100 text-sm">{trainer.user.name}</p>
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

                    {/* Specialty */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Specialty
                        </label>
                        <select
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full px-4 py-2 bg-dark-input border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select specialty...</option>
                            {TRAINER_SPECIALTIES.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Experience */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Experience (years)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="50"
                            value={experience}
                            onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2 bg-dark-input border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Years of experience"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Bio (Optional)
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={1000}
                            rows={4}
                            placeholder="Brief bio or description..."
                            className="w-full px-4 py-2 bg-dark-input border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <p className="text-xs text-white/40 mt-1">
                            {bio.length}/1000 characters
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {submitting ? "Updating..." : "Update Trainer"}
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
