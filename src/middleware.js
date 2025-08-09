import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req) {
    const res = NextResponse.next();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) { return req.cookies.get(name)?.value; },
                set(name, value, options) { res.cookies.set({ name, value, ...options }); },
                remove(name, options) { res.cookies.set({ name, value: '', ...options }); },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();

    const isLoginPage = req.nextUrl.pathname.startsWith('/admin/login');

    if (!session && !isLoginPage) {
        const url = req.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('redirect', req.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    if (session && isLoginPage) {
        const url = req.nextUrl.clone();
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
    }

    return res;
}

export const config = {
    matcher: ['/admin/:path*'],
};
