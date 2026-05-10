import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by <Link href="/" className="font-medium underline underline-offset-4 text-primary">MediFlow</Link>. The smart pharmacy platform.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:underline underline-offset-4 hover:text-foreground transition-colors">About</Link>
            <Link href="/contact" className="hover:underline underline-offset-4 hover:text-foreground transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:underline underline-offset-4 hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:underline underline-offset-4 hover:text-foreground transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
