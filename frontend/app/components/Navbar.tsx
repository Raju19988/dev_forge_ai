import Link from "next/link";
export default function Navbar() {
  return (
    <header className="navbar">
      <a className="logo" href="#home">
        DevForge<span>AI</span>
      </a>

      <nav className="nav-links" aria-label="Main navigation">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#about">About</a>
      </nav>

      <div className="nav-actions">
  <Link href="/login" className="nav-login">
    Login
  </Link>

  <Link href="#get-started" className="nav-cta">
    Get Started
  </Link>
</div>
    </header>
  );
}