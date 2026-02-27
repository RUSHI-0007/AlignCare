import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
}

const InteractiveHoverButton = React.forwardRef<
    HTMLButtonElement,
    InteractiveHoverButtonProps
>(({ text = "Book Appointment", className, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "group inline-flex items-center gap-3 whitespace-nowrap rounded-full px-8 py-4 font-bold text-white cursor-pointer transition-colors duration-300",
                className,
            )}
            style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                backgroundColor: "#00A9CE",   // Aligncare sky blue
                letterSpacing: "0.01em",
                boxShadow: "0 8px 32px rgba(0, 169, 206, 0.35)",
            }}
            /* CSS hover handled via Tailwind group but bg needs JS for inline-style fallback */
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0088A8"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#00A9CE"}
            {...props}
        >
            {text}
            <ArrowRight
                size={18}
                className="translate-x-0 opacity-70 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
            />
        </button>
    );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
