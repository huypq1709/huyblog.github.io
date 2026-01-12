import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: 'bg-destructive/10 border-destructive/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
    info: 'bg-blue-500/10 border-blue-500/20'
  };

  const buttonStyles = {
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    info: 'bg-blue-500 text-white hover:bg-blue-600'
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-background rounded-xl shadow-2xl border border-border p-6 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className={`rounded-lg border p-4 mb-6 ${variantStyles[variant]}`}>
          <div className="flex items-start gap-4">
            <AlertTriangle className={`h-6 w-6 shrink-0 mt-0.5 ${
              variant === 'danger' ? 'text-destructive' : 
              variant === 'warning' ? 'text-yellow-500' : 
              'text-blue-500'
            }`} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button 
            variant="ghost" 
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button 
            onClick={handleConfirm}
            className={buttonStyles[variant]}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

