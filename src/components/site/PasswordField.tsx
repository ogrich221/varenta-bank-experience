import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  /** Optional icon rendered inside the field on the left. */
  icon?: ReactNode;
  /** Extra classes for the eye button (e.g. a different inset). */
  buttonClassName?: string;
  /** Word used in the eye button's accessible label. Defaults to "password". */
  revealWord?: string;
};

/**
 * Masked input (password or PIN) with an accessible show/hide eye toggle.
 * The toggle is a separate button, so the field keeps its real input type
 * for password managers while still being readable on demand.
 */
export function PasswordField({
  className,
  icon,
  buttonClassName,
  revealWord = "password",
  ...input
}: Props) {
  const [shown, setShown] = useState(false);

  return (
    <div className="relative">
      {icon && (
        <span
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        >
          {icon}
        </span>
      )}
      <input
        {...input}
        type={shown ? "text" : "password"}
        className={cn("w-full", icon && "pl-10", className, "pr-11")}
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? `Hide ${revealWord}` : `Show ${revealWord}`}
        aria-pressed={shown}
        className={cn(
          "absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition hover:bg-background/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          buttonClassName,
        )}
      >
        {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
