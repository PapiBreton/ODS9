export default function ScrabbleTiles({ lettres, label }) {
  return (
    <div className="mb-3 mt-0">
      <p className="mb-0 mt-4">{label}</p>
      {lettres.map((lettre, index) => (
        <span
          key={index}
          className="tuile-scrabble"
          style={{
            animation: `fadeIn 0.3s ease ${index * 0.1}s forwards`,
            opacity: 0,
          }}
        >
          {lettre}
        </span>
      ))}
    </div>
  );
}
