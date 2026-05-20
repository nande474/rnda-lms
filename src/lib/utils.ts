import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SUBJECTS = {
  MATHEMATICS: "Mathematics",
  PHYSICAL_SCIENCE: "Physical Science",
  LIFE_SCIENCE: "Life Science",
  COMPUTER_SCIENCE: "Computer Science",
  TECHNOLOGY: "Technology",
} as const;

export const SUBJECT_COLORS: Record<string, string> = {
  MATHEMATICS: "bg-blue-100 text-blue-800",
  PHYSICAL_SCIENCE: "bg-purple-100 text-purple-800",
  LIFE_SCIENCE: "bg-emerald-100 text-emerald-800",
  COMPUTER_SCIENCE: "bg-orange-100 text-orange-800",
  TECHNOLOGY: "bg-cyan-100 text-cyan-800",
};

export const SUBJECT_ICONS: Record<string, string> = {
  MATHEMATICS: "📐",
  PHYSICAL_SCIENCE: "⚗️",
  LIFE_SCIENCE: "🧬",
  COMPUTER_SCIENCE: "💻",
  TECHNOLOGY: "🔧",
};

export const GRADES = [5, 6, 7, 8, 9, 10, 11, 12];

export const SITES: Record<number, { name: string; shortName: string }> = {
  1: { name: "Masibambane College",     shortName: "Masibambane" },
  2: { name: "Monument Park High",      shortName: "Monument Park" },
  3: { name: "Sophumelela High School", shortName: "Sophumelela" },
  4: { name: "School 4",               shortName: "School 4" },
  5: { name: "School 5",               shortName: "School 5" },
};

export function getSiteName(siteId: number | null | undefined) {
  if (!siteId) return null;
  return SITES[siteId]?.shortName ?? `Site ${siteId}`;
}

export function getGradeLabel(grade: number) {
  return `Grade ${grade}`;
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateProgress(completed: number, total: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
