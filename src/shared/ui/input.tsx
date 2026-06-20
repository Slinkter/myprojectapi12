import * as React from "react";
import { TextField } from "@radix-ui/themes";
import { useLogLifecycle } from "@/shared/hooks";

const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<typeof TextField.Root>>(
  (props, ref) => {
    useLogLifecycle("Input");
    return (
      <TextField.Root
        ref={ref}
        size="3"
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

