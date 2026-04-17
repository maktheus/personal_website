interface SkillBadgeProps {
  label: string;
  accent?: boolean;
}

export default function SkillBadge({ label, accent = false }: SkillBadgeProps) {
  return (
    <span className={`tag ${accent ? "accent" : ""}`}>
      {label}
    </span>
  );
}
