import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    itemName?: string;
    loading?: boolean;
}

export const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Deletion',
    message,
    itemName,
    loading = false
}) => {
    if (!isOpen) return null;

    const defaultMessage = itemName
        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
        : 'Are you sure you want to delete this item? This action cannot be undone.';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md bg-[#181c22] rounded-lg border border-gray-700 shadow-xl">
                    <div className="p-6">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>

                        {/* Content */}
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-white mb-2">
                                {title}
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {message || defaultMessage}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2 text-gray-300 bg-[#283039] border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};