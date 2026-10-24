import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/session";
export async function POST(request: NextRequest) { const { password } = await request.json(); if (!process.env.JUDGE_PASSWORD || password !== process.env.JUDGE_PASSWORD) return NextResponse.json({ error: "That password is not correct." }, { status: 401 }); await setSession({ judgeVerified: true }); return NextResponse.json({ ok: true }); }
