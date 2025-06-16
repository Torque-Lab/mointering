import UptimeChart from "@repo/ui/UptimeChart";
import type { UptimeData, Status } from "@repo/ui/UptimeChart";

export default function Home() {
  const data: UptimeData[] = [
    { status: "Up" as Status, date: "2025-06-10", duration: "1440" },
    { status: "Down" as Status, date: "2025-06-11", duration: "10" },
    { status: "Up" as Status, date: "2025-06-12", duration: "1430" },
    // more objects...
  ];

  return (
    <div className="flex">
      <UptimeChart uptimeData={data} />

      <div className="bg-red h-80 w-72 border-solid "> hi </div>
    </div>
  );
}
