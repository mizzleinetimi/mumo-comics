'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-mumo-yellow flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border-3 border-black shadow-hard p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-mumo-orange border-3 border-black rounded-full flex items-center justify-center font-heading font-bold text-white text-3xl shadow-hard mx-auto mb-4">
            M
          </div>
          <h1 className="text-3xl font-heading font-bold text-black mb-2">
            Mumo Comics Admin
          </h1>
          <p className="text-gray-600 font-medium">
            Sign in to manage your comics
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-mumo-orange font-medium"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-3 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-mumo-orange font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-mumo-orange text-white font-heading font-bold rounded-xl border-3 border-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 active:translate-y-0 active:shadow-hard-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 font-medium">
            Powered by Yams{' '}
            <Image
              src="/images/yam.svg"
              alt="Yam"
              width={16}
              height={16}
              className="inline-block"
            />
          </p>
        </div>
      </div>
    </div>
  );
}
