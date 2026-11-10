import AdminShell from './AdminShell';

export { metadata } from './metadata';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminShell>{children}</AdminShell>;
}
