import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/session";
export async function POST(request: NextRequest) { const { password } = await request.json(); if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "That password is not correct." }, { status: 401 }); await setSession({ admin: true }); return NextResponse.json({ ok: true }); }
