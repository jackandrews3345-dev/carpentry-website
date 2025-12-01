# 🖼️ Gallery Images Not Showing? Here's Why & How to Fix

## The Issue

When you upload images in the admin panel and switch between gallery filter tabs (All Work, Furniture, Renovations, Custom Work), some images might not appear even though you uploaded them.

## Why This Happens

The gallery has **6 image spots** that are pre-assigned to categories:

| Spot # | Category | What to Upload Here |
|--------|----------|---------------------|
| Spot 1 | **Furniture** | Tables, chairs, cabinets, etc. |
| Spot 2 | **Renovations** | Kitchen remodels, room renovations |
| Spot 3 | **Custom Work** | Built-ins, shelving, unique projects |
| Spot 4 | **Furniture** | More furniture projects |
| Spot 5 | **Renovations** | More renovation projects |
| Spot 6 | **Custom Work** | More custom projects |

## How Gallery Filtering Works

When you click the filter buttons:
- **"All Work"** - Shows all 6 spots (regardless of what's uploaded)
- **"Furniture"** - Shows only Spots 1 & 4
- **"Renovations"** - Shows only Spots 2 & 5
- **"Custom Work"** - Shows only Spots 3 & 6

## The Problem

If you upload images using the admin panel:
1. Upload a furniture image to "Furniture Gallery - Spot 1"
2. Upload a renovation image to "Renovations Gallery - Spot 1"

The **renovation image won't show** when you click "Renovations" filter because:
- Renovations filter shows Spots 2 & 5 only
- Your renovation image is in the "Renovations Gallery" section, but that data goes to a different storage location

## The Solution

### Option 1: Use Spots According to Category (Recommended)

In the admin panel, upload your images like this:

**For Furniture:**
- Go to "Furniture Gallery"
- Upload to Spot 1 (appears as gallery-spot-1 on website)
- Upload to Spot 2 (appears as gallery-spot-4 on website)

**For Renovations:**
- Go to "Renovations Gallery"
- Upload to Spot 1 (appears as gallery-spot-2 on website)
- Upload to Spot 2 (appears as gallery-spot-5 on website)

**For Custom Work:**
- Go to "Custom Gallery"
- Upload to Spot 1 (appears as gallery-spot-3 on website)
- Upload to Spot 2 (appears as gallery-spot-6 on website)

### Option 2: Ignore Filters & Use "All Work"

If the filtering is confusing:
1. Upload images to any spots you want
2. Tell customers to just use "All Work" to see everything
3. The filters are optional - "All Work" always shows all images

## Quick Test

1. **Open your website** (index.html)
2. **Open browser console** (Press F12)
3. **Look for these messages:**
   ```
   Loading admin settings...
   Loading gallery images with data: {...}
   Loading furniture image for spot 1: ...
   Loading renovation image for spot 2: ...
   ```

4. **Check localStorage:**
   - Press F12 → Application → Local Storage
   - Look for keys like:
     - `gallery_furniture`
     - `gallery_renovation`
     - `gallery_custom`
   - These should contain your uploaded images

## Common Issues & Fixes

### "I uploaded images but they don't appear at all"

**Check:**
1. Did you click "Save" in the admin panel?
2. Did you refresh the main website page?
3. Check browser console for errors (F12)
4. Check if images are too large (should be under 5MB)

**Fix:**
- Try uploading again and make sure to click Save
- Clear browser cache and reload
- Try a smaller image file

### "Images appear on 'All Work' but disappear on other filters"

**This is normal!** 

The gallery spots are pre-assigned:
- Clicking "Furniture" ONLY shows spots 1 & 4
- Clicking "Renovations" ONLY shows spots 2 & 5
- Clicking "Custom Work" ONLY shows spots 3 & 6

**To fix:** Upload your images to the correct category spots (see table above)

### "I want all my images to show in every filter"

**This requires code modification.** The current design uses dedicated spots for each category. To change this, you'd need to modify the gallery filter JavaScript.

**Simple workaround:** Just remove the filter buttons and only show "All Work"

## Testing Your Gallery

Follow these steps:

1. **Upload one image to each category:**
   - Furniture Gallery → Spot 1 → Upload a furniture photo
   - Renovations Gallery → Spot 1 → Upload a renovation photo
   - Custom Gallery → Spot 1 → Upload a custom work photo

2. **Go to your website**

3. **Click each filter button:**
   - "All Work" → Should show 3 images (spots 1, 2, 3)
   - "Furniture" → Should show 1 image (spot 1 only)
   - "Renovations" → Should show 1 image (spot 2 only)
   - "Custom Work" → Should show 1 image (spot 3 only)

4. **If this works, you're all set!** Just upload more images to fill all 6 spots.

## Current Gallery Mapping

Here's exactly how the admin panel maps to website spots:

### Admin Panel → Website Display

**Furniture Gallery Section (Admin Panel)**
- Spot 1 → Website Gallery Spot 1 (shows on "Furniture" filter)
- Spot 2 → Website Gallery Spot 4 (shows on "Furniture" filter)

**Renovations Gallery Section (Admin Panel)**
- Spot 1 → Website Gallery Spot 2 (shows on "Renovations" filter)
- Spot 2 → Website Gallery Spot 5 (shows on "Renovations" filter)

**Custom Gallery Section (Admin Panel)**
- Spot 1 → Website Gallery Spot 3 (shows on "Custom Work" filter)
- Spot 2 → Website Gallery Spot 6 (shows on "Custom Work" filter)

## Pro Tips

1. **Label your images clearly** - Use descriptive labels so you know what's where
2. **Upload high-quality photos** - But keep them under 5MB each
3. **Test after every upload** - Refresh the main site to see your changes
4. **Use "All Work" as default** - Most visitors will click this anyway
5. **Fill all 6 spots** - A full gallery looks more professional

## Still Having Issues?

1. **Check the browser console** (F12) for error messages
2. **Clear localStorage** (Application → Local Storage → Right-click → Clear)
3. **Re-upload your images** one by one
4. **Test in a different browser** (Chrome, Firefox, Edge)
5. **Make sure images are JPG or PNG** format

## Need Help?

The gallery system works, but the mapping between admin panel categories and website filters can be confusing. The key thing to remember:

**Each of the 6 spots on the website is permanently assigned to a category (Furniture, Renovations, or Custom Work). When you filter, you're just hiding/showing different spots.**

Think of it like this:
- You have 6 picture frames on a wall
- Frames 1 & 4 are labeled "Furniture"
- Frames 2 & 5 are labeled "Renovations"  
- Frames 3 & 6 are labeled "Custom Work"
- The filters just turn the lights on/off for each group

You can't change which frames are labeled what (without code changes), but you CAN choose what photos to put in each frame!

---

**Bottom Line:** Upload images to the category that matches where you want them to appear, and the filtering will work perfectly! ✨
