// ===== ADMIN INTEGRATION =====
// Load gallery images and settings from admin panel
function loadAdminSettings() {
    console.log('Loading admin settings...');
    
    // Load gallery images
    loadGalleryImages();
    
    // Load business info
    loadBusinessInfo();
    
    // Set up quote form with admin email
    setupQuoteForm();
}

function loadGalleryImages() {
    // Load categorized gallery data
    const furnitureData = JSON.parse(localStorage.getItem('gallery_furniture') || '{}');
    const renovationData = JSON.parse(localStorage.getItem('gallery_renovation') || '{}');
    const customData = JSON.parse(localStorage.getItem('gallery_custom') || '{}');
    const videoData = JSON.parse(localStorage.getItem('gallery_videos') || '{}');
    
    // Update furniture images (spots 1-2)
    for (let i = 1; i <= 2; i++) {
        const spotElement = document.getElementById(`gallery-spot-${i}`);
        if (spotElement && furnitureData[`spot${i}`]) {
            spotElement.innerHTML = `
                <img src="${furnitureData[`spot${i}`]}" alt="Custom Furniture ${i}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                <div class="gallery-overlay">
                    <i class="fas fa-expand"></i>
                </div>
            `;
        }
    }
    
    // Update renovation images (spots 2, 5)
    const renovationSpots = [2, 5];
    renovationSpots.forEach((spot, index) => {
        const spotElement = document.getElementById(`gallery-spot-${spot}`);
        if (spotElement && renovationData[`spot${index + 1}`]) {
            spotElement.innerHTML = `
                <img src="${renovationData[`spot${index + 1}`]}" alt="Renovation ${index + 1}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                <div class="gallery-overlay">
                    <i class="fas fa-expand"></i>
                </div>
            `;
        }
    });
    
    // Update custom work images (spots 3, 6)
    const customSpots = [3, 6];
    customSpots.forEach((spot, index) => {
        const spotElement = document.getElementById(`gallery-spot-${spot}`);
        if (spotElement && customData[`spot${index + 1}`]) {
            spotElement.innerHTML = `
                <img src="${customData[`spot${index + 1}`]}" alt="Custom Work ${index + 1}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                <div class="gallery-overlay">
                    <i class="fas fa-expand"></i>
                </div>
            `;
        }
    });
    
    // Update video section
    loadGalleryVideos(videoData);
}

function loadGalleryVideos(videoData) {
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach((item, index) => {
        if (videoData[`spot${index + 1}`]) {
            item.innerHTML = `
                <video style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;" muted>
                    <source src="${videoData[`spot${index + 1}`]}" type="video/mp4">
                </video>
                <div class="gallery-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.3s;">
                    <i class="fas fa-play" style="color: white; font-size: 2rem;"></i>
                </div>
            `;
            
            // Add hover effect
            item.addEventListener('mouseenter', function() {
                const overlay = this.querySelector('.gallery-overlay');
                if (overlay) overlay.style.opacity = '1';
            });
            
            item.addEventListener('mouseleave', function() {
                const overlay = this.querySelector('.gallery-overlay');
                if (overlay) overlay.style.opacity = '0';
            });
        }
    });
}

function loadBusinessInfo() {
    const businessInfo = JSON.parse(localStorage.getItem('businessInfo') || '{}');
    const socialMedia = JSON.parse(localStorage.getItem('socialMedia') || '{}');
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo') || '{}');
    
    // Update business name
    if (businessInfo.name) {
        const businessNameElements = document.querySelectorAll('[data-business="name"]');
        businessNameElements.forEach(el => {
            if (el.tagName === 'H1') {
                el.textContent = `Quality Carpentry in The Bahamas - ${businessInfo.name}`;
            } else {
                el.textContent = businessInfo.name;
            }
        });
        
        // Update footer business name
        const footerTitle = document.querySelector('.footer-section h3');
        if (footerTitle) footerTitle.textContent = businessInfo.name;
    }
    
    // Update contact info
    if (businessInfo.phone) {
        const phoneElements = document.querySelectorAll('.phone-number');
        phoneElements.forEach(el => {
            el.textContent = businessInfo.phone;
            if (el.tagName === 'A') {
                el.href = `tel:${businessInfo.phone.replace(/[^0-9+]/g, '')}`;
            }
        });
    }
    
    if (businessInfo.email) {
        const emailElements = document.querySelectorAll('.email-address');
        emailElements.forEach(el => {
            el.textContent = businessInfo.email;
            if (el.tagName === 'A') {
                el.href = `mailto:${businessInfo.email}`;
            }
        });
    }
    
    // Update location info
    if (contactInfo.address) {
        const locationElements = document.querySelectorAll('.business-location');
        locationElements.forEach(el => {
            el.innerHTML = contactInfo.address.replace(/\n/g, '<br>');
        });
    }
    
    // Update social media links
    updateSocialMediaLinks(socialMedia);
}

function updateSocialMediaLinks(socialMedia) {
    const socialContainer = document.getElementById('social-media-container');
    if (!socialContainer) return;
    
    const socialPlatforms = [
        { key: 'facebook', icon: 'fab fa-facebook-f', name: 'Facebook' },
        { key: 'instagram', icon: 'fab fa-instagram', name: 'Instagram' },
        { key: 'whatsapp', icon: 'fab fa-whatsapp', name: 'WhatsApp', urlPrefix: 'https://wa.me/' },
        { key: 'youtube', icon: 'fab fa-youtube', name: 'YouTube' }
    ];
    
    socialContainer.innerHTML = '';
    
    socialPlatforms.forEach(platform => {
        if (socialMedia[platform.key]) {
            const link = document.createElement('a');
            let url = socialMedia[platform.key];
            
            if (platform.urlPrefix && !url.startsWith('http')) {
                url = platform.urlPrefix + url.replace(/[^0-9]/g, '');
            }
            
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.innerHTML = `<i class="${platform.icon}"></i>`;
            link.title = `Follow us on ${platform.name}`;
            
            socialContainer.appendChild(link);
        }
    });
}

function setupQuoteForm() {
    const quoteSettings = JSON.parse(localStorage.getItem('quoteSettings') || '{}');
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Add timestamp and quote email
            data.timestamp = new Date().toISOString();
            data.quoteEmail = quoteSettings.email || 'No email configured';
            
            console.log('Quote request submitted:', data);
            
            // Show success message
            alert(`Thank you ${data.name}! Your quote request has been submitted. We'll contact you soon at ${data.email}.`);
            
            // Reset form
            contactForm.reset();
            
            // In a real implementation, this would send an email to quoteSettings.email
            // For now, we'll just log it
            if (quoteSettings.email) {
                console.log(`Quote request should be sent to: ${quoteSettings.email}`);
            }
        });
    }
}

// ===== MAIN APP INITIALIZATION =====
// This initialization is handled in the main block below

// ===== MOBILE MENU FUNCTIONALITY =====
function initializeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== GALLERY FILTERING FUNCTIONALITY =====
function initializeGalleryFilter() {
    console.log('Initializing gallery filter...');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    console.log('Found', filterButtons.length, 'filter buttons and', galleryItems.length, 'gallery items');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            console.log('Filter clicked:', filterValue);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                    item.style.transition = 'all 0.3s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Also re-initialize after content loads
    setTimeout(() => {
        const newFilterButtons = document.querySelectorAll('.filter-btn');
        const newGalleryItems = document.querySelectorAll('.gallery-item');
        console.log('Re-checking after delay:', newFilterButtons.length, 'buttons,', newGalleryItems.length, 'items');
    }, 1000);
}

// ===== SIMPLE LIGHTBOX FUNCTIONALITY =====
function initializeLightbox() {
    console.log('Initializing lightbox...');
    
    // Get lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (!lightbox || !lightboxImg || !lightboxVideo || !lightboxClose) {
        console.error('Lightbox elements not found!');
        return;
    }
    
    console.log('Lightbox elements found, setting up functionality...');
    
    // Simple function to open lightbox - make globally accessible
    window.openLightbox = function(src, alt, type = 'image') {
        console.log('Opening lightbox with:', src, alt, type);
        
        if (type === 'video') {
            lightboxImg.style.display = 'none';
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = src;
        } else {
            lightboxVideo.style.display = 'none';
            lightboxImg.style.display = 'block';
            lightboxImg.src = src;
            lightboxImg.alt = alt || 'Gallery Image';
        }
        
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };
    
    // Keep local reference for internal use
    const openLightbox = window.openLightbox;
    
    // Simple function to close lightbox
    function closeLightbox() {
        console.log('Closing lightbox...');
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (lightboxVideo.src) {
            lightboxVideo.pause();
            lightboxVideo.src = '';
        }
    }
    
    // Add close button event
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close when clicking outside
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
    
    // Add click events to gallery items
    setTimeout(() => {
        console.log('Adding click events to gallery items...');
        const galleryItems = document.querySelectorAll('.gallery-item');
        console.log('Found', galleryItems.length, 'gallery items');
        
        galleryItems.forEach((item, index) => {
            // Remove any existing click events
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Add cursor pointer
            newItem.style.cursor = 'pointer';
            
            // Add click event
            newItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Gallery item clicked:', index + 1);
                
                // Check if there's an uploaded image
                const img = newItem.querySelector('img');
                if (img && img.src && !img.src.includes('placeholder')) {
                    openLightbox(img.src, img.alt || `Gallery Image ${index + 1}`, 'image');
                } else {
                    // Show placeholder
                    const placeholderSrc = 'data:image/svg+xml;base64,' + btoa(`
                        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="100%" fill="#007acc"/>
                            <text x="50%" y="45%" font-family="Arial" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">
                                Gallery Spot ${index + 1}
                            </text>
                            <text x="50%" y="55%" font-family="Arial" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">
                                Click here when you upload your photos!
                            </text>
                        </svg>
                    `);
                    openLightbox(placeholderSrc, `Gallery Spot ${index + 1}`, 'image');
                }
            });
        });
        
        // Note: Video click handlers are now managed by data-loader.js for admin uploaded videos
        // This prevents conflicts between placeholder videos and actual uploaded content
        
        console.log('Video click handling delegated to data-loader.js for admin uploaded content');
        
        console.log('Lightbox initialization complete!');
    }, 500); // Small delay to ensure DOM is ready
}

// ===== CONTACT FORM HANDLING =====
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        
        for (let [key, value] of formData.entries()) {
            formObject[key] = value;
        }

        // Validate required fields
        const requiredFields = ['name', 'email', 'message'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = contactForm.querySelector(`[name="${field}"]`);
            if (!formObject[field] || formObject[field].trim() === '') {
                input.style.borderColor = '#dc3545';
                isValid = false;
            } else {
                input.style.borderColor = '#e9ecef';
            }
        });

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInput = contactForm.querySelector('[name="email"]');
        if (formObject.email && !emailRegex.test(formObject.email)) {
            emailInput.style.borderColor = '#dc3545';
            isValid = false;
        }

        if (!isValid) {
            showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Send email to owner
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        sendEmailToOwner(formObject).then(success => {
            if (success) {
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showNotification('Sorry, there was an error sending your message. Please try again or call us directly.', 'error');
            }
            submitButton.textContent = 'Send Message';
            submitButton.disabled = false;
        });
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#e9ecef';
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '#007acc';
        });
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    
    [...navLinks, ...heroButtons].forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== HEADER SCROLL EFFECT =====
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScrollY = currentScrollY;
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .section-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                padding: 15px;
                border-radius: 8px;
                color: white;
                font-family: var(--font-primary);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                transform: translateX(400px);
                transition: transform 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                background: linear-gradient(135deg, #28a745, #20c997);
            }
            
            .notification-error {
                background: linear-gradient(135deg, #dc3545, #e74c3c);
            }
            
            .notification-info {
                background: linear-gradient(135deg, #007acc, #40b5d8);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-icon {
                font-size: 1.2rem;
                font-weight: bold;
            }
            
            .notification-message {
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(styles);
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);

    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== PLACEHOLDER INTERACTION HANDLERS =====
// Hero video placeholder
document.addEventListener('DOMContentLoaded', function() {
    const heroVideoPlaceholder = document.querySelector('.hero .video-placeholder');
    if (heroVideoPlaceholder) {
        heroVideoPlaceholder.addEventListener('click', function() {
            showNotification('Feature video will be displayed here. Upload your carpentry showcase video to this section.', 'info');
        });
    }

    // Map placeholder
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            showNotification('Interactive map of the Bahamas will be displayed here. This will show your service areas across the islands.', 'info');
        });
    }

    // Profile image placeholder
    const profileImagePlaceholder = document.querySelector('.about .image-placeholder');
    if (profileImagePlaceholder) {
        profileImagePlaceholder.addEventListener('click', function() {
            showNotification('Add your professional photo here to personalize your carpentry website.', 'info');
        });
    }
});

// ===== LOADING STATES =====
function setLoadingState(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.style.pointerEvents = 'none';
    } else {
        element.classList.remove('loading');
        element.style.pointerEvents = 'auto';
    }
}

// ===== RESPONSIVE UTILITIES =====
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isDesktop() {
    return window.innerWidth > 1024;
}

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Lazy loading for future image implementation
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Handle escape key for closing modals
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.lightbox[style*="flex"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Handle enter key for button-like elements
    if (e.key === 'Enter') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('gallery-item') || 
            focusedElement.classList.contains('video-item')) {
            focusedElement.click();
        }
    }
});

// Add focus indicators for better accessibility
document.addEventListener('DOMContentLoaded', function() {
    const focusableElements = document.querySelectorAll('.gallery-item, .video-item, .service-card');
    
    focusableElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'button');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error reporting service
});

// ===== BROWSER COMPATIBILITY =====
// Simple polyfill for older browsers
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        let el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// ===== EMAIL FUNCTIONALITY =====
// Send email to owner using selected service
function sendEmailToOwner(formData) {
    return new Promise((resolve) => {
        // Check multiple places for the owner email
        const quoteSettings = JSON.parse(localStorage.getItem('quoteSettings') || '{}');
        const businessInfo = JSON.parse(localStorage.getItem('businessInfo') || '{}');
        const ownerEmail = quoteSettings.email || businessInfo.email || localStorage.getItem('casa_receive_email');
        const emailService = localStorage.getItem('casa_email_service') || 'emailjs';
        
        if (!ownerEmail) {
            // If no owner email is set, show instructions
            showNotification('Please configure your email address in the admin panel under Quote Form Settings or Business Information.', 'error');
            resolve(false);
            return;
        }
        
        // Format email content
        const emailContent = {
            to_email: ownerEmail,
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone || 'Not provided',
            location: formData.location || 'Not provided',
            service: formData.service || 'Not specified',
            budget: formData.budget || 'Not specified',
            message: formData.message,
            subject: 'New Inquiry from Casa Madera Website'
        };
        
        // For demo purposes, simulate email sending
        // In production, you would integrate with actual email services
        setTimeout(() => {
            console.log('Email would be sent to:', ownerEmail);
            console.log('Email content:', emailContent);
            
            // Save inquiry for admin dashboard
            saveInquiry(formData);
            
            resolve(true);
        }, 1500);
    });
}

// Save inquiry to localStorage for admin dashboard
function saveInquiry(formData) {
    const inquiries = JSON.parse(localStorage.getItem('casa_inquiries') || '[]');
    const inquiry = {
        ...formData,
        timestamp: new Date().toISOString(),
        id: 'INQ_' + Date.now()
    };
    inquiries.unshift(inquiry); // Add to beginning of array
    
    // Keep only last 50 inquiries
    if (inquiries.length > 50) {
        inquiries.splice(50);
    }
    
    localStorage.setItem('casa_inquiries', JSON.stringify(inquiries));
}

// ===== ADMIN SYSTEM INTEGRATION =====
// Load content from admin system
function loadAdminContent() {
    // Get admin panel settings
    const businessInfo = JSON.parse(localStorage.getItem('businessInfo') || '{}');
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo') || '{}');
    
    // Update contact information from admin panel
    const phone = businessInfo.phone || localStorage.getItem('casa_contact_phone');
    const email = businessInfo.email || localStorage.getItem('casa_contact_email');
    const location = contactInfo.address || localStorage.getItem('casa_contact_location');
    
    if (phone) {
        const phoneElements = document.querySelectorAll('.phone-number');
        phoneElements.forEach(el => {
            el.textContent = phone;
            if (el.tagName === 'A') {
                el.href = `tel:${phone}`;
            }
        });
    }
    
    if (email) {
        const emailElements = document.querySelectorAll('.email-address');
        emailElements.forEach(el => {
            el.textContent = email;
            if (el.tagName === 'A') {
                el.href = `mailto:${email}`;
            }
        });
    }
    
    if (location) {
        const locationElements = document.querySelectorAll('.business-location');
        locationElements.forEach(el => {
            el.innerHTML = location.replace(/\n/g, '<br>');
        });
    }
    
    // Update business information
    const businessName = businessInfo.name || localStorage.getItem('casa_business_name');
    if (businessName) {
        const nameElements = document.querySelectorAll('[data-business="name"]');
        nameElements.forEach(el => el.textContent = businessName);
    }
    
    // Load gallery images
    loadGalleryFromAdmin();
    
    console.log('Admin content loaded:', { businessInfo, contactInfo });
}

// Load gallery images from admin system
function loadGalleryFromAdmin() {
    const savedImages = JSON.parse(localStorage.getItem('casa_gallery_images') || '[]');
    const savedVideos = JSON.parse(localStorage.getItem('casa_gallery_videos') || '[]');
    
    // Replace gallery placeholders with real images
    if (savedImages.length > 0) {
        const galleryItems = document.querySelectorAll('.gallery-item .image-placeholder');
        savedImages.forEach((image, index) => {
            if (galleryItems[index]) {
                const item = galleryItems[index].parentElement;
                galleryItems[index].innerHTML = `<img src="${image.src}" alt="${image.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;">`;
            }
        });
    }
    
    // Replace video placeholders with real videos
    if (savedVideos.length > 0) {
        const videoItems = document.querySelectorAll('.video-item .video-placeholder');
        savedVideos.forEach((video, index) => {
            if (videoItems[index]) {
                videoItems[index].innerHTML = `<video src="${video.src}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;" controls></video>`;
            }
        });
    }
}

// Add admin access link (only visible when logged in)
function addAdminLink() {
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        const adminLink = document.createElement('div');
        adminLink.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(0, 122, 204, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 25px;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        adminLink.innerHTML = `
            <a href="admin-dashboard.html" style="color: white; text-decoration: none;">
                <i class="fas fa-cog"></i> Admin Panel
            </a>
        `;
        document.body.appendChild(adminLink);
    }
}

// ===== REVIEW MODAL FUNCTIONS =====
// Open review modal
function openReviewModal() {
    document.getElementById('reviewModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close review modal
function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('reviewForm').reset();
    
    // Reset star rating
    const stars = document.querySelectorAll('.star-rating .star');
    stars.forEach(star => star.classList.remove('active'));
    document.getElementById('reviewRatingValue').value = '';
}

// Handle star rating
function initializeStarRating() {
    const stars = document.querySelectorAll('.star-rating .star');
    const ratingInput = document.getElementById('reviewRatingValue');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            ratingInput.value = rating;
            
            // Update visual state
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseenter', () => {
            const rating = index + 1;
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.style.color = '#ffc107';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });
    
    document.querySelector('.star-rating').addEventListener('mouseleave', () => {
        const currentRating = parseInt(ratingInput.value) || 0;
        stars.forEach((s, i) => {
            if (i < currentRating) {
                s.style.color = '#ffc107';
            } else {
                s.style.color = '#ddd';
            }
        });
    });
}

// Handle review form submission
function handleReviewSubmission() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('reviewerName').value.trim(),
                location: document.getElementById('reviewerLocation').value.trim(),
                rating: document.getElementById('reviewRatingValue').value,
                reviewText: document.getElementById('reviewText').value.trim(),
                projectType: document.getElementById('projectType').value,
                timestamp: new Date().toISOString(),
                id: 'REV_' + Date.now()
            };
            
            // Validate required fields
            if (!formData.name || !formData.rating || !formData.reviewText) {
                alert('Please fill in all required fields and select a rating.');
                return;
            }
            
            if (parseInt(formData.rating) < 1 || parseInt(formData.rating) > 5) {
                alert('Please select a rating between 1 and 5 stars.');
                return;
            }
            
            // Save review
            const reviews = JSON.parse(localStorage.getItem('casa_reviews') || '[]');
            reviews.unshift(formData); // Add to beginning
            
            // Keep only last 50 reviews
            if (reviews.length > 50) {
                reviews.splice(50);
            }
            
            localStorage.setItem('casa_reviews', JSON.stringify(reviews));
            
            // Show success message
            showNotification('Thank you for your review! It has been submitted successfully.', 'success');
            
            // Close modal
            closeReviewModal();
            
            // Update reviews display
            updateReviewsDisplay();
        });
    }
}

// Update reviews display on the website
function updateReviewsDisplay() {
    const reviews = JSON.parse(localStorage.getItem('casa_reviews') || '[]');
    
    // You can implement this to dynamically update the reviews section
    // For now, we'll just log it
    console.log('Reviews updated:', reviews.length + ' total reviews');
}

// Load and display saved reviews
function loadSavedReviews() {
    const reviews = JSON.parse(localStorage.getItem('casa_reviews') || '[]');
    
    if (reviews.length > 0) {
        // Here you could dynamically replace the sample reviews with real ones
        console.log('Loaded', reviews.length, 'saved reviews');
    }
}

// Load admin-uploaded videos and add lightbox functionality
function loadVideosFromAdmin() {
    const savedVideos = JSON.parse(localStorage.getItem('casa_gallery_videos') || '[]');
    
    if (savedVideos.length > 0) {
        const videoItems = document.querySelectorAll('.video-item');
        savedVideos.forEach((video, index) => {
            if (videoItems[index]) {
                const placeholder = videoItems[index].querySelector('.video-placeholder');
                if (placeholder) {
                    placeholder.innerHTML = `<video style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; cursor: pointer;" poster="${video.poster || ''}">
                        <source src="${video.src}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>`;
                    
                    // Add click event for lightbox
                    const videoEl = placeholder.querySelector('video');
                    if (videoEl) {
                        videoEl.addEventListener('click', () => {
                            openLightbox(video.src, video.name, 'video');
                        });
                    }
                }
            }
        });
    }
}

// Replace map placeholder with interactive Bahamas map
function loadInteractiveMap() {
    const mapPlaceholder = document.querySelector('.location-map .map-placeholder');
    if (mapPlaceholder) {
        // Load service locations from admin
        const serviceLocations = JSON.parse(localStorage.getItem('casa_service_locations') || '[]');
        
        // Create SVG map
        mapPlaceholder.innerHTML = `
            <svg class="bahamas-map" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <!-- Bahamas Islands -->
                <g fill="#40b5d8" stroke="#007acc" stroke-width="2">
                    <ellipse cx="200" cy="150" rx="25" ry="8" data-island="Nassau"/>
                    <ellipse cx="180" cy="100" rx="35" ry="6" data-island="Freeport"/>
                    <ellipse cx="220" cy="120" rx="8" ry="25" data-island="Eleuthera"/>
                    <ellipse cx="160" cy="160" rx="15" ry="40" data-island="Andros"/>
                    <ellipse cx="190" cy="180" rx="6" ry="20" data-island="Exumas"/>
                    <ellipse cx="200" cy="80" rx="8" ry="20" data-island="Abaco"/>
                    <ellipse cx="240" cy="140" rx="4" ry="15" data-island="Cat Island"/>
                    <circle cx="250" cy="160" r="4" data-island="San Salvador"/>
                    <ellipse cx="220" cy="200" rx="3" ry="12" data-island="Long Island"/>
                </g>
                <text x="200" y="280" text-anchor="middle" fill="#007acc" font-family="Arial" font-size="14" font-weight="bold">Service Areas in The Bahamas</text>
            </svg>
        `;
        
        // Add service location pins
        if (serviceLocations.length > 0) {
            const svg = mapPlaceholder.querySelector('.bahamas-map');
            serviceLocations.forEach((location, index) => {
                const pin = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                pin.setAttribute('cx', 200 + (index * 30) - 60); // Distribute pins
                pin.setAttribute('cy', 150 + (index % 2) * 20);
                pin.setAttribute('r', '6');
                pin.setAttribute('fill', '#dc3545');
                pin.setAttribute('stroke', 'white');
                pin.setAttribute('stroke-width', '2');
                pin.classList.add('service-pin');
                pin.setAttribute('title', location.name);
                svg.appendChild(pin);
            });
        }
    }
}

// Load admin-managed gallery images into specific spots
function loadGalleryFromAdmin() {
    console.log('Loading admin gallery content...');
    
    // Load images for specific gallery spots
    for (let i = 1; i <= 6; i++) {
        const savedSpot = localStorage.getItem(`casa_gallery_spot_${i}`);
        if (savedSpot) {
            const spotData = JSON.parse(savedSpot);
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            if (galleryItems[i - 1]) {
                const placeholder = galleryItems[i - 1].querySelector('.image-placeholder');
                if (placeholder) {
                    placeholder.innerHTML = `<img src="${spotData.src}" alt="${spotData.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; cursor: pointer;">`;
                    console.log(`Loaded image for gallery spot ${i}:`, spotData.name);
                }
            }
        }
    }
    
    // Load profile photo
    const savedProfilePhoto = localStorage.getItem('casa_profile_photo');
    if (savedProfilePhoto) {
        const profilePlaceholder = document.querySelector('.about-image .image-placeholder');
        if (profilePlaceholder) {
            profilePlaceholder.innerHTML = `<img src="${savedProfilePhoto}" alt="Profile Photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
            console.log('Loaded profile photo');
        }
    }
}

// Load and update social media links
function loadSocialMediaLinks() {
    console.log('Loading social media links...');
    
    const facebook = localStorage.getItem('casa_social_facebook');
    const instagram = localStorage.getItem('casa_social_instagram');
    const youtube = localStorage.getItem('casa_social_youtube');
    const whatsapp = localStorage.getItem('casa_social_whatsapp');
    const tiktok = localStorage.getItem('casa_social_tiktok');
    const linkedin = localStorage.getItem('casa_social_linkedin');
    
    // Find the social icons container
    const socialIcons = document.querySelector('.social-icons');
    if (!socialIcons) {
        console.log('Social icons container not found');
        return;
    }
    
    // Clear existing placeholder links
    socialIcons.innerHTML = '';
    
    // Add social links that are configured
    if (facebook) {
        socialIcons.innerHTML += `<a href="${facebook}" class="social-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook"></i></a>`;
        console.log('Added Facebook link');
    }
    
    if (instagram) {
        socialIcons.innerHTML += `<a href="${instagram}" class="social-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>`;
        console.log('Added Instagram link');
    }
    
    if (youtube) {
        socialIcons.innerHTML += `<a href="${youtube}" class="social-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-youtube"></i></a>`;
        console.log('Added YouTube link');
    }
    
    if (whatsapp) {
        // Convert phone number to WhatsApp link if it's not already a URL
        const whatsappLink = whatsapp.startsWith('http') ? whatsapp : `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;
        socialIcons.innerHTML += `<a href="${whatsappLink}" class="social-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i></a>`;
        console.log('Added WhatsApp link');
    }
    
    if (tiktok) {
        socialIcons.innerHTML += `<a href="${tiktok}" class="social-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-tiktok"></i></a>`;
        console.log('Added TikTok link');
    }
    
    if (linkedin) {
        socialIcons.innerHTML += `<a href="${linkedin}" class="social-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>`;
        console.log('Added LinkedIn link');
    }
    
    // If no social links are configured, show default placeholders
    if (!facebook && !instagram && !youtube && !whatsapp && !tiktok && !linkedin) {
        socialIcons.innerHTML = `
            <a href="#" class="social-link"><i class="fab fa-facebook"></i></a>
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
            <a href="#" class="social-link"><i class="fab fa-whatsapp"></i></a>
        `;
        console.log('No social links configured, showing placeholders');
    }
}


// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const reviewModal = document.getElementById('reviewModal');
    if (e.target === reviewModal) {
        closeReviewModal();
    }
});

// Console welcome message
console.log('%c🔨 Casa Madera Website', 'color: #007acc; font-size: 20px; font-weight: bold;');
console.log('%cWebsite loaded successfully! Ready to showcase your carpentry work.', 'color: #28a745; font-size: 14px;');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    initializeMobileMenu();
    initializeGalleryFilter();
    initializeLightbox();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeHeaderScroll();
    initializeAnimations();
    
    // Load admin-managed content
    loadAdminContent();
    loadAdminSettings(); // New admin integration
    
    // Load social media links - disabled to prevent conflicts with data-loader.js
    // loadSocialMediaLinks();
    
    // Add admin link if logged in
    addAdminLink();
    
    // Initialize new features
    initializeStarRating();
    handleReviewSubmission();
    loadSavedReviews();
    loadVideosFromAdmin();
    loadInteractiveMap();
    
    // Initialize accessibility features
    initializeAccessibility();
});
