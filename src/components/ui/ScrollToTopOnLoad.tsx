"use client";

import { useEffect } from "react";

function scrollToPageTop() {
  window.scrollTo(0, 0);
}

function clearUrlHash() {
  const { pathname, search } = window.location;
  if (!window.location.hash) return;
  history.replaceState(null, "", `${pathname}${search}`);
}

export function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    clearUrlHash();
    scrollToPageTop();

    requestAnimationFrame(() => {
      scrollToPageTop();
    });

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        clearUrlHash();
        scrollToPageTop();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
