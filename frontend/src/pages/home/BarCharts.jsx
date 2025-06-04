import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 40,
    pv: 24,
    amt: 24,
  },
  {
    name: 'Page B',
    uv: 30,
    pv: 13,
    amt: 22,
  },
  {
    name: 'Page C',
    uv: 20,
    pv: 68,
    amt: 22,
  },
  {
    name: 'Page D',
    uv: 27,
    pv: 39,
    amt: 20,
  }
];

export default class BarCharts extends PureComponent {
  static demoUrl = 'https://codesandbox.io/p/sandbox/bar-chart-has-no-padding-2hlnt8';

  render() {
    return (
      <ResponsiveContainer width="35%" height="60%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="pv" fill="#8884d8" background={{ fill: '#eee' }} />
        </BarChart>
        <h1 className="text-2xl font-extralight px-16 mt-1 text-center">Both Class & Counselling Student's</h1>
      </ResponsiveContainer>
    );
  }
}
