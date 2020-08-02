import { getCalendarShapes } from "./calendarShapes";
import { execDraw } from "./draw";

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

fetch("./foo").then(
  (x) => console.log(x),
  (y) => console.log(y)
);

setTimeout(() => {
  execDraw(ctx, getCalendarShapes());
}, 1000);
