import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req) {
    const supabase = await createServerSupabase();

    const form = await req.formData();
    const file = form.get('file');
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const ext = file.name.split('.').pop() || 'png';
    const path = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(path, new Uint8Array(arrayBuffer), {
            contentType: file.type || 'image/png',
            upsert: false,
        });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 400 });

    const { data: publicUrl } = supabase.storage.from('logos').getPublicUrl(path);

    return NextResponse.json({ url: publicUrl.publicUrl });
}