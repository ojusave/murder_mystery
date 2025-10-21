# Background Image Setup Instructions

## To use the BLACK LOTUS poster as your website background:

1. **Save the image**: 
   - Download the BLACK LOTUS movie poster image
   - Save it as `black-lotus-poster.jpg` in the `/public/` folder
   - The file should be located at: `/public/black-lotus-poster.jpg`

2. **Image specifications**:
   - Recommended size: 1920x1080px or larger
   - Format: JPG or PNG
   - The image will be automatically scaled and centered

3. **Current implementation**:
   - Background image is set to `bg-cover bg-center bg-no-repeat`
   - Dark overlay (`bg-black/60`) ensures text readability
   - All text has drop shadows for better visibility
   - Cards have enhanced backgrounds with borders

4. **If you want to adjust the overlay**:
   - Change `bg-black/60` to `bg-black/40` for lighter overlay
   - Change `bg-black/60` to `bg-black/80` for darker overlay

5. **Alternative image names**:
   - If you save the image with a different name, update line 9 in `/src/app/page.tsx`
   - Change `backgroundImage: 'url(/black-lotus-poster.jpg)'` to your filename

The background will create an amazing atmospheric effect for your murder mystery event!
