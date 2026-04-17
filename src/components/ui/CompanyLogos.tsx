export default function CompanyLogos() {
  const companies = [
    { name: "Motorola", style: "font-sans font-bold tracking-tighter" },
    { name: "Stone", style: "font-sans font-medium tracking-tight" },
    { name: "Jabil", style: "font-serif font-bold italic tracking-wide" },
    { name: "Eldorado", style: "font-sans font-semibold tracking-wider" },
    { name: "CESAR", style: "font-mono font-bold tracking-widest" },
    { name: "OAB AM", style: "font-serif font-black tracking-widest" },
  ];

  return (
    <div className="w-full border-y" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container py-8 overflow-hidden">
        <p className="text-center font-mono text-xs uppercase tracking-widest mb-6" style={{ color: "var(--text-muted)" }}>
          Organizations I've worked with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-40 hover:opacity-100 transition-opacity duration-500 delay-150">
          {companies.map((company, i) => (
            <div key={i} className={`text-xl sm:text-2xl text-white grayscale hover:grayscale-0 transition-all duration-300 ${company.style}`}>
              {company.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
