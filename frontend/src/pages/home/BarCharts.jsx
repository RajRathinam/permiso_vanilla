import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Technical',
    students:10
  },
  {
    name: 'Extracurricular',
    students:5
  },
  {
    name: 'Sports',
    students:15
  },
  {
    name: 'Internship',
    students:35
  }
];

export default class BarCharts extends PureComponent {
  static demoUrl = 'https://codesandbox.io/p/sandbox/bar-chart-has-no-padding-2hlnt8';

  render() {
    return (
      <ResponsiveContainer width="40%" height="60%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 10,
          }}
          barSize={20}
        >
          <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10, bottom:20 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="students" fill="navy" background={{ fill: '#eee' }} />
        </BarChart>
        <h1 className="text-2xl font-extralight px-16 mt-1 text-center">On-Duties</h1>
      </ResponsiveContainer>
    );
  }
}
