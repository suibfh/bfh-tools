import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  console.log('[Callback] Received code:', code ? 'YES' : 'NO');

  if (!code) {
    console.error('[Callback] No code received');
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  console.log('[Callback] Environment check:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    hasAppUrl: !!appUrl,
  });

  if (!clientId || !clientSecret || !appUrl) {
    console.error('[Callback] Missing environment variables');
    return NextResponse.redirect(new URL('/?error=config_error', request.url));
  }

  const redirectUri = `${appUrl}/api/auth/callback`;
  console.log('[Callback] Using redirect_uri:', redirectUri);

  try {
    // トークン交換
    const tokenResponse = await fetch('https://auth.bravefrontierheroes.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    console.log('[Callback] Token response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[Callback] Token exchange failed:', errorText);
      return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
    }

    const tokens = await tokenResponse.json();
    console.log('[Callback] Token received:', {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiresIn: tokens.expires_in,
    });

    // トークンをCookieに保存（運営と同じ設定）
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // アクセストークン: クライアントからアクセス可能（httpOnly: false）
    response.cookies.set('bfh_access_token', tokens.access_token, {
      httpOnly: false,  // クライアントからアクセス可能
      secure: true,
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600,
      path: '/',
    });

    // リフレッシュトークン: セキュア保存（httpOnly: true）
    if (tokens.refresh_token) {
      response.cookies.set('bfh_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30日
        path: '/',
      });
    }

    console.log('[Callback] Cookies set with httpOnly=false for access_token');
    return response;
  } catch (error) {
    console.error('[Callback] Authentication error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
