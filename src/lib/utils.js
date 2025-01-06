import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// function to convert role string into role_id
export const getRoleStringToId = (roleId) => {
  switch (roleId) {
    case 'Admin':
      return 1;
    case 'Mitarbeiter':
      return 2;
    default:
      return "Unknown Role";
  }
};

// function to convert role_id into string
export const getRoleString = (roleId) => {
  switch (roleId) {
    case 1:
      return "Admin";
    case 2:
      return "Mitarbeiter";
    default:
      return "Unknown Role";
  }
};

// Function to calculate expiration date
export const calculateExpirationDate = (dateString, year) => {
  const newDate = new Date(dateString);
  newDate.setFullYear(newDate.getFullYear() + year);
  return newDate.toISOString().split('T')[0];
};