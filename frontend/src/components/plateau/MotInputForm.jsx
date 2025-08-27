export default function MotInputForm({
  motProposé,
  setMotProposé,
  handleSubmit,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="mb-3 d-flex flex-column align-items-center"
    >
      <input
        type="text"
        id="input-solutions"
        autoComplete="off"
        className="form-control input-court mb-2"
        value={motProposé}
        onChange={(e) => setMotProposé(e.target.value.toUpperCase())}
        placeholder="Mot de 8 lettres"
      />
      <button
        type="submit"
        className="btn btn-primary mt-3"
        disabled={motProposé.trim().length !== 8}
      >
        Valider
      </button>
    </form>
  );
}
