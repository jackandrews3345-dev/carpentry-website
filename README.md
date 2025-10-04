# Bahamas Carpentry Website

A modern, responsive website designed specifically for showcasing carpentry work and services in the Bahamas. This website features a beautiful Caribbean-inspired design with interactive galleries, contact forms, and mobile-first responsive design.

## 🌟 Features

- **Responsive Design**: Looks great on all devices (mobile, tablet, desktop)
- **Caribbean Color Palette**: Ocean blues, coral accents, and sand colors
- **Interactive Gallery**: Filterable gallery with lightbox for images and videos
- **Contact Form**: Professional contact form with validation
- **Service Showcase**: Dedicated sections for your carpentry services
- **Location Information**: Highlights your Bahamas location and service areas
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Accessibility**: Keyboard navigation and screen reader support
- **Modern Features**: Smooth scrolling, animations, and mobile menu

## 📁 Project Structure

```
carpentry-website/
├── index.html              # Main HTML file
├── README.md               # This file
├── assets/
│   ├── css/
│   │   └── style.css      # All CSS styles
│   ├── js/
│   │   └── script.js      # JavaScript functionality
│   ├── images/            # Your project images
│   └── videos/            # Your project videos
```

## 🚀 Quick Start

1. **Open the website**: Double-click `index.html` to open in your browser
2. **Add your content**: Replace placeholder text with your information
3. **Upload your media**: Add your carpentry photos and videos
4. **Customize colors**: Modify CSS variables to match your brand
5. **Deploy**: Upload to your web hosting service

## 🎨 Customization Guide

### 1. Personal Information

**Update Contact Details:**
In `index.html`, find and replace:
- `+1 (242) 000-0000` with your phone number
- `info@bahamascarpentry.com` with your email
- Update social media links in the contact section

**Add Your Photo:**
Replace the profile image placeholder in the About section:
```html
<div class="image-placeholder">
    <img src="assets/images/your-photo.jpg" alt="Your Name">
</div>
```

### 2. Adding Your Work

**Gallery Images:**
1. Add your project photos to `assets/images/`
2. Replace image placeholders in the gallery section:
```html
<div class="gallery-item" data-category="furniture">
    <img src="assets/images/custom-table.jpg" alt="Custom Table">
    <div class="gallery-overlay">
        <i class="fas fa-expand"></i>
    </div>
</div>
```

**Project Videos:**
1. Add videos to `assets/videos/`
2. Update video placeholders:
```html
<div class="video-item">
    <video controls>
        <source src="assets/videos/furniture-process.mp4" type="video/mp4">
    </video>
</div>
```

### 3. Services & Pricing

Update the services section with your specific offerings:
- Custom Furniture
- Home Renovations  
- Doors & Windows
- Stairs & Railings
- Repairs & Maintenance
- Finishing Work

### 4. Color Scheme

Customize colors by modifying CSS variables in `assets/css/style.css`:

```css
:root {
    --primary-blue: #007acc;      /* Your primary color */
    --light-blue: #40b5d8;        /* Accent color */
    --dark-blue: #003d5c;         /* Dark headers */
    --coral: #ff6b47;             /* Highlight color */
    --sand: #f4e4bc;              /* Background accent */
}
```

## 📱 Mobile Responsiveness

The website is designed mobile-first and includes:
- Collapsible navigation menu for mobile
- Touch-friendly buttons and links
- Optimized images for different screen sizes
- Readable font sizes on all devices

## 🔧 Technical Details

### Dependencies
- Font Awesome 6.0 (icons)
- Google Fonts (Roboto & Playfair Display)
- Modern browsers (Chrome, Firefox, Safari, Edge)

### Browser Support
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

### Performance Features
- Lazy loading for images
- Optimized animations
- Debounced scroll events
- Efficient CSS with custom properties

## 📝 Content Guidelines

### Photography Tips
- Use high-resolution images (minimum 1200px wide)
- Show before/after comparisons
- Include detail shots of your craftsmanship
- Capture different lighting conditions
- Show projects in their final environment

### Video Content Ideas
- Time-lapse of project completion
- Close-up shots of techniques
- Client testimonials
- Tool demonstrations
- Workshop tours

### SEO Best Practices
- Add descriptive alt text to all images
- Use relevant keywords in content
- Include location-specific terms
- Update meta descriptions
- Add structured data markup

## 🌐 Deployment Options

### Option 1: Free Hosting (GitHub Pages)
1. Create GitHub account
2. Upload files to repository
3. Enable GitHub Pages
4. Access via `username.github.io/repository-name`

### Option 2: Professional Hosting
- Bluehost, SiteGround, or HostGator
- Upload files via FTP/File Manager
- Point custom domain to hosting

### Option 3: Bahamas Local Hosting
- Consider Caribbean-based hosting for better local performance
- Ensure HTTPS certificate for security

## 📧 Contact Form Setup

The contact form currently shows success messages without actually sending emails. To make it functional:

### Option 1: Email Service (Recommended)
Use services like:
- Netlify Forms (free tier available)
- Formspree (free tier available)  
- EmailJS (free tier available)

### Option 2: Backend Integration
If you have web development experience:
- PHP with mail() function
- Node.js with nodemailer
- Python with Flask/Django

## 🔒 Security Considerations

- Always use HTTPS in production
- Validate form inputs on both client and server
- Implement rate limiting for contact forms
- Keep software dependencies updated
- Regular backups of your website

## 📊 Analytics & Tracking

Add Google Analytics to track visitors:
```html
<!-- Add before closing </head> tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🎯 Marketing Tips

### Local SEO
- List your business on Google My Business
- Include "Bahamas" and specific islands in content
- Get reviews from satisfied customers
- Use location-specific keywords

### Social Media Integration
- Share project photos on Instagram
- Create Facebook business page
- Use hashtags: #BahamasCarpentry #CustomFurniture
- Post progress videos on YouTube

### Networking
- Join local business associations
- Partner with real estate agents
- Connect with interior designers
- Attend home and garden shows

## 🛠️ Maintenance

### Regular Updates
- Add new project photos monthly
- Update services and pricing annually
- Check for broken links quarterly
- Update contact information as needed

### Backup Strategy
- Download website files monthly
- Keep copies of original photos/videos
- Document any customizations made

## 📞 Support

If you need help customizing this website:
1. Check this README for common solutions
2. Search online tutorials for specific features
3. Consider hiring a local web developer
4. Join web development communities for advice

## 🔄 Future Enhancements

Consider adding these features as you grow:
- Online booking system
- Client testimonials section
- Project timeline/process explanation
- Before/after comparison sliders
- Blog section for carpentry tips
- Multi-language support (English/Creole)

## 📋 Launch Checklist

Before going live:
- [ ] Replace all placeholder content
- [ ] Add your photos and videos
- [ ] Test contact form functionality
- [ ] Check mobile responsiveness
- [ ] Verify all links work
- [ ] Add Google Analytics
- [ ] Test loading speed
- [ ] Check spelling and grammar
- [ ] Set up domain and hosting
- [ ] Create social media accounts

## 🎉 Congratulations!

Your professional carpentry website is ready to showcase your skills and attract new clients throughout the Bahamas. Remember to keep your content updated and engage with visitors who contact you through the site.

For any questions about using this website template, feel free to refer back to this guide or seek help from the web development community.

---

**Good luck with your carpentry business in the beautiful Bahamas! 🏝️🔨**
