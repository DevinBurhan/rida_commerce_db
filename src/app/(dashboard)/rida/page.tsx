"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type RidaItem } from "@/lib/api";
import { PencilIcon, TrashIcon } from "@/components/icons";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

type RidaFormProps = {
  rida?: RidaItem | null;
  onClose: () => void;
  onSuccess: () => void;
};

function RidaForm({ rida, onClose, onSuccess }: RidaFormProps) {
  const isEdit = !!rida;
  const [ridaName, setRidaName] = useState(rida?.ridaName ?? "");
  const [price, setPrice] = useState(rida ? String(rida.price) : "");
  const [profit, setProfit] = useState(rida ? String(rida.profit) : "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const priceNum = parseFloat(price) || 0;
    const profitNum = parseFloat(profit) || 0;
    setSubmitting(true);
    try {
      const body = { ridaName: ridaName.trim(), price: priceNum, profit: profitNum };
      if (isEdit) {
        await api(`/api/ridas/${rida!._id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await api("/api/ridas", { method: "POST", body: JSON.stringify(body) });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full min-h-[44px] rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rida-form-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-xl border border-zinc-200 bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 sm:px-6">
          <h2 id="rida-form-title" className="text-lg font-semibold text-zinc-900">
            {isEdit ? "Edit Rida" : "Add Rida"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4 sm:px-6">
          <div>
            <label htmlFor="rida-name" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Rida name *
            </label>
            <input
              id="rida-name"
              type="text"
              value={ridaName}
              onChange={(e) => setRidaName(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="rida-price" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Price (selling) *
            </label>
            <input
              id="rida-price"
              type="number"
              min={0}
              step={0.01}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="rida-profit" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Default profit per piece *
            </label>
            <input
              id="rida-profit"
              type="number"
              step={0.01}
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Saving…" : isEdit ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-300 px-4 py-2.5 font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RidaPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<RidaItem | null>(null);

  const { data: list, isLoading, error } = useQuery<RidaItem[]>({
    queryKey: ["ridas"],
    queryFn: () => api("/api/ridas"),
  });

  const deleteRida = useMutation({
    mutationFn: (id: string) => api(`/api/ridas/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ridas"] });
    },
  });

  return (
    <div>
      <nav className="mb-2 text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link href="/dashboard" className="hover:text-zinc-700">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">Rida Module</span>
      </nav>

      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-zinc-900">Rida Module</h1>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span className="text-lg leading-none">+</span>
          Add Rida
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        {isLoading && <div className="p-8 text-center text-zinc-500">Loading…</div>}
        {error && (
          <div className="p-8 text-center text-red-600">
            {error instanceof Error ? error.message : "Failed to load Ridas"}
          </div>
        )}
        {list && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-sky-100">
                    <th className="p-3 font-semibold text-zinc-900">Rida name</th>
                    <th className="p-3 font-semibold text-zinc-900">Price</th>
                    <th className="p-3 font-semibold text-zinc-900">Profit</th>
                    <th className="p-3 font-semibold text-zinc-900">Cost</th>
                    <th className="p-3 font-semibold text-zinc-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-600">
                        No Ridas yet. Add one to get started.
                      </td>
                    </tr>
                  ) : (
                    list.map((r) => (
                      <tr key={r._id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                        <td className="p-3 font-medium text-zinc-900">{r.ridaName}</td>
                        <td className="p-3 text-zinc-700">{formatMoney(r.price)}</td>
                        <td className="p-3 text-zinc-700">{formatMoney(r.profit)}</td>
                        <td className="p-3 text-zinc-600">{formatMoney(r.price - r.profit)}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditing(r)}
                              title="Edit"
                              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
                              aria-label="Edit Rida"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              onClick={() => {
                                if (confirm("Delete this Rida? Invoices using it will keep the stored name.")) {
                                  deleteRida.mutate(r._id);
                                }
                              }}
                              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                              aria-label="Delete Rida"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {createOpen && (
        <RidaForm
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setCreateOpen(false);
            queryClient.invalidateQueries({ queryKey: ["ridas"] });
          }}
        />
      )}
      {editing && (
        <RidaForm
          rida={editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["ridas"] });
          }}
        />
      )}
    </div>
  );
}
