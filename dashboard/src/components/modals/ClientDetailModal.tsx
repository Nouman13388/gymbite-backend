import { useState, useEffect } from "react";
import { X, User, TrendingUp, Calendar, Target, Activity, Weight, Ruler } from "lucide-react";
import { crudApi } from "../../services/api";
import type { ClientWithRelations, ClientMetrics, ProgressRecordBasic, MealPlanBasic, WorkoutPlanBasic } from "../../schemas/client.schema";
import { getBMICategory } from "../../schemas/client.schema";

interface ClientDetailModalProps {
    client: ClientWithRelations;
    onClose: () => void;
    onAssignTrainer?: () => void;
}

export function ClientDetailModal({ client, onClose, onAssignTrainer }: ClientDetailModalProps) {
    const [metrics, setMetrics] = useState<ClientMetrics | null>(null);
    const [progressRecords, setProgressRecords] = useState<ProgressRecordBasic[]>([]);
    const [mealPlans, setMealPlans] = useState<MealPlanBasic[]>([]);
    const [workoutPlans, setWorkoutPlanPlans] = useState<WorkoutPlanBasic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                setLoading(true);

                // Fetch complete client data with relations
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const completeData = await crudApi.clients.getComplete(client.id) as any;

                // Extract progress records (limit to 5 most recent)
                if (completeData.progressRecords) {
                    setProgressRecords(completeData.progressRecords.slice(0, 5));
                }

                // Extract meal plans (limit to active or 3 most recent)
                if (completeData.mealPlans) {
                    const activePlans = completeData.mealPlans.filter((p: MealPlanBasic) => p.isActive);
                    const recentPlans = completeData.mealPlans.slice(0, 3);
                    setMealPlans(activePlans.length > 0 ? activePlans : recentPlans);
                }

                // Extract workout plans (limit to active or 3 most recent)
                if (completeData.workoutPlans) {
                    const activePlans = completeData.workoutPlans.filter((p: WorkoutPlanBasic) => p.isActive);
                    const recentPlans = completeData.workoutPlans.slice(0, 3);
                    setWorkoutPlanPlans(activePlans.length > 0 ? activePlans : recentPlans);
                }

                // Calculate metrics
                const totalProgressRecords = completeData.progressRecords?.length || 0;
                const totalMealPlans = completeData.mealPlans?.length || 0;
                const totalWorkoutPlans = completeData.workoutPlans?.length || 0;

                const currentProgress = completeData.progressRecords?.[0];
                const firstProgress = completeData.progressRecords?.[completeData.progressRecords.length - 1];

                const currentWeight = currentProgress?.weight || null;
                const currentBMI = currentProgress?.bmi || null;
                const weightChange = currentWeight && firstProgress?.weight
                    ? currentWeight - firstProgress.weight
                    : null;

                setMetrics({
                    totalProgressRecords,
                    totalMealPlans,
                    totalWorkoutPlans,
                    currentWeight,
                    currentBMI,
                    weightChange,
                    progressTrend: weightChange ? (weightChange < 0 ? "improving" : weightChange > 0 ? "declining" : "stable") : null,
                });
            } catch (error) {
                console.error("Failed to fetch client data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, [client.id]);

    const bmiCategory = getBMICategory(metrics?.currentBMI || null);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-lg relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{client.user.name}</h2>
                            <p className="text-purple-100">{client.user.email}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading client data...</p>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        {/* Profile Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <User size={18} className="text-purple-600" />
                                    <span className="font-semibold text-gray-700">Trainer</span>
                                </div>
                                {client.trainer ? (
                                    <div>
                                        <p className="text-gray-900 font-medium">{client.trainer.user.name}</p>
                                        <p className="text-sm text-gray-600">{client.trainer.user.email}</p>
                                        {client.trainer.specialty && (
                                            <p className="text-xs text-purple-600 mt-1">{client.trainer.specialty}</p>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-500">No trainer assigned</p>
                                        {onAssignTrainer && (
                                            <button
                                                onClick={onAssignTrainer}
                                                className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                                            >
                                                Assign Trainer
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar size={18} className="text-blue-600" />
                                    <span className="font-semibold text-gray-700">Joined</span>
                                </div>
                                <p className="text-gray-900">
                                    {new Date(client.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Goals & Activity */}
                        {(client.goals || client.activityLevel) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {client.goals && (
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target size={18} className="text-green-600" />
                                            <span className="font-semibold text-gray-700">Goals</span>
                                        </div>
                                        <p className="text-gray-900 text-sm">{client.goals}</p>
                                    </div>
                                )}

                                {client.activityLevel && (
                                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Activity size={18} className="text-orange-600" />
                                            <span className="font-semibold text-gray-700">Activity Level</span>
                                        </div>
                                        <p className="text-gray-900">{client.activityLevel}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Metrics Cards */}
                        {metrics && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp size={16} className="text-blue-600" />
                                        <span className="text-xs text-gray-600">Progress</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-700">{metrics.totalProgressRecords}</p>
                                    <p className="text-xs text-gray-600">records</p>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Target size={16} className="text-green-600" />
                                        <span className="text-xs text-gray-600">Meal Plans</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-700">{metrics.totalMealPlans}</p>
                                    <p className="text-xs text-gray-600">plans</p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Activity size={16} className="text-purple-600" />
                                        <span className="text-xs text-gray-600">Workouts</span>
                                    </div>
                                    <p className="text-2xl font-bold text-purple-700">{metrics.totalWorkoutPlans}</p>
                                    <p className="text-xs text-gray-600">plans</p>
                                </div>

                                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Weight size={16} className="text-yellow-600" />
                                        <span className="text-xs text-gray-600">Weight Change</span>
                                    </div>
                                    <p className="text-2xl font-bold text-yellow-700">
                                        {metrics.weightChange !== null
                                            ? `${metrics.weightChange > 0 ? '+' : ''}${metrics.weightChange.toFixed(1)}`
                                            : 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-600">kg</p>
                                </div>
                            </div>
                        )}

                        {/* Current Stats */}
                        {metrics && (metrics.currentWeight || metrics.currentBMI) && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-3">Current Stats</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {metrics.currentWeight && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Weight size={16} className="text-gray-600" />
                                                <span className="text-sm text-gray-600">Weight</span>
                                            </div>
                                            <p className="text-xl font-bold text-gray-900">{metrics.currentWeight} kg</p>
                                        </div>
                                    )}

                                    {metrics.currentBMI && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Ruler size={16} className="text-gray-600" />
                                                <span className="text-sm text-gray-600">BMI</span>
                                            </div>
                                            <p className="text-xl font-bold text-gray-900">{metrics.currentBMI.toFixed(1)}</p>
                                            {bmiCategory && (
                                                <p className={`text-xs ${bmiCategory.color} font-medium`}>
                                                    {bmiCategory.label}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {metrics.progressTrend && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <TrendingUp size={16} className="text-gray-600" />
                                                <span className="text-sm text-gray-600">Trend</span>
                                            </div>
                                            <p className={`text-sm font-medium ${metrics.progressTrend === 'improving' ? 'text-green-600' :
                                                    metrics.progressTrend === 'declining' ? 'text-red-600' :
                                                        'text-gray-600'
                                                }`}>
                                                {metrics.progressTrend.charAt(0).toUpperCase() + metrics.progressTrend.slice(1)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Recent Progress */}
                        {progressRecords.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Recent Progress</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {progressRecords.map((record) => (
                                        <div key={record.id} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                                {record.weight && (
                                                    <div>
                                                        <span className="text-gray-600">Weight:</span>
                                                        <span className="ml-1 font-medium text-gray-900">{record.weight} kg</span>
                                                    </div>
                                                )}
                                                {record.height && (
                                                    <div>
                                                        <span className="text-gray-600">Height:</span>
                                                        <span className="ml-1 font-medium text-gray-900">{record.height} cm</span>
                                                    </div>
                                                )}
                                                {record.bmi && (
                                                    <div>
                                                        <span className="text-gray-600">BMI:</span>
                                                        <span className="ml-1 font-medium text-gray-900">{record.bmi.toFixed(1)}</span>
                                                    </div>
                                                )}
                                                {record.bodyFat && (
                                                    <div>
                                                        <span className="text-gray-600">Body Fat:</span>
                                                        <span className="ml-1 font-medium text-gray-900">{record.bodyFat}%</span>
                                                    </div>
                                                )}
                                            </div>
                                            {record.notes && (
                                                <p className="text-xs text-gray-600 mt-2">{record.notes}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Active Plans */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Meal Plans */}
                            {mealPlans.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Meal Plans</h3>
                                    <div className="space-y-2">
                                        {mealPlans.map((plan) => (
                                            <div key={plan.id} className="bg-green-50 p-3 rounded-lg border border-green-200">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-gray-900 text-sm">{plan.name}</span>
                                                    {plan.isActive && (
                                                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                {plan.targetCalories && (
                                                    <p className="text-xs text-gray-600">Target: {plan.targetCalories} cal/day</p>
                                                )}
                                                {plan.startDate && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(plan.startDate).toLocaleDateString()} - {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'Ongoing'}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Workout Plans */}
                            {workoutPlans.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Workout Plans</h3>
                                    <div className="space-y-2">
                                        {workoutPlans.map((plan) => (
                                            <div key={plan.id} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-gray-900 text-sm">{plan.name}</span>
                                                    {plan.isActive && (
                                                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                {plan.description && (
                                                    <p className="text-xs text-gray-600">{plan.description}</p>
                                                )}
                                                {plan.startDate && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(plan.startDate).toLocaleDateString()} - {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'Ongoing'}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
