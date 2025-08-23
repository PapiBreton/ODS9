export default function EditModal({
  word,
  solution,
  onChangeWord,
  onChangeSolution,
  onClose,
  onSave,
}) {
  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modifier le préfixe</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label" htmlFor="word">
                Mot
              </label>
              <input
                type="text"
                id="word"
                className="form-control"
                value={word}
                onChange={(e) => onChangeWord(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="solution">
                Solution
              </label>
              <input
                type="text"
                id="solution"
                className="form-control"
                value={solution}
                onChange={(e) => onChangeSolution(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button className="btn btn-primary" onClick={onSave}>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
