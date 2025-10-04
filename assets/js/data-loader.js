// Data Loader for Netlify CMS YAML files
class DataLoader {
    constructor() {
        this.cache = new Map();
        this.baseUrl = window.location.origin;
    }

    // Load YAML file and parse it
    async loadYAML(filePath) {
        if (this.cache.has(filePath)) {
            return this.cache.get(filePath);
        }

        try {
            const response = await fetch(`${this.baseUrl}/_data/${filePath}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status}`);
            }
            
            const yamlText = await response.text();
            const data = this.parseYAML(yamlText);
            this.cache.set(filePath, data);
            return data;
        } catch (error) {
            console.warn(`Could not load ${filePath}:`, error);
            return this.getFallbackData(filePath);
        }
    }

    // Simple YAML parser for our basic structure
    parseYAML(yamlText) {
        const lines = yamlText.split('\n');
        const result = {};
        let currentKey = '';
        let inArray = false;
        let arrayItems = [];

        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith('#')) continue;

            if (line.includes(':')) {
                if (inArray && currentKey) {
                    result[currentKey] = arrayItems;
                    inArray = false;
                    arrayItems = [];
                }

                const [key, ...valueParts] = line.split(':');
                const value = valueParts.join(':').trim();
                
                if (value === '') {
                    currentKey = key.trim();
                    inArray = true;
                } else {
                    result[key.trim()] = value.replace(/^["']|["']$/g, '');
                }
            } else if (line.startsWith('-') && inArray) {
                arrayItems.push(line.substring(1).trim().replace(/^["']|["']$/g, ''));
            }
        }

        if (inArray && currentKey) {
            result[currentKey] = arrayItems;
        }

        return result;
    }

    // Load all gallery items
    async loadGallery() {
        const galleryItems = [];
        for (let i = 1; i <= 6; i++) {
            try {
                const item = await this.loadYAML(`gallery/spot-${i}.yml`);
                if (item && item.title) {
                    galleryItems.push({
                        spot: i,
                        title: item.title,
                        image: item.image || '/assets/images/placeholder.jpg',
                        description: item.description || '',
                        category: item.category || 'all'
                    });
                }
            } catch (error) {
                console.log(`No gallery item for spot ${i}`);
            }
        }
        return galleryItems;
    }

    // Load contact information
    async loadContact() {
        return await this.loadYAML('contact.yml');
    }

    // Load social media links
    async loadSocial() {
        return await this.loadYAML('social.yml');
    }

    // Load business information
    async loadBusiness() {
        return await this.loadYAML('business.yml');
    }

    // Load profile information
    async loadProfile() {
        return await this.loadYAML('profile.yml');
    }

    // Load website settings
    async loadSettings() {
        return await this.loadYAML('settings.yml');
    }

    // Load reviews
    async loadReviews() {
        try {
            // For now, we'll load individual review files
            // In production, this would be more dynamic
            const reviews = [];
            const reviewFiles = ['review-2024-10-04-142500.yml']; // Add more as needed
            
            for (const file of reviewFiles) {
                const review = await this.loadYAML(`reviews/${file}`);
                if (review && review.published !== false) {
                    reviews.push(review);
                }
            }
            return reviews;
        } catch (error) {
            console.warn('Could not load reviews:', error);
            return [];
        }
    }

    // Fallback data if files can't be loaded (for development)
    getFallbackData(filePath) {
        const fallbacks = {
            'contact.yml': {
                phone: '+1-242-555-0123',
                email: 'info@casamadera.bs',
                location: 'Nassau, Bahamas'
            },
            'social.yml': {
                facebook: '', instagram: '', youtube: '', whatsapp: '', tiktok: '', linkedin: ''
            },
            'business.yml': {
                name: 'Casa Madera',
                description: 'Expert carpentry services in The Bahamas'
            },
            'profile.yml': {
                name: 'Casa Madera Owner',
                title: 'Master Craftsman',
                image: '/assets/images/profile-placeholder.jpg'
            }
        };
        return fallbacks[filePath] || {};
    }
}

// Initialize data loader
const dataLoader = new DataLoader();

// Update page content with loaded data
async function updatePageContent() {
    try {
        // Load all data
        const [contact, social, business, profile, gallery] = await Promise.all([
            dataLoader.loadContact(),
            dataLoader.loadSocial(),
            dataLoader.loadBusiness(),
            dataLoader.loadProfile(),
            dataLoader.loadGallery()
        ]);

        // Update contact information
        if (contact.phone) {
            const phoneElements = document.querySelectorAll('.phone-number, [href^="tel:"]');
            phoneElements.forEach(el => {
                if (el.tagName === 'A') {
                    el.href = `tel:${contact.phone}`;
                    el.textContent = contact.phone;
                } else {
                    el.textContent = contact.phone;
                }
            });
        }

        if (contact.email) {
            const emailElements = document.querySelectorAll('.email-address, [href^="mailto:"]');
            emailElements.forEach(el => {
                if (el.tagName === 'A') {
                    el.href = `mailto:${contact.email}`;
                    el.textContent = contact.email;
                } else {
                    el.textContent = contact.email;
                }
            });
        }

        // Update social media links
        updateSocialMediaIcons(social);

        // Update business information
        if (business.name) {
            const nameElements = document.querySelectorAll('.business-name');
            nameElements.forEach(el => el.textContent = business.name);
        }

        if (business.description) {
            const descElements = document.querySelectorAll('.business-description');
            descElements.forEach(el => el.textContent = business.description);
        }

        // Update profile information
        if (profile.image) {
            const profileImages = document.querySelectorAll('.profile-image');
            profileImages.forEach(img => img.src = profile.image);
        }

        // Update gallery
        updateGalleryDisplay(gallery);

        console.log('Page content updated successfully');
    } catch (error) {
        console.error('Error updating page content:', error);
    }
}

// Update social media icons (same logic as before, but with loaded data)
function updateSocialMediaIcons(social) {
    const socialContainer = document.getElementById('social-media-container');
    if (!socialContainer) return;

    const socialPlatforms = [
        { key: 'facebook', name: 'Facebook', icon: 'fab fa-facebook-f', color: '#1877f2' },
        { key: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: '#e4405f' },
        { key: 'youtube', name: 'YouTube', icon: 'fab fa-youtube', color: '#ff0000' },
        { key: 'whatsapp', name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25d366' },
        { key: 'tiktok', name: 'TikTok', icon: 'fab fa-tiktok', color: '#000000' },
        { key: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin-in', color: '#0077b5' }
    ];

    socialContainer.innerHTML = '';

    socialPlatforms.forEach(platform => {
        const url = social[platform.key];
        if (url && url.trim() !== '') {
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'social-icon';
            link.setAttribute('aria-label', `Follow us on ${platform.name}`);
            link.style.color = platform.color;
            link.innerHTML = `<i class="${platform.icon}"></i>`;
            socialContainer.appendChild(link);
        }
    });
}

// Update gallery display
function updateGalleryDisplay(galleryItems) {
    galleryItems.forEach(item => {
        const gallerySpot = document.getElementById(`gallery-spot-${item.spot}`);
        if (gallerySpot) {
            const img = gallerySpot.querySelector('img');
            if (img) {
                img.src = item.image;
                img.alt = item.title;
            }
            
            // Update title if there's a title element
            const titleElement = gallerySpot.querySelector('.gallery-title');
            if (titleElement) {
                titleElement.textContent = item.title;
            }
        }
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updatePageContent);
} else {
    updatePageContent();
}