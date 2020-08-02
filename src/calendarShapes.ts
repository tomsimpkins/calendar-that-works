import { Rect, Group, Text, Shape } from "./types";
import chroma from "chroma-js";

const darks = chroma.brewer.Dark2;
const randomColor = () => {
  return darks[(Math.random() * darks.length) | 0];
};

const getBackground = (): Rect => ({
  shape: "Rect",
  x: 0,
  y: 0,
  w: 1000,
  h: 1000,
  fill: "black",
});

const cellW = 128;
const cellH = 128;
const pillH = 18;
const padding = 1;
const headerH = 32;

const getPill = ({
  x,
  y,
  text,
  color,
}: {
  x: number;
  y: number;
  text: string;
  color: string;
}): Group[] => {
  return [
    {
      container: "Group",
      elements: [
        {
          shape: "Rect",
          fill: color,
          x: padding * 2,
          y: padding * 2,
          w: cellW - 4 * padding,
          h: pillH,
        },
        {
          shape: "Text",
          fill: chroma.contrast("white", color) > 4.5 ? "white" : "black",
          x: padding * 6,
          y: pillH / 2 + padding * 3,
          text,
          fontFamily: "Arial",
          fontSize: pillH / 2,
          textBaseline: "middle",
        },
      ],
      transforms: [{ transform: "Translate", x, y }],
    },
  ];
};

const getPills = (
  { x, y }: { x: number; y: number },
  pillData: string[]
): Group[] => {
  return [
    {
      container: "Group",
      elements: pillData.flatMap((text, i) => {
        return getPill({
          x: 0,
          y: 2 * padding + i * (pillH + padding),
          text,
          color: randomColor(),
        });
      }),
      transforms: [{ transform: "Translate", x, y: y + 2 * padding }],
    },
  ];
};

const getDayShapes = ({
  x,
  y,
  date,
  month,
  pillData,
}: {
  x: number;
  y: number;
  date: number;
  month?: string;
  pillData: string[];
}): Group => {
  return {
    container: "Group",
    elements: [
      { shape: "Rect", x: 0, y: 0, w: cellW, h: cellH, fill: "black" },
      {
        shape: "Rect",
        x: padding,
        y: padding,
        w: cellW - 2 * padding,
        h: cellH - 2 * padding,
        fill: "white",
      },
      {
        shape: "Text",
        text: String(date),
        textAlign: "right",
        x: cellW - 4 * padding,
        y: 4 * padding,
        fontSize: 14,
        fontFamily: "Arial",
      },
      ...(month
        ? [
            {
              shape: "Text",
              text: month,
              textAlign: "left",
              x: 4 * padding,
              y: 4 * padding,
              fontSize: 14,
              fontFamily: "Arial",
            } as Text,
          ]
        : []),
      {
        shape: "Rect",
        fill: "black",
        w: cellW - 4 * padding,
        h: 1,
        x: 2 * padding,
        y: 16 + 4 * padding,
      },
      ...getPills({ x: 0, y: 16 }, pillData),
    ],
    transforms: [{ transform: "Translate", x, y }],
  };
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const dayNames = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"];

const getDayNamesHeader = (): Shape[] => {
  return dayNames.flatMap((d, i) => {
    return [
      {
        shape: "Rect",
        w: cellW,
        h: headerH,
        x: i * cellW,
        y: 0,
        fill: "black",
      },
      {
        shape: "Rect",
        w: cellW - 2 * padding,
        h: headerH - 2 * padding,
        x: i * cellW + padding,
        y: padding,
        fill: "black",
      },
      {
        shape: "Text",
        text: d,
        textAlign: "left",
        textBaseline: "middle",
        fill: "white",
        opacity: 1,
        x: i * cellW + 4 * padding,
        y: headerH / 2 + padding,
        fontSize: 16,
        fontFamily: "Arial",
      },
    ];
  });
};

const getDayData = (year: number, month: number) => {
  const dayInMs = 24 * 60 * 60 * 1000;

  const startDay = new Date(Date.UTC(year, month, 1));
  const endDay = new Date(Date.UTC(year, month + 1, 1) - dayInMs);

  const startDayOffset = startDay.getUTCDay();
  const endDayOffset = 6 - endDay.getUTCDay();

  const startCalUTC = Date.UTC(year, month, 1) - startDayOffset * dayInMs;
  const endCalUTC = Date.UTC(year, month + 1, 1) + endDayOffset * dayInMs;

  const days = [];
  let calUtc = startCalUTC;
  while (calUtc < endCalUTC) {
    const tmp = new Date(calUtc);

    days.push({
      date: tmp.getUTCDate(),
      day: tmp.getUTCDay(),
      month: tmp.getUTCMonth(),
      year: tmp.getUTCFullYear(),
    });

    calUtc += dayInMs;
  }

  return days;
};

const getMonthShapes = (pillData: string[]): Group[] => {
  const now = new Date();
  const [year, month] = [now.getUTCFullYear(), now.getUTCMonth()];

  const days = getDayData(year, month);

  const res = [];
  let x = 0;
  let y = 0;

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const showMonth = day.date === 1 || i === 0;

    res[i] = getDayShapes({
      x,
      y,
      date: day.date,
      month: showMonth ? monthNames[day.month] : undefined,
      pillData,
    });

    if (day.day === 6) {
      y += cellH;
      x = 0;
    } else {
      x += cellW;
    }
  }

  return res;
};

export const getCalendarShapes = (): (Group | Shape)[] => {
  const pillData = [
    "Cosy's Birthday",
    "Toms's Birthday",
    "Jess's Birthday",
    "Twiggy's Birthday",
    "Alex's Birthday",
  ];

  return [
    {
      container: "Group",
      elements: getMonthShapes(pillData),
      transforms: [{ transform: "Translate", x: 0, y: headerH }],
    },
    ...getDayNamesHeader(),
  ];
};
