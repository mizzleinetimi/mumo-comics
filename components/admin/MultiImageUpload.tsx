'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import imageCompression from 'browser-image-compression';

interface PanelImage {
    id: string;
    file: File;
    preview: string;
    compressed?: File;
}

interface ImageUploadProps {
    onImagesChange: (images: PanelImage[]) => void;
    maxImages?: number;
}

function SortableImage({ image, onRemove }: { image: PanelImage; onRemove: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative group cursor-move border-3 border-black rounded-lg overflow-hidden bg-white"
        >
            <div {...attributes} {...listeners} className="aspect-square relative">
                <Image
                    src={image.preview}
                    alt={`Panel ${image.id}`}
                    fill
                    className="object-cover"
                />
            </div>
            <button
                onClick={onRemove}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full border-2 border-black font-bold hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                ×
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 text-white text-xs font-bold rounded">
                Drag to reorder
            </div>
        </div>
    );
}

export function MultiImageUpload({ onImagesChange, maxImages = 20 }: ImageUploadProps) {
    const [images, setImages] = useState<PanelImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setImages((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                onImagesChange(newOrder);
                return newOrder;
            });
        }
    };

    const compressImage = async (file: File): Promise<File> => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error('Compression failed:', error);
            return file;
        }
    };

    const handleFiles = async (files: FileList | null) => {
        if (!files) return;

        setUploading(true);
        setProgress('Compressing images...');

        const fileArray = Array.from(files).slice(0, maxImages - images.length);
        const newImages: PanelImage[] = [];

        for (let i = 0; i < fileArray.length; i++) {
            const file = fileArray[i];
            setProgress(`Compressing ${i + 1}/${fileArray.length}...`);

            const compressed = await compressImage(file);
            const preview = URL.createObjectURL(compressed);

            newImages.push({
                id: `${Date.now()}-${i}`,
                file,
                compressed,
                preview,
            });
        }

        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesChange(updatedImages);
        setUploading(false);
        setProgress('');
    };

    const removeImage = (id: string) => {
        const updatedImages = images.filter((img) => img.id !== id);
        setImages(updatedImages);
        onImagesChange(updatedImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={`border-3 border-dashed border-black rounded-xl p-8 text-center ${uploading ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                onClick={() => document.getElementById('panel-upload')?.click()}
            >
                <input
                    id="panel-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                    disabled={uploading || images.length >= maxImages}
                />

                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-xl font-heading font-bold text-black mb-2">
                    {uploading ? progress : 'Upload Panel Images'}
                </h3>
                <p className="text-gray-600 font-medium">
                    {uploading
                        ? 'Please wait...'
                        : `Click to select multiple images (${images.length}/${maxImages})`}
                </p>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                    Images will be auto-compressed for faster upload
                </p>
            </div>

            {/* Image Grid with Drag & Drop */}
            {images.length > 0 && (
                <div>
                    <h4 className="font-heading font-bold text-black mb-3">
                        Comic Panels ({images.length})
                    </h4>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {images.map((image) => (
                                    <SortableImage
                                        key={image.id}
                                        image={image}
                                        onRemove={() => removeImage(image.id)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            )}
        </div>
    );
}
