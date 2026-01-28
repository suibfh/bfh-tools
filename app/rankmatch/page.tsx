'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRankMatches, getRankMatchHistory } from '@/lib/bfh-api-client';

export default function RankMatchPage() {
  const [rankMatches, setRankMatches] = useState<number[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRankMatches('ongoing')
      .then((data: any) => setRankMatches(data || []))
      .finally(() => setLoading(false));
  }, []);

  const fetchHistory = async (matchId: number) => {
    setSelectedMatch(matchId);
    const data = await getRankMatchHistory(matchId);
    setHistory(data);
  };

  const getBattleReplayUrl = (battleId: number) => `https://bravefrontierheroes.com/ja/battle/${battleId}`;

  if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="container mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">← ホームに戻る</Link>
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">ランクマッチ</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">開催中のランクマッチ</h2>
          {rankMatches.length === 0 ? (
            <p className="text-gray-600">開催中のランクマッチはありません</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {rankMatches.map((id) => (
                <button key={id} onClick={() => fetchHistory(id)} className={`px-4 py-3 rounded transition ${selectedMatch === id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
                  #{id}
                </button>
              ))}
            </div>
          )}
        </div>
        {history && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">戦績</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center"><p className="text-sm text-gray-600">勝利</p><p className="text-2xl font-bold text-green-600">{history.win}</p></div>
                <div className="text-center"><p className="text-sm text-gray-600">敗北</p><p className="text-2xl font-bold text-red-600">{history.lose}</p></div>
                <div className="text-center"><p className="text-sm text-gray-600">勝率</p><p className="text-2xl font-bold text-blue-600">{history.win + history.lose > 0 ? Math.round((history.win / (history.win + history.lose)) * 100) : 0}%</p></div>
                <div className="text-center"><p className="text-sm text-gray-600">レート</p><p className="text-2xl font-bold text-purple-600">{history.rate}</p></div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">バトル履歴（最大20件）</h2>
              <div className="space-y-3">
                {history.results.slice(0, 20).map((result: any, index: number) => (
                  <div key={index} className={`border rounded-lg p-4 ${result.win ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`font-bold ${result.win ? 'text-green-700' : 'text-red-700'}`}>{result.win ? '勝利' : '敗北'}</span>
                      <span className="text-xs text-gray-500">{new Date(result.at).toLocaleString('ja-JP')}</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>レート: {result.last_rate} → {result.new_rate} ({result.new_rate > result.last_rate ? '+' : ''}{result.new_rate - result.last_rate})</p>
                      <p>ダメージ: {result.added_damage} / 被ダメージ: {result.taken_damage}</p>
                    </div>
                    <div className="mt-3">
                      <a href={getBattleReplayUrl(result.battle_id)} target="_blank" rel="noopener noreferrer" className="inline-block text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">リプレイ</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
