import { getCalendarShapes } from "./calendarShapes";
import { execDraw } from "./draw";

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

setTimeout(() => {
  execDraw(ctx, getCalendarShapes());
}, 1000);
