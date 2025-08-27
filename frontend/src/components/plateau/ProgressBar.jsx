export default function ProgressBar({ progressionPourcent }) {
  return (
    <div className="progress my-5  bg-secondary" style={{ height: "25px" }}>
      <div
        className={`progress-bar ${
          progressionPourcent === 100 ? "rebond" : ""
        }`}
        role="progressbar"
        style={{
          width: `${progressionPourcent}%`,
          transition: "width 0.6s ease-in-out",
          backgroundColor:
            progressionPourcent === 100
              ? "#28a745"
              : progressionPourcent > 50
              ? "#ffc107"
              : "#dc3545",
        }}
        aria-valuenow={progressionPourcent}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {progressionPourcent}%
      </div>
    </div>
  );
}
