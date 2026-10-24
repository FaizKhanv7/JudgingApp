import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { getSession, setSession } from "@/lib/session";
export async function POST(request: NextRequest) { if (!(await getSession())?.judgeVerified) return NextResponse.json({ error: "Enter the judge password first." }, { status: 401 }); const { judgeId } = await request.json(); const { data, error } = await db().from("judges").select("id").eq("id", judgeId).single(); if (error || !data) return NextResponse.json({ error: "Judge not found." }, { status: 404 }); await setSession({ judgeId, judgeVerified: true }); return NextResponse.json({ ok: true }); }
