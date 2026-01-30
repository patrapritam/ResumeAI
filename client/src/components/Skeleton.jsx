import "./Skeleton.css";

export function Skeleton({ width, height, variant = "rect", className = "" }) {
  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card glass-card">
      <Skeleton width="60px" height="60px" variant="circle" />
      <div className="skeleton-content">
        <Skeleton width="70%" height="20px" />
        <Skeleton width="50%" height="16px" />
        <Skeleton width="90%" height="14px" />
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="skeleton-stats">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card skeleton-stat">
          <Skeleton width="40px" height="40px" variant="circle" />
          <Skeleton width="80px" height="32px" />
          <Skeleton width="100px" height="14px" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonAnalysis() {
  return (
    <div className="skeleton-analysis">
      <div className="glass-card skeleton-score">
        <Skeleton width="150px" height="150px" variant="circle" />
        <Skeleton width="120px" height="24px" />
      </div>
      <div className="skeleton-grid">
        <div className="glass-card">
          <Skeleton width="60%" height="20px" />
          <div className="skeleton-tags">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} width="80px" height="28px" variant="pill" />
            ))}
          </div>
        </div>
        <div className="glass-card">
          <Skeleton width="60%" height="20px" />
          <div className="skeleton-tags">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} width="70px" height="28px" variant="pill" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
