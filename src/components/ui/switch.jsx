import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchStyles = cva(
    "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
    {
        variants: {
            checked: {
                true: "bg-blue-600",
                false: "bg-gray-600",
            },
        },
        defaultVariants: {
            checked: false,
        },
    }
);

export const Switch = React.forwardRef(({ checked, onChange }, ref) => {
    return (
        <button
            ref={ref}
            type="button"
            onClick={() => onChange(!checked)}
            className={cn(switchStyles({ checked }))}
        >
      <span
          className={cn(
              "block h-5 w-5 rounded-full bg-white shadow transform transition-transform",
              checked ? "translate-x-5" : "translate-x-0"
          )}
      />
        </button>
    );
});

Switch.displayName = "Switch";
