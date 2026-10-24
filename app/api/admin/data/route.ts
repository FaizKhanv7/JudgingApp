import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { dashboard } from "@/lib/data";
export async function GET() { const auth = await requireAdmin(); if ("error" in auth) return auth.error; const { judges, teams } = await dashboard(); return NextResponse.json({ judges, teams }); }
