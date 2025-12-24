import React from 'react';
import { Slot } from '@radix-ui/react-slot';  // Install if using
import { cn } from '../lib/utils'; 

const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeVariants = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef(
  (
    { className, variant = "default", size = "default", asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const variantClass = buttonVariants[variant] || buttonVariants.default;
    const sizeClass = sizeVariants[size] || sizeVariants.default;

    return (
      <Comp
        className={cn(variantClass, sizeClass, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
