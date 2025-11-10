import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificationSchema, type NotificationFormData } from "../../schemas/notification.schema";
import { useEffect, useState } from "react";
import { crudApi } from "../../services/api";

interface NotificationFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export default function NotificationForm({ onSuccess, onCancel }: NotificationFormProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<NotificationFormData>({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            targetType: "BROADCAST",
            notificationType: "INFO",
        },
    });

    const targetType = watch("targetType");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await crudApi.users.getAll();
                setUsers(data as User[]);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    const onSubmit = async (data: NotificationFormData) => {
        setLoading(true);
        try {
            // Different API endpoints based on target type
            if (data.targetType === "BROADCAST") {
                await crudApi.notifications.broadcast({
                    title: data.title,
                    message: data.message,
                    notificationType: data.notificationType,
                });
            } else if (data.targetType === "SINGLE" && data.userId) {
                await crudApi.notifications.sendToUser(data.userId, {
                    title: data.title,
                    message: data.message,
                    notificationType: data.notificationType,
                });
            } else if (data.targetType === "ROLE" && data.role) {
                await crudApi.notifications.sendToRole(data.role, {
                    title: data.title,
                    message: data.message,
                    notificationType: data.notificationType,
                });
            }

            onSuccess();
        } catch (error) {
            console.error("Failed to send notification:", error);
            alert("Failed to send notification. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Target Type Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience *
                </label>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => setValue("targetType", "SINGLE")}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${targetType === "SINGLE"
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                            }`}
                    >
                        👤 Single User
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue("targetType", "ROLE")}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${targetType === "ROLE"
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                            }`}
                    >
                        👥 By Role
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue("targetType", "BROADCAST")}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${targetType === "BROADCAST"
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                            }`}
                    >
                        📢 Broadcast All
                    </button>
                </div>
                {errors.targetType && (
                    <p className="text-red-500 text-sm mt-1">{errors.targetType.message}</p>
                )}
            </div>

            {/* Conditional Selectors */}
            {targetType === "SINGLE" && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select User *
                    </label>
                    {loadingUsers ? (
                        <div className="text-gray-500 text-sm">Loading users...</div>
                    ) : (
                        <select
                            {...register("userId", { valueAsNumber: true })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">-- Select a user --</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.firstName} {user.lastName} ({user.email}) - {user.role}
                                </option>
                            ))}
                        </select>
                    )}
                    {errors.userId && (
                        <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>
                    )}
                </div>
            )}

            {targetType === "ROLE" && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Role *
                    </label>
                    <select
                        {...register("role")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">-- Select a role --</option>
                        <option value="CLIENT">Clients</option>
                        <option value="TRAINER">Trainers</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                    {errors.role && (
                        <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                    )}
                </div>
            )}

            {/* Notification Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Type *
                </label>
                <select
                    {...register("notificationType")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="INFO">ℹ️ Info</option>
                    <option value="WORKOUT">💪 Workout</option>
                    <option value="MEAL">🍽️ Meal</option>
                    <option value="APPOINTMENT">📅 Appointment</option>
                    <option value="PROGRESS">📊 Progress</option>
                    <option value="MESSAGE">💬 Message</option>
                    <option value="ANNOUNCEMENT">📢 Announcement</option>
                    <option value="WARNING">⚠️ Warning</option>
                    <option value="REMINDER">🔔 Reminder</option>
                </select>
                {errors.notificationType && (
                    <p className="text-red-500 text-sm mt-1">{errors.notificationType.message}</p>
                )}
            </div>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title * <span className="text-gray-500 text-xs">(max 60 characters)</span>
                </label>
                <input
                    type="text"
                    {...register("title")}
                    placeholder="Enter notification title"
                    maxLength={60}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
            </div>

            {/* Message */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message * <span className="text-gray-500 text-xs">(max 240 characters)</span>
                </label>
                <textarea
                    {...register("message")}
                    placeholder="Enter notification message"
                    maxLength={240}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Sending...
                        </>
                    ) : (
                        <>
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                            Send Notification
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
