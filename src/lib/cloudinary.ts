export async function deleteCloudinaryImage(publicId: string) {
  try {
    console.log(`Attempting to delete image with publicId: ${publicId}`);
    
    const response = await fetch('/api/upload/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary deletion API error:', errorData);
      return false;
    }
    
    const data = await response.json();
    console.log('Cloudinary deletion response:', data);
    return data.success;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
}