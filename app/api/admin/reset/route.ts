import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
export async function POST() { const auth = await requireAdmin(); if ("error" in auth) return auth.error; const client = db(); const [scores, picks, status] = await Promise.all([client.from("scores").delete().neq("id", "00000000-0000-0000-0000-000000000000"), client.from("judge_picks").delete().neq("judge_id", "00000000-0000-0000-0000-000000000000"), client.from("judge_status").update({ status: "scoring", finished_at: null }).neq("judge_id", "00000000-0000-0000-0000-000000000000")]); const error = scores.error || picks.error || status.error; return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true }); }
