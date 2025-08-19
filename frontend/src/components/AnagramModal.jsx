import "./modal.css";
// components/AnagramModal.js
export default function AnagramModal({
  show,
  motPourAnagrammes,
  anagrammes,
  onClose,
}) {
  if (!show) return null;
  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        role="dialog"
      >
        <div
          className="modal-dialog modal-sm modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header text-warning">
              <h5 className="modal-title">{motPourAnagrammes}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Fermer"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              {anagrammes.length > 0 ? (
                <ul className="list-unstyled mb-0 text-center fw-bold text-primary">
                  {anagrammes.map((ana, i) => (
                    <li key={i}>{ana}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Aucune anagramme trouvée.</p>
              )}
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onClose}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
