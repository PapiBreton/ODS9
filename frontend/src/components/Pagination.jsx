import "./pagination.css";
export default function Pagination({
  page,
  totalPages,
  onFirst,
  onPrev,
  onNext,
  onLast,
}) {
  return (
    <div className="pagination-controls d-flex flex-wrap justify-content-center align-items-center gap-2 mt-4">
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={onFirst}
        disabled={page === 1}
      >
        ⏮
      </button>
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={onPrev}
        disabled={page === 1}
      >
        ◀
      </button>
      <span className="mx-2 text-nowrap">
        Page {page} / {totalPages}
      </span>
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={onNext}
        disabled={page === totalPages}
      >
        ▶
      </button>
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={onLast}
        disabled={page === totalPages}
      >
        ⏭
      </button>
    </div>
  );
}
