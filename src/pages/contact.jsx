import contactImage from '../components/assets/claudio-schwarz-a85IYeAXgxU-unsplash.jpg';

const locations = [
  { city: 'Seattle', country: 'United States', address: '220 Harbor Avenue, Seattle, WA' },
  { city: 'London', country: 'United Kingdom', address: '45 King William Street, London' },
  { city: 'Dubai', country: 'United Arab Emirates', address: 'Al Khaleej Road, Business Bay, Dubai' },
  { city: 'Singapore', country: 'Singapore', address: '10 Marina Boulevard, Singapore' },
  { city: 'Toronto', country: 'Canada', address: '88 Bay Street, Toronto, ON' },
  { city: 'Sydney', country: 'Australia', address: '1 Circular Quay, Sydney, NSW' },
];

export default function Contact() {
  return (
    <section className="page-section">
      <h2>Contact CommonSwift Logistics</h2>
      <p className="section-copy">Need a custom delivery plan, a route consultation, or a fast response from our support team? We’re ready to help with every stage of your shipment journey.</p>
      <div className="mb-8 mx-auto flex max-w-3xl justify-center overflow-hidden rounded-3xl border border-slate-700">
        <img src={contactImage} alt="Customer service and logistics coordination team" className="h-auto max-h-[320px] w-full object-cover" loading="lazy" />
      </div>
      <div className="contact-card">
        <p><strong>Phone:</strong> +1 (800) 555-0148</p>
        <p><strong>Email:</strong> hello@commonswiftlogistics.com</p>
        <p><strong>Support Hours:</strong> 24/7 dispatch and client support</p>
        <p><strong>Service Focus:</strong> Fast delivery, secure handling, and live tracking visibility</p>
      </div>

      <div className="info-card wide-card">
        <h3>Our global locations</h3>
        <div className="card-grid">
          {locations.map((location) => (
            <div key={`${location.city}-${location.country}`} className="info-card">
              <h4>{location.city}, {location.country}</h4>
              <p>{location.address}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
