export default function CompanyLogos() {
  const companies = [
    { name: "Motorola", style: "font-sans font-bold tracking-tighter text-[#E0E4E0]" },
    { name: "Stone", style: "font-sans font-medium tracking-tight text-[var(--accent)]" },
    { name: "Jabil", style: "font-serif font-bold italic tracking-wide text-[#E0E4E0]" },
    { name: "Eldorado", style: "font-sans font-semibold tracking-wider text-[#E0E4E0]" },
    { name: "CESAR", style: "font-mono font-bold tracking-widest text-[#E0E4E0]" },
    { name: "OAB AM", style: "font-serif font-black tracking-widest text-[#E0E4E0]" },
    { name: "UFAM", style: "font-sans font-medium tracking-wide text-[#E0E4E0]" },
  ];

  return (
    <div className="w-full border-y" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container py-10 overflow-hidden">
        <p className="text-center font-mono text-xs uppercase tracking-widest mb-10" style={{ color: "var(--text-muted)" }}>
          Organizations I've worked with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-70 hover:opacity-100 transition-opacity duration-300">
          {companies.map((company, i) => (
            <div key={i} className={`text-xl sm:text-2xl min-h-[2rem] flex items-center justify-center ${company.style}`}>
              {company.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
