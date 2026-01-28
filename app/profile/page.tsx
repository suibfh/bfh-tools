'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMe, getMyUnits, getMySpheres } from '@/lib/bfh-api-client';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [spheres, setSpheres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getMe(), getMyUnits(), getMySpheres()])
      .then(([meData, unitsData, spheresData]) => {
        setUser(meData.user);
        setUnits(unitsData.units || []);
        setSpheres(spheresData.spheres || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>);
  if (error) return (<div className="min-h-screen p-8"><div className="bg-red-50 rounded p-6"><p className="text-red-800">{error}</p><Link href="/" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded">ホームに戻る</Link></div></div>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="container mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">← ホームに戻る</Link>
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">プロフィール</h1>
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">基本情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-600">名前:</span> <span className="ml-2 font-medium text-gray-900 dark:text-white">{user.name}</span></div>
              <div><span className="text-gray-600">UID:</span> <span className="ml-2 font-medium text-gray-900 dark:text-white">{user.uid}</span></div>
              <div><span className="text-gray-600">レベル:</span> <span className="ml-2 font-medium text-gray-900 dark:text-white">{user.level}</span></div>
              <div><span className="text-gray-600">勝利:</span> <span className="ml-2 font-medium text-green-600">{user.total_win}</span></div>
              <div><span className="text-gray-600">敗北:</span> <span className="ml-2 font-medium text-red-600">{user.total_lose}</span></div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">所持ユニット</h2>
            <p className="text-2xl font-bold text-blue-600">{units.length}体</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">所持スフィア</h2>
            <p className="text-2xl font-bold text-purple-600">{spheres.length}個</p>
          </div>
        </div>
      </div>
    </div>
  );
}
