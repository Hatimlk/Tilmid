import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Wrench, Bell, BarChart3, GraduationCap, KeyRound, Settings } from 'lucide-react';
import { Layout } from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { Home } from './pages/Home';
import { ProgramDetails } from './pages/ProgramDetails';
import { OrientationRegistration } from './pages/OrientationRegistration';
import { CoachingOffer } from './pages/CoachingOffer';
import { CoachingRegistration } from './pages/CoachingRegistration';
import { HigherSchools } from './pages/HigherSchools';
import { SchoolDetail } from './pages/SchoolDetail';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { BacSimulator } from './pages/BacSimulator';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';

const StudentArea = lazy(() => import('./pages/StudentArea').then(m => ({ default: m.StudentArea })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const AdminStudents = lazy(() => import('./pages/admin/Students').then(m => ({ default: m.AdminStudents })));
const AdminStudentDetail = lazy(() => import('./pages/admin/StudentDetail').then(m => ({ default: m.AdminStudentDetail })));
const AdminPackages = lazy(() => import('./pages/admin/Packages').then(m => ({ default: m.AdminPackages })));
const AdminAppointments = lazy(() => import('./pages/admin/Appointments').then(m => ({ default: m.AdminAppointments })));
const AdminMessages = lazy(() => import('./pages/admin/Messages').then(m => ({ default: m.AdminMessages })));
const AdminStories = lazy(() => import('./pages/admin/Stories').then(m => ({ default: m.AdminStories })));
const AdminActivity = lazy(() => import('./pages/admin/Activity').then(m => ({ default: m.AdminActivity })));
const AdminContent = lazy(() => import('./pages/admin/Content').then(m => ({ default: m.AdminContent })));
const AdminLibrary = lazy(() => import('./pages/admin/Library').then(m => ({ default: m.AdminLibrary })));
const AdminComingSoonPage = lazy(() => import('./pages/admin/ComingSoonPage').then(m => ({ default: m.AdminComingSoonPage })));
const AdminPlans = lazy(() => import('./pages/admin/Plans').then(m => ({ default: m.AdminPlans })));
const AdminCoaching = lazy(() => import('./pages/admin/Coaching').then(m => ({ default: m.AdminCoaching })));
const AdminCheckIns = lazy(() => import('./pages/admin/CheckIns').then(m => ({ default: m.AdminCheckIns })));
const AdminFeedback = lazy(() => import('./pages/admin/Feedback').then(m => ({ default: m.AdminFeedback })));
const AdminProgress = lazy(() => import('./pages/admin/Progress').then(m => ({ default: m.AdminProgress })));
const AdminCollectiveSessions = lazy(() => import('./pages/admin/CollectiveSessions').then(m => ({ default: m.AdminCollectiveSessions })));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<div className="min-h-[50vh]" aria-label="Chargement" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tawjih" element={<ProgramDetails />} />
          <Route path="/tawjih/inscription" element={<OrientationRegistration />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/student-area" element={<StudentArea />} />
          <Route path="/coaching-offer" element={<CoachingOffer />} />
          <Route path="/coaching-offer/inscription" element={<CoachingRegistration />} />
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
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
