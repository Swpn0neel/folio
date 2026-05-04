import { Share2, Globe, Check, Copy, Twitter, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileUrl: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  profileUrl,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border shadow-brutal w-[95vw] max-w-md p-0 overflow-hidden bg-background">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6 sm:mb-8">
            <DialogTitle className="font-mono text-lg sm:text-xl uppercase tracking-tighter flex items-center gap-2">
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-neon" />
              share_your_folio
            </DialogTitle>
            <DialogDescription className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
              let the world see what you've built
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            <div className="relative flex items-center gap-2 p-3 bg-muted/30 border border-border font-mono text-[11px] sm:text-xs">
              <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate flex-1 text-foreground/90">{profileUrl}</span>
            </div>

            <button
              onClick={handleCopy}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 px-4 font-mono text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 border-2",
                copied 
                  ? "bg-neon border-neon text-background shadow-glow-neon" 
                  : "bg-background border-border hover:border-neon hover:text-neon hover:shadow-brutal"
              )}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  copied_to_clipboard
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  copy_profile_link
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
              <a
                href={`https://twitter.com/intent/tweet?text=Check out my portfolio on folio! ${profileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 sm:py-3 border border-border hover:border-cyan hover:text-cyan transition-colors text-[9px] sm:text-[10px] font-mono uppercase tracking-wider"
              >
                <Twitter className="h-3.5 w-3.5" />
                twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${profileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 sm:py-3 border border-border hover:border-cyan hover:text-cyan transition-colors text-[9px] sm:text-[10px] font-mono uppercase tracking-wider"
              >
                <Linkedin className="h-3.5 w-3.5" />
                linkedin
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
