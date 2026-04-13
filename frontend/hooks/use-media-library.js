"use client";

import { useEffect, useState } from "react";

import { canUseUnsignedCloudinaryUpload, uploadToCloudinarySigned, uploadToCloudinaryUnsigned } from "@/lib/cloudinary-upload";
import { cmsApi } from "@/lib/cms-api";

const parseCloudinaryUrl = (url) => {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname || "";
    const marker = "/image/upload/";
    const markerIndex = pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    const afterUpload = pathname.slice(markerIndex + marker.length);
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    const withoutExtension = withoutVersion.replace(/\.[a-zA-Z0-9]+$/, "");
    const publicId = decodeURIComponent(withoutExtension);

    return {
      url,
      publicId,
      alt: "",
      width: null,
      height: null,
      format: (url.split(".").pop() || "").toLowerCase()
    };
  } catch (_error) {
    return null;
  }
};

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
      if ((result.cloudinaryTotalCount || 0) > 0 && (result.cloudinaryResourceCount || 0) === 0) {
        setError(
          "Cloudinary dang co anh, nhung API key hien tai khong doc duoc chi tiet asset de hien thi thu vien. Ban van co the upload moi trong modal nay hoac paste URL Cloudinary de import tay."
        );
      }
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

  const importFromUrl = async (url) => {
    const parsed = parseCloudinaryUrl(url);

    if (!parsed?.publicId) {
      throw new Error("URL Cloudinary khong hop le");
    }

    const created = await cmsApi.createMedia({
      ...parsed,
      folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "vinhhy-blog"
    });

    setMedia((current) => {
      const next = [created, ...current.filter((item) => item.publicId !== created.publicId)];
      return next;
    });

    return created;
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
    setError,
    loadMedia,
    uploadFile,
    removeMedia,
    importFromUrl
  };
}
