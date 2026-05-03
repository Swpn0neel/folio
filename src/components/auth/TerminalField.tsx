import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

export function TerminalField({
  label,
  prefix,
  type,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; prefix?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <span className="text-amber">▸</span> {label}
      </span>
      <div className="mt-1.5 flex items-center border border-border focus-within:border-neon bg-background px-3 py-2 transition-colors">
        {prefix && <span className="font-mono text-sm text-magenta mr-1 shrink-0">{prefix}</span>}
        <input
          {...props}
          type={inputType}
          className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-muted-foreground/40 min-w-0"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 text-muted-foreground hover:text-neon transition-colors focus:outline-none"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
      </div>
    </label>
  );
}
