const highlights = [
  'Trusted by local businesses, retail teams, and fast-moving service providers',
  'Real-time updates, dependable route planning, and proactive support at every step',
  'Secure handling for packages of all sizes, from urgent documents to large commercial shipments',
  'Transparent communication designed for clients who expect reliability and accountability',
];

const companyFacts = [
  'CommonSwift Logistics operates across major urban and regional hubs with a growing international presence.',
  'Our teams combine modern routing technology with experienced dispatch specialists to keep every delivery on schedule.',
  'We support industries such as retail, healthcare, professional services, and e-commerce with tailored logistics solutions.',
  'Every shipment is managed with clear visibility, secure handling standards, and customer-focused communication.',
];

export default function About() {
  return (
    <section className="page-section">
      <h2>About CommonSwift Logistics</h2>
      <p className="section-copy">
        We help businesses and customers move parcels, supplies, and essentials quickly and safely through a modern logistics network built for speed, precision, and trust.
      </p>
      <div className="mb-8 overflow-hidden rounded-3xl border border-slate-700">
        {/* ADDED FOR ABOUT PAGE IMAGE */}
        <img src="/images/hero-1.webp" alt="Logistics team handling a delivery shipment" className="w-full h-auto object-cover" loading="lazy" />
      </div>
      <div className="info-card wide-card">
        <h3>Why choose us</h3>
        <ul>
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="info-card wide-card">
        <h3>More about our company</h3>
        <div className="card-grid">
          {companyFacts.map((fact) => (
            <div key={fact} className="info-card">
              <p>{fact}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
