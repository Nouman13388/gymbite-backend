import React from 'react';

interface ActionButtonsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
    editLabel?: string;
    deleteLabel?: string;
    viewLabel?: string;
    showEdit?: boolean;
    showDelete?: boolean;
    showView?: boolean;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    onEdit,
    onDelete,
    onView,
    editLabel = 'Edit',
    deleteLabel = 'Delete',
    viewLabel = 'View',
    showEdit = true,
    showDelete = true,
    showView = false,
    size = 'md',
    disabled = false
}) => {
    const buttonClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    const baseClasses = `rounded-lg font-medium transition-colors ${buttonClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`;

    return (
        <div className="flex items-center space-x-2">
            {showView && onView && (
                <button
                    onClick={onView}
                    disabled={disabled}
                    className={`${baseClasses} text-blue-400 bg-blue-900/20 hover:bg-blue-900/40 border border-blue-700`}
                >
                    {viewLabel}
                </button>
            )}

            {showEdit && onEdit && (
                <button
                    onClick={onEdit}
                    disabled={disabled}
                    className={`${baseClasses} text-yellow-400 bg-yellow-900/20 hover:bg-yellow-900/40 border border-yellow-700`}
                >
                    {editLabel}
                </button>
            )}

            {showDelete && onDelete && (
                <button
                    onClick={onDelete}
                    disabled={disabled}
                    className={`${baseClasses} text-red-400 bg-red-900/20 hover:bg-red-900/40 border border-red-700`}
                >
                    {deleteLabel}
                </button>
            )}
        </div>
    );
};