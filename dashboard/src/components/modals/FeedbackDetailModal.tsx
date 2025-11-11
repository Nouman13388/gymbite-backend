import { X, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { FeedbackWithRelations } from "../../schemas/feedback.schema";
import StarRating from "../ui/StarRating";

interface FeedbackDetailModalProps {
    feedback: FeedbackWithRelations;
    onClose: () => void;
}

export default function FeedbackDetailModal({
    feedback,
    onClose,
}: FeedbackDetailModalProps) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Feedback Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Rating */}
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Rating</p>
                        <div className="flex justify-center">
                            <StarRating rating={feedback.rating} size="xl" showNumber />
                        </div>
                    </div>

                    {/* Client & Trainer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Client */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <User size={18} className="text-blue-600" />
                                <p className="text-sm font-semibold text-gray-700">Client</p>
                            </div>
                            <p className="text-base font-bold text-gray-900">
                                {feedback.user.name}
                            </p>
                            <p className="text-sm text-gray-600">{feedback.user.email}</p>
                        </div>

                        {/* Trainer */}
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <User size={18} className="text-green-600" />
                                <p className="text-sm font-semibold text-gray-700">Trainer</p>
                            </div>
                            <p className="text-base font-bold text-gray-900">
                                {feedback.trainer.name}
                            </p>
                            <p className="text-sm text-gray-600">{feedback.trainer.email}</p>
                            {feedback.trainer.specialization && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {feedback.trainer.specialization}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={18} />
                        <p className="text-sm">
                            Submitted on{" "}
                            <span className="font-semibold text-gray-900">
                                {format(new Date(feedback.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
                            </span>
                        </p>
                    </div>

                    {/* Comment */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Comment</p>
                        {feedback.comments ? (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                    {feedback.comments}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No comment provided</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
