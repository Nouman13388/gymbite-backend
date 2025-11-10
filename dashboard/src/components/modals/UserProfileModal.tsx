import React, { useState, useEffect } from 'react';
import { X, User, Mail, Calendar, Award, Users, TrendingUp, Star, Target, Activity } from 'lucide-react';
import { crudApi } from '../../services/api';
import { Loading, ErrorMessage } from '../../views/components/ui';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
    userName: string;
    userRole: 'CLIENT' | 'TRAINER' | 'ADMIN';
}

interface TrainerProfile {
    id: number;
    userId: number;
    specialty: string;
    experienceYears: number;
    bio?: string;
    certifications?: string[];
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: string;
    };
    clients?: Array<{
        id: number;
        userId: number;
        user: {
            id: number;
            name: string;
            email: string;
        };
    }>;
    appointments?: Array<{
        id: number;
        appointmentTime: string;
        type: string;
        status: string;
        client: {
            user: {
                name: string;
            };
        };
    }>;
    feedbacks?: Array<{
        id: number;
        rating: number;
        comment?: string;
    }>;
}

interface ClientProfile {
    id: number;
    userId: number;
    trainerId?: number;
    age?: number;
    weight?: number;
    height?: number;
    goals?: string;
    activityLevel?: string;
    dietaryPreferences?: string;
    medicalConditions?: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: string;
    };
    trainer?: {
        id: number;
        userId: number;
        specialty: string;
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    progress?: Array<{
        id: number;
        date: string;
        weight?: number;
        bodyFat?: number;
        muscleMass?: number;
        measurements?: string;
    }>;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
    isOpen,
    onClose,
    userId,
    userName,
    userRole,
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trainerProfile, setTrainerProfile] = useState<TrainerProfile | null>(null);
    const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);

    const fetchProfileData = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (userRole === 'TRAINER') {
                // Fetch trainer complete profile
                const response = await crudApi.trainers.getComplete(userId);
                setTrainerProfile(response as TrainerProfile);
            } else if (userRole === 'CLIENT') {
                // Fetch client complete profile
                const response = await crudApi.clients.getComplete(userId);
                setClientProfile(response as ClientProfile);
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            setError(err instanceof Error ? err.message : 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    }, [userId, userRole]);

    useEffect(() => {
        if (isOpen && userRole !== 'ADMIN') {
            fetchProfileData();
        } else {
            setLoading(false);
        }
    }, [isOpen, userRole, fetchProfileData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-blue rounded-lg">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{userName}</h2>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${userRole === 'ADMIN' ? 'bg-red-700' :
                                    userRole === 'TRAINER' ? 'bg-blue-700' :
                                        'bg-green-700'
                                } text-white`}>
                                {userRole}
                            </span>
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
                <div className="p-6">
                    {loading ? (
                        <Loading text="Loading profile..." />
                    ) : error ? (
                        <ErrorMessage message={error} onRetry={fetchProfileData} />
                    ) : userRole === 'ADMIN' ? (
                        <AdminProfileView userName={userName} userId={userId} />
                    ) : userRole === 'TRAINER' && trainerProfile ? (
                        <TrainerProfileView profile={trainerProfile} />
                    ) : userRole === 'CLIENT' && clientProfile ? (
                        <ClientProfileView profile={clientProfile} />
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <p>No profile data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Admin Profile View (Basic Info Only)
const AdminProfileView: React.FC<{ userName: string; userId: number }> = ({ userName, userId }) => {
    return (
        <div className="space-y-6">
            <div className="bg-dark-bg rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Administrator Profile
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>User ID: {userId}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>Name: {userName}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-4">
                        Administrators have full system access and can manage all users, trainers, clients, and system settings.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Trainer Profile View
const TrainerProfileView: React.FC<{ profile: TrainerProfile }> = ({ profile }) => {
    const avgRating = calculateAverageRating(profile.feedbacks);

    return (
        <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-bg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Basic Information
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-300">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{profile.user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">Specialty: {profile.specialty}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">Experience: {profile.experienceYears} years</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">Rating: {avgRating} ({profile.feedbacks?.length || 0} reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-dark-bg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Statistics
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-400">Total Clients</span>
                                <span className="text-xl font-bold text-white">{profile.clients?.length || 0}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min((profile.clients?.length || 0) * 10, 100)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-400">Total Appointments</span>
                                <span className="text-xl font-bold text-white">{profile.appointments?.length || 0}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((profile.appointments?.length || 0) * 5, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio */}
            {profile.bio && (
                <div className="bg-dark-bg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{profile.bio}</p>
                </div>
            )}

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
                <div className="bg-dark-bg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.certifications.map((cert, index) => (
                            <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                                {cert}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Clients */}
            {profile.clients && profile.clients.length > 0 && (
                <div className="bg-dark-bg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Active Clients ({profile.clients.length})
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {profile.clients.map((client) => (
                            <div key={client.id} className="flex items-center gap-3 p-3 bg-dark-card rounded-lg hover:bg-gray-700 transition-colors">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-semibold">
                                    {client.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{client.user.name}</p>
                                    <p className="text-xs text-gray-400">{client.user.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Appointments */}
            {profile.appointments && profile.appointments.length > 0 && (
                <div className="bg-dark-bg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Recent Appointments ({profile.appointments.length})
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {profile.appointments.slice(0, 5).map((appointment) => (
                            <div key={appointment.id} className="flex items-center justify-between p-3 bg-dark-card rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${appointment.status === 'SCHEDULED' ? 'bg-blue-600' :
                                            appointment.status === 'COMPLETED' ? 'bg-green-600' :
                                                appointment.status === 'CANCELLED' ? 'bg-red-600' :
                                                    'bg-gray-600'
                                        } text-white`}>
                                        {appointment.type}
                                    </div>
                                    <span className="text-sm text-gray-300">{appointment.client.user.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(appointment.appointmentTime).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Client Profile View
const ClientProfileView: React.FC<{ profile: ClientProfile }> = ({ profile }) => {
    return (
        <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-bg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Personal Information
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-300">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{profile.user.email}</span>
                        </div>
                        {profile.age && (
                            <div className="flex items-center gap-3 text-gray-300">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">Age: {profile.age} years</span>
                            </div>
                        )}
                        {profile.weight && profile.height && (
                            <div className="flex items-center gap-3 text-gray-300">
                                <Activity className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">Weight: {profile.weight} kg | Height: {profile.height} cm</span>
                            </div>
                        )}
                        {profile.activityLevel && (
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-4 h-4 text-gray-400" />
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActivityLevelBadge(profile.activityLevel)} text-white`}>
                                    {profile.activityLevel.replace('_', ' ')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trainer Info */}
                <div className="bg-dark-bg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Assigned Trainer
                    </h3>
                    {profile.trainer ? (
                        <div className="flex items-center gap-3 p-3 bg-dark-card rounded-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {profile.trainer.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-white font-medium">{profile.trainer.user.name}</p>
                                <p className="text-xs text-gray-400">{profile.trainer.specialty}</p>
                                <p className="text-xs text-gray-500">{profile.trainer.user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No trainer assigned yet</p>
                    )}
                </div>
            </div>

            {/* Goals */}
            {profile.goals && (
                <div className="bg-dark-bg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Fitness Goals
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{profile.goals}</p>
                </div>
            )}

            {/* Health Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dietary Preferences */}
                {profile.dietaryPreferences && (
                    <div className="bg-dark-bg rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Dietary Preferences</h3>
                        <p className="text-gray-300 text-sm">{profile.dietaryPreferences}</p>
                    </div>
                )}

                {/* Medical Conditions */}
                {profile.medicalConditions && (
                    <div className="bg-dark-bg rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Medical Conditions</h3>
                        <p className="text-gray-300 text-sm">{profile.medicalConditions}</p>
                    </div>
                )}
            </div>

            {/* Progress Records */}
            {profile.progress && profile.progress.length > 0 && (
                <div className="bg-dark-bg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Progress Records ({profile.progress.length})
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {profile.progress.slice(0, 5).map((record) => (
                            <div key={record.id} className="flex items-center justify-between p-3 bg-dark-card rounded-lg">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-400">
                                        {new Date(record.date).toLocaleDateString()}
                                    </span>
                                    {record.weight && (
                                        <span className="text-sm text-gray-300">Weight: {record.weight} kg</span>
                                    )}
                                    {record.bodyFat && (
                                        <span className="text-sm text-gray-300">Body Fat: {record.bodyFat}%</span>
                                    )}
                                    {record.muscleMass && (
                                        <span className="text-sm text-gray-300">Muscle: {record.muscleMass} kg</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper function for activity level badge
const getActivityLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
        SEDENTARY: 'bg-gray-600',
        LIGHT: 'bg-blue-600',
        MODERATE: 'bg-green-600',
        ACTIVE: 'bg-yellow-600',
        VERY_ACTIVE: 'bg-orange-600',
    };
    return colors[level] || 'bg-gray-600';
};

// Helper function for average rating
const calculateAverageRating = (feedbacks?: Array<{ rating: number }>) => {
    if (!feedbacks || feedbacks.length === 0) return '0.0';
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
};
