import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(req) {
    const supabase = await createServerSupabase();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() || '';
    const type = searchParams.get('type')?.trim() || '';

    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    // filter type (optional)
    if (type) query = query.eq('type', type);

    // simple search (title/description/price)
    if (q) {
        // Supabase tidak support OR ILIKE multiple kolom langsung di SDK,
        // pakai filter di server setelah fetch (aman karena data tidak terlalu besar)
        const { data, error } = await query;
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        const lower = q.toLowerCase();
        const filtered = (data || []).filter(p =>
            (p.title || '').toLowerCase().includes(lower) ||
            (p.description || '').toLowerCase().includes(lower) ||
            (p.price || '').toLowerCase().includes(lower) ||
            (p.type || '').toLowerCase().includes(lower) ||
            (Array.isArray(p.features) ? p.features.join(' ').toLowerCase().includes(lower) : false)
        );
        return NextResponse.json(filtered);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data || []);
}

// POST: create product
export async function POST(req) {
    const supabase = await createServerSupabase();
    const body = await req.json();

    const payload = {
        title: body.title ?? null,
        description: body.description ?? null,
        price: body.price ?? null,
        features: Array.isArray(body.features) ? body.features : [],
        type: body.type,         // 'UMKM' | 'Perusahaan' | 'Sekolah'
        is_active: body.is_active ?? true,
    };

    const { data, error } = await supabase.from('products').insert(payload).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

// PATCH: update product by id (id di body)
export async function PATCH(req) {
    const supabase = await createServerSupabase();
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    if (rest.features && !Array.isArray(rest.features)) {
        return NextResponse.json({ error: 'features must be an array of text' }, { status: 400 });
    }

    const { data, error } = await supabase.from('products')
        .update({ ...rest, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

// DELETE: delete product by id (id di body)
export async function DELETE(req) {
    const supabase = await createServerSupabase();
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
}
