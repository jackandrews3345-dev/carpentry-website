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

        // Update social media links with delay to prevent conflicts
        setTimeout(() => {
            updateSocialMediaIcons(social);
        }, 500);

        // Update business information
        if (business.name) {
            const nameElements = document.querySelectorAll('.business-name, [data-business="name"]');
            nameElements.forEach(el => el.textContent = business.name);
        }

        if (business.description) {
            const descElements = document.querySelectorAll('.business-description');
            descElements.forEach(el => el.textContent = business.description);
        }

        // Update profile information
        updateProfilePhoto(profile);

        // Update gallery
        updateGalleryDisplay(gallery);
        
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
function updateVideoGallery(videos) {
    console.log('📹 Updating video gallery...');
    
    // Load admin panel videos from localStorage
    let adminVideos = JSON.parse(localStorage.getItem('gallery_videos') || '{}');
    
    // Try to load from Firebase if available
    if (window.firebaseManager && window.firebaseManager.isFirebaseReady) {
        window.firebaseManager.loadData('gallery_videos').then(firebaseVideos => {
            if (firebaseVideos && typeof firebaseVideos === 'object') {
                console.log('📹 Loading videos from Firebase:', firebaseVideos);
                adminVideos = { ...adminVideos, ...firebaseVideos };
                // Update localStorage with Firebase data
                localStorage.setItem('gallery_videos', JSON.stringify(adminVideos));
                // Trigger another update with Firebase data
                setTimeout(() => updateVideoGallery(videos), 100);
            }
        }).catch(error => {
            console.log('⚠️ Could not load videos from Firebase:', error);
        });
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
            // Replace placeholder with video element
            const videoElement = document.createElement('video');
            videoElement.src = adminVideo;
            videoElement.style.cssText = 'width: 100%; height: 200px; object-fit: cover; border-radius: 8px; cursor: pointer;';
            videoElement.muted = true;
            videoElement.preload = 'metadata';
            
            // Create video container with play overlay
            const videoContainer = document.createElement('div');
            videoContainer.style.cssText = 'position: relative; width: 100%; height: 200px;';
            
            const playOverlay = document.createElement('div');
            playOverlay.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); cursor: pointer; z-index: 10;';
            playOverlay.innerHTML = '<i class="fas fa-play-circle"></i>';
            
            const videoTitle = document.createElement('div');
            videoTitle.style.cssText = 'position: absolute; bottom: 10px; left: 10px; right: 10px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);';
            videoTitle.innerHTML = `<h4 style="margin: 0; font-size: 1.1rem;">Project Video ${i}</h4>`;
            
            videoContainer.appendChild(videoElement);
            videoContainer.appendChild(playOverlay);
            videoContainer.appendChild(videoTitle);
            
            // Replace placeholder
            placeholder.innerHTML = '';
            placeholder.appendChild(videoContainer);
            
            // Add click handlers for video playback
            const playVideo = () => {
                if (videoElement.paused) {
                    videoElement.play();
                    playOverlay.style.display = 'none';
                    videoElement.controls = true;
                } else {
                    videoElement.pause();
                    playOverlay.style.display = 'block';
                    videoElement.controls = false;
                }
            };
            
            videoElement.onclick = playVideo;
            playOverlay.onclick = playVideo;
            
            // Show play overlay when video ends
            videoElement.onended = () => {
                playOverlay.style.display = 'block';
                videoElement.controls = false;
            };
            
            // Hide play overlay on play, show on pause
            videoElement.onplay = () => {
                playOverlay.style.display = 'none';
            };
            
            videoElement.onpause = () => {
                if (!videoElement.ended) {
                    playOverlay.style.display = 'block';
                }
            };
            
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
    
    console.log('📹 Video gallery update complete');
}

// Update hero section video
function updateHeroVideo() {
    console.log('🎬 Updating hero section video...');
    
    // Load admin panel videos from localStorage
    let adminVideos = JSON.parse(localStorage.getItem('gallery_videos') || '{}');
    
    // Try to load from Firebase if available
    if (window.firebaseManager && window.firebaseManager.isFirebaseReady) {
        window.firebaseManager.loadData('gallery_videos').then(firebaseVideos => {
            if (firebaseVideos && typeof firebaseVideos === 'object') {
                console.log('🎬 Loading hero videos from Firebase:', firebaseVideos);
                adminVideos = { ...adminVideos, ...firebaseVideos };
                // Update localStorage with Firebase data
                localStorage.setItem('gallery_videos', JSON.stringify(adminVideos));
                // Trigger another update with Firebase data
                setTimeout(() => updateHeroVideo(), 100);
            }
        }).catch(error => {
            console.log('⚠️ Could not load hero videos from Firebase:', error);
        });
    }
    
    const heroVideoContainer = document.querySelector('.hero-video .video-placeholder');
    
    if (!heroVideoContainer) {
        console.log('Hero video container not found');
        return;
    }
    
    // Check if we have a featured video (use spot1 as hero video)
    const heroVideo = adminVideos['spot1'];
    
    if (heroVideo) {
        console.log('🎬 Loading hero video from admin panel');
        
        // Create video element
        const videoElement = document.createElement('video');
        videoElement.src = heroVideo;
        videoElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 8px; cursor: pointer;';
        videoElement.muted = true;
        videoElement.preload = 'metadata';
        
        // Create video container with play overlay
        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = 'position: relative; width: 100%; height: 100%;';
        
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
        
        // Add click handlers for video playback
        const playVideo = () => {
            if (videoElement.paused) {
                videoElement.play();
                playOverlay.style.display = 'none';
                videoElement.controls = true;
            } else {
                videoElement.pause();
                playOverlay.style.display = 'block';
                videoElement.controls = false;
            }
        };
        
        videoElement.onclick = playVideo;
        playOverlay.onclick = playVideo;
        
        // Show play overlay when video ends
        videoElement.onended = () => {
            playOverlay.style.display = 'block';
            videoElement.controls = false;
        };
        
        // Hide play overlay on play, show on pause
        videoElement.onplay = () => {
            playOverlay.style.display = 'none';
        };
        
        videoElement.onpause = () => {
            if (!videoElement.ended) {
                playOverlay.style.display = 'block';
            }
        };
    } else {
        console.log('No hero video found in admin panel');
        // Keep original placeholder styling
    }
    
    console.log('🎬 Hero video update complete');
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
    updateVideoGallery([]);
    updateHeroVideo();
    
    console.log('=== End Video Debug ===');
};

// Add global function to refresh videos
window.refreshVideos = function() {
    console.log('🖪 Refreshing all videos...');
    updateVideoGallery([]);
    updateHeroVideo();
    console.log('✅ Video refresh complete');
};

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

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updatePageContent();
        // Also try to refresh profile photo immediately
        setTimeout(refreshProfilePhoto, 500);
        // Start checking for updates
        checkForProfileUpdates();
    });
} else {
    updatePageContent();
    // Also try to refresh profile photo immediately
    setTimeout(refreshProfilePhoto, 500);
    // Start checking for updates
    checkForProfileUpdates();
}
