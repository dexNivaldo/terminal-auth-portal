import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-brand-700 text-white shadow-sm hover:bg-brand-800 focus-visible:ring-white/80 focus-visible:ring-offset-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 dark:focus-visible:ring-offset-brand-600',
        secondary:
          'border border-zinc-300 bg-white text-zinc-800 shadow-sm hover:bg-zinc-50 focus-visible:ring-brand-600/50 focus-visible:ring-offset-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-900',
        outline:
          'border border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-100 focus-visible:ring-brand-600/50 focus-visible:ring-offset-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-900',
        ghost:
          'text-zinc-700 hover:bg-zinc-100 focus-visible:ring-brand-600/50 focus-visible:ring-offset-white dark:text-zinc-300 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-900',
        destructive:
          'border border-red-200 bg-red-50 text-red-800 hover:bg-red-100 focus-visible:ring-red-700/30 focus-visible:ring-offset-white dark:border-red-900 dark:bg-red-950/50 dark:text-red-200 dark:hover:bg-red-950 dark:focus-visible:ring-offset-zinc-900',
        link: 'text-brand-700 underline-offset-4 hover:underline focus-visible:ring-brand-600/50 dark:text-brand-300',
      },
      size: {
        default: 'h-9 px-4',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 px-5',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
