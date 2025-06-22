export type Status = "Up" | "Down" | "Unknown";

export interface UptimeData {
  status: Status;
  date: string;
  duration: string;
}

export interface UptimeChartProps {
  uptimeData: UptimeData[];
}

const statusColors = {
  Up: "green",
  Down: "red",
  Unknown: "white",
};

export default function UptimeChart({ uptimeData }: UptimeChartProps) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {uptimeData.map((item, idx) => (
        <div
          className="m-10px "
          key={idx}
          style={{
            width: 10,
            height: 54,
            margin: "0 2px",
            background: statusColors[item.status] || "#ccc",
          }}
          title={
            `${item.date}\nStatus: ${item.status}` +
            (item.status !== "Up" ? `\nDown for ${item.duration} min` : "")
          }
        />
      ))}
    </div>
  );
}