"use client";

import { IconTileCard } from "@/components/ui/IconTileCard";
import { TileActionButton } from "@/components/ui/TileActionButton";
import { assetPath } from "@/lib/assetPath";

type FlavorTileCardProps = {
  name: string;
  image: string;
  tint: string;
  darkTint: string;
  selected: boolean;
  onToggle: () => void;
};

export function FlavorTileCard({
  name,
  image,
  tint,
  darkTint,
  selected,
  onToggle,
}: FlavorTileCardProps) {
  return (
    <IconTileCard
      ariaLabel={name}
      selected={selected}
      className={`relative overflow-hidden p-0 ${tint} ${darkTint}`}
      footer={
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center sm:bottom-4">
          <div className="pointer-events-auto">
            <TileActionButton selected={selected} ariaPressed={selected} onClick={onToggle}>
              {selected ? "Обрано" : "Обрати"}
            </TileActionButton>
          </div>
        </div>
      }
    >
      <div className="absolute inset-0">
        <img
          src={assetPath(image)}
          alt={name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </IconTileCard>
  );
}
