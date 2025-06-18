import { Button } from "../../components/Button";
import UptimeChart, { Status, UptimeData } from "../../components/UptimeChart";

export default function Home() {
  const data: UptimeData[] = [
    { status: "Up" as Status, date: "2025-06-10", duration: "1440" },
    { status: "Down" as Status, date: "2025-06-11", duration: "10" },
    { status: "Up" as Status, date: "2025-06-12", duration: "1430" },
    // more objects...
  ];

  return (
    <>
      <Button variant="primary" text={"add"} />
      <div className="flex ">
        <UptimeChart uptimeData={data} />

        <div className="bg-red  border-solid h-5 w-30 border-amber-400  ">
          {" "}
          hi{" "}
        </div>
      </div>
    </>
  );
}
