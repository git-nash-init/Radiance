import { image, srcset, fallbackSrc, type ImageId } from "../../data/media";

type Props = {
  id: ImageId;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Target width for the plain <img> fallback. */
  fallbackWidth?: number;
};

/** AVIF/WebP responsive picture with a blurred inline placeholder. */
export function Picture({ id, alt, sizes = "100vw", className = "", imgClassName = "", priority, fallbackWidth }: Props) {
  const meta = image(id);
  return (
    <picture className={className} style={{ backgroundImage: `url(${meta.lqip})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <source type="image/avif" srcSet={srcset(id, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(id, "webp")} sizes={sizes} />
      <img
        src={fallbackSrc(id, fallbackWidth)}
        alt={alt}
        width={meta.width}
        height={meta.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchpriority: "high" } : {})}
        className={imgClassName}
      />
    </picture>
  );
}
