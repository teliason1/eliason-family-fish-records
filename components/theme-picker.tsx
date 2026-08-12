"use client";
import { useEffect, useState } from "react";
import { Check } from "./icons";
type Theme = "coastal" | "heritage" | "nightfall";
const themes: { id: Theme; label: string; colors: string[] }[] = [
  { id: "coastal", label: "Coastal", colors: ["#174e5d", "#edf3f2", "#ed7438"] },
  { id: "heritage", label: "Heritage", colors: ["#26382f", "#f2eadb", "#b85736"] },
  { id: "nightfall", label: "Nightfall", colors: ["#081d2a", "#152f3b", "#e9a545"] },
];
export function ThemePicker() { const [theme, setTheme] = useState<Theme>("coastal"); const [open, setOpen] = useState(false); const [ready, setReady] = useState(false); useEffect(() => { const saved = localStorage.getItem("fish-theme") as Theme | null; if (saved && themes.some((t) => t.id === saved)) setTheme(saved); setReady(true); }, []); useEffect(() => { if (!ready) return; document.documentElement.dataset.theme = theme; localStorage.setItem("fish-theme", theme); }, [theme, ready]); return <div className="theme-picker"><button className="theme-trigger" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="listbox"><span className={`theme-swatch swatch-${theme}`} /><span>Themes</span></button>{open && <div className="theme-menu" role="listbox" aria-label="Choose a visual theme"><span className="theme-menu-title">Atlas appearance</span>{themes.map((option) => <button role="option" aria-selected={theme === option.id} key={option.id} onClick={() => { setTheme(option.id); setOpen(false); }}><span className="palette">{option.colors.map((color) => <i key={color} style={{ background: color }} />)}</span><span>{option.label}</span>{theme === option.id && <Check size={16} />}</button>)}</div>}</div>; }
