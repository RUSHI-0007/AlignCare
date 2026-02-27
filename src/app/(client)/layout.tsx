import { Header } from "@/components/ui/header-2";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-cream-50 text-clinic-navy">
            <Header />
            <main className="relative z-10">
                {children}
            </main>
        </div>
    );
}

