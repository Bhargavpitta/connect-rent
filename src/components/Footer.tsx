export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24 py-10">
      <div className="container text-center space-y-2">
        <p className="font-display font-semibold">WalkieTalkieRentalsIndia</p>
        <p className="label-caps">Privacy · Terms · Compliance · Contact</p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} WalkieTalkieRentalsIndia. Professional Communication Systems.
        </p>
      </div>
    </footer>
  );
}
