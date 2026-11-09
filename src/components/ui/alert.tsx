import * as React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const alertVariants = cva(
  'flex w-full items-start gap-2.5 rounded-lg border p-3 text-sm',
  {
    variants: {
      variant: {
        error:
          'border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200',
        warning:
          'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200',
        success:
          'border-green-200 bg-green-50 text-green-800 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200',
        info: 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
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
      error: 'text-red-700 dark:text-red-400',
      warning: 'text-amber-600 dark:text-amber-400',
      success: 'text-green-600 dark:text-green-400',
      info: 'text-zinc-500 dark:text-zinc-400',
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
