import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateHealthCard = (id: string): boolean => {
  // Remove spaces or dashes
  const cleanId = id.replace(/\D/g, "");
  
  // Basic length check (adjust based on your region, usually 10-12 digits)
  if (cleanId.length < 10) return false;

  // Luhn Algorithm logic
  let sum = 0;
  for (let i = 0; i < cleanId.length; i++) {
    let digit = parseInt(cleanId[cleanId.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};