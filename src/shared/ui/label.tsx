import * as React from "react";
import { Text } from "@radix-ui/themes";
import { useLogLifecycle } from "@/shared/hooks";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ ...props }, ref) => {
  useLogLifecycle("Label");
  return (
    <Text as="label" size="2" weight="medium" asChild>
      <label ref={ref} {...props} />
    </Text>
  );
});
Label.displayName = "Label";

export { Label };

