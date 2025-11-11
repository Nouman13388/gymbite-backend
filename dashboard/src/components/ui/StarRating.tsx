import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
    rating: number; // 0-5 (supports decimals)
    size?: "sm" | "md" | "lg" | "xl";
    readOnly?: boolean;
    showNumber?: boolean;
    onChange?: (rating: number) => void;
}

const sizeMap = {
    sm: 14,
    md: 20,
    lg: 28,
    xl: 36,
};

const getStarColor = (rating: number): string => {
    if (rating < 2.5) return "text-red-500";
    if (rating < 3.5) return "text-yellow-500";
    return "text-green-500";
};

export default function StarRating({
    rating,
    size = "md",
    readOnly = true,
    showNumber = false,
    onChange,
}: StarRatingProps) {
    const iconSize = sizeMap[size];
    const color = getStarColor(rating);

    const handleClick = (starRating: number) => {
        if (!readOnly && onChange) {
            onChange(starRating);
        }
    };

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Full stars
        for (let i = 1; i <= fullStars; i++) {
            stars.push(
                <button
                    key={`full-${i}`}
                    type="button"
                    onClick={() => handleClick(i)}
                    disabled={readOnly}
                    className={`${color} ${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
                        } transition-transform`}
                >
                    <Star size={iconSize} fill="currentColor" />
                </button>
            );
        }

        // Half star
        if (hasHalfStar && fullStars < 5) {
            stars.push(
                <button
                    key="half"
                    type="button"
                    onClick={() => handleClick(fullStars + 1)}
                    disabled={readOnly}
                    className={`${color} ${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
                        } transition-transform relative`}
                >
                    <Star size={iconSize} className="opacity-30" />
                    <StarHalf
                        size={iconSize}
                        fill="currentColor"
                        className="absolute top-0 left-0"
                    />
                </button>
            );
        }

        // Empty stars
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 1; i <= emptyStars; i++) {
            const starValue = fullStars + (hasHalfStar ? 1 : 0) + i;
            stars.push(
                <button
                    key={`empty-${i}`}
                    type="button"
                    onClick={() => handleClick(starValue)}
                    disabled={readOnly}
                    className={`text-gray-300 ${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
                        } transition-transform`}
                >
                    <Star size={iconSize} />
                </button>
            );
        }

        return stars;
    };

    return (
        <div className="flex items-center gap-1">
            {renderStars()}
            {showNumber && (
                <span
                    className={`ml-1 font-semibold ${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
                        }`}
                >
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
