type SectionHeadingProps = {
  line1: string;
  line2: string;
  className?: string;
};

export function SectionHeading({ line1, line2, className = "" }: SectionHeadingProps) {
  return (
    <h2 className={`section-heading-lg ${className}`}>
      {line1}
      <br />
      <span className="playful-tilt">{line2}</span>
      <span className="text-accent">.</span>
    </h2>
  );
}
