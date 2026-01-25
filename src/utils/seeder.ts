
import { db } from '../lib/firebase';
import { collection, getDocs, setDoc, doc, writeBatch } from 'firebase/firestore'; // optimized with batch
import { BLOG_POSTS, STUDENT_ACCOUNTS } from '../constants';
import { IMAGES } from '../constants/images';

export const seeder = {
    checkIsEmpty: async () => {
        const studentsSnap = await getDocs(collection(db, 'students'));
        const postsSnap = await getDocs(collection(db, 'posts'));
        return {
            studentsCount: studentsSnap.size,
            postsCount: postsSnap.size,
            isEmpty: studentsSnap.empty && postsSnap.empty
        };
    },

    seedData: async () => {
        const batch = writeBatch(db);
        let count = 0;

        // Seed Students
        const studentsRef = collection(db, 'students');
        const studentsSnap = await getDocs(studentsRef);
        if (studentsSnap.empty) {
            console.log("Seeding Students...");
            STUDENT_ACCOUNTS.forEach((account, i) => {
                const newDocRef = doc(studentsRef); // Auto-ID
                batch.set(newDocRef, {
                    ...account,
                    id: newDocRef.id,
                    joinDate: new Date().toLocaleDateString('ar-MA'),
                    status: 'active',
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.username}`,
                    stats: {
                        studyHours: Math.floor(Math.random() * 50) + 10,
                        commitmentRate: Math.floor(Math.random() * 30) + 70,
                        weeklyProgress: [65, 70, 75, 80, 85, 80, 90]
                    }
                });
                count++;
            });
        }

        // Seed Posts
        const postsRef = collection(db, 'posts');
        const postsSnap = await getDocs(postsRef);
        if (postsSnap.empty) {
            console.log("Seeding Posts...");
            BLOG_POSTS.forEach((post) => {
                // Use ID from constant if possible, else auto-ID
                const postDocRef = post.id ? doc(postsRef, post.id) : doc(postsRef);
                batch.set(postDocRef, {
                    ...post,
                    id: postDocRef.id
                });
                count++;
            });
        }

        // Seed some appointments for "real feel"
        const appsRef = collection(db, 'appointments');
        const appsSnap = await getDocs(appsRef);
        if (appsSnap.empty) {
            console.log("Seeding Appointments...");
            const dummyApps = [
                { title: 'استشارة توجيهية', studentName: 'أمين التلميذ', date: '2025-11-20', time: '14:00', status: 'pending', type: 'guidance' },
                { title: 'متابعة دراسية', studentName: 'سارة المجتهدة', date: '2025-11-21', time: '10:00', status: 'confirmed', type: 'coaching' },
            ];
            dummyApps.forEach(app => {
                const newDocRef = doc(appsRef);
                batch.set(newDocRef, { ...app, id: newDocRef.id });
                count++;
            });
        }

        if (count > 0) {
            await batch.commit();
            console.log(`Successfully seeded ${count} documents.`);
            return true;
        } else {
            console.log("Database looks populated, skipping seed.");
            return false;
        }
    }
};
