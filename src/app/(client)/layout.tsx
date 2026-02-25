import GlassNavbar from "@/components/ui/GlassNavbar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-primary-background">
            <GlassNavbar />
            <main className="relative z-10">
                {children}
            </main>
        </div>
    );
}
