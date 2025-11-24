'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { MultiImageUpload } from '@/components/admin/MultiImageUpload';

interface PanelImage {
    id: string;
    file: File;
    preview: string;
    compressed?: File;
}

export default function NewComic() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        synopsis: '',
        tags: '',
        readingTime: 5,
        author: 'Mumo Team',
        featured: false,
        content: '',
    });

    const [panelImages, setPanelImages] = useState<PanelImage[]>([]);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Upload all panel images
            const uploadedUrls: string[] = [];

            if (panelImages.length > 0) {
                setError('Uploading images...');

                for (let i = 0; i < panelImages.length; i++) {
                    const panel = panelImages[i];
                    const fileToUpload = panel.compressed || panel.file;
                    const fileExt = fileToUpload.name.split('.').pop();
                    const fileName = `panel-${i + 1}.${fileExt}`;
                    const filePath = `${formData.slug}/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('comic-images')
                        .upload(filePath, fileToUpload, { upsert: true });

                    if (uploadError) throw uploadError;

                    uploadedUrls.push(filePath);
                }
            }

            // First image is the cover - use proper Supabase storage URL
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const coverImageUrl = uploadedUrls.length > 0
                ? `${supabaseUrl}/storage/v1/object/public/comic-images/${uploadedUrls[0]}`
                : '';

            // Generate MDX content with panel images
            let content = formData.content;
            if (uploadedUrls.length > 1 && !content.trim()) {
                // Auto-generate panel sections if user hasn't written content
                content = uploadedUrls.map((url, idx) =>
                    `## Panel ${idx + 1}\n\n![Panel ${idx + 1}](${supabaseUrl}/storage/v1/object/public/comic-images/${url})\n`
                ).join('\n');
            }

            // Parse tags
            const tagsArray = formData.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);

            // Insert comic
            const { error: insertError } = await supabase.from('comics').insert({
                title: formData.title,
                slug: formData.slug,
                synopsis: formData.synopsis,
                tags: tagsArray,
                reading_time: formData.readingTime,
                author: formData.author,
                featured: formData.featured,
                content: content,
                cover_image_url: coverImageUrl,
                publish_date: new Date().toISOString(),
            });

            if (insertError) throw insertError;

            // Trigger homepage revalidation
            await fetch('/api/revalidate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_REVALIDATION_SECRET }),
            }).catch(console.error);

            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b-3 border-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-heading font-bold text-black">
                            Create New Comic
                        </h1>
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg border-2 border-black hover:bg-gray-300"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </header>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-3 border-red-500 rounded-xl">
                        <p className="text-red-700 font-bold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="bg-white rounded-xl border-3 border-black p-6">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="w-full px-4 py-3 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-mumo-orange font-medium"
                            placeholder="The Amazing Adventure"
                        />
                    </div>

                    {/* Slug (auto-generated) */}
                    <div className="bg-white rounded-xl border-3 border-black p-6">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Slug (auto-generated)
                        </label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-4 py-3 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-mumo-orange font-mono text-sm"
                            placeholder="the-amazing-adventure"
                        />
                    </div>

                    {/* Synopsis */}
                    <div className="bg-white rounded-xl border-3 border-black p-6">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Synopsis *
                        </label>
                        <textarea
                            required
                            value={formData.synopsis}
                            onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-mumo-orange font-medium"
                            placeholder="A brief description of the comic..."
                        />
                    </div>

                    {/* Tags */}
                    <div className="bg-white rounded-xl border-3 border-black p-6">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-3 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-mumo-orange font-medium"
                            placeholder="technology, streaming, adventure"
                        />
                    </div>

                    {/* Reading Time & Author */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border-3 border-black p-6">
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Reading Time (minutes)
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.readingTime}
                                onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-mumo-orange font-medium"
                            />
                        </div>

                        <div className="bg-white rounded-xl border-3 border-black p-6">
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Author
                            </label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full px-4 py-3 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-mumo-orange font-medium"
                            />
                        </div>
                    </div>

                    {/* Featured */}
                    <div className="bg-white rounded-xl border-3 border-black p-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-5 h-5 border-2 border-black rounded focus:ring-2 focus:ring-mumo-orange"
                            />
                            <span className="font-bold text-gray-900">
                                Mark as Featured ⭐
                            </span>
                        </label>
                    </div>

                    {/* Panel Images with Drag & Drop */}
                    <div className="bg-white rounded-xl border-3 border-black p-6">
                        <label className="block text-sm font-bold text-gray-900 mb-4">
                            Comic Panels *
                        </label>
                        <MultiImageUpload
                            onImagesChange={setPanelImages}
                            maxImages={20}
                        />
                        <p className="mt-4 text-sm text-gray-600 font-medium">
                            📌 <strong>Tip:</strong> First image becomes your cover. Drag to reorder panels!
                        </p>
                    </div>

                    {/* Content (MDX) */}
                    <div className="bg-white rounded-xl border-3 border-black p-6">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Content (MDX) - Optional
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={10}
                            className="w-full px-4 py-3 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-mumo-orange font-mono text-sm"
                            placeholder="Leave blank to auto-generate from panels, or write custom MDX..."
                        />
                        <p className="mt-2 text-sm text-gray-600 font-medium">
                            💡 Leave this blank and we'll auto-generate content from your uploaded panels!
                        </p>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 px-6 bg-mumo-orange text-white font-heading font-bold text-lg rounded-xl border-3 border-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Publishing...' : 'Publish Comic'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-4 bg-gray-200 text-gray-800 font-bold rounded-xl border-3 border-black hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
