"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { Project } from "@/types";

interface CompareContextType {
  compareList: Project[];
  addToCompare: (project: Project) => void;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  canAdd: boolean;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Project[]>([]);
  const MAX = 3;

  const addToCompare = useCallback((project: Project) => {
    setCompareList((prev) => {
      if (prev.length >= MAX || prev.find((p) => p.id === project.id))
        return prev;
      return [...prev, project];
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const isInCompare = useCallback(
    (id: string) => compareList.some((p) => p.id === id),
    [compareList]
  );

  const clearCompare = useCallback(() => setCompareList([]), []);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        canAdd: compareList.length < MAX,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
