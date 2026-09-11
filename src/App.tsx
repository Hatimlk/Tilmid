import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Wrench, Bell, BarChart3, GraduationCap, KeyRound, Settings } from 'lucide-react';
import { Layout } from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { Home } from './pages/Home';
import { ProgramDetails } from './pages/ProgramDetails';
import { OrientationRegistration } from './pages/OrientationRegistration';
import { StudentArea } from './pages/StudentArea';
import { CoachingOffer } from './pages/CoachingOffer';
import { HigherSchools } from './pages/HigherSchools';
import { SchoolDetail } from './pages/SchoolDetail';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { BacSimulator } from './pages/BacSimulator';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminStudents } from './pages/admin/Students';
import { AdminStudentDetail } from './pages/admin/StudentDetail';
import { AdminPackages } from './pages/admin/Packages';
import { AdminAppointments } from './pages/admin/Appointments';
import { AdminMessages } from './pages/admin/Messages';
import { AdminStories } from './pages/admin/Stories';
import { AdminActivity } from './pages/admin/Activity';
import { AdminContent } from './pages/admin/Content';
import { AdminLibrary } from './pages/admin/Library';
import { AdminComingSoonPage } from './pages/admin/ComingSoonPage';
import { AdminPlans } from './pages/admin/Plans';
import { AdminCoaching } from './pages/admin/Coaching';
import { AdminCheckIns } from './pages/admin/CheckIns';
import { AdminFeedback } from './pages/admin/Feedback';
import { AdminProgress } from './pages/admin/Progress';
import { AdminCollectiveSessions } from './pages/admin/CollectiveSessions';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tawjih" element={<ProgramDetails />} />
          <Route path="/tawjih/inscription" element={<OrientationRegistration />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/student-area" element={<StudentArea />} />
          <Route path="/coaching-offer" element={<CoachingOffer />} />
          <Route path="/higher-schools" element={<HigherSchools />} />
          <Route path="/higher-schools/:slug" element={<SchoolDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bac-simulator" element={<BacSimulator />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="students/:id" element={<AdminStudentDetail />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="coaching" element={<AdminCoaching />} />
            <Route path="check-ins" element={<AdminCheckIns />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="progress" element={<AdminProgress />} />
            <Route path="collective-sessions" element={<AdminCollectiveSessions />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="library" element={<AdminLibrary />} />
            <Route path="tools" element={<AdminComingSoonPage icon={Wrench} title="Outils" breadcrumb="Administration / Contenu" description="La configuration des outils pédagogiques Mouwakaba sera disponible ici." />} />
            <Route path="notifications" element={<AdminComingSoonPage icon={Bell} title="Notifications" breadcrumb="Administration / Communication" description="L'envoi de notifications ciblées aux étudiants sera disponible ici." />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="stories" element={<AdminStories />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="reports" element={<AdminComingSoonPage icon={BarChart3} title="Rapports" breadcrumb="Administration / Analyse" description="Les rapports d'engagement, de coaching et de progression seront disponibles ici." />} />
            <Route path="activity" element={<AdminActivity />} />
            <Route path="coaches" element={<AdminComingSoonPage icon={GraduationCap} title="Coachs" breadcrumb="Administration / Administration" description="La gestion des coachs et de leur charge de travail sera disponible ici." />} />
            <Route path="users" element={<AdminComingSoonPage icon={KeyRound} title="Utilisateurs & rôles" breadcrumb="Administration / Administration" description="La gestion des comptes d'équipe et des permissions sera disponible ici." />} />
            <Route path="settings" element={<AdminComingSoonPage icon={Settings} title="Paramètres" breadcrumb="Administration / Administration" description="La configuration générale de la plateforme sera disponible ici." />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
