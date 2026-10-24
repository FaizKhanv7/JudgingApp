import "server-only";
import { db } from "./supabase";
import type { Category, Judge, JudgeStatus, Score, Team } from "./types";

export async function dashboard(judgeId?: string) {
  const client = db();
  const [judges, teams, categories, statuses, scores, picks] = await Promise.all([
    client.from("judges").select("id,name").order("sort_order"), client.from("teams").select("*").order("sort_order"),
    client.from("categories").select("*").order("sort_order"), client.from("judge_status").select("*"),
    judgeId ? client.from("scores").select("*").eq("judge_id", judgeId) : client.from("scores").select("*"), client.from("judge_picks").select("judge_id,team_id")
  ]);
  for (const result of [judges, teams, categories, statuses, scores, picks]) if (result.error) throw result.error;
  return { judges: judges.data as Judge[], teams: teams.data as Team[], categories: categories.data as Category[], statuses: statuses.data as JudgeStatus[], scores: scores.data as Score[], picks: picks.data as {judge_id:string;team_id:string}[] };
}

export function incomplete(teams: Team[], categories: Category[], scores: Score[]) {
  const lookup = new Set(scores.map(s => `${s.team_id}:${s.category_id}`));
  return teams.map(team => ({ team, categories: categories.filter(category => !lookup.has(`${team.id}:${category.id}`)) })).filter(x => x.categories.length);
}
