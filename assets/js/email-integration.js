// ===== EMAIL INTEGRATION FOR CASA MADERA =====
// This file handles actual email sending through Formspree or EmailJS
// Choose your preferred service and update the configuration below

// ===== CONFIGURATION =====
// Option 1: Formspree (Recommended - Simple & Free)
// Sign up at: https://formspree.io/
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID_HERE'; // Replace with your Formspree form ID (e.g., 'xeqyabcd')
const USE_FORMSPREE = true; // Set to false if using EmailJS instead

// Option 2: EmailJS (Alternative - More features)
// Sign up at: https://www.emailjs.com/
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'; // Your EmailJS public key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Your EmailJS template ID

// ===== EMAIL SENDING FUNCTIONS =====

/**
 * Send email using Formspree
 * Formspree is the easiest option - just need a form ID
 */
async function sendViaFormspree(formData) {
    try {
        console.log('📧 Sending email via Formspree...');
        
        // Check if Formspree is configured
        if (FORMSPREE_ID === 'YOUR_FORMSPREE_ID_HERE' || !FORMSPREE_ID) {
            console.error('❌ Formspree not configured. Please update FORMSPREE_ID in email-integration.js');
            return false;
        }
        
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                phone: formData.phone || 'Not provided',
                location: formData.location || 'Not provided',
                service: formData.service || 'Not specified',
                budget: formData.budget || 'Not specified',
                message: formData.message,
                _subject: `New Casa Madera Inquiry from ${formData.name}`,
                _replyto: formData.email
            })
        });
        
        if (response.ok) {
            console.log('✅ Email sent successfully via Formspree!');
            return true;
        } else {
            const errorData = await response.json();
            console.error('❌ Formspree error:', errorData);
            return false;
        }
    } catch (error) {
        console.error('❌ Formspree sending failed:', error);
        return false;
    }
}

/**
 * Send email using EmailJS
 * EmailJS requires more setup but offers more features like auto-replies
 */
async function sendViaEmailJS(formData) {
    try {
        console.log('📧 Sending email via EmailJS...');
        
        // Check if EmailJS is configured
        if (EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY' || 
            EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
            EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
            console.error('❌ EmailJS not configured. Please update EmailJS settings in email-integration.js');
            return false;
        }
        
        // Load EmailJS library if not already loaded
        if (typeof emailjs === 'undefined') {
            console.log('Loading EmailJS library...');
            await loadEmailJSLibrary();
        }
        
        // Initialize EmailJS
        emailjs.init(EMAILJS_PUBLIC_KEY);
        
        // Prepare template parameters
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone || 'Not provided',
            location: formData.location || 'Not provided',
            service: formData.service || 'Not specified',
            budget: formData.budget || 'Not specified',
            message: formData.message,
            to_email: getOwnerEmail() // Get owner email from admin panel
        };
        
        // Send email
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );
        
        console.log('✅ Email sent successfully via EmailJS!', response);
        return true;
    } catch (error) {
        console.error('❌ EmailJS sending failed:', error);
        return false;
    }
}

/**
 * Load EmailJS library dynamically
 */
function loadEmailJSLibrary() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Get owner email from admin panel settings
 */
function getOwnerEmail() {
    const quoteSettings = JSON.parse(localStorage.getItem('quoteSettings') || '{}');
    const businessInfo = JSON.parse(localStorage.getItem('businessInfo') || '{}');
    return quoteSettings.email || businessInfo.email || 'info@casamadera.bs';
}

/**
 * Main email sending function - automatically chooses the configured service
 * This replaces the placeholder sendEmailToOwner function
 */
window.sendEmailToOwner = async function(formData) {
    console.log('📧 Processing contact form submission...');
    console.log('Form data:', formData);
    
    // Check if any email service is configured
    const formspreeConfigured = FORMSPREE_ID && FORMSPREE_ID !== 'YOUR_FORMSPREE_ID_HERE';
    const emailjsConfigured = EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY';
    
    if (!formspreeConfigured && !emailjsConfigured) {
        console.warn('⚠️ No email service configured!');
        console.log('Please follow the EMAIL-SETUP-GUIDE.md to configure Formspree or EmailJS');
        
        // Still save the inquiry locally
        saveInquiryLocally(formData);
        
        // Show helpful message to user
        alert('Thank you for your inquiry! Your message has been saved. However, email delivery is not yet configured. Please call us directly at the number shown on the website, or set up email delivery by following the EMAIL-SETUP-GUIDE.md');
        
        return true; // Return true so form still resets
    }
    
    // Send via configured service
    let success = false;
    
    if (USE_FORMSPREE && formspreeConfigured) {
        success = await sendViaFormspree(formData);
    } else if (!USE_FORMSPREE && emailjsConfigured) {
        success = await sendViaEmailJS(formData);
    } else if (formspreeConfigured) {
        // Fallback to Formspree if EmailJS not configured
        success = await sendViaFormspree(formData);
    } else if (emailjsConfigured) {
        // Fallback to EmailJS if Formspree not configured
        success = await sendViaEmailJS(formData);
    }
    
    // Save inquiry locally regardless of email success
    saveInquiryLocally(formData);
    
    return success;
};

/**
 * Save inquiry to localStorage for admin dashboard
 */
function saveInquiryLocally(formData) {
    const inquiries = JSON.parse(localStorage.getItem('casa_inquiries') || '[]');
    const inquiry = {
        ...formData,
        timestamp: new Date().toISOString(),
        id: 'INQ_' + Date.now(),
        emailSent: true // Marked as sent for tracking
    };
    inquiries.unshift(inquiry); // Add to beginning of array
    
    // Keep only last 50 inquiries
    if (inquiries.length > 50) {
        inquiries.splice(50);
    }
    
    localStorage.setItem('casa_inquiries', JSON.stringify(inquiries));
    console.log('💾 Inquiry saved locally for admin dashboard');
}

// ===== AUTOMATIC CONFIGURATION DETECTION =====
// Check if email is properly configured on page load
document.addEventListener('DOMContentLoaded', function() {
    const formspreeConfigured = FORMSPREE_ID && FORMSPREE_ID !== 'YOUR_FORMSPREE_ID_HERE';
    const emailjsConfigured = EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY';
    
    if (formspreeConfigured) {
        console.log('✅ Email configured: Formspree (ID: ' + FORMSPREE_ID + ')');
    } else if (emailjsConfigured) {
        console.log('✅ Email configured: EmailJS');
    } else {
        console.warn('⚠️ Email not configured yet!');
        console.log('📖 Please follow EMAIL-SETUP-GUIDE.md to set up email delivery');
        console.log('💡 Contact form will still work and save inquiries locally');
    }
});

// ===== CONFIGURATION STATUS FOR ADMIN PANEL =====
// Expose configuration status for admin panel
window.getEmailConfigurationStatus = function() {
    const formspreeConfigured = FORMSPREE_ID && FORMSPREE_ID !== 'YOUR_FORMSPREE_ID_HERE';
    const emailjsConfigured = EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY';
    
    return {
        configured: formspreeConfigured || emailjsConfigured,
        service: formspreeConfigured ? 'Formspree' : emailjsConfigured ? 'EmailJS' : 'None',
        formspree: formspreeConfigured,
        emailjs: emailjsConfigured
    };
};

console.log('📧 Email integration loaded');
