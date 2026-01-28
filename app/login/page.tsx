'use client';

import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!clientId || !appUrl) {
      window.location.href = '/?error=config_error';
      return;
    }

    const redirectUri = `${appUrl}/api/auth/callback`;
    
    const authUrl = new URL('https://auth.bravefrontierheroes.com/oauth2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid profile email');

    console.log('Redirecting to:', authUrl.toString());
    
    // クライアントサイドでリダイレクト
    window.location.href = authUrl.toString();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">ブレヒロ認証画面にリダイレクト中...</p>
      </div>
    </div>
  );
}
