import React, { Dispatch, SetStateAction } from "react";
import { uploadImageToServer } from "../apis/lp";

type ThumbnailInputProps = {
  thumbnail: string;
  setThumbnail: Dispatch<SetStateAction<string>>;
};

export function ThumbnailInput({ thumbnail, setThumbnail }: ThumbnailInputProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImageToServer(file);
      setThumbnail(imageUrl);
    } catch (error) {
      alert("이미지 업로드에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {thumbnail && (
        <img
          src={thumbnail}
          alt="썸네일 미리보기"
          className="mt-4 w-48 h-48 object-cover rounded"
        />
      )}
    </div>
  );
}
