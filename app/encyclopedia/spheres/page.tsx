'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSpheres } from '@/lib/bfh-api-client';
import type { Sphere } from '@/lib/types/bfh';

export default function SpheresPage() {
  const [spheres, setSpheres] = useState<Sphere[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetchSpheres();
  }, []);

  const fetchSpheres = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: any = await getSpheres();
      const spheresArray = Object.values(data.spheres || {}) as Sphere[];
      setSpheres(spheresArray);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('401')) {
          setError('ログインが必要です');
        } else {
          setError(err.message);
        }
      } else {
        setError('不明なエラー');
      }
    } finally {
      setLoading(false);
    }
  };

  const displayedSpheres = spheres.slice(0, limit);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← ホームに戻る
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">スフィア図鑑</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">読み込み中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            {error.includes('ログイン') ? (
              <Link href="/login" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                ログインする
              </Link>
            ) : (
              <button onClick={fetchSpheres} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                再試行
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              全{spheres.length}個のスフィア / 表示中: {displayedSpheres.length}個
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedSpheres.map((sphere) => (
                <div key={sphere.sphere_id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">ID: {sphere.sphere_id}</h3>
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                      Lv.{sphere.level}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>レアリティ: ★{sphere.rarity}</p>
                    <p>タイプID: {sphere.sphere_type_id}</p>
                    <p>スキル数: {sphere.skill_ids.length}</p>
                  </div>
                </div>
              ))}
            </div>
            {displayedSpheres.length < spheres.length && (
              <div className="text-center mt-8">
                <button onClick={() => setLimit(limit + 50)} className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  さらに表示（残り{spheres.length - displayedSpheres.length}個）
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
