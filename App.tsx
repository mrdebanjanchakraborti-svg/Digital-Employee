
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from './services/configContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { HireMe } from './pages/HireMe';
import { About } from './pages/About';
import { Partner } from './pages/Partner';
import { Webinar } from './pages/Webinar';
import { AdminDashboard } from './pages/Admin';
import { Jobs } from './pages/Jobs';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { Cart } from './pages/Cart';
import { Onboarding } from './pages/Onboarding';
import { CustomerDashboard } from './pages/CustomerDashboard';

const ScrollToTop = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

const App = () => {
  return (
    <HashRouter>
      <ConfigProvider>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes (No Layout) */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Public Routes (With Layout) */}
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/hire" element={<HireMe />} />
                <Route path="/partner" element={<Partner />} />
                <Route path="/webinar" element={<Webinar />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Customer Routes */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<CustomerDashboard />} />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </ConfigProvider>
    </HashRouter>
  );
};

export default App;