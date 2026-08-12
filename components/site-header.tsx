"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Concept } from "@/lib/types";
import { Fish, LogIn, Plus } from "./icons";
import { ThemePicker } from "./theme-picker";

export function SiteHeader({ concept }: { concept: Concept }) {
  const pathname = usePathname();
  return <header className="site-header"><Link className="brand" href={`/concepts/${concept}`}><span className="brand-mark"><Fish /></span><span>Eliason Family Fish <em>Records</em></span></Link><nav aria-label="Main navigation"><Link className={pathname === `/concepts/${concept}` ? "active" : ""} href={`/concepts/${concept}`}>Explore</Link><Link href={`/concepts/${concept}/submit`}><Plus size={16} /> Submit a catch</Link><ThemePicker /><Link className="login-link" href="/login"><LogIn size={16} /> Sign in</Link></nav></header>;
}
