'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { checkAuth } from '@/lib/bfh-api-client';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 認証状態を確認
    checkAuth()
      .then(setIsLoggedIn)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🎮 BFH Tools
            </h1>
            {!loading && (
              <div>
                {isLoggedIn ? (
                  <a
                    href="/api/auth/logout"
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    ログアウト
                  </a>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    ブレヒロでログイン
                  </Link>
                )}
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Brave Frontier Heroes 非公式ツール
          </p>
        </header>

        {/* 機能カード */}
        <div className="grid grid-cols-1 gap-6">
          {/* マイページセクション（認証必要） */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              🔐 機能一覧（要ログイン）
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              ログインすると自分のアカウント情報やアセットを確認できます
            </p>
            {isLoggedIn ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="block w-full px-4 py-3 bg-green-50 dark:bg-gray-700 text-green-700 dark:text-green-300 rounded hover:bg-green-100 dark:hover:bg-gray-600 transition text-center"
                >
                  プロフィール
                </Link>
                <Link
                  href="/encyclopedia/heroes"
                  className="block w-full px-4 py-3 bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-gray-600 transition text-center"
                >
                  ユニット図鑑
                </Link>
                <Link
                  href="/encyclopedia/spheres"
                  className="block w-full px-4 py-3 bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-gray-600 transition text-center"
                >
                  スフィア図鑑
                </Link>
                <Link
                  href="/rankmatch"
                  className="block w-full px-4 py-3 bg-green-50 dark:bg-gray-700 text-green-700 dark:text-green-300 rounded hover:bg-green-100 dark:hover:bg-gray-600 transition text-center"
                >
                  ランクマッチ
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  ログインが必要です
                </p>
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  ブレヒロでログイン
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* 注意事項 */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>⚠️ このツールは非公式です。運営サーバーに負荷をかけないよう配慮しています。</p>
          <p className="mt-1">問題があれば使用を控えてください。</p>
        </footer>
      </div>
    </div>
  );
}
