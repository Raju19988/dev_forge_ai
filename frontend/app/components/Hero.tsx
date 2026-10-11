export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="eyebrow">
          YOUR CAREER. YOUR NEXT LEVEL.
        </p>

        <h1>
          Build Skills.
          <br />
          <span>Forge Your Future.</span>
        </h1>

        <p className="hero-description">
          Your personal AI-powered developer platform to analyze
          your resume, strengthen your skills, and prepare for
          your next technical interview.
        </p>

        <div className="hero-actions" id="get-started">
          <a className="button button-primary" href="#features">
            Explore Features
          </a>

          <a
            className="button button-secondary"
            href="#how-it-works"
          >
            How It Works
          </a>
        </div>

        <div className="hero-note">
          <span className="status-dot" />
          One platform. Your entire developer journey.
        </div>
      </div>

      <div className="hero-visual" aria-label="Developer dashboard preview">
        <div className="dashboard-window">
          <div className="window-header">
            <div className="window-dots">
              <span />
              <span />
              <span />
            </div>

            <span className="window-title">DevForge Dashboard</span>
          </div>

          <div className="dashboard-content">
            <p className="dashboard-label">YOUR DEVELOPER PROFILE</p>

            <h2>Ready to level up?</h2>

            <p className="dashboard-subtitle">
              Your progress starts here.
            </p>

            <div className="progress-card">
              <div className="progress-heading">
                <span>Interview preparation</span>
                <strong>75%</strong>
              </div>

              <div
                className="progress-track"
                role="progressbar"
                aria-label="Interview preparation preview"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={75}
              >
                <div className="progress-fill" />
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="mini-card">
                <span className="mini-icon">01</span>
                <strong>Resume AI</strong>
                <span>Find skill gaps</span>
              </div>

              <div className="mini-card">
                <span className="mini-icon">02</span>
                <strong>Mock Interviews</strong>
                <span>Practice with AI</span>
              </div>

              <div className="mini-card">
                <span className="mini-icon">03</span>
                <strong>GitHub Insights</strong>
                <span>Track development</span>
              </div>

              <div className="mini-card">
                <span className="mini-icon">04</span>
                <strong>Skill Growth</strong>
                <span>Keep improving</span>
              </div>
            </div>
          </div>
        </div>

        <div className="floating-badge">
          <span className="badge-indicator" />
          Built for developers
        </div>
      </div>
    </section>
  );
}