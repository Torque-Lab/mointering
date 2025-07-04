export type Status = "Up" | "Down" | "Unknown";

export interface UptimeData {
  status: Status;
  timestamp: string;
  duration: number;
}