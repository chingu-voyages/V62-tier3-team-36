"use client";
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data generator function
const generateMockData = (count: number, maxVal: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return Array.from({ length: count }, (_, index) => ({
    name: months[index],
    value: Math.floor(Math.random() * maxVal) + 50,
  }));
};

const data = generateMockData(6, 823);

export default function SimpleBarChart() {
  return (
    <div style={{ width: '200px', height: '200px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
        >
          <XAxis dataKey="name" fontSize={10} tickLine={false} />
          <YAxis fontSize={10} tickLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#0088FE" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}