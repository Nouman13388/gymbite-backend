import React from 'react';
import { X, TrendingUp, Calendar, Weight, Activity, Ruler, FileText, User } from 'lucide-react';

interface ProgressDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    progress: {
        id: number;
        progressDate: string;
        weight: number;
        BMI: number;
        workoutPerformance?: string;
        mealPlanCompliance?: string;
        client?: {
            user: {
                name: string;
                email: string;
            };
        };
    } | null;
}

export const ProgressDetailModal: React.FC<ProgressDetailModalProps> = ({
    isOpen,
    onClose,
    progress,
}) => {
    if (!isOpen || !progress) return null;

    const hasWorkoutPerformance = progress.workoutPerformance && progress.workoutPerformance.trim() !== '';
    const hasMealCompliance = progress.mealPlanCompliance && progress.mealPlanCompliance.trim() !== '';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-card rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-blue rounded-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Progress Details</h2>
                            <p className="text-sm text-gray-400 mt-1">
                                {new Date(progress.progressDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Client Info */}
                    {progress.client && (
                        <div className="bg-dark-bg rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {progress.client.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <p className="text-white font-medium">{progress.client.user.name}</p>
                                    </div>
                                    <p className="text-xs text-gray-400">{progress.client.user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Metrics */}
                    <div className="bg-dark-bg rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Body Metrics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Weight className="w-5 h-5 text-blue-400" />
                                    <p className="text-sm text-gray-400">Weight</p>
                                </div>
                                <p className="text-3xl font-bold text-white">{progress.weight}</p>
                                <p className="text-xs text-gray-500 mt-1">kilograms</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    <p className="text-sm text-gray-400">BMI</p>
                                </div>
                                <p className="text-3xl font-bold text-white">{progress.BMI}</p>
                                <p className="text-xs text-gray-500 mt-1">body mass index</p>
                            </div>
                        </div>
                    </div>

                    {/* Workout Performance */}
                    {hasWorkoutPerformance && (
                        <div className="bg-dark-bg rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <Ruler className="w-5 h-5" />
                                Workout Performance
                            </h3>
                            <div className="bg-dark-card rounded-lg p-4">
                                <p className="text-gray-300 whitespace-pre-line">{progress.workoutPerformance}</p>
                            </div>
                        </div>
                    )}

                    {/* Meal Plan Compliance */}
                    {hasMealCompliance && (
                        <div className="bg-dark-bg rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Meal Plan Compliance
                            </h3>
                            <div className="bg-dark-card rounded-lg p-4">
                                <p className="text-gray-300 whitespace-pre-line leading-relaxed">{progress.mealPlanCompliance}</p>
                            </div>
                        </div>
                    )}

                    {/* Record Date */}
                    <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-blue-200">
                            <Calendar className="w-4 h-4" />
                            <p className="text-sm">
                                <strong>Record Date:</strong> {new Date(progress.progressDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-primary-blue hover:bg-blue-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
