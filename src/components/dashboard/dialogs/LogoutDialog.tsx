import { LogOut, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
  onOpenDelete: () => void;
}

export function LogoutDialog({
  open,
  onOpenChange,
  onLogout,
  onOpenDelete,
}: LogoutDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border shadow-brutal max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-lg uppercase tracking-tight flex items-center gap-2">
            <LogOut className="h-5 w-5 text-amber" />
            terminate session?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to log out? You'll need to sign back in to edit your folio.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-3">
          <AlertDialogCancel className="border-border hover:bg-foreground hover:text-background font-mono text-[11px] uppercase tracking-widest h-9 transition-colors">
            cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onLogout}
            className="bg-foreground text-background hover:bg-foreground/90 font-mono text-[11px] uppercase tracking-widest font-bold h-9"
          >
            confirm_logout
          </AlertDialogAction>
        </AlertDialogFooter>
        
        <div className="pt-6 mt-4 border-t border-border/50">
          <button
            onClick={() => {
              onOpenChange(false);
              onOpenDelete();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors group"
          >
            <Trash2 className="h-3 w-3 opacity-50 group-hover:opacity-100" />
            permanently delete account
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
