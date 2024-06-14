import React, { useState, useEffect } from 'react';
import { PolarArea, Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Chart = () => {
  const baseApi = process.env.REACT_APP_BASEURL_API;
  const [productData, setProductData] = useState([0, 0, 0, 0, 0]);
  const [productCounts, setProductCounts] = useState([0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseApi + '/count_products');
        const data = response.data;
        const counts = [data.celana, data.hoodie, data.jaket, data.sepatu, data.shirt];
        const totalProducts = data.total_products;
        // const totalProducts = counts.reduce((acc, count) => acc + count, 0);
        const percentages = counts.map(count => (count / totalProducts) * 100);
        setProductCounts(counts);
        setProductData(percentages);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const chartColors = [
    'rgba(255, 99, 132, 0.3)',
    'rgba(60, 255, 0, 0.3)',
    'rgba(255, 206, 86, 0.3)',
    'rgba(75, 192, 192, 0.3)',
    'rgba(153, 102, 255, 0.3)',
  ];

  const chartBorderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(60, 255, 0, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
  ];

  const polarData = {
    labels: ['Celana', 'Hoodie', 'Jaket', 'Sepatu', 'T-Shirt'],
    datasets: [
      {
        label: 'Percentage of Total Products',
        data: productData,
        backgroundColor: chartColors,
        borderColor: chartBorderColors,
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Celana', 'Hoodie', 'Jaket', 'Sepatu', 'T-Shirt'],
    datasets: [
      {
        label: 'Percentage of Total Products',
        data: productData,
        backgroundColor: chartColors,
        borderColor: chartBorderColors,
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Celana', 'Hoodie', 'Jaket', 'Sepatu', 'T-Shirt'],
    datasets: [
      {
        label: 'Percentage of Total Products',
        data: productData,
        backgroundColor: chartColors,
        borderColor: chartBorderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Produk Berdasarkan Kategori',
      },
    },
  };

  return (
    <div>
      <div className='chart-container'>
        <div className='chart-polar-wrapper'>
          <PolarArea data={polarData} options={options} />
          <small>Celana: {productCounts[0]}</small>
          <small>Hoodie: {productCounts[1]}</small>
          <small>Jaket: {productCounts[2]}</small>
          <small>Sepatu: {productCounts[3]}</small>
          <small>T-Shirt: {productCounts[4]}</small>
        </div>
        <div className='chart-wrapper'>
          <Pie data={pieData} options={options} />
          <small>Celana: {productCounts[0]}</small>
          <small>Hoodie: {productCounts[1]}</small>
          <small>Jaket: {productCounts[2]}</small>
          <small>Sepatu: {productCounts[3]}</small>
          <small>T-Shirt: {productCounts[4]}</small>
        </div>
        <div className='chart-bar-wrapper'>
          <Bar data={barData} options={options} />
          <small>Celana: {productCounts[0]}</small>
          <small>Hoodie: {productCounts[1]}</small>
          <small>Jaket: {productCounts[2]}</small>
          <small>Sepatu: {productCounts[3]}</small>
          <small>T-Shirt: {productCounts[4]}</small>
        </div>
      </div>
    </div>
  );
};

export default Chart;
