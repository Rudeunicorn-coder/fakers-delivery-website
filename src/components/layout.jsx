import { Link, NavLink, Outlet } from 'react-router-dom';
import TawkChat from './TawkChat';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/track', label: 'Track Order', button: true },
];

export default function Layout() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="nav-wrap">
          <Link to="/" className="brand">
            <span className="brand-mark">🕊</span>
            <span>CommonSwift Logistics</span>
          </Link>
          <nav className="nav-links">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? `active${item.button ? ' nav-cta' : ''}` : item.button ? 'nav-cta' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div>
          <p className="footer-title">CommonSwift Logistics</p>
          <p>© 2026 CommonSwift Logistics. Fast, dependable logistics for homes, retailers, and growing teams.</p>
        </div>
        <div className="footer-links">
          <Link to="/contact">Contact</Link>
          <Link to="/track">Track Shipment</Link>
          <Link to="/services">Services</Link>
        </div>
      </footer>

      <TawkChat />
    </div>
  );
}
