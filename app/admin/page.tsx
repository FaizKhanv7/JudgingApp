"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { api } from "@/components/client";
import type { Judge, Team } from "@/lib/types";
type Data = { judges: Judge[]; teams: Team[] };

export default function Admin() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(() => api("/api/admin/data").then(setData).catch(e => setError(e.message)), []);

  useEffect(() => {
    api("/api/session")
      .then(x => {
        setAuthorized(x.admin);
        if (x.admin) load();
      })
      .catch(() => setAuthorized(false));
  }, [load]);

  async function login(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/api/auth/admin", { method: "POST", body: JSON.stringify({ password }) });
      setAuthorized(true);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign in.");
    }
  }

  async function saveJudge(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    try {
      await api("/api/admin/judges", {
        method: "POST",
        body: JSON.stringify({ name: form.get("name") }),
      });
      formElement.reset();
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add judge.");
    }
  }

  async function saveTeam(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    try {
      await api("/api/admin/teams", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          project_title: form.get("title"),
          description: form.get("description"),
        }),
      });
      formElement.reset();
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add team.");
    }
  }

  async function rename(judge: Judge) {
    const name = prompt("Judge name", judge.name);
    if (!name) return;
    try {
      await api("/api/admin/judges", {
        method: "PUT",
        body: JSON.stringify({ id: judge.id, name }),
      });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not rename judge.");
    }
  }

  async function edit(team: Team) {
    const name = prompt("Team name", team.name);
    if (!name) return;
    const project_title = prompt("Project title", team.project_title);
    if (!project_title) return;
    const description = prompt("Short description (optional)", team.description || "");
    try {
      await api("/api/admin/teams", {
        method: "PUT",
        body: JSON.stringify({ id: team.id, name, project_title, description }),
      });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not edit team.");
    }
  }

  async function remove(team: Team) {
    if (!confirm(`Delete ${team.name}? Its scores will also be removed.`)) return;
    try {
      await api(`/api/admin/teams?id=${team.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete team.");
    }
  }

  async function reset() {
    if (!confirm("Clear every score, pick, and finish status? This cannot be undone.")) return;
    try {
      await api("/api/admin/reset", { method: "POST" });
      alert("Judging has been reset.");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reset.");
    }
  }

  if (authorized === null) {
    return <main className="page"><p className="pt-8 text-center">Loading…</p></main>;
  }
  if (!authorized) {
    return (
      <main className="page flex min-h-screen items-center">
        <form className="card w-full space-y-4" onSubmit={login}>
          <p className="text-sm font-bold uppercase tracking-widest text-coral">Admin</p>
          <h1 className="text-3xl font-black">Manage event</h1>
          <input
            className="field"
            type="password"
            autoFocus
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="button w-full">Sign in</button>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="page">
      <p className="text-sm font-bold uppercase tracking-widest text-coral">Admin</p>
      <h1 className="text-3xl font-black">Event setup</h1>
      <section className="card mt-6">
        <h2 className="text-xl font-bold">Judges</h2>
        <form className="mt-3 flex gap-2" onSubmit={saveJudge}>
          <input className="field" name="name" placeholder="Judge name" required />
          <button className="button shrink-0">Add judge</button>
        </form>
        <div className="mt-3 space-y-2">
          {data?.judges.map(j => (
            <button
              className="button-secondary flex w-full justify-between text-left"
              key={j.id}
              onClick={() => rename(j)}
            >
              {j.name}<span>Edit</span>
            </button>
          ))}
        </div>
      </section>
      <section className="card mt-5">
        <h2 className="text-xl font-bold">Add a team</h2>
        <form className="mt-3 space-y-3" onSubmit={saveTeam}>
          <input className="field" name="name" placeholder="Team name" required />
          <input className="field" name="title" placeholder="Project title" required />
          <textarea className="field min-h-24 py-3" name="description" placeholder="Short description (optional)" />
          <button className="button w-full">Add team</button>
        </form>
      </section>
      <section className="card mt-5">
        <h2 className="text-xl font-bold">Teams</h2>
        <div className="mt-3 space-y-2">
          {data?.teams.map(t => (
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3" key={t.id}>
              <span>
                <b>{t.name}</b>
                <small className="block text-slate-600">{t.project_title}</small>
              </span>
              <span className="flex gap-3">
                <button className="text-sm font-bold underline" onClick={() => edit(t)}>Edit</button>
                <button className="text-sm font-bold text-red-700 underline" onClick={() => remove(t)}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      </section>
      <button
        className="mt-6 w-full rounded-2xl border-2 border-red-200 bg-white p-3 font-bold text-red-700"
        onClick={reset}
      >
        Reset all judging
      </button>
      {error && <p className="mt-4 text-red-700">{error}</p>}
    </main>
  );
}
