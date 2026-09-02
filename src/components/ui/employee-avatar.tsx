import { getInitials, cn } from "@/lib/utils";

const colors = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
];

function colorFromName(name: string): string {
  const idx = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
}

interface EmployeeAvatarProps {
  firstName: string;
  lastName: string;
  profileImage?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-20 w-20 text-xl",
};

export function EmployeeAvatar({ firstName, lastName, profileImage, size = "md", className }: EmployeeAvatarProps) {
  const initials = getInitials(firstName, lastName);
  const color = colorFromName(firstName + lastName);

  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt={`${firstName} ${lastName}`}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <div
      aria-label={`${firstName} ${lastName}`}
      className={cn(
        "flex items-center justify-center rounded-full font-semibold text-white",
        color,
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
