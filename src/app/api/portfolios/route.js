import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

// GET: list portfolios (public read)
// Query opsional: ?q=search&type=Website|Social%20Media&active=true|false
export async function GET(req) {
    const supabase = await createServerSupabase();
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const type = (searchParams.get('type') || '').trim();          // 'Website' | 'Social Media'
    const active = searchParams.get('active');                      // 'true' | 'false' | null

    let query = supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false });

    if (type) query = query.eq('type', type);
    if (active === 'true') query = query.eq('is_active', true);
    if (active === 'false') query = query.eq('is_active', false);

    // Jika ada q, ambil dulu lalu filter di server (karena OR ILIKE multi kolom)
    if (q) {
        const { data, error } = await query;
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        const s = q.toLowerCase();
        const filtered = (data || []).filter((p) => {
            const inJudul = (p.judul || '').toLowerCase().includes(s);
            const inDesk = (p.deskripsi || '').toLowerCase().includes(s);
            const inType = (p.type || '').toLowerCase().includes(s);
            const inLink = (p.link_portfolio || '').toLowerCase().includes(s);
            const inTech =
                Array.isArray(p.tech) ? p.tech.join(' ').toLowerCase().includes(s) : false;
            return inJudul || inDesk || inType || inLink || inTech;
        });
        return NextResponse.json(filtered);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data || []);
}

// POST: create portfolio
export async function POST(req) {
    const supabase = await createServerSupabase();
    const body = await req.json();

    if (body.tech && !Array.isArray(body.tech)) {
        return NextResponse.json({ error: 'tech must be an array of text' }, { status: 400 });
    }

    const payload = {
        foto_url: body.foto_url ?? null,
        type: body.type, // 'Website' | 'Social Media'
        judul: body.judul ?? null,
        deskripsi: body.deskripsi ?? null,
        tech: Array.isArray(body.tech) ? body.tech : [],
        link_portfolio: body.link_portfolio ?? null,
        is_active: body.is_active ?? true,
    };

    const { data, error } = await supabase
        .from('portfolios')
        .insert(payload)
        .select('*')
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

// PATCH: update portfolio by id (id di body)
export async function PATCH(req) {
    const supabase = await createServerSupabase();
    const body = await req.json();
    const { id, ...rest } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    if (rest.tech && !Array.isArray(rest.tech)) {
        return NextResponse.json({ error: 'tech must be an array of text' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('portfolios')
        .update({ ...rest, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

// DELETE: delete portfolio by id (id di body)
export async function DELETE(req) {
    const supabase = await createServerSupabase();
    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { error } = await supabase.from('portfolios').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
}
