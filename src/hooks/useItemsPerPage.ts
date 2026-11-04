"use client";

import { useEffect, useState } from "react";

export function useItemsPerPage(options: { sm?: number; md?: number; lg?: number } = {}) {
  const { sm = 1, md = 2, lg = 3 } = options;
  const [count, setCount] = useState(sm);

  useEffect(() => {
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      if (mqLg.matches) setCount(lg);
      else if (mqMd.matches) setCount(md);
      else setCount(sm);
    };

    update();
    mqMd.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqMd.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, [lg, md, sm]);

  return count;
}
