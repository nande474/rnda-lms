"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Shield } from "lucide-react";

interface LogEntry {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string | null;
  createdAt: string;
  actor: { name: string | null; email: string };
}

const ACTION_COLORS: Record<string, "default" | "info" | "success" | "warning"> = {
  USER_UPDATE:  "info",
  USER_CREATE:  "success",
  USER_DELETE:  "warning",
};

const ACTION_LABELS: Record<string, string> = {
  USER_UPDATE: "User Updated",
  USER_CREATE: "User Created",
  USER_DELETE: "User Deleted",
};

function parseDetails(raw: string | null) {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function DetailsCell({ raw }: { raw: string | null }) {
  const data = parseDetails(raw);
  if (!data) return <span className="text-gray-400 text-xs">—</span>;

  return (
    <div className="space-y-0.5">
      {Object.entries(data).map(([key, val]: [string, unknown]) => {
        const v = val as { from?: unknown; to?: unknown };
        return (
          <div key={key} className="text-xs text-gray-600">
            <span className="font-medium text-gray-700 uppercase">{key}: </span>
            {v.from !== undefined ? (
              <span>
                <span className="line-through text-gray-400">{String(v.from ?? "—")}</span>
                {" → "}
                <span className="text-[#1e5631] font-medium">{String(v.to ?? "—")}</span>
              </span>
            ) : (
              <span className="text-[#1e5631] font-medium">{String(v.to ?? "—")}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AuditLogViewer() {
  const [logs,    setLogs]    = useState<LogEntry[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [action,  setAction]  = useState("");
  const [loading, setLoading] = useState(true);

  const PAGE_SIZE = 50;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (action) params.set("action", action);
    const res  = await fetch(`/api/admin/audit?${params}`);
    const data = await res.json();
    setLogs(data.logs ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, action]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1); }}
          options={[
            { value: "",            label: "All actions" },
            { value: "USER_UPDATE", label: "User Updated" },
            { value: "USER_CREATE", label: "User Created" },
            { value: "USER_DELETE", label: "User Deleted" },
          ]}
          className="w-44 text-sm"
        />
        <span className="text-sm text-gray-500">{total} entries</span>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">Loading…</div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center">
              <Shield size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No audit logs yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-3 text-left">When</th>
                    <th className="px-5 py-3 text-left">Actor</th>
                    <th className="px-5 py-3 text-left">Action</th>
                    <th className="px-5 py-3 text-left">Target</th>
                    <th className="px-5 py-3 text-left">Changes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-ZA", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-800">{log.actor.name ?? "—"}</div>
                        <div className="text-xs text-gray-400">{log.actor.email}</div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={ACTION_COLORS[log.action] ?? "default"} className="text-xs">
                          {ACTION_LABELS[log.action] ?? log.action}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        <span className="font-medium">{log.targetType}</span>
                        <div className="text-gray-400 font-mono">{log.targetId.slice(0, 8)}…</div>
                      </td>
                      <td className="px-5 py-3">
                        <DetailsCell raw={log.details} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
