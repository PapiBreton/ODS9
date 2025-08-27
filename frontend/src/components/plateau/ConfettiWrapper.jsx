import Confetti from "react-confetti";

export default function ConfettiWrapper({ run = true }) {
  return <Confetti run={run} />;
}
