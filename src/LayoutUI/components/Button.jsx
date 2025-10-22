import React from "react";

// Tiny `cn` (classNames) helper — merge conditional class strings
const cn = (...args) =>
  args
    .flatMap((a) => (Array.isArray(a) ? a : [a]))
    .filter(Boolean)
    .join(" ");

// --- MODIFIED variantStyles ---
const variantStyles = {
  // Primary button: Dark blue from the 'Create Account' button
  default:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-300",
  
  // New variant for GitHub/Google social buttons (Dark mode outline)
  darkOutline:
    "border border-[#333333] bg-[#242424] text-white hover:bg-[#333333] focus-visible:ring-gray-600",
    
  // Existing variants (kept for versatility)
  destructive:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300",
  outline:
    "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-900",
  link: "bg-transparent underline-offset-4 hover:underline text-sky-600",
};

const sizeStyles = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-sm",
  // Adjusted 'lg' size to match the height of the 'Create Account' button (py-3 generally makes it taller)
  lg: "h-12 px-6 py-3 text-base", 
};

const base =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const Button = React.forwardRef(
  (
    {
      children,
      className,
      variant = "default",
      size = "default",
      loading = false,
      disabled = false,
      asChild = false,
      icon = null,
      type = "button",
      ...props
    },
    ref
  ) => {
    const Component = asChild && props.href ? "a" : props.as || "button";

    const classes = cn(base, variantStyles[variant], sizeStyles[size], className);

    return (
      <Component
        ref={ref}
        className={classes}
        aria-busy={loading ? true : undefined}
        disabled={disabled || loading}
        type={Component === "button" ? type : undefined}
        {...props}
      >
        {/* icon slot */}
        {loading ? (
          <svg
            className={cn("animate-spin mr-2 h-4 w-4", size === "lg" ? "h-5 w-5" : "h-4 w-4")}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : (
          // Adjusted spacing for icon placement
          icon && <span className="mr-3 inline-flex items-center">{icon}</span>
        )}

        <span>{children}</span>
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;