import { assetPath } from "@/lib/assetPath";

type NovaPoshtaLogoProps = {
  className?: string;
};

/** Логотип Нової Пошти — `public/images/nova-poshta.png` */
export function NovaPoshtaLogo({ className = "h-8 w-8" }: NovaPoshtaLogoProps) {
  return (
    <img
      src={assetPath("images/nova-poshta.png")}
      alt=""
      width={36}
      height={36}
      className={`shrink-0 object-contain ${className}`}
      aria-hidden
      draggable={false}
    />
  );
}
