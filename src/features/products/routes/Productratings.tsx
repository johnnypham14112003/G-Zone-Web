import React, { useEffect, useState } from 'react';
import { getAccessToken } from '@/lib/token';
import { createRating, getRatingsByProduct } from '@/features/accounts/api/rating-api';

// ─── Types ────────────────────────────────────────────────────────
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

// ─── Helpers ──────────────────────────────────────────────────────
const getCustomerId = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.accountId ?? payload.sub ?? payload.id ?? null;
  } catch {
    return null;
  }
};

// ─── Star Picker ──────────────────────────────────────────────────
const StarPicker: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <span
            className={`material-symbols-outlined text-2xl transition-colors ${
              i <= (hovered || value) ? 'text-yellow-400' : 'text-white/20'
            }`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        </button>
      ))}
    </div>
  );
};

// ─── Stars display ────────────────────────────────────────────────
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
  averageRating: number;
  totalReviews: number;
}

// ─── Main ─────────────────────────────────────────────────────────
const ProductRatings: React.FC<ProductRatingsProps> = ({ productId, averageRating, totalReviews }) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | null>(null);

  // Form state
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const customerId = getCustomerId();
  const isLoggedIn = !!customerId;

  const loadRatings = () => {
    setLoading(true);
    getRatingsByProduct(productId)
      .then((data) => setRatings(Array.isArray(data) ? data.filter((r) => !r['is-hidden']) : []))
      .catch(() => setRatings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!productId) return;
    loadRatings();
  }, [productId]);

  const handleSubmit = async () => {
    if (!customerId) return;
    if (score === 0) { setSubmitError('Please select a star rating.'); return; }
    if (!comment.trim()) { setSubmitError('Please write a comment.'); return; }

    setSubmitError('');
    setSubmitting(true);
    try {
      await createRating({
        'rating-score': score,
        'comment': comment.trim(),
        'customer-id': customerId,
        'product-id': productId,
        'order-detail-id': null,
        'is-verified-purchase': false,
        'is-hidden': false,
      });
      setSubmitSuccess(true);
      setScore(0);
      setComment('');
      // Reload ratings after submit
      loadRatings();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      setSubmitError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ── Left: Summary + Write review ── */}
        <div className="lg:col-span-1 flex flex-col gap-5">

          {/* Score summary */}
          <div className="rounded-xl border border-surface-border bg-surface-dark p-6 flex flex-col gap-5">
            <div className="text-center">
              <p className="text-6xl font-black text-white leading-none">{averageRating.toFixed(1)}</p>
              <div className="flex justify-center mt-2">
                <Stars score={Math.round(averageRating)} size="text-lg" />
              </div>
              <p className="text-text-muted text-xs mt-1">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
            </div>

            <div className="space-y-2">
              {breakdown.map(({ score: s, count }) => (
                <ScoreBar key={s} label={s} count={count} total={ratings.length} />
              ))}
            </div>

            {/* Filter pills */}
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

          {/* ── Write a review form ── */}
          <div className="rounded-xl border border-surface-border bg-surface-dark p-6 flex flex-col gap-4">
            <h3 className="text-white font-bold uppercase tracking-wide text-sm">Write a Review</h3>

            {!isLoggedIn ? (
              <p className="text-text-muted text-xs">
                Please <a href="/login" className="text-primary hover:underline font-bold">log in</a> to leave a review.
              </p>
            ) : submitSuccess ? (
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3">
                <span className="material-symbols-outlined text-green-400 text-base">check_circle</span>
                <p className="text-green-300 text-xs font-bold">Review submitted successfully!</p>
              </div>
            ) : (
              <>
                {/* Star picker */}
                <div>
                  <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">Your Rating</p>
                  <StarPicker value={score} onChange={setScore} />
                </div>

                {/* Comment textarea */}
                <div>
                  <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">Your Comment</p>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    className="w-full rounded-lg border border-surface-border bg-black/20 px-4 py-3 text-sm text-white placeholder-text-muted resize-none focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Error */}
                {submitError && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {submitError}
                  </p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="h-10 rounded-lg bg-primary hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">send</span>
                      Submit Review
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Right: Review cards ── */}
        <div className="lg:col-span-2 space-y-4">
          {totalReviews === 0 ? (
            <div className="rounded-xl border border-surface-border bg-surface-dark p-10 text-center">
              <span className="material-symbols-outlined text-5xl text-white/10 mb-3 block">rate_review</span>
              <p className="text-text-muted text-sm">No reviews yet. Be the first to review!</p>
            </div>
          ) : filtered.length === 0 ? (
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
    </section>
  );
};

export default ProductRatings;