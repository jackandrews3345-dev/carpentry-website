# Video Optimization Guide

## Issues You're Experiencing

### 1. **No Video Previews on Mobile**
Videos on mobile devices need a poster image (thumbnail) to show before the video loads. Without it, you just see a black box.

**Solution:** The system now automatically generates thumbnails from your videos when you upload them.

### 2. **Only 1 Video Loads, Others Don't**
This is caused by browser storage limits. Videos stored as base64 data in localStorage can quickly exceed the 5-10MB storage quota.

**Solution:** 
- Keep videos **under 10MB** each
- Use video compression before uploading
- Remove old videos before adding new ones

## How to Compress Videos

### Option 1: Free Online Tools
1. **HandBrake** (Desktop - Recommended)
   - Download: https://handbrake.fr/
   - Settings: Use "Fast 1080p30" preset
   - Adjust quality slider to reduce file size

2. **CloudConvert** (Online)
   - Visit: https://cloudconvert.com/mp4-converter
   - Upload your video
   - Settings: Resolution 720p, Quality "Good"

3. **FreeConvert** (Online)
   - Visit: https://www.freeconvert.com/video-compressor
   - Upload and compress

### Option 2: Mobile Apps
- **Video Compressor** (Android)
- **Video Compress** (iOS)

## Recommended Video Settings

For best results on your carpentry website:

```
Resolution: 1280x720 (720p) or lower
Bitrate: 1-2 Mbps
Format: MP4 (H.264)
File Size: Under 10MB (under 5MB ideal)
Duration: 15-60 seconds recommended
```

## What the System Does Now

✅ **Auto-generates thumbnails** - Captures a frame from your video as a preview image  
✅ **Shows warnings** - Alerts you if video is too large before upload  
✅ **Catches storage errors** - Tells you if storage quota is exceeded  
✅ **Mobile-optimized** - Videos now have `playsinline` attribute for iOS  

## Troubleshooting

### Problem: "Storage quota exceeded" error
**Fix:** 
1. Remove existing videos from admin panel
2. Compress your new video to under 5-10MB
3. Try uploading again

### Problem: Video shows black screen on mobile
**Fix:** 
- The thumbnail should now generate automatically
- If not, try re-uploading the video
- Check browser console for errors

### Problem: Video won't play on iPhone
**Fix:**
- Ensure video is in MP4 format
- Video must be under 50MB
- Try clearing browser cache

## Best Practices

1. **Test on Mobile First** - Always check how videos look on your phone
2. **Keep It Short** - 30-second clips work best for web
3. **Use WiFi** - Upload videos on WiFi, not cellular data
4. **Compress Before Upload** - Don't rely on the 50MB limit
5. **One at a Time** - Upload videos one by one, not all at once

## Storage Management

Your browser has limited storage (~5-10MB for localStorage). Here's what uses space:

- **Videos**: Largest items (can be 5-10MB each)
- **Images**: Medium (500KB-2MB each)  
- **Settings**: Minimal (<10KB)

**Tip:** If you have 3-4 videos, you may hit the storage limit. Keep only your best project videos.

## Technical Details

The fixes implemented:

1. **Poster Generation**: Extracts a frame at 1 second (or 10% into video) as JPEG thumbnail
2. **Storage Error Handling**: Catches `QuotaExceededError` and shows helpful message
3. **Mobile Attributes**: Added `playsinline`, `preload="metadata"` for iOS Safari
4. **Size Warnings**: Warns before upload if file is over 10MB
5. **Background Color**: Black background prevents white flash on video load

## Need Help?

If you're still having issues:
1. Check the browser console (F12) for error messages
2. Try a different browser (Chrome, Safari, Firefox)
3. Clear browser cache and localStorage
4. Compress videos more aggressively (under 5MB)
