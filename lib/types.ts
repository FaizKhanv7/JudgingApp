export type Judge = { id: string; name: string };
export type Team = { id: string; name: string; project_title: string; description: string | null; sort_order: number };
export type Category = { id: string; name: string; weight: number; sort_order: number; rubric_baseline: string; rubric_winning: string };
export type Score = { id?: string; judge_id: string; team_id: string; category_id: string; stars: number };
export type Status = "scoring" | "picking" | "finished";
export type JudgeStatus = { judge_id: string; status: Status; finished_at: string | null };
