"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import("@/components/ui/LoadingScreen"), { ssr: false });

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  const handleDone = useCallback(() => setLoaded(true), []);

  return (
    <>
      {!loaded && <LoadingScreen onDone={handleDone} />}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease 0.1s",
        }}
      >
        {children}
      </div>
    </>
  );
}
