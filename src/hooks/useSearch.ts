import { useState, useCallback } from "react";
import axios from "axios";
import type { PersonData } from "../types";

export function useSearch() {
  const [person, setPerson] = useState<PersonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (name: string) => {
    if (!name.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get<PersonData>(`/api/search?name=${encodeURIComponent(name.trim())}`);
      setPerson(res.data);
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error || err.message : "Search failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { person, isLoading, error, search };
}
