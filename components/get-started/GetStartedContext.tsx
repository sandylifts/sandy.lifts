"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { GetStartedModal } from "./GetStartedModal";

interface GetStartedContextValue {
  open: () => void;
}

const GetStartedContext = createContext<GetStartedContextValue | null>(null);

export function GetStartedProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <GetStartedContext.Provider value={{ open }}>
      {children}
      <GetStartedModal isOpen={isOpen} onClose={close} />
    </GetStartedContext.Provider>
  );
}

export function useGetStarted() {
  const ctx = useContext(GetStartedContext);
  if (!ctx) throw new Error("useGetStarted must be inside GetStartedProvider");
  return ctx;
}
