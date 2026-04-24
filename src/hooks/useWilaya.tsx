// src/hooks/useWilayas.ts
import { useState, useEffect } from "react";
import { getWilayas } from "../lib/API";

interface Wilaya {
  code: string;
  name: string;
}

export const useWilayas = () => {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWilayas = async () => {
      try {
        setLoading(true);
        const data = await getWilayas();
        setWilayas(data);
      } catch (err: any) {
        setError(err.message || "Erreur de chargement des wilayas");
        console.error("Erreur wilayas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWilayas();
  }, []);

  return { wilayas, loading, error };
};
