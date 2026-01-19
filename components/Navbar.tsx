import Link from "next/link";
import { Castle, Globe, Layers, ScrollText, Settings, Swords } from "lucide-react";

const links = [
  { href: "/map", label: "Map", icon: Castle },
  { href: "/missions", label: "Missions", icon: ScrollText },
  { href: "/skills", label: "Skills", icon: Swords },
  { href: "/inventory", label: "Inventory", icon: Layers },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/login", label: "Login", icon: Globe }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Globe className="h-5 w-5 text-primary" />
          Agent Kingdom
        </Link>
        <nav className="flex flex-wrap gap-3 text-sm text-muted">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-foreground transition hover:border-primary/60 hover:bg-primary/10"
            >
              <Icon className="h-4 w-4 text-primary/80 group-hover:text-primary" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
