import { AlertTriangle } from "lucide-react";
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

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  handle: string;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  onDelete,
  handle,
}: DeleteAccountDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-destructive shadow-brutal-destructive max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-lg uppercase tracking-tight flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            danger_zone
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs text-muted-foreground leading-relaxed">
            This action is irreversible. Your handle <span className="text-foreground">@{handle}</span> will be released, and all your projects, gallery images, and links will be wiped from our database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-3">
          <AlertDialogCancel className="border-border hover:bg-foreground hover:text-background font-mono text-[11px] uppercase tracking-widest h-9 transition-colors">
            abort
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-mono text-[11px] uppercase tracking-widest font-bold h-9"
          >
            delete_forever
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
