"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    businessName: "",
    clientName: "",
    projectType: "",
    scope: "",
    budget: "",
  });
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setProposal("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Request failed");
      const data = await res.json();
      setProposal(data.proposal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Free Proposal Generator</h1>
      <p className="sub">
        Fill in a few details and get a polished, ready-to-send client proposal in seconds.
        Built by Landship.ca.
      </p>

      <form onSubmit={onSubmit}>
        <label>
          Your business name
          <input value={form.businessName} onChange={update("businessName")} required />
        </label>
        <label>
          Client / prospect name
          <input value={form.clientName} onChange={update("clientName")} required />
        </label>
        <label>
          Project type
          <input
            value={form.projectType}
            onChange={update("projectType")}
            placeholder="e.g. AI call answering setup"
            required
          />
        </label>
        <label>
          Scope / what's included
          <textarea value={form.scope} onChange={update("scope")} rows={4} required />
        </label>
        <label>
          Budget / price
          <input value={form.budget} onChange={update("budget")} placeholder="e.g. $999/mo" required />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Generating…" : "Generate proposal"}
        </button>
      </form>

      {error && <p style={{ color: "#ff6b6b", marginTop: 16 }}>{error}</p>}
      {proposal && <div className="output">{proposal}</div>}
    </main>
  );
}
