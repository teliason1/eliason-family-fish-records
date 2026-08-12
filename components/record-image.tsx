import Image from "next/image";
import { Fish } from "./icons";

export function RecordImage({ src, alt, priority = false }: { src: string | null; alt: string; priority?: boolean }) {
  if (!src) return <div className="image-placeholder"><Fish size={44} strokeWidth={1.4} /><span>Photo not available</span></div>;
  return <Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" className="record-image" priority={priority} />;
}
