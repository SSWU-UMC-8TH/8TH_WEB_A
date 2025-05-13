// src/components/AddLpModal.tsx
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";

interface AddLpModalProps {
  onClose: () => void;
}

export const AddLpModal = ({ onClose }: AddLpModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const uploadImageToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post("/v1/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data.imageUrl;
  };

  const createLpMutation = useMutation({
    mutationFn: async () => {
      let thumbnailUrl = "/LP.png";

      if (thumbnail) {
        thumbnailUrl = await uploadImageToServer(thumbnail);
      }

      const payload = {
        title,
        content,
        thumbnail: thumbnailUrl,
        tags,
        published: true,
      };

      const response = await axiosInstance.post("/v1/lps", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      onClose();
    },
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 bg-[#2c2c2c] p-6 rounded-xl w-[90%] max-w-md text-white">
        <button className="absolute top-3 right-3 text-xl" onClick={onClose}>
          ✕
        </button>

        <div className="flex flex-col items-center space-y-4">
          <img
            src={thumbnail ? URL.createObjectURL(thumbnail) : "/LP.png"}
            alt="thumbnail"
            onClick={handleImageClick}
            className="w-28 h-28 cursor-pointer rounded-full object-cover"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />

          <input
            placeholder="LP Name"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="LP Content"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex w-full gap-2">
            <input
              placeholder="LP Tag"
              className="flex-1 px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 w-full">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-white hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <button
            className="w-full bg-pink-500 py-2 rounded mt-4 hover:bg-pink-600"
            onClick={() => createLpMutation.mutate()}
            disabled={createLpMutation.isPending || !title.trim() || !content.trim()}
          >
            {createLpMutation.isPending ? "등록 중..." : "Add LP"}
          </button>
        </div>
      </div>
    </div>
  );
};