# 🎥 Video Upload Guide

## Video Size Limits

### **Maximum Video Size: 10MB per video**

**Why this limit?**
- Videos are stored as base64 data in Firebase's free tier database
- Larger videos slow down page loading
- Most browsers handle videos under 10MB smoothly

### **Recommended Video Specs:**

| Property | Recommended | Maximum |
|----------|-------------|---------|
| **File Size** | 5-8 MB | 10 MB |
| **Resolution** | 1280x720 (720p) | 1920x1080 (1080p) |
| **Duration** | 15-30 seconds | 60 seconds |
| **Format** | MP4 (H.264) | MP4 |
| **Frame Rate** | 30 fps | 60 fps |

## How to Compress Videos

If your video is too large, compress it before uploading:

### **Option 1: Online Tools (Free & Easy)**

1. **HandBrake** (https://handbrake.fr/) - Desktop app
   - Free and open-source
   - Choose "Fast 720p30" preset
   - Adjust quality slider to hit target file size

2. **CloudConvert** (https://cloudconvert.com/) - Online
   - Upload video
   - Select MP4 output
   - Reduce resolution to 720p

3. **Clideo** (https://clideo.com/compress-video) - Online
   - Simple drag-and-drop
   - Automatic compression

### **Option 2: Quick Tips**

- **Reduce resolution** - 720p is perfect for web
- **Shorten duration** - Keep videos under 30 seconds
- **Lower frame rate** - 30fps is smooth enough
- **Use modern codecs** - H.264 is best for web

## Video Titles

### **How to Add/Edit Video Titles**

1. **Go to Admin Panel** → Gallery Management → Videos
2. **Upload your video** to any of the 3 video spots
3. **Add a title** in the "Label" field
4. **Click Save**
5. **Refresh main website** to see the title below the video

### **Title Best Practices:**

✅ **Good Titles:**
- "Kitchen Cabinet Installation Process"
- "Custom Furniture: Dining Table Build"
- "Home Renovation Time-lapse"
- "Deck Building Tutorial"

❌ **Avoid:**
- "Video 1" (too generic)
- "asdfasdf" (meaningless)
- "MY VIDEO!!!!!!" (unprofessional)
- Super long titles that take multiple lines

### **Title Length:**
- **Recommended:** 3-6 words (25-40 characters)
- **Maximum:** 60 characters before it looks cramped

## Video Formatting

### **Best Video Formats:**

1. **MP4** - ✅ BEST (works everywhere)
2. **WebM** - ✅ Good (modern browsers)
3. **AVI** - ❌ Avoid (too large)
4. **MOV** - ❌ Avoid (Apple only)

### **Converting Videos to MP4:**

If you have a video in another format:

**Windows:**
- Use VLC Media Player (free)
- File → Convert/Save → Choose MP4

**Mac:**
- Use QuickTime Player (built-in)
- File → Export As → 720p

**Online:**
- CloudConvert.com
- Upload → Select MP4 → Download

## Video Gallery Layout

Your website has **3 video spots**:

| Spot | Default Title | What to Show |
|------|---------------|--------------|
| Video 1 | Furniture Making Process | Crafting furniture |
| Video 2 | Home Renovation Timelapse | Renovation projects |
| Video 3 | Custom Design Consultation | Custom work showcase |

**You can change these titles** to whatever you want in the admin panel!

## Troubleshooting

### "My video won't upload"

**Check:**
- Is file size under 10MB?
- Is it MP4 format?
- Did you click Save?
- Is your internet connection stable?

**Solution:** Compress the video and try again

### "Video uploaded but doesn't show on website"

**Check:**
- Did you refresh the main website page?
- Check browser console (F12) for errors
- Clear browser cache and try again

**Solution:** Re-upload and make sure to click Save

### "Video is choppy or slow to load"

**Cause:** Video file is too large

**Solution:**
1. Compress video to under 5MB
2. Reduce resolution to 720p
3. Shorten video duration

### "Title doesn't appear"

**Check:**
- Did you add a label in the admin panel?
- Did you click Save after uploading?
- Did you refresh the main site?

**Solution:** Go back to admin panel, add label, save, refresh main site

## Video Quality Tips

### **Filming Your Projects:**

1. **Good lighting** - Film during daytime or use bright lights
2. **Steady camera** - Use tripod or stable surface
3. **Multiple angles** - Show different perspectives
4. **Keep it short** - 15-30 seconds is perfect
5. **Show action** - Timelapse or sped-up footage works great

### **What Makes Good Project Videos:**

✅ **Before/After comparisons**
- Show the space before work starts
- Show the finished result

✅ **Process videos**
- Timelapse of building something
- Key steps in the project

✅ **Detail shots**
- Close-ups of craftsmanship
- Joinery details
- Finished products

✅ **Client testimonials**
- Happy customers talking about your work
- Showing off completed projects

## Examples of Great Carpentry Videos

**Good video types for your business:**

1. **Quick build timelapse** (20-30 seconds)
   - Sped-up footage of building a table
   - Shows your skills and process

2. **Before/After transformation** (15 seconds)
   - Old kitchen → New cabinets
   - Broken deck → New beautiful deck

3. **Detail showcase** (10-15 seconds)
   - Slow pan across finished furniture
   - Close-up of wood joints and details

4. **Customer walkthrough** (30-40 seconds)
   - Client showing off your work
   - Authentic testimonial

## Mobile Recording Tips

Most people will film with their phones:

1. **Hold phone horizontally** (landscape mode)
2. **Clean your lens** before recording
3. **Tap to focus** on what you're filming
4. **Keep camera steady** - lean against something
5. **Record in good light** - natural daylight is best

### **Phone Settings:**

- **iPhone:** Settings → Camera → Record Video → 1080p at 30fps
- **Android:** Camera → Settings → Video Quality → FHD (1080p)

## File Size Calculator

**Approximate file sizes for 30-second videos:**

| Resolution | 30fps | 60fps |
|------------|-------|-------|
| 480p | 2-3 MB | 3-5 MB |
| 720p | 4-6 MB ✅ | 7-10 MB |
| 1080p | 8-12 MB | 15-20 MB ⚠️ |
| 4K | 30-50 MB ❌ | 60-100 MB ❌ |

**✅ = Perfect for upload**  
**⚠️ = May need compression**  
**❌ = Too large, must compress**

## Summary

### **Quick Reference:**

- **Max video size:** 10MB
- **Recommended:** 5-8MB, 720p, 15-30 seconds
- **Format:** MP4 (H.264)
- **Title length:** 3-6 words
- **Number of videos:** 3 spots available

### **Upload Process:**

1. Record/compress your video to under 10MB
2. Log into admin panel
3. Go to Gallery Management → Videos
4. Upload to Video Spot 1, 2, or 3
5. Add a descriptive title in the label field
6. Click Save
7. Refresh main website to see it live

---

**Your videos will auto-play on mute when visitors hover over them, and clicking opens them in fullscreen with sound! 🎬**
