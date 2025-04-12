import { deleteFile, UploadcareAuthSchema } from "@uploadcare/rest-client";
import axios from "axios";

const uploadcarePublicKey = import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY;
const uploadcareSecretKey = import.meta.env.VITE_UPLOADCARE_SECRET_KEY;

const uploadcareSimpleAuthSchema = new UploadcareAuthSchema({
  publicKey: uploadcarePublicKey,
  secretKey: uploadcareSecretKey,
});

export const uploadImage = async (file) => {
  try {
    if (!file) throw new Error("No file provided");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("UPLOADCARE_PUB_KEY", uploadcarePublicKey);

    const res = await axios.post(
      "https://upload.uploadcare.com/base/",
      formData,
      {
        headers: {
          Accept: "multipart/form-data",
        },
      }
    );

    if (res.status !== 200 || !res?.data?.file) {
      throw new Error("Failed to upload image");
    }

    return {
      success: true,
      fileId: res.data.file,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const deleteImage = async (uuid) => {
  const result = deleteFile(
    {
      uuid: uuid,
    },
    { authSchema: uploadcareSimpleAuthSchema }
  );

  return result;
};
