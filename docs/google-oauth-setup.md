# Google OAuth Setup for Boerne's Handy Hub

This guide walks through setting up "Sign in with Google" for the site.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a Project** → **New Project**
3. Name it: `Boernes Handy Hub` (or similar)
4. Click **Create**

## Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (for any Google user to sign in)
3. Click **Create**
4. Fill in required fields:
   - **App name**: `Boerne's Handy Hub`
   - **User support email**: your email
   - **Developer contact email**: your email
5. Click **Save and Continue**
6. **Scopes**: Click **Add or Remove Scopes**
   - Select: `email`, `profile`, `openid`
   - Click **Update** → **Save and Continue**
7. **Test users**: Skip for now (not needed for published apps)
8. Click **Back to Dashboard**

## Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. **Application type**: `Web application`
4. **Name**: `Boernes Handy Hub Web`
5. **Authorized JavaScript origins**:
   ```
   https://boerneshandyhub.com
   http://localhost:3000
   ```
6. **Authorized redirect URIs**:
   ```
   https://<your-supabase-project>.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```

   > Get your Supabase URL from: Supabase Dashboard → Project Settings → API → Project URL

7. Click **Create**
8. **Save the Client ID and Client Secret** - you'll need these!

## Step 4: Configure Supabase

1. Go to **Supabase Dashboard** → your project
2. **Authentication** → **Providers**
3. Find **Google** and toggle it **ON**
4. Enter:
   - **Client ID**: (from Google Cloud)
   - **Client Secret**: (from Google Cloud)
5. Copy the **Callback URL** shown (add this to Google if you haven't)
6. Click **Save**

## Step 5: Update the App

### Add Google Sign-In Button

In your login pages, add:

```tsx
import { supabase } from '@/lib/supabase';

const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Google sign-in error:', error);
  }
};

// In your JSX:
<button
  onClick={handleGoogleSignIn}
  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Continue with Google
</button>
```

### Create Auth Callback Page

Create `/src/app/auth/callback/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
```

## Step 6: Publish OAuth App (For Production)

1. Go back to **OAuth consent screen** in Google Cloud
2. Click **Publish App**
3. Confirm the prompts

> Note: Until published, only test users you add can sign in.

## Testing

1. Go to your login page
2. Click "Continue with Google"
3. Sign in with your Google account
4. You should be redirected back and logged in

## Troubleshooting

### "redirect_uri_mismatch" Error
- Double-check the redirect URI in Google Cloud matches exactly what Supabase shows
- Include both http://localhost:3000 and https://boerneshandyhub.com versions

### "Access blocked: App not verified"
- Either publish the app OR add your email as a test user in OAuth consent screen

### User Created But No Profile
- Make sure you have a database trigger to create profiles for new users
- Or handle profile creation in your auth callback
