import Link from "next/link";
import { cn } from "@/lib/utils";
import { Michroma } from "next/font/google";
import { ModeToggle } from "@/components/mode-toggle";

const michroma = Michroma({ subsets: ["latin"], weight: "400" });

export const SiteHeader = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center justify-between w-full mx-20">
          <div>
            <nav className="flex items-center gap-4 text-sm lg:gap-6">
              <Link
                href="/"
                className="mr-4 flex items-center space-x-2 lg:mr-6"
              >
                <h1
                  className={cn(
                    "font-extrabold tracking-widest text-lg",
                    michroma.className
                  )}
                >
                  OEV SEARCHER
                </h1>
              </Link>
              <Link
                href="/aboutus"
                className={cn(
                  "transition-colors hover:text-foreground/80 text-foreground/60"
                )}
              >
                About
              </Link>
              <Link
                href="/docs"
                className={cn(
                  "transition-colors hover:text-foreground/80 text-foreground/60"
                )}
              >
                Docs
              </Link>
              <Link
                href="/api"
                className={cn(
                  "transition-colors hover:text-foreground/80 text-foreground/60"
                )}
              >
                API
              </Link>
              <Link
                href="/comingsoon"
                className={cn(
                  "transition-colors hover:text-foreground/80 text-foreground/60"
                )}
              >
                Pricing
              </Link>
            </nav>
          </div>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};
