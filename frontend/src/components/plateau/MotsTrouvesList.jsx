export default function MotsTrouvesList({ solutionsTrouvees }) {
  return (
    <div className="my-5 text-center">
      <strong className="text-primary">Mots trouvés :</strong>{" "}
      {solutionsTrouvees.length === 0 ? (
        <span className="text-secondary"> aucun.</span>
      ) : (
        solutionsTrouvees.map((mot, idx) => {
          return (
            <span key={idx} className="mot-trouvé me-2">
              {mot}
            </span>
          );
        })
      )}
    </div>
  );
}
