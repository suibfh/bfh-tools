'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHeroes } from '@/lib/bfh-api-client';
import type { Hero } from '@/lib/types/bfh';

export default function HeroesPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: any = await getHeroes();
      const heroesArray = Object.values(data.heroes || {}) as Hero[];
      setHeroes(heroesArray);
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

  const displayedHeroes = heroes.slice(0, limit);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← ホームに戻る
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          ユニット図鑑
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">読み込み中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            {error.includes('ログイン') ? (
              <Link
                href="/login"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                ログインする
              </Link>
            ) : (
              <button
                onClick={fetchHeroes}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                再試行
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              全{heroes.length}体のユニット / 表示中: {displayedHeroes.length}体
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedHeroes.map((hero) => (
                <div
                  key={hero.hero_id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      ID: {hero.hero_id}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      Lv.{hero.level}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>レアリティ: ★{hero.rarity}</p>
                    <p>HP: {hero.hp}</p>
                    <p>物理: {hero.phy} / 知力: {hero.int}</p>
                    <p>素早: {hero.agi} / 精神: {hero.spr}</p>
                    <p>防御: {hero.def}</p>
                  </div>
                </div>
              ))}
            </div>

            {displayedHeroes.length < heroes.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setLimit(limit + 50)}
                  className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  さらに表示（残り{heroes.length - displayedHeroes.length}体）
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
