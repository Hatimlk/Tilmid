import React from 'react';
import { AdminPageHeader, ModuleComingSoon } from '../../components/admin/primitives';

export const AdminComingSoonPage: React.FC<{
  icon: React.ElementType;
  title: string;
  breadcrumb: string;
  description: string;
}> = ({ icon, title, breadcrumb, description }) => (
  <div>
    <AdminPageHeader title={title} breadcrumb={breadcrumb} />
    <ModuleComingSoon icon={icon} title={title} description={description} />
  </div>
);
