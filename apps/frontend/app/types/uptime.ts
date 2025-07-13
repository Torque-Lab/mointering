export type Status = "Up" | "Down" | "Unknown";

export interface UptimeData {
  date: string;
  uptime: number;  // Uptime as a number (e.g., 99.5 for 99.5%)
  avgResponseTime: number;
  upCount: number;
  downCount: number;
  totalChecks: number;
}