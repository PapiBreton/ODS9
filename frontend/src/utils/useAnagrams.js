// useAnagrams.js
import { useState, useCallback } from "react";

export default function useAnagrams() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnagrams = useCallback(async (mot) => {
    setLoading(true);
    setError(null);
    try {
      const sorted = mot.split("").sort().join("");
      const res = await fetch(`/api/anagrammes/${encodeURIComponent(sorted)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || data.error);
      return data.mots.sort() || [];
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchAnagrams, loading, error };
}
