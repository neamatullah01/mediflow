import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const uploadToCloudinary = async (
  fileBuffer: Buffer,
  mimetype: string,
  folder: string = 'mediflow',
): Promise<string> => {
  try {
    const base64Image = fileBuffer.toString('base64');
    const dataUri = `data:${mimetype};base64,${base64Image}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'auto',
    });

    return result.secure_url;
  } catch (error) {
    throw new Error(
      `Cloudinary upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export default uploadToCloudinary;
