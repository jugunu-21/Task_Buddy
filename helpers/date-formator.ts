

export function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
}
export function createDateFromISO(isoString: string): string {
    try {
        const date = new Date(isoString);
        return formatDate(date);
    } catch (error) {
        console.error('Invalid ISO string:', isoString);
        throw error;
    }
}
