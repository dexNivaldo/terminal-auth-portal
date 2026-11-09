import * as React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const alertVariants = cva(
  'flex w-full items-start gap-2.5 rounded-lg border p-3 text-sm',
  {
    variants: {
      variant: {
        error: 'border-red-200 bg-red-50 text-red-900',
        warning: 'border-amber-200 bg-amber-50 text-amber-900',
        success: 'border-green-200 bg-green-50 text-green-800',
        info: 'border-zinc-200 bg-zinc-50 text-zinc-700',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const iconVariants = cva('mt-0.5 size-4 shrink-0', {
  variants: {
    variant: {
      error: 'text-red-700',
      warning: 'text-amber-600',
      success: 'text-green-600',
      info: 'text-zinc-500',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

const icons = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, children, ...props }, ref) => {
    const resolvedVariant = variant ?? 'info';
    const Icon = icons[resolvedVariant];
    return (
      <div
        ref={ref}
        role={variant === 'error' ? 'alert' : 'status'}
        className={cn(alertVariants({ variant: resolvedVariant }), className)}
        {...props}
      >
        <Icon className={cn(iconVariants({ variant: resolvedVariant }))} />
        <div className="min-w-0 flex-1">
          {title && <p className="font-medium">{title}</p>}
          {children && (
            <div className={cn('text-sm', title && 'mt-0.5')}>{children}</div>
          )}
        </div>
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export { Alert, alertVariants };
