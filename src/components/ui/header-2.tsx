'use client';
import React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';

const links = [
    { label: 'Services', href: '#services' },
    { label: 'Clinic', href: '#clinic' },
    { label: 'Home Visit', href: '#home-visit' },
];

/* ── Blue Glassy Aligncare Navbar ─────────────────────────────────────────── */
export function Header() {
    const [open, setOpen] = React.useState(false);
    const scrolled = useScroll(10);

    // Lock scroll when mobile menu open
    React.useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    /* Blue glass — strong visible border + multi-layer shadow for realism */
    const glassStyle: React.CSSProperties = {
        background: 'rgba(224, 232, 255, 0.70)',
        backdropFilter: 'blur(20px) saturate(1.8)',
        border: '1px solid rgba(45, 91, 227, 0.25)',
        boxShadow: scrolled
            ? '0 8px 32px rgba(45, 91, 227, 0.18), 0 2px 8px rgba(15, 30, 60, 0.12), inset 0 1px 0 rgba(255,255,255,0.6)'
            : '0 4px 20px rgba(45, 91, 227, 0.12), 0 1px 4px rgba(15, 30, 60, 0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
    };

    return (
        <header
            className={cn(
                'sticky top-0 z-50 mx-auto w-full max-w-5xl transition-all duration-500 ease-out',
                scrolled && !open
                    ? 'md:top-4 md:rounded-full'
                    : 'md:top-0 md:rounded-none',
            )}
            style={glassStyle}
        >
            <nav
                className={cn(
                    'flex h-14 w-full items-center justify-between px-6 md:h-13 transition-all duration-300',
                    scrolled && 'md:px-4',
                )}
            >
                {/* Aligncare 3-colour wordmark */}
                <Link
                    href="/"
                    className="font-bold text-xl select-none"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em' }}
                >
                    <span style={{ color: '#0F1E3C' }}>Align</span>
                    <span style={{ color: '#2D5BE3' }}>care</span>
                    <span style={{ color: '#0D9488' }}>.</span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className={buttonVariants({ variant: 'ghost' })}
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0F1E3C', fontSize: '0.875rem' }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Book Now CTA — indigo */}
                <div className="hidden md:block">
                    <Link href="/booking">
                        <Button
                            className="rounded-full px-5 font-semibold"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                        >
                            Book Now
                        </Button>
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setOpen(!open)}
                    className="md:hidden rounded-full"
                    aria-label="Toggle menu"
                    style={{ borderColor: 'rgba(45,91,227,0.3)', color: '#2D5BE3' }}
                >
                    <MenuToggleIcon open={open} className="size-5" duration={300} />
                </Button>
            </nav>

            {/* ── Mobile menu drawer ── */}
            <div
                className={cn(
                    'fixed top-14 right-0 bottom-0 left-0 z-50 md:hidden overflow-hidden transition-all duration-300',
                    open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
                )}
                style={{
                    background: 'rgba(224, 232, 255, 0.92)',
                    backdropFilter: 'blur(24px)',
                    borderTop: '1px solid rgba(45,91,227,0.15)',
                }}
            >
                <div className="flex h-full flex-col justify-between p-6 gap-4">
                    <div className="grid gap-2 pt-2">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={buttonVariants({ variant: 'ghost', className: 'justify-start text-base h-12' })}
                                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0F1E3C' }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <Link href="/booking" onClick={() => setOpen(false)}>
                        <Button className="w-full h-12 rounded-full font-semibold text-base"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            Book Now
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
