export interface Circle {
  shape: "Circle";
  x: number;
  y: number;
  r: number;
}

export interface Rect {
  shape: "Rect";
  x: number;
  y: number;
  h: number;
  w: number;
  fill?: string;
  opacity?: number;
}

export interface Line {
  shape: "Line";
  stroke?: string;
  fx: number;
  fy: number;
  tx: number;
  ty: number;
  thickness: number;
}

export interface Text {
  shape: "Text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fill?: string;
  opacity?: number;
  textAlign?: "left" | "right" | "center" | "start" | "end";
  textBaseline?:
    | "top"
    | "hanging"
    | "middle"
    | "alphabetic"
    | "ideographic"
    | "bottom";
  x: number;
  y: number;
}

interface Translate {
  transform: "Translate";
  x: number;
  y: number;
}

type Transform = Translate;

export interface Group {
  container: "Group";
  elements: (Shape | Container)[];
  transforms: Transform[];
}

export type Shape = Rect | Line | Text;
export type Container = Group;

export interface DataNode {
  id: string;
  children: DataNode[];
}
