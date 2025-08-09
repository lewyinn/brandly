import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data || {});
}

export async function POST(req) {
    const supabase = await createServerSupabase();
    const body = await req.json();

    const { data: current } = await supabase
        .from('profiles')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!current) {
        const { data, error } = await supabase
            .from('profiles')
            .insert({
                logo_url: body.logo_url ?? null,
                title: body.title ?? null,
                subtitle: body.subtitle ?? null,
                description: body.description ?? null,
                whatsapp: body.whatsapp ?? null,
                instagram: body.instagram ?? null,
                facebook: body.facebook ?? null,
            })
            .select('*')
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json(data);
    } else {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                logo_url: body.logo_url ?? null,
                title: body.title ?? null,
                subtitle: body.subtitle ?? null,
                description: body.description ?? null,
                whatsapp: body.whatsapp ?? null,
                instagram: body.instagram ?? null,
                facebook: body.facebook ?? null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', current.id)
            .select('*')
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json(data);
    }
}

export async function PATCH(req) {
    const supabase = await createServerSupabase();
    const body = await req.json();

    const { data: current } = await supabase
        .from('profiles')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!current) return NextResponse.json({ error: 'No profile yet' }, { status: 404 });

    const { data, error } = await supabase
        .from('profiles')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', current.id)
        .select('*')
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

export async function DELETE() {
    const supabase = await createServerSupabase();
    const { data: current } = await supabase
        .from('profiles')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!current) return NextResponse.json({ ok: true });

    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', current.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
}
