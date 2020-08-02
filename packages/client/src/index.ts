import { getCalendarShapes } from "./calendarShapes";
import { execDraw } from "./draw";

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const test = async () => {
  const response = await fetch("foo");

  console.log("A");
  console.log(await response.text());
  console.log("B");
};

test();

setTimeout(() => {
  execDraw(ctx, getCalendarShapes());
}, 1000);
