/**
 * Date Formatting Utilities
 * -------------------------
 * Provides utility functions for formatting dates in a consistent manner across the application.
 *
 * ### Functions
 * - `formatDate`:
 *   - **Description**: Formats a date into a human-readable string (e.g., "January 15, 2024").
 *   - **Parameters**:
 *     - `date`: Date object, string, or number representing the date to format.
 *   - **Returns**: Formatted date string.
 *
 * - `formatDateTime`:
 *   - **Description**: Formats a date with time into a readable string (e.g., "January 15, 2024 at 3:45 PM").
 *   - **Parameters**:
 *     - `date`: Date object, string, or number representing the date to format.
 *   - **Returns**: Formatted date and time string.
 *
 * - `getRelativeTime`:
 *   - **Description**: Returns a relative time string (e.g., "2 hours ago", "just now").
 *   - **Parameters**:
 *     - `date`: Date object, string, or number representing the date.
 *   - **Returns**: Relative time string.
 *
 * ### Usage Example
 * ```tsx
 * import { formatDate, formatDateTime, getRelativeTime } from "./utils/date";
 *
 * const dateStr = formatDate(new Date());
 * const dateTimeStr = formatDateTime(user.lastLogin);
 * const relativeTimeStr = getRelativeTime(user.lastLogin);
 * ```
 *
 * ### Dependencies
 * - None (uses native JavaScript Date API)
 */

export const formatDate = (date: Date | string | number): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
};

export const formatDateTime = (date: Date | string | number): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    };
    return new Date(date).toLocaleDateString("en-US", options);
};

export const getRelativeTime = (date: Date | string | number): string => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
};
