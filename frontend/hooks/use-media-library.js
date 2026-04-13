"use client";

import { useEffect, useState } from "react";

import { canUseUnsignedCloudinaryUpload, uploadToCloudinarySigned, uploadToCloudinaryUnsigned } from "@/lib/cloudinary-upload";
import { cmsApi } from "@/lib/cms-api";

export function useMediaLibrary(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [media, setMedia] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadMedia = async (nextSearch = search) => {
    setLoading(true);
    setError("");

    try {
      const result = await cmsApi.getMedia({ search: nextSearch });
      setMedia(result.resources || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const uploadFile = async (file) => {
    setUploading(true);
    setError("");

    try {
      let uploaded;

      if (canUseUnsignedCloudinaryUpload()) {
        uploaded = await uploadToCloudinaryUnsigned(file);
      } else {
        uploaded = await uploadToCloudinarySigned(file);
      }

      uploaded = await cmsApi.createMedia({
        ...uploaded,
        folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "vinhhy-blog"
      });

      setMedia((current) => [uploaded, ...current]);
      return uploaded;
    } catch (uploadError) {
      const message =
        uploadError.message?.includes("permissions") || uploadError.message?.includes("403") || uploadError.message?.toLowerCase().includes("cloudinary")
          ? `${uploadError.message}. Cloudinary key hien tai dang thieu quyen create/upload. Hay cap quyen create cho API key nay hoac tao unsigned upload preset roi them NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME va NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET vao frontend/.env.`
          : uploadError.message;

      setError(message);
      throw uploadError;
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = async (publicId) => {
    await cmsApi.deleteMedia(publicId);
    setMedia((current) => current.filter((item) => item.publicId !== publicId));
  };

  return {
    isOpen,
    setIsOpen,
    media,
    search,
    setSearch,
    loading,
    uploading,
    error,
    loadMedia,
    uploadFile,
    removeMedia
  };
}
