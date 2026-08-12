"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fish, LogIn, Plus } from "./icons";
import { ThemePicker } from "./theme-picker";

export function SiteHeader() {
  const pathname = usePathname();
  return <header className="site-header"><Link className="brand" href="/"><span className="brand-mark"><Fish /></span><span>Eliason Family Fish <em>Records</em></span></Link><nav aria-label="Main navigation"><Link className={pathname === "/" ? "active" : ""} href="/">Explore</Link><Link href="/submit"><Plus size={16} /> Submit a catch</Link><ThemePicker /><Link className="login-link" href="/login"><LogIn size={16} /> Sign in</Link></nav></header>;
}
