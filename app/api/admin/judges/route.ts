import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
export async function PUT(request: NextRequest) { const auth = await requireAdmin(); if ("error" in auth) return auth.error; const { id, name } = await request.json(); if (!name?.trim()) return NextResponse.json({ error: "A name is required." }, { status: 400 }); const { error } = await db().from("judges").update({ name: name.trim() }).eq("id", id); return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true }); }
