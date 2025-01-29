"use client";

import React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "./emotionCache";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const cache = createEmotionCache();

  // This ensures MUI/Emotion styles rendered on the server are picked up on hydration
  useServerInsertedHTML(() => (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
