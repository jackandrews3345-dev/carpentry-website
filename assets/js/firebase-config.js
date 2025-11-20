// Firebase configuration and database integration
// This makes admin panel changes visible to everyone across all devices

// Firebase configuration - Real credentials from your Firebase project
const firebaseConfig = {
    apiKey: "AIzaSyAWaAHwlZjBWtLr_q0cpquF8ZrfHcXBdM0",
    authDomain: "casa-madera-carpentry.firebaseapp.com",
    databaseURL: "https://casa-madera-carpentry-default-rtdb.firebaseio.com",
    projectId: "casa-madera-carpentry",
    storageBucket: "casa-madera-carpentry.firebasestorage.app",
    messagingSenderId: "285478306449",
    appId: "1:285478306449:web:5ed7fe71751c840429f530",
    measurementId: "G-JKT1RY68JW"
};

// Firebase integration class
class FirebaseManager {
    constructor() {
        this.isFirebaseReady = false;
        this.fallbackToLocalStorage = true;
        this.initFirebase();
    }

    async initFirebase() {
        try {
            console.log('🔥 Starting Firebase initialization...');
            
            // Check if Firebase is available
            if (typeof firebase === 'undefined') {
                console.log('❌ Firebase SDK not loaded, using localStorage fallback');
                this.fallbackToLocalStorage = true;
                return;
            }
            
            console.log('✅ Firebase SDK loaded successfully');

            // Initialize Firebase
            if (!firebase.apps.length) {
                console.log('🔧 Initializing Firebase app...');
                firebase.initializeApp(firebaseConfig);
                console.log('✅ Firebase app initialized');
            } else {
                console.log('✅ Firebase app already initialized');
            }
            
            console.log('🔧 Setting up Firebase services...');
            this.database = firebase.database();
            // Note: We only use Firebase Database (free), not Storage (paid)
            this.isFirebaseReady = true;
            this.fallbackToLocalStorage = false;
            
            console.log('✅ Firebase initialized successfully!');
            console.log('🔧 Testing Firebase connection...');
            
            // Test Firebase connection
            await this.database.ref('.info/connected').once('value', (snapshot) => {
                if (snapshot.val() === true) {
                    console.log('✅ Firebase database connected!');
                } else {
                    console.log('⚠️ Firebase database not connected');
                }
            });
            
            // Load data from Firebase
            console.log('🔄 Loading data from Firebase...');
            await this.loadAllDataFromFirebase();
            
        } catch (error) {
            console.warn('Firebase initialization failed, using localStorage:', error);
            this.fallbackToLocalStorage = true;
        }
    }

    // Save data to both Firebase and localStorage
    async saveData(key, data) {
        try {
            // Save to localStorage first (immediate feedback)
            localStorage.setItem(key, JSON.stringify(data));
            
            // If Firebase is ready, also save to Firebase
            if (this.isFirebaseReady && !this.fallbackToLocalStorage) {
                await this.database.ref(key).set(data);
                console.log(`✅ Data saved to Firebase: ${key}`);
            }
            
            return true;
        } catch (error) {
            console.warn('Firebase save failed, data saved to localStorage only:', error);
            return true; // Still successful via localStorage
        }
    }

    // Load data from Firebase with localStorage fallback
    async loadData(key) {
        try {
            if (this.isFirebaseReady && !this.fallbackToLocalStorage) {
                const snapshot = await this.database.ref(key).once('value');
                const firebaseData = snapshot.val();
                
                if (firebaseData) {
                    // Save to localStorage for faster future access
                    localStorage.setItem(key, JSON.stringify(firebaseData));
                    console.log(`✅ Loaded from Firebase: ${key}`);
                    return firebaseData;
                }
            }
            
            // Fallback to localStorage
            const localData = localStorage.getItem(key);
            return localData ? JSON.parse(localData) : {};
            
        } catch (error) {
            console.warn('Firebase load failed, using localStorage:', error);
            const localData = localStorage.getItem(key);
            return localData ? JSON.parse(localData) : {};
        }
    }

    // Upload image using base64 to Firebase Database (no Storage needed)
    async uploadImage(file, path) {
        try {
            // Convert to base64 first
            const base64Data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            
            console.log('✅ Image converted to base64 for Firebase Database');
            return base64Data;
            
        } catch (error) {
            console.warn('Image conversion failed:', error);
            throw error;
        }
    }

    // Load all data from Firebase to sync with localStorage
    async loadAllDataFromFirebase() {
        if (!this.isFirebaseReady || this.fallbackToLocalStorage) return;

        const dataKeys = [
            'businessInfo',
            'contactInfo', 
            'socialMedia',
            'quoteSettings',
            'adminCredentials',
            'casa_profile_photo',
            'gallery_furniture',
            'gallery_renovation', 
            'gallery_custom',
            'gallery_videos',
            'gallery_furniture_labels',
            'gallery_renovation_labels',
            'gallery_custom_labels',
            'gallery_videos_labels',
            'casa_gallery_spot_1',
            'casa_gallery_spot_2',
            'casa_gallery_spot_3',
            'casa_gallery_spot_4',
            'casa_gallery_spot_5',
            'casa_gallery_spot_6'
        ];

        for (const key of dataKeys) {
            try {
                const data = await this.loadData(key);
                if (data && Object.keys(data).length > 0) {
                    localStorage.setItem(key, JSON.stringify(data));
                }
            } catch (error) {
                console.warn(`Failed to load ${key} from Firebase:`, error);
            }
        }

        console.log('✅ All data synced from Firebase to localStorage');
        
        // Trigger page update with new data
        if (typeof updatePageContent === 'function') {
            setTimeout(updatePageContent, 500);
        }
    }

    // Get Firebase status for admin panel
    getStatus() {
        return {
            isReady: this.isFirebaseReady,
            usingLocalStorage: this.fallbackToLocalStorage,
            message: this.isFirebaseReady ? 
                '✅ Connected to Firebase - Changes visible to everyone!' : 
                '⚠️ Using localStorage only - Changes visible on this device only'
        };
    }
}

// Initialize Firebase Manager
const firebaseManager = new FirebaseManager();

// Make it globally available
window.firebaseManager = firebaseManager;

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseManager;
}