import type { ReactNode } from "react";
import { Search } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const tone: Record<string, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  open: "bg-warning/15 text-warning border-warning/30",
  in_progress: "bg-primary/15 text-primary border-primary/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  approved: "bg-success/15 text-success border-success/30",
  completed: "bg-success/15 text-success border-success/30",
  active: "bg-success/15 text-success border-success/30",
  resolved: "bg-success/15 text-success border-success/30",
  success: "bg-success/15 text-success border-success/30",
  repaid: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
  blocked: "bg-destructive/15 text-destructive border-destructive/30",
  closed: "bg-destructive/15 text-destructive border-destructive/30",
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  urgent: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-primary/15 text-primary border-primary/30",
};

export function Status({ value }: { value: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize", tone[value] ?? "border-border bg-muted text-muted-foreground")}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />{value.replace("_", " ")}
    </span>
  );
}

export function PageHeader({ title, desc, children }: { title: string; desc?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("glass rounded-3xl p-4 sm:p-6", className)}>{children}</div>;
}

export function SearchBox({ value, onChange, placeholder = "Search…" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="h-10 w-full rounded-full border border-input bg-background/40 pl-9 pr-4 text-sm outline-none backdrop-blur focus-visible:ring-2 focus-visible:ring-ring sm:w-64" />
    </label>
  );
}

export function Select({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-full border border-input bg-background/60 px-4 text-sm capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {options.map((o) => <option key={o} value={o}>{o === "all" ? `All ${label.toLowerCase()}` : o.replace("_", " ")}</option>)}
    </select>
  );
}

const btnTone = {
  primary: "bg-gradient-primary text-primary-foreground shadow-glow",
  ghost: "border border-border bg-background/40 text-foreground hover:bg-accent",
  danger: "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25",
  success: "bg-success/15 text-success border border-success/30 hover:bg-success/25",
};
export const abtn = (t: keyof typeof btnTone = "ghost") =>
  cn("inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", btnTone[t]);

/** Button that asks for confirmation before running a sensitive action. */
export function Confirm({ label, title, desc, onConfirm, tone: t = "ghost", disabled }: {
  label: ReactNode; title: string; desc: string; onConfirm: () => void; tone?: keyof typeof btnTone; disabled?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={abtn(t)} disabled={disabled}>{label}</AlertDialogTrigger>
      <AlertDialogContent className="glass border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: boolean }) {
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead><tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          {head.map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}
        </tr></thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
      {empty && <p className="py-10 text-center text-sm text-muted-foreground">Nothing matches your filters.</p>}
    </div>
  );
}

export function Loading() {
  return <div className="grid h-40 place-items-center text-sm text-muted-foreground" role="status">Loading…</div>;
}
