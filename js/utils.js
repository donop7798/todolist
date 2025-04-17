export function formatDate(dateString) {
    try {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString;
    }
}

export function isOverdue(deadline) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        return deadlineDate < today;
    } catch (e) {
        console.error("Error checking overdue:", e);
        return false;
    }
}