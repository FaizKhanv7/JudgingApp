import { NextResponse } from "next/server";
import { requireJudge } from "@/lib/auth";
import { dashboard } from "@/lib/data";
export async function GET() { const auth = await requireJudge(); if ("error" in auth) return auth.error; try { return NextResponse.json({ ...(await dashboard(auth.judgeId)), judgeId: auth.judgeId }); } catch { return NextResponse.json({ error: "Could not load judging data." }, { status: 500 }); } }
