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
            // Check if Firebase is available
            if (typeof firebase === 'undefined') {
                console.log('Firebase SDK not loaded, using localStorage fallback');
                this.fallbackToLocalStorage = true;
                return;
            }

            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            this.database = firebase.database();
            this.storage = firebase.storage();
            this.isFirebaseReady = true;
            this.fallbackToLocalStorage = false;
            
            console.log('✅ Firebase initialized successfully!');
            
            // Load data from Firebase
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

    // Upload image to Firebase Storage with localStorage fallback
    async uploadImage(file, path) {
        try {
            if (this.isFirebaseReady && !this.fallbackToLocalStorage && file.size < 10 * 1024 * 1024) { // 10MB limit
                const storageRef = this.storage.ref().child(`images/${path}`);
                const snapshot = await storageRef.put(file);
                const downloadURL = await snapshot.ref.getDownloadURL();
                
                console.log('✅ Image uploaded to Firebase Storage');
                return downloadURL;
            }
            
            // Fallback to base64 localStorage
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            
        } catch (error) {
            console.warn('Firebase image upload failed, using base64 fallback:', error);
            
            // Fallback to base64
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
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
            'casa_profile_photo',
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