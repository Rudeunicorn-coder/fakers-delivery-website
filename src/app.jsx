import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import About from './pages/about';
import Contact from './pages/contact';
import Home from './pages/home';
import Services from './pages/services';
import TrackOrder from './pages/trackOrder';
import DriverDashboard from './pages/driverDashboard';
import LiveMap from './pages/liveMap';
import Admin from './admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/map" element={<LiveMap />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
