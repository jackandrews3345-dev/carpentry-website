# Troubleshooting: Videos Stuck Loading Infinitely

## Quick Diagnosis

I've created a diagnostic tool to help us identify the issue. Here's how to use it:

### Step 1: Open the Diagnostic Tool

1. Open your admin panel
2. In the address bar, change the URL from:
   ```
   .../admin/dashboard.html
   ```
   to:
   ```
   .../admin/video-test.html
   ```
3. Press Enter

### Step 2: Check Firebase Status

The page will show one of these messages:

- ✅ **"Firebase Storage is READY and AVAILABLE"** - Storage working properly
- ⚠️ **"Firebase Database ready, but Storage NOT available"** - Storage issue detected
- ❌ **"Firebase Manager not found"** - Configuration issue

### Step 3: Test Upload

1. Click "Choose File" and select a small video (under 10MB)
2. Click "Test Upload"
3. Watch the console output - it will show exactly what's happening

---

## Common Issues & Fixes

### Issue 1: Firebase Storage Rules Not Set

**Symptoms:** 
- Upload starts but never completes
- Console shows "Firebase Storage upload failed"
- Error mentions "permission denied"

**Fix:**
1. Go to https://console.firebase.google.com
2. Select your project: **casa-madera-carpentry**
3. Click **Storage** in left menu
4. Click **Rules** tab
5. Replace the rules with:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```
6. Click **Publish**

**This sets Storage to "test mode" - anyone can upload/download. We'll secure it later.**

### Issue 2: Storage Not Enabled

**Symptoms:**
- Status shows "Storage NOT available"
- Always falls back to localStorage

**Fix:**
1. Go to Firebase Console
2. Select your project
3. Click **Storage** in left menu
4. If you see "Get started", click it
5. Choose "Start in test mode"
6. Select location: "United States"
7. Click "Done"

### Issue 3: localStorage Quota Exceeded

**Symptoms:**
- Error: "QuotaExceededError"
- Only 1 video works, others fail

**Fix:**
Clear existing video data:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run:
```javascript
localStorage.removeItem('gallery_videos');
localStorage.removeItem('gallery_videos_posters');
console.log('Video data cleared');
```
4. Refresh page and try again

### Issue 4: Video File Corrupted or Unsupported

**Symptoms:**
- Upload completes but video won't play
- Black screen with no preview

**Fix:**
1. Re-export video in compatible format:
   - Format: MP4
   - Video codec: H.264
   - Audio codec: AAC
2. Use VLC or HandBrake to convert
3. Try uploading again

---

## What the Console Should Show (Success)

When upload works properly, you'll see:

```
📹 Starting video upload for spot 1
File: myvideo.mp4, Size: 15.23MB
☁️ Uploading to Firebase Storage...
📤 Upload progress: 25.0%
📤 Upload progress: 50.0%
📤 Upload progress: 75.0%
📤 Upload progress: 100.0%
✅ Video uploaded to cloud: https://firebasestorage.googleapis.com/...
✅ Video upload complete for spot 1
```

## What the Console Shows (Failure)

```
❌ Firebase Storage upload failed: FirebaseError: [storage/unauthorized]
Cloud upload failed, using local storage...
💾 Converting video to base64...
❌ Video conversion failed: QuotaExceededError
```

---

## Temporary Workaround (Until Firebase Storage Fixed)

If Firebase Storage isn't working, use smaller videos:

1. **Compress your videos to under 5MB**
   
   Use HandBrake (free):
   - Download: https://handbrake.fr/
   - Open video
   - Preset: "Very Fast 480p30"
   - Quality: Adjust slider until file is under 5MB
   - Click "Start"

2. **Or use online compression:**
   - CloudConvert: https://cloudconvert.com/mp4-converter
   - FreeConvert: https://www.freeconvert.com/video-compressor
   - Set resolution to 480p or 720p
   - Quality: "Good" (not "Best")

---

## Send Me This Info

If the problem persists, send me:

1. The Firebase Status message from video-test.html
2. The console output when you try to upload
3. Your video file size
4. Screenshot of any error messages

I can then provide a specific fix for your situation.

---

## Alternative: Use Video Links Instead

If uploads keep failing, you can:

1. Upload videos to YouTube or Vimeo (free, unlimited storage)
2. Set video to "Unlisted" (not public but accessible via link)
3. Use the video link in your website
4. Edit `_data/videos/` YAML files to point to external URLs

This way you avoid storage limits entirely!

---

## Need Live Help?

Open browser DevTools (F12) → Console tab, and run:
```javascript
console.log('Firebase:', window.firebaseManager);
console.log('Storage:', window.firebaseManager?.storageAvailable);
console.log('Ready:', window.firebaseManager?.isFirebaseReady);
```

Send me those 3 lines and I'll know exactly what's wrong.
