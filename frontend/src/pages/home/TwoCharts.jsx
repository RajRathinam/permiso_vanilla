import React, { PureComponent } from 'react';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

const data01 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const data02 = [
  { name: 'A1', value: 100 },
  { name: 'A2', value: 300 },
  { name: 'B1', value: 100 },
  { name: 'B2', value: 80 },
];

export default class TwoCharts extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="30%" height="60%">
        <PieChart width={400} height={400} style={{ outline: 'none' }}>
          <Pie
            data={data01}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={70}
            fill="#8884d8"
          />
          <Pie
            data={data02}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            fill="#82ca9d"
            label
          />
        </PieChart>
        <h1 className="text-2xl font-extralight px-10 mt-1 text-center">Both Class & Counselling Student's</h1>
      </ResponsiveContainer>
    );
  }
}
