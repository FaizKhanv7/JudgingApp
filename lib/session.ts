import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

type Session = { judgeId?: string; admin?: boolean; judgeVerified?: boolean };
const COOKIE = "hackathon_judging_session";
const secret = () => process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.JUDGE_PASSWORD || "development-secret";
function sign(data: string) { return crypto.createHmac("sha256", secret()).update(data).digest("base64url"); }
export function encodeSession(value: Session) { const data = Buffer.from(JSON.stringify(value)).toString("base64url"); return `${data}.${sign(data)}`; }
export function decodeSession(raw?: string): Session | null { if (!raw) return null; const [data, signature] = raw.split("."); const expected = data ? sign(data) : ""; if (!data || !signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null; try { return JSON.parse(Buffer.from(data, "base64url").toString()); } catch { return null; } }
export async function getSession() { return decodeSession((await cookies()).get(COOKIE)?.value); }
export async function setSession(value: Session) { (await cookies()).set(COOKIE, encodeSession(value), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 12, path: "/" }); }
export async function clearSession() { (await cookies()).delete(COOKIE); }
