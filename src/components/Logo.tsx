import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  isStatic?: boolean;
}

export function Logo({ className = "h-5 w-5", isStatic = false }: LogoProps) {
  return (
    <svg
      className={cn("shrink-0", className)}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer frame */}
      <rect x="2" y="2" width="28" height="28" stroke="currentColor" strokeWidth="2.5" />
      
      {/* Stylized 'f' */}
      <path
        d="M12 22V10H20M12 16H18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
      />
      
      {/* Terminal cursor block */}
      <rect
        x="20"
        y="20"
        width="4"
        height="4"
        className={cn("fill-neon", !isStatic && "animate-blink")}
      />
    </svg>
  );
}
