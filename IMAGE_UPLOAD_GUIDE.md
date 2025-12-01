# Image Upload Setup Guide

## Getting Your ImgBB API Key

1. Go to [ImgBB API](https://api.imgbb.com/)
2. Click "Get API Key" (no account required - just enter email)
3. Copy your API key
4. Add it to `.env.local`:
   ```
   IMGBB_API_KEY=your_actual_api_key_here
   ```
5. Restart your dev server

## Using the ImageUpload Component

### Basic Usage

```tsx
import { ImageUpload } from './components/ImageUpload';

function MyComponent() {
  const handleImageUploaded = (url: string) => {
    console.log('Image uploaded:', url);
    // Use the URL (save to state, add to trip gallery, etc.)
  };

  return (
    <ImageUpload onImageUploaded={handleImageUploaded} />
  );
}
```

### Advanced Usage

```tsx
<ImageUpload
  onImageUploaded={handleImageUploaded}
  buttonText="Add Photo"
  showPreview={true}
  className="my-4"
/>
```

## Example Integration: Adding Images to Trip Comments

In `NextTrip.tsx`, you can integrate image uploads with comments:

```tsx
import { ImageUpload } from './ImageUpload';

// Inside your component:
const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);

const handleImageUploaded = (url: string) => {
  setPendingImageUrl(url);
};

const handleSendMessage = () => {
  const comment: Comment = {
    id: Date.now().toString(),
    memberId: currentUser.id,
    text: newMessage,
    timestamp: Date.now(),
    imageUrl: pendingImageUrl || undefined, // Attach uploaded image
  };
  
  // Send comment and clear pending image
  handleAddComment(comment);
  setPendingImageUrl(null);
  setNewMessage('');
};

// In your JSX:
<ImageUpload
  onImageUploaded={handleImageUploaded}
  buttonText="📷 Add Photo"
  showPreview={true}
/>
```

## Features

- ✅ Free unlimited uploads (ImgBB free tier)
- ✅ Up to 32MB per image
- ✅ Automatic image validation
- ✅ Preview before upload
- ✅ Loading states
- ✅ Error handling
- ✅ Returns CDN-hosted URL

## ImgBB Limits (Free Tier)

- Max file size: 32MB
- Unlimited uploads
- No account required for API key
- CDN-backed URLs (fast worldwide)
- Images stored permanently

## Alternative: imgbox

If you want to use imgbox instead (also free):

1. Visit: https://imgbox.com/
2. Use their upload API (no key needed for anonymous uploads)
3. Update `imageUploadService.ts` to use imgbox endpoint

## Troubleshooting

**Error: "Image upload not configured"**
- Make sure `IMGBB_API_KEY` is in `.env.local`
- Restart your dev server after adding the key

**Upload fails**
- Check file size (must be < 32MB)
- Ensure file is a valid image format
- Check browser console for detailed error messages
