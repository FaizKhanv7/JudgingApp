import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/supabase";
export async function GET() { const session = await getSession(); let judge = null; if (session?.judgeId) { const { data } = await db().from("judges").select("id,name").eq("id", session.judgeId).maybeSingle(); judge = data; } return NextResponse.json({ judge, admin: !!session?.admin }); }
