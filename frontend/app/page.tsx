import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureCard from "./components/FeatureCard";

const features = [
  {
    number: "01",
    title: "AI Resume Analysis",
    description:
      "Understand your resume, uncover skill gaps, and discover opportunities to improve your profile.",
    tag: "AI POWERED",
  },
  {
    number: "02",
    title: "Technical Interviews",
    description:
      "Prepare for technical interviews with structured practice and personalized feedback.",
    tag: "PRACTICE",
  },
  {
    number: "03",
    title: "GitHub Insights",
    description:
      "Turn your development activity and projects into clearer insights about your technical growth.",
    tag: "ANALYTICS",
  },
  {
    number: "04",
    title: "Developer Roadmap",
    description:
      "Identify important skills and organize your learning around your career goals.",
    tag: "GROWTH",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <section className="features-section" id="features">
          <div className="section-heading">
            <p className="eyebrow">THE DEVFORGE TOOLKIT</p>

            <h2>
              Everything you need to
              <br />
              <span>grow as a developer.</span>
            </h2>

            <p className="section-description">
              A unified workspace for learning, building, and
              preparing for your next career opportunity.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <FeatureCard
                key={feature.number}
                number={feature.number}
                title={feature.title}
                description={feature.description}
                tag={feature.tag}
              />
            ))}
          </div>
        </section>

        <section className="closing-section" id="how-it-works">
          <p className="eyebrow">YOUR JOURNEY STARTS HERE</p>

          <h2 id="about">
            Don't just prepare.
            <br />
            <span>Become the developer.</span>
          </h2>

          <p>
            Build your skills, track your progress, and move
            toward your next opportunity with DevForge AI.
          </p>

          <a className="button button-primary" href="#home">
            Back to Top ↑
          </a>
        </section>
      </main>

      <footer className="footer">
        <a className="logo" href="#home">
          DevForge<span>AI</span>
        </a>

        <p>Built for developers who never stop growing.</p>

        <p>© 2026 DevForge AI. All rights reserved.</p>
      </footer>
    </>
  );
}