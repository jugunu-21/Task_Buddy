
export const getBadgeVariant = (value: 'work' | 'personal' |'to-do'): string => {
    switch (value) {
        case 'to-do':
            return 'bg-purple-500 hover:bg-purple-500';
        case 'personal':
            return 'bg-pink-500 hover:bg-pink-500';
        
        default:
            return 'bg-gray-700 hover:bg-gray-700';
    }
};