export default function MotivationMessage({ progressionPourcent }) {
  return (
    <div className="mt-2 text-white">
      {progressionPourcent === 100
        ? "🏆 Bravo !"
        : progressionPourcent > 50
        ? "🚀 Plus de la moitié, continue !"
        : "🔍 Tu viens de commencer, courage !"}
    </div>
  );
}
