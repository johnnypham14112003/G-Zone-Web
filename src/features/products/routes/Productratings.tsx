import React, { useEffect, useState } from 'react';
import api from '@/lib/axios-api';

interface Rating {
  'rating-id': string;
  'rating-score': number;
  'comment': string;
  'admin-reply'?: string;
  'helpful-count': number;
  'created-at': string;
  'is-verified-purchase': boolean;
  'is-hidden': boolean;
  'customer-id': string;
}

const getRatingsByProduct = async (productId: string): Promise<Rating[]> => {
  const response = await api.get(`/rating/${productId}`);
  return response.data.data ?? response.data ?? [];
};

const Stars: React.FC<{ score: number; size?: string }> = ({ score, size = 'text-base' }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={`material-symbols-outlined ${size} ${i <= score ? 'text-yellow-400' : 'text-white/15'}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        star
      </span>
    ))}
  </div>
);

// ─── Score bar ────────────────────────────────────────────────────
const ScoreBar: React.FC<{ label: number; count: number; total: number }> = ({ label, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-text-muted w-3 text-right">{label}</span>
      <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full bg-yellow-400/70 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-text-muted w-6 text-right">{count}</span>
    </div>
  );
};

// ─── Props ────────────────────────────────────────────────────────
interface ProductRatingsProps {
  productId: string;
  averageRating: number;   // từ product.averageRating
  totalReviews: number;    // từ product.totalReviews
}

// ─── Main ─────────────────────────────────────────────────────────
const ProductRatings: React.FC<ProductRatingsProps> = ({ productId, averageRating, totalReviews }) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | null>(null);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getRatingsByProduct(productId)
      .then((data) => setRatings(Array.isArray(data) ? data.filter((r) => !r['is-hidden']) : []))
      .catch(() => setRatings([]))
      .finally(() => setLoading(false));
  }, [productId]);

  const breakdown = [5, 4, 3, 2, 1].map((s) => ({
    score: s,
    count: ratings.filter((r) => r['rating-score'] === s).length,
  }));
  const filtered = filter ? ratings.filter((r) => r['rating-score'] === filter) : ratings;

  if (loading) {
    return (
      <div className="mt-16 space-y-4">
        <div className="h-6 w-48 rounded bg-surface-dark animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-40 rounded-xl bg-surface-dark animate-pulse" />
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl bg-surface-dark animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 border-b border-surface-border pb-4">
        <h2 className="text-2xl font-bold uppercase text-white tracking-tight">Rider Reviews</h2>
        <span className="text-sm text-text-muted">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
      </div>

      {totalReviews === 0 ? (
        <div className="rounded-xl border border-surface-border bg-surface-dark p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-white/10 mb-3 block">rate_review</span>
          <p className="text-text-muted text-sm">No reviews yet for this product.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Left: Score summary ── */}
          <div className="lg:col-span-1 rounded-xl border border-surface-border bg-surface-dark p-6 flex flex-col gap-5 sticky top-24">
            <div className="text-center">
              <p className="text-6xl font-black text-white leading-none">{averageRating.toFixed(1)}</p>
              <div className="flex justify-center mt-2">
                <Stars score={Math.round(averageRating)} size="text-lg" />
              </div>
              <p className="text-text-muted text-xs mt-1">{totalReviews} verified review{totalReviews !== 1 ? 's' : ''}</p>
            </div>

            <div className="space-y-2">
              {breakdown.map(({ score, count }) => (
                <ScoreBar key={score} label={score} count={count} total={ratings.length} />
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-border">
              <button
                onClick={() => setFilter(null)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${filter === null ? 'bg-primary text-white' : 'bg-white/5 text-text-muted hover:text-white'}`}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(filter === s ? null : s)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-white/5 text-text-muted hover:text-white'}`}
                >
                  {s}★
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Review cards ── */}
          <div className="lg:col-span-2 space-y-4">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-surface-border bg-surface-dark p-8 text-center">
                <p className="text-text-muted text-sm">No reviews for this rating.</p>
              </div>
            ) : (
              filtered.map((r) => (
                <div
                  key={r['rating-id']}
                  className="rounded-xl border border-surface-border bg-surface-dark p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-sm">person</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">{r['customer-id'].slice(0, 8).toUpperCase()}</p>
                        <p className="text-text-muted text-[10px]">
                          {new Date(r['created-at']).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Stars score={r['rating-score']} size="text-sm" />
                      {r['is-verified-purchase'] && (
                        <span className="flex items-center gap-1 text-[10px] text-green-400 font-bold uppercase">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {r['comment'] && (
                    <p className="text-[#a0a0a0] text-sm leading-relaxed">{r['comment']}</p>
                  )}

                  {r['admin-reply'] && (
                    <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex gap-3">
                      <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">support_agent</span>
                      <div>
                        <p className="text-primary text-[10px] font-black uppercase tracking-wider mb-1">G-Zone Response</p>
                        <p className="text-[#a0a0a0] text-xs leading-relaxed">{r['admin-reply']}</p>
                      </div>
                    </div>
                  )}

                  {r['helpful-count'] > 0 && (
                    <p className="text-[10px] text-text-muted mt-3">
                      {r['helpful-count']} person{r['helpful-count'] !== 1 ? 's' : ''} found this helpful
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductRatings;