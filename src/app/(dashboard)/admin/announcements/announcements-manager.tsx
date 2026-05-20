"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Plus, Trash2, EyeOff, Eye } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  active: boolean;
  createdAt: string;
  expiresAt: string | null;
  author: { name: string | null };
}

export function AnnouncementsManager() {
  const [items,   setItems]   = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState({ title: "", message: "", expiresAt: "" });
  const [error,   setError]   = useState("");

  const load = async () => {
    const res  = await fetch("/api/admin/announcements");
    const data = await res.json();
    setItems(data.announcements ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/announcements", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        title:     form.title,
        message:   form.message,
        expiresAt: form.expiresAt || null,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setItems((prev) => [data.announcement, ...prev]);
      setForm({ title: "", message: "", expiresAt: "" });
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to create");
    }
    setSaving(false);
  };

  const toggle = async (id: string, active: boolean) => {
    const res = await fetch(`/api/admin/announcements/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ active }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((a) => a.id === id ? { ...a, active } : a));
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Create form */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Plus size={16} /> New Announcement
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={create} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Saturday session cancelled"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6db33f]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Full message visible to all users…"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6db33f] resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expires at (optional)</label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6db33f]"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={saving} className="gap-2">
              <Megaphone size={14} />
              {saving ? "Broadcasting…" : "Broadcast Announcement"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
          All Announcements ({items.length})
        </h2>
        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Megaphone size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No announcements yet</p>
            </CardContent>
          </Card>
        ) : (
          items.map((a) => (
            <Card key={a.id} className={a.active ? "border-[#6db33f]" : "opacity-60"}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">{a.title}</p>
                      <Badge variant={a.active ? "success" : "default"} className="text-[10px]">
                        {a.active ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{a.message}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>By {a.author.name ?? "Admin"}</span>
                      <span>
                        {new Date(a.createdAt).toLocaleDateString("en-ZA", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                      {a.expiresAt && (
                        <span>
                          Expires {new Date(a.expiresAt).toLocaleDateString("en-ZA", {
                            day: "numeric", month: "short",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggle(a.id, !a.active)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#1e5631] hover:bg-[#f0f7eb] transition-colors"
                      title={a.active ? "Hide" : "Show"}
                    >
                      {a.active ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      onClick={() => remove(a.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
