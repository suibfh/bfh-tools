// BFH API 直接呼び出しヘルパー

const BFH_API_BASE = 'https://api.bravefrontierheroes.com';

/**
 * Cookieからアクセストークンを取得
 */
function getAccessToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith('bfh_access_token='));
  
  if (!tokenCookie) return null;
  
  return tokenCookie.split('=')[1];
}

/**
 * BFH APIを呼び出す
 */
export async function callBFHApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 既存のheadersをマージ
  if (options.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BFH_API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * ユーザー情報を取得
 */
export async function getMe(): Promise<any> {
  return callBFHApi('/v1/me');
}

/**
 * 全ヒーローを取得
 */
export async function getHeroes(heroIds?: number[]): Promise<any> {
  return callBFHApi('/v1/heroes', {
    method: 'POST',
    body: JSON.stringify({ hero_ids: heroIds || [] }),
  });
}

/**
 * 全スフィアを取得
 */
export async function getSpheres(sphereIds?: number[]): Promise<any> {
  return callBFHApi('/v1/spheres', {
    method: 'POST',
    body: JSON.stringify({ sphere_ids: sphereIds || [] }),
  });
}

/**
 * 所持ユニットを取得
 */
export async function getMyUnits(): Promise<any> {
  return callBFHApi('/v1/me/units');
}

/**
 * 所持スフィアを取得
 */
export async function getMySpheres(): Promise<any> {
  return callBFHApi('/v1/me/spheres');
}

/**
 * ランクマッチ一覧を取得
 */
export async function getRankMatches(status: 'ongoing' | 'finished' = 'ongoing'): Promise<any> {
  return callBFHApi(`/v1/rankmatches?status=${status}`);
}

/**
 * ランクマッチ履歴を取得
 */
export async function getRankMatchHistory(rankMatchId: number): Promise<any> {
  return callBFHApi(`/v1/rankmatches/${rankMatchId}/history`);
}

/**
 * 認証状態をチェック
 */
export async function checkAuth(): Promise<boolean> {
  try {
    await getMe();
    return true;
  } catch {
    return false;
  }
}
