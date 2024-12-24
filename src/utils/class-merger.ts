import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { // for more readable classname when using tailwind class
  return twMerge(clsx(inputs));
}