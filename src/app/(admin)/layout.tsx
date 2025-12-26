import AdminGuard from '@/ui/components/auth/AdminGuard';
import AdminSidebar from '@/ui/organisms/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-50">
                <AdminSidebar />
                <main className="ml-64 p-8">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}