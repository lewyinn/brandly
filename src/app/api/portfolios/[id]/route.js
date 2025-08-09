import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

// GET by id (public)
export async function GET(_req, context) {
    const supabase = await createServerSupabase();
    const { id } = context.params;

    const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
}

// PUT update by id (returns JSON)
export async function PUT(req, context ) {
    const supabase = await createServerSupabase();
    const { id } = context.params;
    const body = await req.json();

    if (body.tech && !Array.isArray(body.tech)) {
        return NextResponse.json({ error: 'tech must be an array' }, { status: 400 });
    }

    const payload = {
        foto_url: body.foto_url ?? null,
        type: body.type ?? null,
        judul: body.judul ?? null,
        deskripsi: body.deskripsi ?? null,
        tech: body.tech ?? [],
        link_portfolio: body.link_portfolio ?? null,
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('portfolios')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

// (opsional) DELETE by id
export async function DELETE(_req, context) {
    const supabase = await createServerSupabase();
    const { id } = context.params;

    const { error } = await supabase.from('portfolios').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
}
