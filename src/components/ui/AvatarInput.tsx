import React, { useRef, useState, useEffect } from "react";
import { Camera, X } from "lucide-react";

interface AvatarInputProps {
    avatar: File | null;
    onChange: (file: File | null) => void;
}

const AvatarInput: React.FC<AvatarInputProps> = ({ avatar, onChange }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string>("");

    useEffect(() => {
        if (!avatar) {
            setPreview("");
            return;
        }
        const objectUrl = URL.createObjectURL(avatar);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [avatar]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        onChange(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onChange(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer" onClick={handleClick}>
                {preview ? (
                    <>
                        <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200 transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                        >
                            <X className="w-4 h-4 text-gray-700" />
                        </button>
                    </>
                ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                )}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
            <span className="text-gray-500 text-sm">Загрузить аватар</span>
        </div>
    );
};

export default AvatarInput;
