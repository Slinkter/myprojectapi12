import { Button as RadixButton } from "@radix-ui/themes";
import { forwardRef } from 'react';
import { useLogLifecycle } from "@/shared/hooks";

export interface ButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof RadixButton>, "size" | "variant"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, color, ...props }, ref) => {
    useLogLifecycle("Button");
    
    // Map Tailwind variants to Radix Themes variants
    let radixVariant: "solid" | "soft" | "outline" | "ghost" | "surface" | "classic" = "solid";
    let radixColor = color;
    
    if (variant === "destructive") {
      radixVariant = "soft";
      radixColor = radixColor || "red";
    } else if (variant === "outline") {
      radixVariant = "outline";
    } else if (variant === "secondary") {
      radixVariant = "surface";
    } else if (variant === "ghost") {
      radixVariant = "ghost";
    } else if (variant === "link") {
      radixVariant = "ghost";
      // We can add custom link style inside styles or inline if needed, but ghost is a good base.
    }
    
    // Map Tailwind sizes to Radix Themes sizes
    let radixSize: "1" | "2" | "3" | "4" = "3";
    if (size === "sm") {
      radixSize = "2";
    } else if (size === "lg") {
      radixSize = "4";
    } else if (size === "icon") {
      radixSize = "2";
    }
    
    return (
      <RadixButton
        ref={ref}
        variant={radixVariant}
        size={radixSize}
        color={radixColor}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
