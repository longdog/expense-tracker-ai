'use client';

import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Expense } from '@/types';
import { getExpenseChartData, formatCurrency } from '@/utils/expenseUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseChartProps {
  expenses: Expense[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (expenses.length === 0) {
      setChartData(null);
      return;
    }

    const { categoryData } = getExpenseChartData(expenses);

    setChartData({
      labels: categoryData.labels,
      datasets: [
        {
          data: categoryData.values,
          backgroundColor: categoryData.colors.slice(0, categoryData.labels.length),
          borderColor: categoryData.colors.slice(0, categoryData.labels.length).map(color => color.replace('0.2', '1')),
          borderWidth: 1,
        },
      ],
    });
  }, [expenses]);

  if (!chartData || expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No expense data available for chart visualization.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Spending by Category</h2>
      <div className="h-64 flex items-center justify-center">
        <Pie 
          data={chartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
                  font: {
                    size: 12
                  },
                  generateLabels: (chart) => {
                    const datasets = chart.data.datasets;
                    return chart.data.labels?.map((label, i) => {
                      const meta = chart.getDatasetMeta(0);
                      const style = meta.controller.getStyle(i);
                      const value = datasets[0].data[i] as number;
                      
                      return {
                        text: `${label}: ${formatCurrency(value)}`,
                        fillStyle: style.backgroundColor,
                        strokeStyle: style.borderColor,
                        lineWidth: style.borderWidth,
                        hidden: false,
                        index: i
                      };
                    }) || [];
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw as number;
                    const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) as number;
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default ExpenseChart;