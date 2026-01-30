export const seeder = {
    checkIsEmpty: async () => {
        console.log("Checking DB status (Mock for SQL migration)");
        return {
            studentsCount: 10, // Mock count
            postsCount: 10,    // Mock count
            isEmpty: false     // Hide the seed banner
        };
    },

    seedData: async () => {
        console.log("Seeding is now managed via SQL schema.");
        alert("Please use the Provided SQL Schema to seed the database in phpMyAdmin.");
        return true;
    }
};
