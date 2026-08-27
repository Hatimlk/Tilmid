import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminDataProvider, useAdminData } from '../../context/AdminDataContext';
import { AdminSidebar, useSidebarCollapsed } from './navigation';
import { AdminTopbar } from './AdminTopbar';
import { CommandPalette } from './CommandPalette';
import { StudentFormModal } from './StudentFormModal';
import { AppointmentFormModal } from './AppointmentFormModal';
import { Student, Appointment } from '../../types';
import SEO from '../SEO';

export interface AdminOutletContext {
  openStudentModal: (student?: Student | null) => void;
  openAppointmentModal: (appointment?: Appointment | null) => void;
}

export const useAdminOutletContext = () => useOutletContext<AdminOutletContext>();

const AdminShell: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { students, refreshStudents, refreshAppointments } = useAdminData();
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [studentModal, setStudentModal] = useState<{ open: boolean; student: Student | null }>({ open: false, student: null });
  const [appointmentModal, setAppointmentModal] = useState<{ open: boolean; appointment: Appointment | null }>({ open: false, appointment: null });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openStudentModal = (student?: Student | null) => setStudentModal({ open: true, student: student || null });
  const openAppointmentModal = (appointment?: Appointment | null) => setAppointmentModal({ open: true, appointment: appointment || null });

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] font-sans" dir="ltr">
      <SEO title="Administration" description="Portail d'administration Tilmid." noindex />

      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar
          onOpenMobileSidebar={() => setMobileOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onCreateStudent={() => openStudentModal(null)}
          onCreateAppointment={openAppointmentModal}
        />

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-7">
          <div className="max-w-[1500px] mx-auto">
            <Outlet context={{ openStudentModal, openAppointmentModal } satisfies AdminOutletContext} />
          </div>
        </main>
      </div>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />

      <StudentFormModal
        open={studentModal.open}
        student={studentModal.student}
        onClose={() => setStudentModal({ open: false, student: null })}
        onSaved={refreshStudents}
      />
      <AppointmentFormModal
        open={appointmentModal.open}
        students={students.data}
        appointment={appointmentModal.appointment}
        onClose={() => setAppointmentModal({ open: false, appointment: null })}
        onSaved={refreshAppointments}
      />
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/login" replace />;

  return (
    <AdminDataProvider>
      <AdminShell />
    </AdminDataProvider>
  );
};
