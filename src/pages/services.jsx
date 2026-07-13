import { motion } from 'framer-motion';

const services = [
  { title: 'Same-Day Delivery', description: 'Fast dispatch for urgent parcels, contracts, and time-sensitive documentation across major urban zones.' },
  { title: 'Scheduled Routes', description: 'Reliable delivery planning for recurring business orders, retail replenishment, and recurring route schedules.' },
  { title: 'Cold Chain', description: 'Secure transport for temperature-sensitive shipments with controlled handling and careful monitoring.' },
  { title: 'Corporate Logistics', description: 'Flexible dispatch and fulfillment support at scale for growing teams, branch operations, and multi-location delivery needs.' },
  { title: 'Priority Handling', description: 'Extra-care service for premium parcels, high-value items, and sensitive handoffs that require special attention.' },
  { title: 'International Freight Support', description: 'Cross-border coordination with documented routing, customs-ready planning, and consistent milestone updates.' },
];

export default function Services() {
  return (
    <section className="page-section">
      <h2>Delivery services designed around speed and care</h2>
      <p className="section-copy">From same-day courier support to scheduled business routes, we keep every shipment moving with dependable care.</p>
      <div className="mb-8 overflow-hidden rounded-3xl border border-slate-700">
        {/* ADDED FOR SERVICES PAGE IMAGE */}
        <img src="/images/hero-2.webp" alt="Professional delivery team managing logistics operations" className="w-full h-auto object-cover" loading="lazy" />
      </div>
      <div className="card-grid">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            className="info-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
