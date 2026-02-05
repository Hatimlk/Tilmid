import { dataManager } from './dataManager';

export const seeder = {
    checkIsEmpty: async () => {
        try {
            // Check if we have any students as a proxy for DB status
            const students = await dataManager.getStudents();
            return {
                studentsCount: students.length,
                postsCount: 0, // We could fetch posts too if needed, but students is enough for connectivity check
                isEmpty: students.length === 0
            };
        } catch (error) {
            console.error("Failed to check DB status", error);
            // If API fails, we can assume it might be empty or connection issue, 
            // but for safety in this context we'll say it's NOT empty to avoid showing seed UI erroneously
            // OR we say it IS empty to prompt user? 
            // Better to say NOT empty (false) so we don't annoy user if backend is down.
            return {
                studentsCount: 0,
                postsCount: 0,
                isEmpty: false
            };
        }
    },

    seedData: async () => {
        console.log("Seeding is now managed via SQL schema.");
        alert("Please use the Provided SQL Schema to seed the database in phpMyAdmin.");
        return true;
    }
};
