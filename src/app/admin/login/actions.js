'use server';

import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';

export async function signInAction(prevState, formData) {
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    const supabase = await createServerSupabase();

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return { ok: false, message: error.message };
    }

    return { ok: true };
}

export async function signOutAction() {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
    redirect('/admin/login');
}
