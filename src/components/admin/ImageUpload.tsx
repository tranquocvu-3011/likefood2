"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (url: string) => void;
    disabled?: boolean;
    multiple?: boolean;
}

export default function ImageUpload({
    value = [],
    onChange,
    onRemove,
    disabled,
    multiple = false
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            // Validate files before upload
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                // Validate file type
                if (!file.type.startsWith("image/")) {
                    toast.error(`File ${file.name} không phải là ảnh`);
                    return;
                }

                // Validate file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    toast.error(`File ${file.name} quá lớn (tối đa 10MB)`);
                    return;
                }
            }

            setIsUploading(true);
            const formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                formData.append("file", files[i]);
            }

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                onChange([...value, ...data.urls]);
                toast.success(`Upload thành công ${data.urls.length} ảnh`);
            } else {
                const error = await res.json();
                logger.error("Image upload failed", new Error(error.error || "Upload failed"), {
                    context: "image-upload-component",
                    errorDetails: error
                });
                toast.error(error.error || "Upload thất bại");
            }
        } catch (error) {
            logger.error("Image upload error", error as Error, { context: "image-upload-component" });
            toast.error("Đã có lỗi xảy ra khi upload");
        } finally {
            setIsUploading(false);
            // Reset input
            if (e.target) {
                e.target.value = "";
            }
        }
    }, [onChange, value]);

    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-wrap gap-4">
                {value
                    .filter((url) => typeof url === "string" && url.trim() !== "")
                    .map((url) => (
                    <div key={url} className="relative w-[150px] h-[150px] rounded-2xl overflow-hidden border-2 border-zinc-800 group">
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Product image"
                            src={url}
                            sizes="150px"
                        />
                    </div>
                ))}

                {(!disabled && (multiple || value.length === 0)) && (
                    <label className={`
                        w-[150px] h-[150px] rounded-2xl border-2 border-dashed border-zinc-700 
                        flex flex-col items-center justify-center gap-2 cursor-pointer
                        hover:border-teal-500/50 hover:bg-teal-500/5 transition-all
                        ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                    `}>
                        {isUploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                        ) : (
                            <>
                                <Upload className="h-8 w-8 text-zinc-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center px-4">
                                    {multiple ? "Thêm ảnh" : "Tải ảnh lên"}
                                </span>
                            </>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            onChange={onUpload}
                            accept="image/*"
                            multiple={multiple}
                            disabled={disabled || isUploading}
                        />
                    </label>
                )}
            </div>

            {value.length === 0 && !isUploading && (
                <div className="flex items-center gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 italic text-zinc-500 text-xs font-medium">
                    <ImageIcon className="h-4 w-4" />
                    Chưa có ảnh nào được chọn
                </div>
            )}
        </div>
    );
}
