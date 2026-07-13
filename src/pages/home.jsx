import { Link } from 'react-router-dom';

const stats = [
  { label: 'On-time deliveries', value: '98.7%' },
  { label: 'Active routes', value: '140+' },
  { label: 'Happy clients', value: '2.4k' },
];

const highlights = [
  {
    title: 'Global logistics coverage',
    text: 'Reliable routing across cities, regions, and cross-border operations with transparent updates and dependable handoffs.',
  },
  {
    title: 'Secure delivery handling',
    text: 'Professional handling for parcels, documents, and sensitive shipments with strict accountability at every checkpoint.',
  },
  {
    title: 'Real-time visibility',
    text: 'Track progress from dispatch to customer delivery with live status updates, proactive support, and complete confidence.',
  },
  {
    title: 'Flexible business solutions',
    text: 'Support for e-commerce, healthcare, corporate dispatch, and recurring delivery needs with scalable service plans.',
  },
];

export default function Home() {
  return (
    <>
      {/* ADDED FOR HERO IMAGE */}
      <section
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/ladybike2.webp')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-end px-0 sm:px-0 lg:px-0">
          <div className="ml-auto mr-0 w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/10 p-8 shadow-2xl backdrop-blur-xl sm:max-w-xl lg:max-w-[32rem] lg:mr-0">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-300">Express logistics • Global reach</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Fast, precise delivery for every shipment.
            </h1>
            <p className="mt-5 text-lg text-slate-200">
              CommonSwift Logistics helps families and businesses move parcels, essentials, and urgent shipments with dependable routing, careful handling, and real-time visibility.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/track" className="rounded-xl bg-yellow-400 px-5 py-3 text-center font-semibold text-slate-900 transition hover:bg-yellow-300">
                Track Your Parcel
              </Link>
              <Link to="/services" className="rounded-xl border border-yellow-300 bg-transparent px-5 py-3 text-center font-semibold text-yellow-200 transition hover:bg-yellow-400/10">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-section">
        <div className="hero-card hero-grid">
        <div className="hero-main">
          <p className="eyebrow">Express logistics • Global reach</p>
          <h1>Fast, precise delivery for every shipment.</h1>
          <p className="hero-text">
            CommonSwift Logistics helps families and businesses move parcels, essentials, and urgent shipments with dependable routing, careful handling, and real-time visibility.
          </p>
          <div className="hero-actions">
            <Link to="/track" className="btn btn-primary">Track Your Parcel</Link>
            <Link to="/services" className="btn btn-secondary">Explore Services</Link>
          </div>
          <div className="hero-badge">24/7 dispatch • Live tracking • Safe handoff</div>
        </div>

        <div className="hero-side-card">
          <div className="hero-pill">Track in three steps</div>
          <div className="hero-steps">
            <div>1. Enter your tracking code</div>
            <div>2. Follow your shipment live</div>
            <div>3. Receive on-time delivery</div>
          </div>
          <Link to="/track" className="btn btn-primary hero-inline-btn">Open Tracking</Link>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="feature-grid">
        {highlights.map((item) => (
          <div key={item.title} className="feature-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
