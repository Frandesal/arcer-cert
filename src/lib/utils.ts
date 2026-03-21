import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses a YYYY-MM-DD string as a local Date, ignoring the user's system timezone 
 * offset to prevent date-shifting backwards or forwards on misconfigured devices.
 */
export function parseLocalDate(dateStr: string | null | undefined): Date {
  if (!dateStr) return new Date();
  // Strip any time components if present and grab just year-month-day
  const parts = dateStr.split("T")[0].split("-");
  if (parts.length !== 3) return new Date(dateStr);
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed month
  const day = parseInt(parts[2], 10);
  
  return new Date(year, month, day);
}
