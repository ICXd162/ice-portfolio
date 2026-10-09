import { designs } from "@/lib/work";
import { imageDims } from "@/lib/image-dims";
import { DesignGallery } from "./DesignGallery";

// Server wrapper: measures each image at build time so the masonry reserves space.
export function DesignWork() {
  if (!designs.items.length) return null;
  const items = designs.items.map((d) => ({ ...d, dims: imageDims(d.image) }));
  return <DesignGallery heading={designs.heading} intro={designs.intro} items={items} />;
}
