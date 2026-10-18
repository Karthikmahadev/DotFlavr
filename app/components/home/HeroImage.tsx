import { HeroAsset } from "@/app/lib/hero-assets";
import Image from "next/image";


type Props = {
  name: "primary" | "secondary";
  asset: HeroAsset;
  /** Positioning and size classes. */
  className: string;
  sizes: string;
  priority?: boolean;
  tone?: "flame" | "wine";
};

export default function HeroImage({
  name,
  asset,
  className,
  sizes,
  priority = false,
  tone = "flame",
}: Props) {
  return (
    <div data-img={name} className={`absolute will-change-transform ${className}`}>
      <div className="js-reveal absolute inset-0 overflow-hidden">
        <div className="js-scale absolute inset-0 will-change-transform">
          {asset.src ? (
            <Image
              src={asset.src}
              alt={asset.alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover"
              style={{ objectPosition: asset.objectPosition ?? "50% 50%" }}
            />
          ) : (
            <div
              className={`flex h-full w-full items-end p-4 font-mono text-[10px] uppercase tracking-[0.2em] ${
                tone === "flame" ? "bg-flame text-ink" : "bg-wine text-cream"
              }`}
            >
              Placeholder: set HERO_ASSETS.{name}.src
            </div>
          )}
        </div>
      </div>
    </div>
  );
}