import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { Home } from './pages/Home';
import { ProgramDetails } from './pages/ProgramDetails';
import { StudentArea } from './pages/StudentArea';
import { CoachingOffer } from './pages/CoachingOffer';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { AdminDashboard } from './pages/AdminDashboard';
import { BacSimulator } from './pages/BacSimulator';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tilmid-talib" element={<ProgramDetails />} />
          <Route path="/tawjih" element={<ProgramDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/student-area" element={<StudentArea />} />
          <Route path="/coaching-offer" element={<CoachingOffer />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bac-simulator" element={<BacSimulator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
