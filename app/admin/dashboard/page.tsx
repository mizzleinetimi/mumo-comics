'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Comic {
  id: string;
  title: string;
  slug: string;
  publish_date: string;
  tags: string[];
  featured: boolean;
}

export default function AdminDashboard() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      router.push('/admin');
    }
  };

  const fetchComics = async () => {
    const { data } = await supabase
      .from('comics')
      .select('id, title, slug, publish_date, tags, featured')
      .order('publish_date', { ascending: false });

    if (data) {
      setComics(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
    fetchComics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    console.log('Deleting comic ID:', id);
    const { error } = await supabase.from('comics').delete().eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete: ${error.message}`);
    } else {
      console.log('Delete successful');
      setComics(comics.filter((c) => c.id !== id));

      // Trigger homepage revalidation
      fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.NEXT_PUBLIC_REVALIDATION_SECRET,
        }),
      }).catch(console.error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-mumo-orange border-3 border-black rounded-full flex items-center justify-center font-heading font-bold text-white text-3xl shadow-hard mx-auto mb-4 animate-bounce">
            M
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-mumo-orange border-3 border-black rounded-full flex items-center justify-center font-heading font-bold text-white text-2xl shadow-hard">
                M
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-black">
                  Comic Manager
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Manage your Mumo comics
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg border-2 border-black hover:bg-gray-300 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-black">
            Comics ({comics.length})
          </h2>
          <Link
            href="/admin/dashboard/new"
            className="px-6 py-3 bg-mumo-orange text-white font-heading font-bold rounded-xl border-3 border-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all"
          >
            + New Comic
          </Link>
        </div>

        {comics.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-3 border-black">
            <div className="w-24 h-24 bg-mumo-yellow border-3 border-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Image src="/images/yam.svg" alt="Yam" width={48} height={48} />
            </div>
            <h3 className="text-xl font-heading font-bold text-black mb-2">
              No comics yet
            </h3>
            <p className="text-gray-600 font-medium mb-6">
              Create your first comic to get started!
            </p>
            <Link
              href="/admin/dashboard/new"
              className="inline-block px-6 py-3 bg-mumo-orange text-white font-heading font-bold rounded-xl border-3 border-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all"
            >
              Create Comic
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-3 border-black overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-3 border-black">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-heading font-bold text-black uppercase">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-heading font-bold text-black uppercase">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-heading font-bold text-black uppercase">
                    Published
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-heading font-bold text-black uppercase">
                    Tags
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-heading font-bold text-black uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {comics.map((comic) => (
                  <tr key={comic.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {comic.featured && (
                          <span className="text-yellow-500">⭐</span>
                        )}
                        <span className="font-bold text-gray-900">
                          {comic.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {comic.slug}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                      {new Date(comic.publish_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {comic.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-mumo-blue text-white text-xs font-bold rounded border border-black"
                          >
                            {tag}
                          </span>
                        ))}
                        {comic.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded">
                            +{comic.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/dashboard/edit/${comic.id}`}
                        className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded border-2 border-black hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={(e) => handleDelete(comic.id, e)}
                        className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded border-2 border-black hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
