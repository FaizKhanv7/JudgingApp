import { NextResponse } from "next/server";
import { requireJudge } from "@/lib/auth";
import { dashboard, incomplete } from "@/lib/data";
import { db } from "@/lib/supabase";
export async function POST() { const auth = await requireJudge(); if ("error" in auth) return auth.error; const data = await dashboard(auth.judgeId); const missing = incomplete(data.teams, data.categories, data.scores); const pick = data.picks.find(p => p.judge_id === auth.judgeId); if (missing.length || !pick) return NextResponse.json({ error: "Finish every score and choose a Judges’ Pick before locking in.", missing }, { status: 400 }); const { error } = await db().from("judge_status").upsert({ judge_id: auth.judgeId, status: "finished", finished_at: new Date().toISOString() }, { onConflict: "judge_id" }); if (error) return NextResponse.json({ error: "Could not lock your scores." }, { status: 500 }); return NextResponse.json({ ok: true }); }
