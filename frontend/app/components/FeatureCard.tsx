interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
  tag: string;
}

export default function FeatureCard({
  number,
  title,
  description,
  tag,
}: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-card-top">
        <span className="feature-number">{number}</span>
        <span className="feature-tag">{tag}</span>
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <span className="feature-arrow" aria-hidden="true">
        ↗
      </span>
    </article>
  );
}