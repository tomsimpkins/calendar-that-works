import { Rect, Line, Shape, Container, Group, Text } from "./types";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d")!;

const drawRect = (ctx: CanvasRenderingContext2D, shape: Rect) => {
  ctx.fillStyle = shape.fill || "red";
  ctx.globalAlpha = shape.opacity || 1;
  ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
};

const drawLine = (ctx: CanvasRenderingContext2D, shape: Line) => {
  ctx.lineWidth = shape.thickness;
  ctx.strokeStyle = shape.stroke || "red";
  ctx.beginPath();
  ctx.moveTo(shape.fx, shape.fy);
  ctx.lineTo(shape.tx, shape.ty);
  ctx.stroke();
};

const drawText = (ctx: CanvasRenderingContext2D, shape: Text) => {
  ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;
  ctx.textBaseline = shape.textBaseline || "top";
  ctx.textAlign = shape.textAlign || "left";
  ctx.fillStyle = shape.fill || "black";
  ctx.globalAlpha = shape.opacity || 1;

  ctx.fillText(shape.text, shape.x, shape.y);
};

const drawGroup = (ctx: CanvasRenderingContext2D, group: Group) => {
  for (const transform of group.transforms) {
    switch (transform.transform) {
      case "Translate": {
        ctx.translate(transform.x, transform.y);
        break;
      }
      default: {
        throw new Error("Transforms are not exhaustive");
      }
    }
  }

  execDraw(ctx, group.elements);
};

export const execDraw = (
  ctx: CanvasRenderingContext2D,
  elements: (Shape | Container)[]
) => {
  for (const element of elements) {
    ctx.save();
    if ("shape" in element) {
      switch (element.shape) {
        case "Rect": {
          drawRect(ctx, element);
          break;
        }
        case "Line": {
          drawLine(ctx, element);
          break;
        }
        case "Text": {
          drawText(ctx, element);
          break;
        }
        default: {
          throw new Error("Shapes are not exhaustive");
        }
      }
    } else if ("container" in element) {
      switch (element.container) {
        case "Group": {
          drawGroup(ctx, element);
          break;
        }
        default: {
          throw new Error("Containers are not exhaustive");
        }
      }
    }

    ctx.restore();
  }
};

export const clear = (ctx: CanvasRenderingContext2D) => {
  ctx.resetTransform();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};
