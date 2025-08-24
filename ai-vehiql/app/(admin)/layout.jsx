import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import HeaderAdmin from "@/components/header-admin";
import Sidebar from "./admin/_components/sidebar";
import { getAdmin } from "@/actions/admin";

const AdminLayout = async ({ children }) => {
  const admin = await getAdmin();

  if (!admin.authorized) return notFound();

  return (
    <ClerkProvider>
      <HeaderAdmin isAdminPage={true} />

      {/* Desktop / tablet fixed sidebar — width = 16rem (w-64) */}
      <aside
        className="hidden md:flex md:fixed md:inset-y-0 md:top-20 md:left-0 md:w-64 md:flex-col z-50"
        aria-hidden={false}
        data-component="admin-sidebar-wrapper"
      >
        <Sidebar />
      </aside>

      {/* Mobile: floating bottom icon-only nav (mounted outside the desktop aside) */}
      <div className="md:hidden">
        <Sidebar mobile />
      </div>

      {/* Main content reserves space for the desktop sidebar on md+ (md:pl-64)
          and for the mobile bottom nav on small screens (pb-20), so nothing overlaps. */}
      <main
        className="min-h-screen w-full md:pl-64 pt-[80px] pb-20 md:pb-0"
        role="main"
      >
        {children}
      </main>
    </ClerkProvider>
  );
};

export default AdminLayout;
