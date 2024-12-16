import { clsx, type ClassValue } from "clsx"
import { format, parse } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getScreenSize(bp: "sm" | "md" | "lg" | "xl") {
    switch (bp) {
        case "sm":
            return 640;
        case "md":
            return 768;
        case "lg":
            return 1024;
        case "xl":
            return 1280;
    } 
}

export function numericToTextDate(date: string, shortenedMonth=false) {
    date = !date ? "01/01/2024" : date;

    const parsed = parse(date, "dd/MM/yyyy", new Date());
    const isSingleDigit = date.split('/')[0].trim().startsWith('0');
    

    return format(parsed, `${isSingleDigit ? 'd' : 'dd'} ${shortenedMonth ? "MMM" : "MMMM"} yyyy`)
}
