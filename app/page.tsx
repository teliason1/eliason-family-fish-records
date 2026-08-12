import { Explorer } from "@/components/explorer";
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";

export default function HomePage() {
  return <div className="site atlas"><SiteHeader /><Suspense fallback={<div className="map-loading">Loading the family archive…</div>}><Explorer /></Suspense><footer className="site-footer"><span>Eliason Family Fish Records</span><span>For bragging rights only · Since 1976</span></footer></div>;
}
