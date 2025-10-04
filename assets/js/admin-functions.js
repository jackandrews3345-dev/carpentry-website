// ===== ADDITIONAL ADMIN FUNCTIONS =====

// Gallery Spot Management
function initializeGallerySpots() {
    for (let i = 1; i <= 6; i++) {
        const uploadInput = document.getElementById(`upload-spot-${i}`);
        if (uploadInput) {
            uploadInput.addEventListener('change', function(e) {
                handleSpotImageUpload(e, i);
            });
        }
    }
}

function handleSpotImageUpload(event, spotNumber) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = function(e) {
            setSpotImage(spotNumber, e.target.result, file.name);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a valid image file under 5MB');
    }
}

function setSpotImage(spotNumber, src, name) {
    const spotPreview = document.getElementById(`spot-${spotNumber}`);
    if (spotPreview) {
        spotPreview.innerHTML = `<img src="${src}" alt="Gallery Spot ${spotNumber}">`;
        
        // Save to localStorage
        localStorage.setItem(`casa_gallery_spot_${spotNumber}`, JSON.stringify({src, name}));
        
        updateStats();
        updateMainWebsiteGallery();
    }
}

function removeSpotImage(spotNumber) {
    if (confirm(`Are you sure you want to remove the image from Gallery Spot ${spotNumber}?`)) {
        const spotPreview = document.getElementById(`spot-${spotNumber}`);
        if (spotPreview) {
            spotPreview.innerHTML = `
                <div class="placeholder-content">
                    <i class="fas fa-plus"></i>
                    <p>Upload Image</p>
                </div>
            `;
            
            // Remove from localStorage
            localStorage.removeItem(`casa_gallery_spot_${spotNumber}`);
            
            updateStats();
            updateMainWebsiteGallery();
        }
    }
}

// Profile Photo Management
function initializeProfilePhoto() {
    const profileUpload = document.getElementById('profile-upload');
    if (profileUpload) {
        profileUpload.addEventListener('change', handleProfilePhotoUpload);
    }
    
    // Load existing profile photo
    loadProfilePhoto();
}

function handleProfilePhotoUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = function(e) {
            setProfilePhoto(e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a valid image file under 5MB');
    }
}

function setProfilePhoto(src) {
    const profilePreview = document.getElementById('profile-preview');
    if (profilePreview) {
        profilePreview.innerHTML = `<img src="${src}" alt="Profile Photo">`;
        
        // Save to localStorage
        localStorage.setItem('casa_profile_photo', src);
        
        updateMainWebsiteProfile();
    }
}

function removeProfilePhoto() {
    if (confirm('Are you sure you want to remove your profile photo?')) {
        const profilePreview = document.getElementById('profile-preview');
        if (profilePreview) {
            profilePreview.innerHTML = `
                <div class="placeholder-content">
                    <i class="fas fa-user"></i>
                    <p>Upload Your Photo</p>
                </div>
            `;
            
            // Remove from localStorage
            localStorage.removeItem('casa_profile_photo');
            
            updateMainWebsiteProfile();
        }
    }
}

function loadProfilePhoto() {
    const savedPhoto = localStorage.getItem('casa_profile_photo');
    if (savedPhoto) {
        setProfilePhoto(savedPhoto);
    }
}

// Map and Location Management
function initializeBahamasMap() {
    const mapContainer = document.getElementById('bahamasMap');
    if (mapContainer) {
        // Create simple SVG map of The Bahamas
        mapContainer.innerHTML = `
            <svg class="bahamas-map" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <!-- Bahamas Islands Simplified -->
                <g fill="#40b5d8" stroke="#007acc" stroke-width="2">
                    <!-- New Providence (Nassau) -->
                    <ellipse cx="200" cy="150" rx="25" ry="8" data-island="Nassau"/>
                    <!-- Grand Bahama (Freeport) -->
                    <ellipse cx="180" cy="100" rx="35" ry="6" data-island="Freeport"/>
                    <!-- Eleuthera -->
                    <ellipse cx="220" cy="120" rx="8" ry="25" data-island="Eleuthera"/>
                    <!-- Andros -->
                    <ellipse cx="160" cy="160" rx="15" ry="40" data-island="Andros"/>
                    <!-- Exumas -->
                    <ellipse cx="190" cy="180" rx="6" ry="20" data-island="Exumas"/>
                    <!-- Abaco -->
                    <ellipse cx="200" cy="80" rx="8" ry="20" data-island="Abaco"/>
                    <!-- Cat Island -->
                    <ellipse cx="240" cy="140" rx="4" ry="15" data-island="Cat Island"/>
                    <!-- San Salvador -->
                    <circle cx="250" cy="160" r="4" data-island="San Salvador"/>
                    <!-- Long Island -->
                    <ellipse cx="220" cy="200" rx="3" ry="12" data-island="Long Island"/>
                </g>
                <text x="200" y="250" text-anchor="middle" fill="#007acc" font-family="Arial" font-size="16" font-weight="bold">The Bahamas</text>
            </svg>
        `;
        
        // Load existing service locations
        loadServiceLocations();
    }
}

function addServiceLocation() {
    const locationName = document.getElementById('locationName').value.trim();
    const locationDescription = document.getElementById('locationDescription').value.trim();
    
    if (!locationName) {
        alert('Please enter a location name');
        return;
    }
    
    const locations = JSON.parse(localStorage.getItem('casa_service_locations') || '[]');
    const newLocation = {
        id: 'LOC_' + Date.now(),
        name: locationName,
        description: locationDescription,
        timestamp: new Date().toISOString()
    };
    
    locations.push(newLocation);
    localStorage.setItem('casa_service_locations', JSON.stringify(locations));
    
    // Clear form
    document.getElementById('locationName').value = '';
    document.getElementById('locationDescription').value = '';
    
    // Refresh location list
    loadServiceLocations();
    updateMainWebsiteMap();
}

function loadServiceLocations() {
    const locations = JSON.parse(localStorage.getItem('casa_service_locations') || '[]');
    const locationList = document.getElementById('locationList');
    
    if (!locationList) return;
    
    if (locations.length === 0) {
        locationList.innerHTML = '<p style="color: #6c757d; text-align: center; padding: 20px;">No locations pinned yet</p>';
        return;
    }
    
    locationList.innerHTML = locations.map(location => `
        <div class="location-item">
            <button class="remove-location" onclick="removeServiceLocation('${location.id}')">&times;</button>
            <h6><i class="fas fa-map-marker-alt"></i> ${location.name}</h6>
            ${location.description ? `<p>${location.description}</p>` : ''}
        </div>
    `).join('');
}

function removeServiceLocation(locationId) {
    if (confirm('Are you sure you want to remove this service location?')) {
        const locations = JSON.parse(localStorage.getItem('casa_service_locations') || '[]');
        const updatedLocations = locations.filter(loc => loc.id !== locationId);
        localStorage.setItem('casa_service_locations', JSON.stringify(updatedLocations));
        
        loadServiceLocations();
        updateMainWebsiteMap();
    }
}

// Update main website functions
function updateMainWebsiteGallery() {
    console.log('Gallery updated - changes will appear on main website');
}

function updateMainWebsiteProfile() {
    console.log('Profile photo updated - changes will appear on main website');
}

function updateMainWebsiteMap() {
    console.log('Service locations updated - changes will appear on main website');
}

// Initialize all admin features
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin-dashboard')) {
        initializeGallerySpots();
        initializeProfilePhoto();
        initializeBahamasMap();
    }
});