import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { name } = await request.json();
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "A name is required." }, { status: 400 });
  }

  const client = db();
  const { data: lastJudge, error: orderError } = await client
    .from("judges")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  const { error } = await client.from("judges").insert({
    name: name.trim(),
    sort_order: (lastJudge?.sort_order ?? 0) + 1,
  });
  if (error) {
    return NextResponse.json(
      { error: error.code === "23505" ? "A judge with that name already exists." : error.message },
      { status: error.code === "23505" ? 409 : 500 },
    );
  }
  return NextResponse.json({ ok: true });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id, name } = await request.json();
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "A name is required." }, { status: 400 });
  }
  const { error } = await db().from("judges").update({ name: name.trim() }).eq("id", id);
  return error
    ? NextResponse.json({ error: error.message }, { status: 500 })
    : NextResponse.json({ ok: true });
}
