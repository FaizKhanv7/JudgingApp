import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { getSession } from "@/lib/session";
export async function GET() { if (!(await getSession())?.judgeVerified) return NextResponse.json({ error: "Enter the judge password first." }, { status: 401 }); const { data, error } = await db().from("judges").select("id,name").order("sort_order"); return error ? NextResponse.json({ error: "Could not load judges." }, { status: 500 }) : NextResponse.json({ judges: data }); }
