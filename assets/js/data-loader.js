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
        
        // Load general gallery spots (1-6)
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
    
    // Load category-specific galleries
    async loadCategoryGalleries() {
        const categories = ['furniture', 'renovation', 'custom'];
        const categoryItems = {
            furniture: [],
            renovation: [],
            custom: []
        };
        
        for (const category of categories) {
            try {
                // Try to load sample files for each category
                const sampleFiles = {
                    furniture: ['custom-dining-table.yml'],
                    renovation: ['kitchen-makeover-nassau.yml'],
                    custom: ['built-in-entertainment-center.yml']
                };
                
                for (const file of sampleFiles[category] || []) {
                    try {
                        const item = await this.loadYAML(`gallery/${category}/${file}`);
                        if (item && item.title) {
                            categoryItems[category].push({
                                title: item.title,
                                image: item.image || '/assets/images/placeholder.jpg',
                                description: item.description || '',
                                category: category,
                                ...item
                            });
                        }
                    } catch (error) {
                        console.log(`No ${category} item: ${file}`);
                    }
                }
            } catch (error) {
                console.log(`Error loading ${category} gallery:`, error);
            }
        }
        
        return categoryItems;
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
        const profile = await this.loadYAML('profile.yml');
        console.log('Loaded profile data:', profile);
        return profile;
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

    // Load videos
    async loadVideos() {
        const videos = [];
        for (let i = 1; i <= 3; i++) {
            try {
                // Try to load video files dynamically
                const videoFiles = ['furniture-making-process.yml']; // Add more as discovered
                for (const file of videoFiles) {
                    const video = await this.loadYAML(`videos/${file}`);
                    if (video && video.spot === i.toString()) {
                        videos.push({
                            spot: i,
                            title: video.title || `Video ${i}`,
                            thumbnail: video.thumbnail || '/assets/images/video-placeholder.jpg',
                            video_url: video.video_url || '',
                            description: video.description || '',
                            duration: video.duration || ''
                        });
                    }
                }
            } catch (error) {
                console.log(`No video for spot ${i}`);
            }
        }
        return videos;
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
        const [contact, social, business, profile, gallery, videos, categoryGalleries] = await Promise.all([
            dataLoader.loadContact(),
            dataLoader.loadSocial(),
            dataLoader.loadBusiness(),
            dataLoader.loadProfile(),
            dataLoader.loadGallery(),
            dataLoader.loadVideos(),
            dataLoader.loadCategoryGalleries()
        ]);

        // Contact information is now handled in updateBusinessInformation()

        // Update social media links with delay to prevent conflicts
        setTimeout(() => {
            updateSocialMediaIcons(social);
        }, 500);

        // Update business information - prioritize admin panel data
        updateBusinessInformation(business);

        // Update profile information
        updateProfilePhoto(profile);

        // Update gallery
        updateGalleryDisplay(gallery);
        
        // Load admin gallery images into gallery spots
        updateGalleryFromAdmin();
        
        // Update video gallery (load from admin panel and YAML)
        updateVideoGallery(videos);
        
        // Update hero section video
        updateHeroVideo();
        
        // Set up enhanced gallery filtering with category data
        setupEnhancedGalleryFiltering(categoryGalleries);

        console.log('Page content updated successfully');
        
        // Final social media update to ensure they stay visible
        setTimeout(() => {
            updateSocialMediaIcons(social);
        }, 1000);
        
    } catch (error) {
        console.error('Error updating page content:', error);
    }
}

// Update business information - prioritize admin panel data over YAML
function updateBusinessInformation(business) {
    console.log('📊 Updating business information...');
    
    // Load admin panel business info
    const adminBusiness = JSON.parse(localStorage.getItem('businessInfo') || '{}');
    console.log('Admin business data:', adminBusiness);
    console.log('YAML business data:', business);
    
    // Try to load from Firebase if available
    if (window.firebaseManager && window.firebaseManager.isFirebaseReady) {
        window.firebaseManager.loadData('businessInfo').then(firebaseBusiness => {
            if (firebaseBusiness && typeof firebaseBusiness === 'object') {
                console.log('📊 Loading business info from Firebase:', firebaseBusiness);
                // Update localStorage with Firebase data
                localStorage.setItem('businessInfo', JSON.stringify(firebaseBusiness));
                // Trigger another update with Firebase data
                setTimeout(() => updateBusinessInformation(business), 100);
            }
        }).catch(error => {
            console.log('⚠️ Could not load business info from Firebase:', error);
        });
    }
    
    // Combine data with admin panel taking priority
    const combinedBusiness = {
        name: adminBusiness.name || business.name || 'Casa Madera',
        phone: adminBusiness.phone || business.phone || '+1-242-555-0123', 
        email: adminBusiness.email || business.email || 'info@casamadera.bs',
        description: adminBusiness.description || business.description || 'Expert carpentry services in The Bahamas'
    };
    
    console.log('Combined business data:', combinedBusiness);
    
    // Update business name
    if (combinedBusiness.name) {
        const nameElements = document.querySelectorAll('.business-name, [data-business="name"]');
        console.log(`Updating ${nameElements.length} business name elements to: ${combinedBusiness.name}`);
        nameElements.forEach(el => {
            el.textContent = combinedBusiness.name;
            console.log('Updated element:', el);
        });
    }
    
    // Update business description
    if (combinedBusiness.description) {
        const descElements = document.querySelectorAll('.business-description');
        console.log(`Updating ${descElements.length} business description elements`);
        descElements.forEach(el => el.textContent = combinedBusiness.description);
    }
    
    // Update contact info with admin data
    const adminContact = JSON.parse(localStorage.getItem('contactInfo') || '{}');
    
    // Update phone numbers
    if (combinedBusiness.phone) {
        const phoneElements = document.querySelectorAll('.phone-number, [href^="tel:"]');
        console.log(`Updating ${phoneElements.length} phone elements to: ${combinedBusiness.phone}`);
        phoneElements.forEach(el => {
            if (el.tagName === 'A') {
                el.href = `tel:${combinedBusiness.phone}`;
                el.textContent = combinedBusiness.phone;
            } else {
                el.textContent = combinedBusiness.phone;
            }
        });
    }
    
    // Update email addresses  
    if (combinedBusiness.email) {
        const emailElements = document.querySelectorAll('.email-address, [href^="mailto:"]');
        console.log(`Updating ${emailElements.length} email elements to: ${combinedBusiness.email}`);
        emailElements.forEach(el => {
            if (el.tagName === 'A') {
                el.href = `mailto:${combinedBusiness.email}`;
                el.textContent = combinedBusiness.email;
            } else {
                el.textContent = combinedBusiness.email;
            }
        });
    }
    
    // Update location if available from contact info
    if (adminContact.address) {
        const locationElements = document.querySelectorAll('.business-location');
        console.log(`Updating ${locationElements.length} location elements`);
        locationElements.forEach(el => el.textContent = adminContact.address);
    }
    
    console.log('📊 Business information update complete');
}

// Update social media icons - check both YAML and admin panel data
function updateSocialMediaIcons(social) {
    const socialContainer = document.getElementById('social-media-container');
    if (!socialContainer) return;

    // Check admin panel social media settings first
    const adminSocial = JSON.parse(localStorage.getItem('socialMedia') || '{}');
    const combinedSocial = {
        facebook: adminSocial.facebook || localStorage.getItem('casa_social_facebook') || social.facebook || '',
        instagram: adminSocial.instagram || localStorage.getItem('casa_social_instagram') || social.instagram || '',
        youtube: adminSocial.youtube || localStorage.getItem('casa_social_youtube') || social.youtube || '',
        whatsapp: adminSocial.whatsapp || localStorage.getItem('casa_social_whatsapp') || social.whatsapp || '',
        tiktok: localStorage.getItem('casa_social_tiktok') || social.tiktok || '',
        linkedin: localStorage.getItem('casa_social_linkedin') || social.linkedin || ''
    };
    
    console.log('Social media data found:', combinedSocial);

    const socialPlatforms = [
        { key: 'facebook', name: 'Facebook', icon: 'fab fa-facebook-f', color: '#1877f2' },
        { key: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: '#e4405f' },
        { key: 'youtube', name: 'YouTube', icon: 'fab fa-youtube', color: '#ff0000' },
        { key: 'whatsapp', name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25d366' },
        { key: 'tiktok', name: 'TikTok', icon: 'fab fa-tiktok', color: '#000000' },
        { key: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin-in', color: '#0077b5' }
    ];

    // Only clear if we have new social media data or if container is empty
    const hasValidSocial = Object.values(combinedSocial).some(val => val && val.trim() !== '');
    if (hasValidSocial || socialContainer.children.length === 0) {
        socialContainer.innerHTML = '';
    } else {
        // Don't clear if we don't have data and icons are already there
        return;
    }

    socialPlatforms.forEach(platform => {
        const url = combinedSocial[platform.key];
        if (url && url.trim() !== '') {
            const link = document.createElement('a');
            
            // Handle WhatsApp special formatting
            if (platform.key === 'whatsapp' && !url.startsWith('http')) {
                link.href = `https://wa.me/${url.replace(/[^0-9]/g, '')}`;
            } else {
                link.href = url;
            }
            
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'social-link';
            link.setAttribute('aria-label', `Follow us on ${platform.name}`);
            link.innerHTML = `<i class="${platform.icon}"></i>`;
            socialContainer.appendChild(link);
        }
    });
    
    // If no social links are configured, show some placeholder icons
    if (socialContainer.children.length === 0) {
        const defaultPlatforms = [
            { name: 'Facebook', icon: 'fab fa-facebook-f', href: '#' },
            { name: 'Instagram', icon: 'fab fa-instagram', href: '#' },
            { name: 'WhatsApp', icon: 'fab fa-whatsapp', href: '#' },
            { name: 'YouTube', icon: 'fab fa-youtube', href: '#' }
        ];
        
        defaultPlatforms.forEach(platform => {
            const link = document.createElement('a');
            link.href = platform.href;
            link.className = 'social-link';
            link.setAttribute('aria-label', `${platform.name} (not configured)`);
            link.onclick = function(e) {
                e.preventDefault();
                alert('This social media link has not been configured yet. Please set it up in the admin panel.');
            };
            link.innerHTML = `<i class="${platform.icon}"></i>`;
            socialContainer.appendChild(link);
        });
        console.log('Added default social media placeholders');
    }
    
    console.log('Updated social media with:', combinedSocial);
}

// Update profile photo
function updateProfilePhoto(profile) {
    console.log('Updating profile photo:', profile);
    
    const profileContainer = document.querySelector('.profile-image-container');
    if (!profileContainer) {
        console.log('Profile container not found');
        return;
    }
    
    // Check for admin panel uploaded photo first
    const adminProfilePhoto = localStorage.getItem('casa_profile_photo');
    let imageToUse = adminProfilePhoto || profile.image;
    
    console.log('Admin profile photo from localStorage:', adminProfilePhoto);
    console.log('Profile image from YAML:', profile.image);
    console.log('Image to use:', imageToUse);
    
    if (imageToUse && imageToUse !== '/assets/images/profile-placeholder.jpg') {
        // Replace placeholder with actual profile image
        console.log('Setting profile image to:', imageToUse);
        profileContainer.innerHTML = `
            <img src="${imageToUse}" alt="${profile.name || 'Profile Photo'}" 
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" 
                 class="profile-image">
        `;
    } else {
        // Update placeholder text with profile info
        const nameText = profile.name || 'Your Photo Here';
        profileContainer.innerHTML = `
            <i class="fas fa-user"></i>
            <p>${nameText}</p>
            ${profile.title ? `<small style="opacity: 0.8;">${profile.title}</small>` : ''}
        `;
    }
    
    // Update profile name and title in the about section if provided
    if (profile.name) {
        const aboutName = document.querySelector('.about-text h3');
        if (aboutName && profile.title) {
            aboutName.textContent = `${profile.name} - ${profile.title}`;
        }
    }
}

// Update video gallery
function updateGalleryDisplay(galleryItems) {
    galleryItems.forEach(item => {
        const gallerySpot = document.getElementById(`gallery-spot-${item.spot}`);
        if (gallerySpot) {
            // Check if there's a real image uploaded
            if (item.image && item.image !== '/assets/images/placeholder.jpg' && item.image !== '/assets/images/uploads/kitchen-cabinet-sample.jpg') {
                // Replace placeholder with actual image
                const placeholder = gallerySpot.querySelector('.image-placeholder');
                if (placeholder) {
                    const img = document.createElement('img');
                    img.src = item.image;
                    img.alt = item.title;
                    img.className = 'gallery-image';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    placeholder.replaceWith(img);
                }
            } else {
                // Update placeholder text if no image uploaded
                const titleElement = gallerySpot.querySelector('.image-placeholder p');
                if (titleElement && item.title) {
                    titleElement.textContent = item.title;
                }
            }
            
            // Update data category for filtering
            if (item.category) {
                gallerySpot.setAttribute('data-category', item.category);
            }
        }
    });
}

// Populate gallery with category-specific items
function populateGalleryWithCategory(categoryItems, category) {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    // Clear existing items
    galleryGrid.innerHTML = '';
    
    if (categoryItems[category] && categoryItems[category].length > 0) {
        // Add category-specific items
        categoryItems[category].forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-category', category);
            galleryItem.innerHTML = `
                <div class="image-placeholder">
                    <i class="fas fa-image"></i>
                    <p>${item.title}</p>
                    <small style="opacity: 0.8; font-size: 0.8rem;">${item.description || ''}</small>
                </div>
                <div class="gallery-overlay">
                    <i class="fas fa-expand"></i>
                </div>
            `;
            galleryGrid.appendChild(galleryItem);
        });
    } else {
        // Show message if no items in category
        galleryGrid.innerHTML = `
            <div class="empty-category" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-camera" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No ${category.charAt(0).toUpperCase() + category.slice(1)} Items Yet</h3>
                <p>Upload ${category} photos in your admin panel to see them here!</p>
            </div>
        `;
    }
}

// Update video gallery - load from admin panel localStorage and Firebase
let videoGalleryUpdating = false; // Prevent recursive updates

function updateVideoGallery(videos, skipFirebaseLoad = false) {
    // Prevent multiple simultaneous updates that cause glitching
    if (videoGalleryUpdating && !skipFirebaseLoad) {
        console.log('📹 Video gallery update already in progress, skipping...');
        return;
    }
    
    console.log('📹 Updating video gallery...');
    videoGalleryUpdating = true;
    
    // Load admin panel videos from localStorage
    let adminVideos = JSON.parse(localStorage.getItem('gallery_videos') || '{}');
    
    // Try to load from Firebase if available (only on initial load)
    if (!skipFirebaseLoad && window.firebaseManager && window.firebaseManager.isFirebaseReady) {
        window.firebaseManager.loadData('gallery_videos').then(firebaseVideos => {
            if (firebaseVideos && typeof firebaseVideos === 'object') {
                console.log('📹 Loading videos from Firebase:', firebaseVideos);
                const combinedVideos = { ...adminVideos, ...firebaseVideos };
                // Only update if data actually changed
                const currentData = JSON.stringify(adminVideos);
                const newData = JSON.stringify(combinedVideos);
                if (currentData !== newData) {
                    localStorage.setItem('gallery_videos', newData);
                    // Trigger update with Firebase data but skip Firebase loading
                    setTimeout(() => {
                        videoGalleryUpdating = false;
                        updateVideoGallery(videos, true);
                    }, 50);
                    return;
                }
            }
            videoGalleryUpdating = false;
        }).catch(error => {
            console.log('⚠️ Could not load videos from Firebase:', error);
            videoGalleryUpdating = false;
        });
        return; // Exit early, will resume in Firebase callback
    }
    
    console.log('Admin panel videos:', adminVideos);
    
    // Get video items in the main gallery
    const videoItems = document.querySelectorAll('.video-item');
    console.log(`Found ${videoItems.length} video slots on page`);
    
    // Update each video slot
    for (let i = 1; i <= videoItems.length; i++) {
        const videoItem = videoItems[i - 1];
        const placeholder = videoItem.querySelector('.video-placeholder');
        
        if (!placeholder) continue;
        
        // Check for admin uploaded video
        const adminVideo = adminVideos[`spot${i}`];
        
        if (adminVideo) {
            console.log(`📹 Loading admin video for spot ${i}`);
            
            // Load custom labels
            const videoLabels = JSON.parse(localStorage.getItem('gallery_videos_labels') || '{}');
            const customLabel = videoLabels[`spot${i}`] || `Project Video ${i}`;
            
            // Replace placeholder with video element
            const videoElement = document.createElement('video');
            videoElement.src = adminVideo;
            videoElement.style.cssText = 'width: 100%; height: 200px; object-fit: cover; border-radius: 8px; cursor: pointer;';
            videoElement.muted = true;
            videoElement.preload = 'metadata';
            videoElement.setAttribute('data-label', customLabel);
            
            // Create video container with play overlay
            const videoContainer = document.createElement('div');
            videoContainer.style.cssText = 'position: relative; width: 100%; height: 200px;';
            
            const playOverlay = document.createElement('div');
            playOverlay.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); cursor: pointer; z-index: 10;';
            playOverlay.innerHTML = '<i class="fas fa-play-circle"></i>';
            
            const videoTitle = document.createElement('div');
            videoTitle.style.cssText = 'position: absolute; bottom: 10px; left: 10px; right: 10px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);';
            videoTitle.innerHTML = `<h4 style="margin: 0; font-size: 1.1rem;">${customLabel}</h4>`;
            
            videoContainer.appendChild(videoElement);
            videoContainer.appendChild(playOverlay);
            videoContainer.appendChild(videoTitle);
            
            // Replace placeholder
            placeholder.innerHTML = '';
            placeholder.appendChild(videoContainer);
            
            // Let script.js handle all video clicks uniformly
            
            // Note: Video now opens in fullscreen lightbox instead of inline controls
            
        } else {
            // Check YAML videos for this slot
            const yamlVideo = videos.find(v => v.spot === i);
            if (yamlVideo && yamlVideo.video_url && yamlVideo.video_url.trim() !== '') {
                console.log(`📹 Loading YAML video for spot ${i}:`, yamlVideo.video_url);
                // Replace placeholder with video thumbnail and play button
                placeholder.innerHTML = `
                    <div class="video-thumbnail" style="position: relative; width: 100%; height: 200px; background-image: url('${yamlVideo.thumbnail}'); background-size: cover; background-position: center; border-radius: 8px; cursor: pointer;">
                        <div class="play-button" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                            <i class="fas fa-play-circle"></i>
                        </div>
                        <div class="video-info" style="position: absolute; bottom: 10px; left: 10px; right: 10px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                            <h4 style="margin: 0; font-size: 1.1rem;">${yamlVideo.title}</h4>
                            ${yamlVideo.duration ? `<span style="font-size: 0.9rem;">${yamlVideo.duration}</span>` : ''}
                        </div>
                    </div>
                `;
                
                // Add click handler for video playback
                placeholder.style.cursor = 'pointer';
                placeholder.onclick = () => openVideoModal(yamlVideo.video_url, yamlVideo.title);
            } else {
                // Keep original placeholder
                const iconElement = placeholder.querySelector('i');
                const textElement = placeholder.querySelector('p');
                if (iconElement && textElement) {
                    // Update placeholder text if available
                    if (yamlVideo && yamlVideo.title) {
                        textElement.textContent = yamlVideo.title;
                    } else {
                        textElement.textContent = `Project Video ${i}`;
                    }
                }
            }
        }
    }
    
    // Reset the updating flag
    videoGalleryUpdating = false;
    console.log('📹 Video gallery update complete');
    
    // Video click handlers are now managed by the data-loader itself
    // No need to reinitialize script.js handlers as they detect processed videos
}

// Update hero section video
let heroVideoUpdating = false; // Prevent recursive updates

function updateHeroVideo(skipFirebaseLoad = false) {
    // Prevent multiple simultaneous updates that cause glitching
    if (heroVideoUpdating && !skipFirebaseLoad) {
        console.log('🎬 Hero video update already in progress, skipping...');
        return;
    }
    
    console.log('🎬 Updating hero section video...');
    heroVideoUpdating = true;
    
    // Try to load featured video from Firebase if available (only on initial load)
    if (!skipFirebaseLoad && window.firebaseManager && window.firebaseManager.isFirebaseReady) {
        // Only load featured video from Firebase (completely independent from gallery videos)
        window.firebaseManager.loadData('casa_featured_video').then(firebaseFeaturedVideo => {
            // Update featured video if available
            if (firebaseFeaturedVideo) {
                const currentFeatured = localStorage.getItem('casa_featured_video');
                if (currentFeatured !== firebaseFeaturedVideo) {
                    localStorage.setItem('casa_featured_video', firebaseFeaturedVideo);
                    localStorage.setItem('casa_featured_video_updated', Date.now().toString());
                    console.log('🎬 Loading featured video from Firebase');
                    // Trigger update with Firebase data but skip Firebase loading
                    setTimeout(() => {
                        heroVideoUpdating = false;
                        updateHeroVideo(true);
                    }, 50);
                    return;
                }
            }
            
            heroVideoUpdating = false;
        }).catch(error => {
            console.log('⚠️ Could not load featured video from Firebase:', error);
            heroVideoUpdating = false;
        });
        return; // Exit early, will resume in Firebase callback
    }
    
    const heroVideoContainer = document.querySelector('.hero-video .video-placeholder');
    
    if (!heroVideoContainer) {
        console.log('Hero video container not found');
        heroVideoUpdating = false;
        return;
    }
    
    // Check if we have a dedicated featured video (completely independent from gallery videos)
    const featuredVideo = localStorage.getItem('casa_featured_video');
    const heroVideo = featuredVideo; // No fallback - featured video is completely separate
    
    if (heroVideo) {
        console.log('🎬 Loading featured video for hero section');
        
        // Create video container with fixed sizing to prevent background coverage
        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = 'position: relative; width: 400px; height: 250px; margin: 0 auto; border-radius: 16px; overflow: hidden;';
        
        // Create video element
        const videoElement = document.createElement('video');
        videoElement.src = heroVideo;
        videoElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 16px; cursor: pointer;';
        videoElement.muted = true;
        videoElement.preload = 'metadata';
        videoElement.autoplay = false;
        videoElement.loop = false;
        
        const playOverlay = document.createElement('div');
        playOverlay.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); cursor: pointer; z-index: 10;';
        playOverlay.innerHTML = '<i class="fas fa-play-circle"></i>';
        
        const videoTitle = document.createElement('div');
        videoTitle.style.cssText = 'position: absolute; bottom: 20px; left: 20px; right: 20px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); text-align: center;';
        videoTitle.innerHTML = '<p style="margin: 0; font-size: 1.2rem;">Featured Work Video</p>';
        
        videoContainer.appendChild(videoElement);
        videoContainer.appendChild(playOverlay);
        videoContainer.appendChild(videoTitle);
        
        // Replace placeholder
        heroVideoContainer.innerHTML = '';
        heroVideoContainer.appendChild(videoContainer);
        
        // Add click handlers for fullscreen video playback using lightbox
        const openFullscreenHeroVideo = () => {
            console.log('🎬 Opening hero video in fullscreen lightbox');
            // Use the existing lightbox system for fullscreen video
            if (typeof openLightbox === 'function') {
                openLightbox(heroVideo, 'Featured Work Video', 'video');
            } else {
                console.log('Lightbox not available, falling back to inline play');
                // Fallback to inline video if lightbox not available
                if (videoElement.paused) {
                    videoElement.play();
                    playOverlay.style.display = 'none';
                    videoElement.controls = true;
                } else {
                    videoElement.pause();
                    playOverlay.style.display = 'block';
                    videoElement.controls = false;
                }
            }
        };
        
        videoElement.onclick = openFullscreenHeroVideo;
        playOverlay.onclick = openFullscreenHeroVideo;
        
        // Note: Hero video now opens in fullscreen lightbox instead of inline controls
    } else {
        console.log('No featured video uploaded - hero section will show placeholder');
        // Keep original placeholder styling
    }
    
    // Reset the updating flag - this prevents recursive calls and video flickering
    heroVideoUpdating = false;
    console.log('🎬 Hero video update complete');
    
    // Additional safety reset after a small delay to prevent Firebase load cycles
    setTimeout(() => {
        heroVideoUpdating = false;
    }, 100);
}

// Open video modal (you'll need to implement this)
function openVideoModal(videoUrl, title) {
    // This would open a video modal - implement based on your needs
    console.log('Opening video:', videoUrl, title);
    // For now, just open in new window
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        window.open(videoUrl, '_blank');
    } else if (videoUrl.includes('vimeo.com')) {
        window.open(videoUrl, '_blank');
    } else {
        // Direct video file
        window.open(videoUrl, '_blank');
    }
}

// Enhanced gallery filtering with category data
function setupEnhancedGalleryFiltering(categoryGalleries) {
    console.log('Setting up enhanced gallery filtering with categories:', categoryGalleries);
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryGrid = document.querySelector('.gallery-grid');
    const originalGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    
    // Store original gallery HTML
    const originalGalleryHTML = galleryGrid ? galleryGrid.innerHTML : '';
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            console.log('Enhanced filter clicked:', filterValue);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            if (filterValue === 'all') {
                // Show original gallery spots
                galleryGrid.innerHTML = originalGalleryHTML;
            } else {
                // Show category-specific items
                populateGalleryWithCategory(categoryGalleries, filterValue);
            }
            
            // Re-initialize lightbox for new items
            setTimeout(() => {
                initializeLightboxForNewItems();
            }, 100);
        });
    });
}

// Initialize lightbox for dynamically added gallery items
function initializeLightboxForNewItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        // Remove existing event listeners
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        newItem.style.cursor = 'pointer';
        newItem.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const img = newItem.querySelector('img');
            if (img && img.src && !img.src.includes('placeholder')) {
                openLightbox(img.src, img.alt || `Gallery Image ${index + 1}`, 'image');
            } else {
                // Show placeholder
                const title = newItem.querySelector('p')?.textContent || `Gallery Item ${index + 1}`;
                const placeholderSrc = 'data:image/svg+xml;base64,' + btoa(`
                    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#007acc"/>
                        <text x="50%" y="45%" font-family="Arial" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">
                            ${title}
                        </text>
                        <text x="50%" y="55%" font-family="Arial" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">
                            Upload photos in the admin panel!
                        </text>
                    </svg>
                `);
                openLightbox(placeholderSrc, title, 'image');
            }
        });
    });
}

// Function to refresh profile photo from admin panel (make it global)
window.refreshProfilePhoto = function refreshProfilePhoto() {
    const adminProfilePhoto = localStorage.getItem('casa_profile_photo');
    const profileContainer = document.querySelector('.profile-image-container');
    
    if (profileContainer && adminProfilePhoto) {
        console.log('Refreshing profile photo from admin panel:', adminProfilePhoto);
        profileContainer.innerHTML = `
            <img src="${adminProfilePhoto}" alt="Profile Photo" 
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" 
                 class="profile-image">
        `;
        return true;
    }
    return false;
}

// Test function to debug profile photo (make it global)
window.testProfilePhoto = function() {
    console.log('=== Profile Photo Debug ===');
    console.log('localStorage casa_profile_photo:', localStorage.getItem('casa_profile_photo'));
    console.log('Profile container exists:', !!document.querySelector('.profile-image-container'));
    const container = document.querySelector('.profile-image-container');
    if (container) {
        console.log('Container HTML:', container.innerHTML);
    }
    
    // Check Firebase status
    if (window.firebaseManager) {
        console.log('Firebase Manager exists:', true);
        console.log('Firebase ready:', window.firebaseManager.isFirebaseReady);
        console.log('Using localStorage fallback:', window.firebaseManager.fallbackToLocalStorage);
        
        // Try to load from Firebase
        if (window.firebaseManager.isFirebaseReady) {
            window.firebaseManager.loadData('casa_profile_photo').then(data => {
                console.log('Firebase profile photo data:', data);
            }).catch(err => {
                console.log('Firebase load error:', err);
            });
        }
    } else {
        console.log('Firebase Manager exists:', false);
    }
    
    // Try to refresh
    const result = refreshProfilePhoto();
    console.log('Refresh result:', result);
    
    // Try Firebase refresh
    if (typeof loadProfileFromFirebase === 'function') {
        loadProfileFromFirebase();
    }
    
    console.log('=== End Debug ===');
};

// Add global function to force Firebase sync
window.forceFirebaseSync = async function() {
    console.log('🔄 Forcing Firebase sync...');
    if (window.firebaseManager && window.firebaseManager.isFirebaseReady) {
        await window.firebaseManager.loadAllDataFromFirebase();
        console.log('✅ Firebase sync complete');
        // Trigger page refresh
        if (typeof updatePageContent === 'function') {
            setTimeout(updatePageContent, 500);
        }
    } else {
        console.log('❌ Firebase not ready for sync');
    }
};

// Add global function to test video loading
window.testVideoGallery = function() {
    console.log('=== Video Gallery Debug ===');
    const adminVideos = JSON.parse(localStorage.getItem('gallery_videos') || '{}');
    console.log('localStorage gallery_videos:', adminVideos);
    
    const videoItems = document.querySelectorAll('.video-item');
    console.log('Video items found on page:', videoItems.length);
    
    const heroVideo = document.querySelector('.hero-video .video-placeholder');
    console.log('Hero video container exists:', !!heroVideo);
    
    if (window.firebaseManager) {
        console.log('Firebase Manager exists:', true);
        console.log('Firebase ready:', window.firebaseManager.isFirebaseReady);
        
        if (window.firebaseManager.isFirebaseReady) {
            window.firebaseManager.loadData('gallery_videos').then(data => {
                console.log('Firebase video data:', data);
            }).catch(err => {
                console.log('Firebase load error:', err);
            });
        }
    } else {
        console.log('Firebase Manager exists:', false);
    }
    
    // Force video gallery update
    console.log('Forcing video gallery update...');
    updateVideoGallery([], false); // Allow Firebase loading
    updateHeroVideo(false); // Allow Firebase loading
    
    console.log('=== End Video Debug ===');
};

// Add simple video status check
window.checkVideos = function() {
    console.log('=== Quick Video Check ===');
    const videos = JSON.parse(localStorage.getItem('gallery_videos') || '{}');
    console.log('Videos in localStorage:', videos);
    
    const videoElements = document.querySelectorAll('.video-item video, .hero-video video');
    console.log(`Found ${videoElements.length} video elements on page`);
    
    videoElements.forEach((vid, i) => {
        console.log(`Video ${i + 1}: ${vid.src ? 'HAS SRC' : 'NO SRC'}`);
    });
    
    console.log('=== End Video Check ===');
};

// Make immediate video update available globally for manual testing
window.forceImmediateVideoUpdate = forceImmediateVideoUpdate;

// Add global function to refresh videos
window.refreshVideos = function() {
    console.log('🖪 Refreshing all videos...');
    
    // Reset updating flags to allow fresh updates
    videoGalleryUpdating = false;
    heroVideoUpdating = false;
    
    updateVideoGallery([], false); // Allow Firebase loading
    updateHeroVideo(false); // Allow Firebase loading
    console.log('✅ Video refresh complete');
};

// Add function to force video reload from Firebase
window.forceVideoSync = async function() {
    console.log('🔄 Forcing video sync from Firebase...');
    
    if (!window.firebaseManager || !window.firebaseManager.isFirebaseReady) {
        console.log('❌ Firebase not ready for video sync');
        return;
    }
    
    try {
        // Load videos directly from Firebase
        const firebaseVideos = await window.firebaseManager.loadData('gallery_videos');
        console.log('📹 Firebase videos loaded:', firebaseVideos);
        
        if (firebaseVideos && typeof firebaseVideos === 'object') {
            // Update localStorage with Firebase data
            localStorage.setItem('gallery_videos', JSON.stringify(firebaseVideos));
            console.log('✅ Videos synced to localStorage');
            
            // Force video refresh
            videoGalleryUpdating = false;
            heroVideoUpdating = false;
            updateVideoGallery([], true); // Skip Firebase loading since we just loaded
            updateHeroVideo(true); // Skip Firebase loading since we just loaded
            
            console.log('✅ Video sync complete!');
        } else {
            console.log('⚠️ No videos found in Firebase');
        }
    } catch (error) {
        console.error('❌ Video sync failed:', error);
    }
};

// Add global function to test business information
window.testBusinessInfo = function() {
    console.log('=== Business Info Debug ===');
    
    const adminBusiness = JSON.parse(localStorage.getItem('businessInfo') || '{}');
    console.log('localStorage businessInfo:', adminBusiness);
    
    const adminContact = JSON.parse(localStorage.getItem('contactInfo') || '{}');
    console.log('localStorage contactInfo:', adminContact);
    
    const nameElements = document.querySelectorAll('.business-name, [data-business="name"]');
    console.log(`Found ${nameElements.length} business name elements:`);
    nameElements.forEach((el, i) => {
        console.log(`  ${i + 1}: ${el.tagName}.${el.className} = "${el.textContent}"`);
    });
    
    const phoneElements = document.querySelectorAll('.phone-number, [href^="tel:"]');
    console.log(`Found ${phoneElements.length} phone elements:`);
    phoneElements.forEach((el, i) => {
        console.log(`  ${i + 1}: ${el.tagName}.${el.className} = "${el.textContent}"`);
    });
    
    const emailElements = document.querySelectorAll('.email-address, [href^="mailto:"]');
    console.log(`Found ${emailElements.length} email elements:`);
    emailElements.forEach((el, i) => {
        console.log(`  ${i + 1}: ${el.tagName}.${el.className} = "${el.textContent}"`);
    });
    
    if (window.firebaseManager) {
        console.log('Firebase Manager exists:', true);
        console.log('Firebase ready:', window.firebaseManager.isFirebaseReady);
        
        if (window.firebaseManager.isFirebaseReady) {
            window.firebaseManager.loadData('businessInfo').then(data => {
                console.log('Firebase business data:', data);
            }).catch(err => {
                console.log('Firebase load error:', err);
            });
        }
    } else {
        console.log('Firebase Manager exists:', false);
    }
    
    // Force business info update
    console.log('Forcing business info update...');
    updateBusinessInformation({ name: 'Casa Madera', description: 'Expert carpentry services in The Bahamas' });
    
    console.log('=== End Business Debug ===');
};

// Add global function to refresh business info
window.refreshBusinessInfo = function() {
    console.log('📊 Refreshing business information...');
    updateBusinessInformation({ name: 'Casa Madera', description: 'Expert carpentry services in The Bahamas' });
    console.log('✅ Business refresh complete');
};

// Add global function to test gallery loading
window.testGallery = function() {
    console.log('=== Gallery Debug ===');
    
    const furnitureGallery = JSON.parse(localStorage.getItem('gallery_furniture') || '{}');
    const renovationGallery = JSON.parse(localStorage.getItem('gallery_renovation') || '{}');
    const customGallery = JSON.parse(localStorage.getItem('gallery_custom') || '{}');
    
    console.log('localStorage gallery data:');
    console.log('  gallery_furniture:', furnitureGallery);
    console.log('  gallery_renovation:', renovationGallery);
    console.log('  gallery_custom:', customGallery);
    
    const gallerySpots = document.querySelectorAll('[id^="gallery-spot-"]');
    console.log(`Found ${gallerySpots.length} gallery spots on page`);
    
    if (window.firebaseManager) {
        console.log('Firebase Manager exists:', true);
        console.log('Firebase ready:', window.firebaseManager.isFirebaseReady);
        
        if (window.firebaseManager.isFirebaseReady) {
            ['furniture', 'renovation', 'custom'].forEach(category => {
                window.firebaseManager.loadData(`gallery_${category}`).then(data => {
                    console.log(`Firebase gallery_${category} data:`, data);
                }).catch(err => {
                    console.log(`Firebase gallery_${category} load error:`, err);
                });
            });
        }
    } else {
        console.log('Firebase Manager exists:', false);
    }
    
    // Force gallery update
    console.log('Forcing gallery update...');
    updateGalleryFromAdmin();
    loadGalleryImagesFromFirebase();
    
    console.log('=== End Gallery Debug ===');
};

// Add global function to refresh gallery
window.refreshGallery = function() {
    console.log('🖼️ Refreshing gallery...');
    loadGalleryImagesFromFirebase();
    updateGalleryFromAdmin();
    console.log('✅ Gallery refresh complete');
};

// Add global function to test admin credentials
window.testAdminCredentials = function() {
    console.log('=== Admin Credentials Debug ===');
    
    const localCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
    console.log('localStorage adminCredentials:', localCredentials);
    
    if (window.firebaseManager) {
        console.log('Firebase Manager exists:', true);
        console.log('Firebase ready:', window.firebaseManager.isFirebaseReady);
        
        if (window.firebaseManager.isFirebaseReady) {
            window.firebaseManager.loadData('adminCredentials').then(data => {
                console.log('Firebase adminCredentials:', data);
            }).catch(err => {
                console.log('Firebase credentials load error:', err);
            });
        }
    } else {
        console.log('Firebase Manager exists:', false);
    }
    
    console.log('=== End Admin Credentials Debug ===');
};

// Load gallery images from Firebase and sync to localStorage
async function loadGalleryImagesFromFirebase() {
    if (!window.firebaseManager || !window.firebaseManager.isFirebaseReady) {
        return;
    }
    
    const galleryCategories = ['furniture', 'renovation', 'custom'];
    
    for (const category of galleryCategories) {
        try {
            const firebaseGallery = await window.firebaseManager.loadData(`gallery_${category}`);
            if (firebaseGallery && typeof firebaseGallery === 'object') {
                console.log(`🖼️ Loading ${category} gallery from Firebase:`, firebaseGallery);
                
                // Update localStorage with Firebase data
                const localGallery = JSON.parse(localStorage.getItem(`gallery_${category}`) || '{}');
                const combinedGallery = { ...localGallery, ...firebaseGallery };
                localStorage.setItem(`gallery_${category}`, JSON.stringify(combinedGallery));
                
                console.log(`✅ ${category} gallery synced from Firebase`);
            }
        } catch (error) {
            console.log(`⚠️ Could not load ${category} gallery from Firebase:`, error);
        }
    }
}

// Update main website gallery spots with admin uploaded images
function updateGalleryFromAdmin() {
    console.log('🖼️ Updating main gallery with admin images...');
    
    // Load admin gallery data
    const furnitureGallery = JSON.parse(localStorage.getItem('gallery_furniture') || '{}');
    const renovationGallery = JSON.parse(localStorage.getItem('gallery_renovation') || '{}');
    const customGallery = JSON.parse(localStorage.getItem('gallery_custom') || '{}');
    
    // Load custom labels from admin panel
    const furnitureLabels = JSON.parse(localStorage.getItem('gallery_furniture_labels') || '{}');
    const renovationLabels = JSON.parse(localStorage.getItem('gallery_renovation_labels') || '{}');
    const customLabels = JSON.parse(localStorage.getItem('gallery_custom_labels') || '{}');
    
    console.log('Admin gallery data:');
    console.log('  Furniture:', furnitureGallery);
    console.log('  Renovation:', renovationGallery);
    console.log('  Custom:', customGallery);
    console.log('Admin labels:');
    console.log('  Furniture labels:', furnitureLabels);
    console.log('  Renovation labels:', renovationLabels);
    console.log('  Custom labels:', customLabels);
    
    // Combine all images into a single pool
    const allImages = [];
    
    // Add furniture images with custom labels
    Object.keys(furnitureGallery).forEach(key => {
        if (furnitureGallery[key]) {
            const customLabel = furnitureLabels[key] || 'Custom Furniture Project';
            allImages.push({
                src: furnitureGallery[key],
                category: 'furniture',
                title: customLabel
            });
        }
    });
    
    // Add renovation images with custom labels
    Object.keys(renovationGallery).forEach(key => {
        if (renovationGallery[key]) {
            const customLabel = renovationLabels[key] || 'Home Renovation Project';
            allImages.push({
                src: renovationGallery[key],
                category: 'renovation', 
                title: customLabel
            });
        }
    });
    
    // Add custom work images with custom labels
    Object.keys(customGallery).forEach(key => {
        if (customGallery[key]) {
            const customLabel = customLabels[key] || 'Custom Work Project';
            allImages.push({
                src: customGallery[key],
                category: 'custom',
                title: customLabel
            });
        }
    });
    
    console.log(`Found ${allImages.length} admin images to display`);
    
    // Update gallery spots with admin images
    for (let i = 1; i <= 6; i++) {
        const gallerySpot = document.getElementById(`gallery-spot-${i}`);
        if (gallerySpot && allImages[i - 1]) {
            const image = allImages[i - 1];
            console.log(`Updating gallery-spot-${i} with ${image.category} image`);
            
            // Update data-category attribute
            gallerySpot.setAttribute('data-category', image.category);
            
            // Replace placeholder with actual image and title overlay
            gallerySpot.innerHTML = `
                <div style="position: relative; width: 100%; height: 100%;">
                    <img src="${image.src}" alt="${image.title}" 
                         style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;"
                         class="gallery-image">
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 0 0 8px 8px;">
                        <h4 style="margin: 0; font-size: 0.95rem; font-weight: 600;">${image.title}</h4>
                    </div>
                </div>
                <div class="gallery-overlay">
                    <i class="fas fa-expand"></i>
                </div>
            `;
        }
    }
    
    console.log('✅ Main gallery updated with admin images');
}

// Check for profile photo updates periodically
function checkForProfileUpdates() {
    // Check if profile was updated in the last few seconds
    const lastUpdate = localStorage.getItem('casa_profile_photo_updated');
    if (lastUpdate) {
        const timeSinceUpdate = Date.now() - parseInt(lastUpdate);
        if (timeSinceUpdate < 5000) { // 5 seconds
            refreshProfilePhoto();
            localStorage.removeItem('casa_profile_photo_updated');
        }
    }
    
    // Also try to load from Firebase if available
    if (window.firebaseManager && window.firebaseManager.isFirebaseReady) {
        loadProfileFromFirebase();
    }
    
    // Set up periodic check
    setTimeout(checkForProfileUpdates, 1000);
}

// Load profile photo from Firebase
async function loadProfileFromFirebase() {
    try {
        if (window.firebaseManager && window.firebaseManager.isFirebaseReady) {
            const profilePhotoUrl = await window.firebaseManager.loadData('casa_profile_photo');
            if (profilePhotoUrl && typeof profilePhotoUrl === 'string') {
                console.log('🖼️ Loading profile photo from Firebase:', profilePhotoUrl);
                const profileContainer = document.querySelector('.profile-image-container');
                if (profileContainer && profilePhotoUrl !== localStorage.getItem('casa_profile_photo')) {
                    profileContainer.innerHTML = `
                        <img src="${profilePhotoUrl}" alt="Profile Photo" 
                             style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" 
                             class="profile-image">
                    `;
                    // Update localStorage with Firebase data
                    localStorage.setItem('casa_profile_photo', profilePhotoUrl);
                    console.log('✅ Profile photo loaded from Firebase');
                }
            }
        }
    } catch (error) {
        console.log('⚠️ Could not load profile from Firebase:', error);
    }
}

// Load featured video from Firebase
async function loadFeaturedVideoFromFirebase() {
    if (!window.firebaseManager || !window.firebaseManager.isFirebaseReady) {
        console.log('Firebase not ready, skipping featured video loading');
        return;
    }
    
    try {
        const featuredVideo = await window.firebaseManager.loadData('casa_featured_video');
        if (featuredVideo) {
            localStorage.setItem('casa_featured_video', featuredVideo);
            console.log('✅ Featured video loaded from Firebase');
        }
    } catch (error) {
        console.log('⚠️ Could not load featured video from Firebase:', error);
    }
}

// Force immediate video update on page load
function forceImmediateVideoUpdate() {
    console.log('🚀 Force immediate video update...');
    
    const adminVideos = JSON.parse(localStorage.getItem('gallery_videos') || '{}');
    const videoLabels = JSON.parse(localStorage.getItem('gallery_videos_labels') || '{}');
    console.log('Admin videos found:', adminVideos);
    console.log('Video labels found:', videoLabels);
    
    if (Object.keys(adminVideos).length === 0) {
        console.log('No admin videos found, skipping immediate update');
        return;
    }
    
    // Direct replacement of video placeholders
    for (let i = 1; i <= 3; i++) {
        const videoItem = document.querySelector(`.video-item:nth-child(${i}) .video-placeholder`);
        const adminVideo = adminVideos[`spot${i}`];
        
        if (videoItem && adminVideo) {
            console.log(`🎬 Direct replacing video spot ${i}`);
            
            // Get custom label or use default
            const customLabel = videoLabels[`spot${i}`] || `Project Video ${i}`;
            
            // Create direct video replacement
            const videoContainer = document.createElement('div');
            videoContainer.style.cssText = 'position: relative; width: 100%; height: 200px; cursor: pointer;';
            
            const videoElement = document.createElement('video');
            videoElement.src = adminVideo;
            videoElement.style.cssText = 'width: 100%; height: 200px; object-fit: cover; border-radius: 8px;';
            videoElement.muted = true;
            videoElement.preload = 'metadata';
            videoElement.setAttribute('data-label', customLabel); // Store custom label
            
            const playOverlay = document.createElement('div');
            playOverlay.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); cursor: pointer; z-index: 10;';
            playOverlay.innerHTML = '<i class="fas fa-play-circle"></i>';
            
            const videoTitle = document.createElement('div');
            videoTitle.style.cssText = 'position: absolute; bottom: 10px; left: 10px; right: 10px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);';
            videoTitle.innerHTML = `<h4 style="margin: 0; font-size: 1.1rem;">${customLabel}</h4>`;
            
            videoContainer.appendChild(videoElement);
            videoContainer.appendChild(playOverlay);
            videoContainer.appendChild(videoTitle);
            
            // Don't add click handlers here - let script.js handle all video clicks uniformly
            
            // Replace the content
            videoItem.innerHTML = '';
            videoItem.appendChild(videoContainer);
        }
    }
    
    // Update hero video with dedicated featured video
    const heroVideoContainer = document.querySelector('.hero-video .video-placeholder');
    const featuredVideo = localStorage.getItem('casa_featured_video');
    
    if (heroVideoContainer && featuredVideo) {
        console.log('🎬 Direct replacing hero video with featured video');
        // Create hero video elements
        const heroContainer = document.createElement('div');
        heroContainer.style.cssText = 'position: relative; width: 100%; height: 100%; cursor: pointer; z-index: 1;';
        
        const heroVideoElement = document.createElement('video');
        heroVideoElement.src = featuredVideo;
        heroVideoElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 8px;';
        heroVideoElement.muted = true;
        heroVideoElement.preload = 'metadata';
        
        const heroPlayOverlay = document.createElement('div');
        heroPlayOverlay.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); cursor: pointer; z-index: 2;';
        heroPlayOverlay.innerHTML = '<i class="fas fa-play-circle"></i>';
        
        const heroVideoTitle = document.createElement('div');
        heroVideoTitle.style.cssText = 'position: absolute; bottom: 20px; left: 20px; right: 20px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); text-align: center;';
        heroVideoTitle.innerHTML = '<p style="margin: 0; font-size: 1.2rem;">Featured Work Video</p>';
        
        heroContainer.appendChild(heroVideoElement);
        heroContainer.appendChild(heroPlayOverlay);
        heroContainer.appendChild(heroVideoTitle);
        
        // Add click event listener
        const openHeroVideoLightbox = () => {
            console.log('Opening hero video in lightbox');
            if (typeof window.openLightbox === 'function') {
                window.openLightbox(featuredVideo, 'Featured Work Video', 'video');
            } else {
                console.error('openLightbox function not available');
                // Fallback - try to play inline
                if (heroVideoElement.paused) {
                    heroVideoElement.play();
                    heroVideoElement.controls = true;
                }
            }
        };
        
        heroContainer.addEventListener('click', openHeroVideoLightbox);
        heroPlayOverlay.addEventListener('click', openHeroVideoLightbox);
        
        // Replace the content
        heroVideoContainer.innerHTML = '';
        heroVideoContainer.appendChild(heroContainer);
    } else if (heroVideoContainer && adminVideos['spot1']) {
        // Fallback to gallery video if no featured video is available
        console.log('🎬 No featured video found, using gallery video as fallback');
        const heroVideo = adminVideos['spot1'];
        
        const heroContainer = document.createElement('div');
        heroContainer.style.cssText = 'position: relative; width: 100%; height: 100%; cursor: pointer; z-index: 1;';
        
        const heroVideoElement = document.createElement('video');
        heroVideoElement.src = heroVideo;
        heroVideoElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 8px;';
        heroVideoElement.muted = true;
        heroVideoElement.preload = 'metadata';
        
        const heroPlayOverlay = document.createElement('div');
        heroPlayOverlay.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); cursor: pointer; z-index: 2;';
        heroPlayOverlay.innerHTML = '<i class="fas fa-play-circle"></i>';
        
        const heroVideoTitle = document.createElement('div');
        heroVideoTitle.style.cssText = 'position: absolute; bottom: 20px; left: 20px; right: 20px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); text-align: center;';
        heroVideoTitle.innerHTML = '<p style="margin: 0; font-size: 1.2rem;">Featured Work Video</p>';
        
        heroContainer.appendChild(heroVideoElement);
        heroContainer.appendChild(heroPlayOverlay);
        heroContainer.appendChild(heroVideoTitle);
        
        const openHeroVideoLightbox = () => {
            console.log('Opening hero video in lightbox');
            if (typeof window.openLightbox === 'function') {
                window.openLightbox(heroVideo, 'Featured Work Video', 'video');
            } else {
                console.error('openLightbox function not available');
                if (heroVideoElement.paused) {
                    heroVideoElement.play();
                    heroVideoElement.controls = true;
                }
            }
        };
        
        heroContainer.addEventListener('click', openHeroVideoLightbox);
        heroPlayOverlay.addEventListener('click', openHeroVideoLightbox);
        
        heroVideoContainer.innerHTML = '';
        heroVideoContainer.appendChild(heroContainer);
    }
    
    console.log('🚀 Immediate video update complete');
    
    // Video click handlers are managed by data-loader, no need to reinitialize
}

// Load all labels from Firebase on startup
async function loadLabelsFromFirebase() {
    if (!window.firebaseManager || !window.firebaseManager.isFirebaseReady) {
        console.log('Firebase not ready, skipping label loading');
        return;
    }
    
    try {
        console.log('🏷️ Loading labels from Firebase...');
        
        // Load all category labels
        const categories = ['furniture', 'renovation', 'custom'];
        for (const category of categories) {
            const labels = await window.firebaseManager.loadData(`gallery_${category}_labels`);
            if (labels) {
                localStorage.setItem(`gallery_${category}_labels`, JSON.stringify(labels));
                console.log(`✅ Loaded ${category} labels from Firebase`);
            }
        }
        
        // Load video labels
        const videoLabels = await window.firebaseManager.loadData('gallery_videos_labels');
        if (videoLabels) {
            localStorage.setItem('gallery_videos_labels', JSON.stringify(videoLabels));
            console.log('✅ Loaded video labels from Firebase');
        }
        
        console.log('✅ All labels loaded from Firebase');
        
    } catch (error) {
        console.error('Error loading labels from Firebase:', error);
    }
}

// Debugging functions for videos
window.checkVideos = function() {
    console.log('🔍 Video Debug Information:');
    
    const adminVideos = JSON.parse(localStorage.getItem('gallery_videos') || '{}');
    const videoLabels = JSON.parse(localStorage.getItem('gallery_videos_labels') || '{}');
    
    console.log('📼 Admin Videos:', adminVideos);
    console.log('🏷️ Video Labels:', videoLabels);
    
    const videoItems = document.querySelectorAll('.video-item');
    console.log(`🎬 Found ${videoItems.length} video items on page`);
    
    videoItems.forEach((item, index) => {
        const placeholder = item.querySelector('.video-placeholder');
        const processedContainer = item.querySelector('[data-video-processed="true"]');
        const video = item.querySelector('video');
        
        console.log(`Video ${index + 1}:`);
        console.log('  - Has placeholder:', !!placeholder);
        console.log('  - Processed by data-loader:', !!processedContainer);
        console.log('  - Has video element:', !!video);
        if (video) {
            console.log('  - Video src:', video.src);
            console.log('  - Video label:', video.dataset.label);
        }
    });
};

window.forceVideoSync = function() {
    console.log('🔄 Force syncing videos from Firebase...');
    loadLabelsFromFirebase().then(() => {
        forceImmediateVideoUpdate();
    });
};

window.refreshVideos = function() {
    console.log('🔄 Refreshing all videos...');
    forceImmediateVideoUpdate();
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updatePageContent();
        // Process videos immediately
        forceImmediateVideoUpdate();
        // Load labels from Firebase
        setTimeout(loadLabelsFromFirebase, 1500);
        // Load featured video from Firebase
        setTimeout(loadFeaturedVideoFromFirebase, 1200);
        // Force immediate video update - run very early
        setTimeout(forceImmediateVideoUpdate, 100);
        // Run again to ensure it worked
        setTimeout(forceImmediateVideoUpdate, 800);
        // Also try to refresh profile photo immediately
        setTimeout(refreshProfilePhoto, 500);
        // Start checking for updates
        checkForProfileUpdates();
    });
} else {
    updatePageContent();
    // Process videos immediately
    forceImmediateVideoUpdate();
    // Load labels from Firebase
    setTimeout(loadLabelsFromFirebase, 1500);
    // Load featured video from Firebase
    setTimeout(loadFeaturedVideoFromFirebase, 1200);
    // Force immediate video update - run very early
    setTimeout(forceImmediateVideoUpdate, 100);
    // Run again to ensure it worked
    setTimeout(forceImmediateVideoUpdate, 800);
    // Also try to refresh profile photo immediately
    setTimeout(refreshProfilePhoto, 500);
    // Start checking for updates
    checkForProfileUpdates();
}
