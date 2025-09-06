import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  animated?: boolean;
  animationDuration?: number;
  animationDelay?: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, animated = false, animationDuration = 1500, animationDelay = 0, ...props }, ref) => {
  const [animatedValue, setAnimatedValue] = useState(animated ? 0 : value || 0);

  useEffect(() => {
    if (!animated || !value) return;

    const timer = setTimeout(() => {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / animationDuration, 1);
        
        // Easing function for smoother animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = easeOutCubic * value;
        
        setAnimatedValue(currentValue);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [value, animated, animationDuration, animationDelay]);

  const displayValue = animated ? animatedValue : value;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all duration-500 ease-out"
        style={{ transform: `translateX(-${100 - (displayValue || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
