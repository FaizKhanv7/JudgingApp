import { NextResponse } from "next/server";
import { getSession } from "./session";
export async function requireJudge() { const session = await getSession(); if (!session?.judgeId) return { error: NextResponse.json({ error: "Please sign in as a judge." }, { status: 401 }) }; return { judgeId: session.judgeId }; }
export async function requireAdmin() { const session = await getSession(); if (!session?.admin) return { error: NextResponse.json({ error: "Admin access required." }, { status: 401 }) }; return {}; }
