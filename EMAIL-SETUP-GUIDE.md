# 📧 Email Setup Guide - Make Your Contact Form Work!

## What This Does:
✅ **Contact form sends actual emails to you**  
✅ **No backend or server code needed**  
✅ **100% free for up to 50 emails per month**  
✅ **Easy 5-minute setup**

---

## 🚀 Option 1: Formspree (Recommended - Free & Easy)

### Step 1: Create Formspree Account
1. Go to **https://formspree.io/**
2. Click **"Get Started"**
3. Sign up with your email (free plan is perfect!)
4. Verify your email address

### Step 2: Create a New Form
1. After logging in, click **"+ New Form"**
2. Name it: **"Casa Madera Contact Form"**
3. Enter the email address where you want to receive inquiries
4. Click **"Create Form"**

### Step 3: Get Your Form ID
1. After creating the form, you'll see a **Form ID** like: `xeqyabcd`
2. **Copy this ID** - you'll need it in the next step

### Step 4: Update Your Website
1. Open `assets/js/email-integration.js` (we'll create this file)
2. Replace `YOUR_FORMSPREE_ID_HERE` with your actual Form ID
3. Save the file

### Step 5: Add the Script to Your Website
Add this line to your `index.html` before the closing `</body>` tag:
```html
<script src="assets/js/email-integration.js"></script>
```

### Test It!
1. Go to your website
2. Fill out the contact form
3. Submit it
4. You should receive an email within a few seconds!

---

## 🚀 Option 2: EmailJS (Alternative - Also Free)

### Step 1: Create EmailJS Account
1. Go to **https://www.emailjs.com/**
2. Click **"Sign Up"**
3. Create your free account

### Step 2: Add Email Service
1. Go to **Email Services**
2. Click **"Add New Service"**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Connect your email account
5. Copy your **Service ID**

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **"Create New Template"**
3. Name it: **"Casa Madera Inquiry"**
4. Use this template:
```
Subject: New Casa Madera Inquiry from {{from_name}}

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Location: {{location}}
Service: {{service}}
Budget: {{budget}}

Message:
{{message}}

---
Sent from Casa Madera Website
```
5. Save and copy your **Template ID**

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Find your **Public Key**
3. Copy it

### Step 5: Update Configuration
1. Open `assets/js/email-integration.js`
2. Update the EmailJS settings with your IDs
3. Save the file

---

## 🎯 Quick Setup (Copy-Paste Ready)

### For Formspree Users:
Just update this line in `email-integration.js`:
```javascript
const FORMSPREE_ID = 'xeqyabcd'; // Replace with your actual ID
```

### For EmailJS Users:
Update these lines in `email-integration.js`:
```javascript
const EMAILJS_PUBLIC_KEY = 'your_public_key_here';
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
```

---

## ✅ Verification Steps

### How to Test:
1. **Fill out your contact form** with test information
2. **Check your email** (including spam folder)
3. **You should receive an email** with the form details

### Troubleshooting:
- **No email received?**
  - Check spam/junk folder
  - Verify your Form ID/API keys are correct
  - Make sure you verified your Formspree/EmailJS email

- **Error on form submission?**
  - Check browser console (F12) for error messages
  - Verify the script is loaded correctly
  - Make sure you're not hitting API rate limits

---

## 💰 Cost & Limits

### Formspree Free Plan:
- ✅ 50 submissions per month
- ✅ Spam filtering
- ✅ Email notifications
- ✅ Perfect for most small businesses

### EmailJS Free Plan:
- ✅ 200 emails per month
- ✅ 2 email templates
- ✅ Auto-reply emails
- ✅ Great for higher volume

---

## 🔒 Security Notes

- Your API keys are **public** (designed to be used in websites)
- Both services have spam protection built-in
- Never put sensitive data in public-facing forms
- Both services are GDPR compliant

---

## 📞 Admin Panel Integration

Once email is working, configure it in your Admin Panel:

1. Go to **Admin Dashboard** → **Quote Form Settings**
2. Enter the email address where you want to receive inquiries
3. This helps track where emails should go

The contact form will automatically send to this address!

---

## 🎉 You're All Set!

Your Casa Madera website now has:
- ✅ Working contact form
- ✅ Email notifications
- ✅ Professional inquiry management
- ✅ Zero monthly costs (with free plans)

Customers can now reach you directly through your website! 🚀
