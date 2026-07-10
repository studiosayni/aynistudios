import Link from "next/link";
import AdminGate from "./AdminGate";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate>
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl gap-8 px-6 py-8">
        <aside className="w-52 shrink-0 border-r border-white/10 pr-6 text-sm">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#7B878F]">
            Admin
          </p>
          <nav className="flex flex-col gap-2">
            <Link href="/admin" className="hover:text-[#FEB040]">
              Dashboard
            </Link>
            <Link href="/admin/clients" className="hover:text-[#FEB040]">
              Clients
            </Link>
            <Link href="/admin/projects" className="hover:text-[#FEB040]">
              Projects
            </Link>
            <Link href="/admin/library" className="hover:text-[#FEB040]">
              Library
            </Link>
          </nav>
        </aside>
        <section className="flex-1 min-w-0">{children}</section>
      </div>
    </AdminGate>
  );
}
