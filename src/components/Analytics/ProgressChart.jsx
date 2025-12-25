import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area, LineChart, Line } from 'recharts';

export const DonutChart = ({ data }) => {
    // Expected data: [{ name: 'Category', value: 10, color: '#...' }]

    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No data</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export const StackedBarChart = ({ data, categories }) => {
    // categories: [{ name: 'Study', color: '#...' }]
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {categories.map(cat => (
                    <Bar key={cat.name} dataKey={cat.name} stackId="a" fill={cat.color} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

export const DottedLineChart = ({ data, categories }) => {
    // data: [{ name: 'Mon', Study: 5, Work: 2 ... }]
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dy={10}
                    interval="preserveStartEnd"
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend iconType="circle" />
                {categories.map(cat => (
                    <Line
                        key={cat.name}
                        type="monotone"
                        dataKey={cat.name}
                        stroke={cat.color}
                        strokeWidth={3}
                        dot={{ r: 4, fill: 'white', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                        strokeDasharray="5 5" // "Dotted" pattern
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};
