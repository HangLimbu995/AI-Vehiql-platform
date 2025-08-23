import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import HeaderAdmin from "@/components/header-admin";
import Sidebar from "./admin/_components/sidebar";

const AdminLayout = async ({ children }) => {
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

      {/* Main content reserves space for the sidebar on md+ (md:pl-64),
          so the sidebar never overlaps children. On small screens the
          sidebar is hidden and the main content uses full width. */}
      <main className="min-h-screen w-full md:pl-64 pt-[80px] " role="main">
        {children}
      </main>
    </ClerkProvider>
  );
};

export default AdminLayout;
