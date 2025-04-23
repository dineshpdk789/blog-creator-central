
import React from "react";
import { X } from "lucide-react";

interface ImagesUploadGalleryProps {
  images: string[];
  onRemoveImage: (index: number) => void;
  isSubmitting: boolean;
}

const ImagesUploadGallery: React.FC<ImagesUploadGalleryProps> = ({
  images,
  onRemoveImage,
  isSubmitting
}) => (
  <div className="flex flex-wrap gap-4 mt-2">
    {images.map((image, index) => (
      <div key={index} className="relative group">
        <img
          src={image.startsWith("http") ? image : `https://images.unsplash.com/${image}`}
          alt={`Upload ${index + 1}`}
          className="w-32 h-32 object-cover rounded-md border"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <button
          type="button"
          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemoveImage(index)}
          disabled={isSubmitting}
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

export default ImagesUploadGallery;
