"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fish } from "./icons";
import { ThemePicker } from "./theme-picker";

export function SiteHeader() {
  const pathname = usePathname();
  return <header className="site-header"><Link className="brand" href="/"><span className="brand-mark"><Fish /></span><span>Eliason Family Fish <em>Records</em></span></Link><nav aria-label="Main navigation"><Link className={pathname === "/" ? "active" : ""} href="/">Explore</Link><ThemePicker /></nav></header>;
}
