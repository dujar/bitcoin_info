import { useCallback } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { ESpan } from "../types";
interface ChartProps {
  meta: {
    keyX: string;
    keyY: string;
    span: ESpan;
    data: { time: string; feed: number }[];
  };
}
export const Chart = (props: ChartProps) => {
  const renderLineChart = useCallback(
    (meta: ChartProps["meta"]) => (
      <LineChart key={meta.span} width={650} height={300} data={meta.data}>
        <Line type='monotone' dataKey={meta.keyY} stroke='#8884d8' />
        <CartesianGrid stroke='#ccc' />
        <XAxis dataKey={meta.keyX} />
        <YAxis />
      </LineChart>
    ),
    []
  );
  return renderLineChart(props.meta);
};
