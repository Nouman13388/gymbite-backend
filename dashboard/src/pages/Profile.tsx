import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../utils/firebase";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import {
    User,
    Mail,
    Shield,
    Calendar,
    Key,
    LogOut,
    Save,
    Edit,
    X,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
    const { user, logout } = useAuth();
    const [isEditingName, setIsEditingName] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const firebaseUser = auth.currentUser;

    // Handle display name update
    const handleUpdateName = async () => {
        if (!firebaseUser || !displayName.trim()) return;

        setLoading(true);
        setMessage(null);

        try {
            await updateProfile(firebaseUser, {
                displayName: displayName.trim(),
            });

            setMessage({
                type: "success",
                text: "Display name updated successfully!",
            });
            setIsEditingName(false);

            // Refresh the page to update the sidebar
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error("Error updating display name:", error);
            setMessage({
                type: "error",
                text: "Failed to update display name. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle password change
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firebaseUser || !firebaseUser.email) return;

        setLoading(true);
        setMessage(null);

        // Validation
        if (passwordForm.newPassword.length < 6) {
            setMessage({
                type: "error",
                text: "New password must be at least 6 characters long.",
            });
            setLoading(false);
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({
                type: "error",
                text: "New passwords do not match.",
            });
            setLoading(false);
            return;
        }

        try {
            // Re-authenticate user before password change
            const credential = EmailAuthProvider.credential(
                firebaseUser.email,
                passwordForm.currentPassword
            );
            await reauthenticateWithCredential(firebaseUser, credential);

            // Update password
            await updatePassword(firebaseUser, passwordForm.newPassword);

            setMessage({
                type: "success",
                text: "Password changed successfully!",
            });
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setIsChangingPassword(false);
        } catch (error: unknown) {
            console.error("Error changing password:", error);
            const errorMessage =
                error instanceof Error && error.message.includes("auth/wrong-password")
                    ? "Current password is incorrect."
                    : "Failed to change password. Please try again.";
            setMessage({
                type: "error",
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        if (confirm("Are you sure you want to logout?")) {
            await logout();
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your admin account settings
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

            {/* Message Banner */}
            {message && (
                <div
                    className={`p-4 rounded-lg flex items-center gap-3 ${message.type === "success"
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                >
                    {message.type === "success" ? (
                        <CheckCircle className="text-green-600" size={20} />
                    ) : (
                        <AlertCircle className="text-red-600" size={20} />
                    )}
                    <p
                        className={`text-sm font-medium ${message.type === "success" ? "text-green-800" : "text-red-800"
                            }`}
                    >
                        {message.text}
                    </p>
                    <button
                        onClick={() => setMessage(null)}
                        className="ml-auto text-gray-500 hover:text-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                    <User className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">
                        Profile Information
                    </h2>
                </div>

                <div className="space-y-6">
                    {/* Display Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Display Name
                        </label>
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your name"
                                />
                                <button
                                    onClick={handleUpdateName}
                                    disabled={loading || !displayName.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditingName(false);
                                        setDisplayName(user?.displayName || "");
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-900 font-medium">
                                    {user?.displayName || "Not set"}
                                </p>
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <Edit size={16} />
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Mail size={18} className="text-gray-600" />
                            <p className="text-gray-900 font-medium">{user?.email}</p>
                            <span className="ml-auto text-xs text-gray-500">(Read-only)</span>
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Role
                        </label>
                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                            <Shield size={18} className="text-purple-600" />
                            <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Firebase UID */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Firebase UID
                        </label>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700 font-mono text-sm break-all">
                                {user?.firebaseUid || firebaseUser?.uid || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Account Created */}
                    {firebaseUser?.metadata?.creationTime && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Account Created
                            </label>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Calendar size={18} className="text-gray-600" />
                                <p className="text-gray-900">
                                    {format(
                                        new Date(firebaseUser.metadata.creationTime),
                                        "MMMM dd, yyyy 'at' hh:mm a"
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Last Sign In */}
                    {firebaseUser?.metadata?.lastSignInTime && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Last Sign In
                            </label>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Calendar size={18} className="text-gray-600" />
                                <p className="text-gray-900">
                                    {format(
                                        new Date(firebaseUser.metadata.lastSignInTime),
                                        "MMMM dd, yyyy 'at' hh:mm a"
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Key className="text-orange-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                    </div>
                    {!isChangingPassword && (
                        <button
                            onClick={() => setIsChangingPassword(true)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                        >
                            <Edit size={16} />
                            Change Password
                        </button>
                    )}
                </div>

                {isChangingPassword ? (
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) =>
                                    setPasswordForm((prev) => ({
                                        ...prev,
                                        currentPassword: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter current password"
                                required
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) =>
                                    setPasswordForm((prev) => ({
                                        ...prev,
                                        newPassword: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter new password (min 6 characters)"
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) =>
                                    setPasswordForm((prev) => ({
                                        ...prev,
                                        confirmPassword: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                <Save size={16} />
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setPasswordForm({
                                        currentPassword: "",
                                        newPassword: "",
                                        confirmPassword: "",
                                    });
                                    setMessage(null);
                                }}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-600">
                        Click "Change Password" to update your account password. You'll need
                        to provide your current password for security.
                    </p>
                )}
            </div>

            {/* Security Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                            Security Notice
                        </p>
                        <p className="text-sm text-blue-700">
                            Your account is protected by Firebase Authentication. Always use a
                            strong, unique password and never share your credentials with
                            anyone.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
