import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarCharts = () => {
  const [onDutyStudents, setOnDutyStudents] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        const classStudents = parsedUser.classStudents || [];
        const counsellingStudents = parsedUser.counsellingStudents || [];

        // Filter both arrays for On-duty Request
        const filteredClass = classStudents.filter(
          (student) => student.requestType === "On-duty Request"
        );
        const filteredCounselling = counsellingStudents.filter(
          (student) => student.requestType === "On-duty Request"
        );

        const merged = [...filteredClass, ...filteredCounselling];
        setOnDutyStudents(merged);

        // Count occurrences by `requestFor`
        const countMap = merged.reduce((acc, curr) => {
          acc[curr.requestFor] = (acc[curr.requestFor] || 0) + 1;
          return acc;
        }, {});

        // Convert into chart data format
        const chartArray = Object.entries(countMap).map(([key, value]) => ({
          name: key,
          students: value
        }));

        setChartData(chartArray);

      } catch (err) {
        console.error("Error parsing or filtering:", err);
      }
    }
  }, []);

  return (
    <ResponsiveContainer width="40%" height="60%">
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 10,
        }}
        barSize={20}
      >
        <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="students" fill="navy" background={{ fill: '#eee' }} />
      </BarChart>
      <h1 className="text-2xl font-extralight px-16 mt-1 text-center">On-Duties</h1>
    </ResponsiveContainer>
  );
};

export default BarCharts;
