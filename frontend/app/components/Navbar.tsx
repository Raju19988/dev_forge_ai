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

      <a className="nav-cta" href="#get-started">
        Get Started
      </a>
    </header>
  );
}