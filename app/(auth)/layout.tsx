import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col min-h-screen">
        {/* Simple header for auth pages */}
        <header className="bg-slate-300 shadow-sm p-4">
          <div className="container mx-auto">
            <Link href="/" className="text-xl font-bold">
              Green Gaming
            </Link>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="bg-slate-200 py-4">
          <div className="container mx-auto text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} Green Gaming. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
