import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { Home } from './pages/Home';
import { ProgramDetails } from './pages/ProgramDetails';
import { OrientationRegistration } from './pages/OrientationRegistration';
import { CoachingOffer } from './pages/CoachingOffer';
import { CoachingRegistration } from './pages/CoachingRegistration';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { BacSimulator } from './pages/BacSimulator';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';

const StudentArea = lazy(() => import('./pages/StudentArea').then(m => ({ default: m.StudentArea })));
const HigherSchools = lazy(() => import('./pages/HigherSchools').then(m => ({ default: m.HigherSchools })));
const SchoolDetail = lazy(() => import('./pages/SchoolDetail').then(m => ({ default: m.SchoolDetail })));
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
const AdminPlans = lazy(() => import('./pages/admin/Plans').then(m => ({ default: m.AdminPlans })));
const AdminCoaching = lazy(() => import('./pages/admin/Coaching').then(m => ({ default: m.AdminCoaching })));
const AdminCheckIns = lazy(() => import('./pages/admin/CheckIns').then(m => ({ default: m.AdminCheckIns })));
const AdminFeedback = lazy(() => import('./pages/admin/Feedback').then(m => ({ default: m.AdminFeedback })));
const AdminProgress = lazy(() => import('./pages/admin/Progress').then(m => ({ default: m.AdminProgress })));
const AdminCollectiveSessions = lazy(() => import('./pages/admin/CollectiveSessions').then(m => ({ default: m.AdminCollectiveSessions })));
const AdminCoachs = lazy(() => import('./pages/admin/Coachs').then(m => ({ default: m.AdminCoachs })));
const AdminReports = lazy(() => import('./pages/admin/Reports').then(m => ({ default: m.AdminReports })));
const AdminUsers = lazy(() => import('./pages/admin/Users').then(m => ({ default: m.AdminUsers })));
const AdminSettings = lazy(() => import('./pages/admin/Settings').then(m => ({ default: m.AdminSettings })));
const AdminOutils = lazy(() => import('./pages/admin/Outils').then(m => ({ default: m.AdminOutils })));
const AdminNotifications = lazy(() => import('./pages/admin/Notifications').then(m => ({ default: m.AdminNotifications })));

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
            <Route path="tools" element={<AdminOutils />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="stories" element={<AdminStories />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="activity" element={<AdminActivity />} />
            <Route path="coaches" element={<AdminCoachs />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
