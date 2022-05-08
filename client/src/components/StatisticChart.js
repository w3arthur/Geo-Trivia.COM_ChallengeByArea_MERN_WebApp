import React from "react";
import { PieChart, Pie, Cell/*, Tooltip, Legend*/ } from "recharts";
import { colors, statisticChart } from '../Config';

const dataFail = statisticChart.errorExampleData;	//	[{ answer: 99, counter: 10 },{ answer: 34, counter: 10 }]

const COLORS = colors.statisticChart.piColors;	//	['#0088FEFF', '#00C49FFF', '#FFBB28FF', '#FF8042FF', '#FFBB28FF', '#00C49FFF']
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (data) => ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, }) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
			{`${percent> 0.1 ? Number(data[index].answer) + 1 : ""}`} 
		</text>
	);
};

export default function StatisticChart({data}) {
    const setData = data ? data : dataFail;
		return (
			<PieChart width={200} height={200} >
				<Pie data={setData} labelLine={false} label={renderCustomizedLabel(setData)} outerRadius='100%' fill="#8884d8" dataKey="counter" >
					{ setData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />) }
				</Pie>
			</PieChart>
		);

}

