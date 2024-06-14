import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../History.css";
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { PiNotePencil } from "react-icons/pi";
import { IoIosCheckboxOutline } from "react-icons/io";
import { CiDeliveryTruck } from "react-icons/ci";
import { GiReceiveMoney } from "react-icons/gi";
import { CiCircleCheck } from "react-icons/ci";
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <PiNotePencil />,
    2: <IoIosCheckboxOutline />,
    3: <CiDeliveryTruck />,
    4: <GiReceiveMoney />,
    5: <CiCircleCheck />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ['Order Created', 'Order Confirmed', 'Order Shipped', 'Order Delivered', 'Order Completed'];

const HistoryDetail = () => {
  const { id } = useParams(); // Ambil parameter ID dari URL
  const [historyData, setHistoryData] = useState(null);
  const [products, setProducts] = useState([]);
  const urlImage = process.env.REACT_APP_API1_IMAGE_URL;
  const baseApi = process.env.REACT_APP_BASEURL_API;

  useEffect(() => {
    const fetchHistoryDetail = async () => {
      try {
        const token = localStorage.getItem('data');

        const [HistoryResponse, productsResponse] = await Promise.all([
          axios.get(`${baseApi}/checkout_histories/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get(`${baseApi}/products`)
        ]);

        setHistoryData(HistoryResponse.data.data);
        console.log(HistoryResponse.data.data)
        setProducts(productsResponse.data.data);
      } catch (error) {
        console.error('Error fetching history detail:', error);
      }
    };

    fetchHistoryDetail();
  }, [baseApi, id]);

  const getProductDetails = (id_produk) => {
    const product = products.find(p => p.id === id_produk);
    return product ? { price: product.harga, image: product.gambar, name: product.nama_barang } : { price: 'N/A', image: 'default.png', name: 'Unknown Product' };
  };

  // Tentukan langkah aktif (activeStep) berdasarkan status yang diterima
  let activeStep = 0;
  if (historyData) {
    switch (historyData.status) {
      case 'dibuat':
        activeStep = 0;
        break;
      case 'dikonfirmasi':
        activeStep = 1;
        break;
      case 'dikirim':
        activeStep = 2;
        break;
      case 'diterima':
        activeStep = 3;
        break;
      case 'selesai':
        activeStep = 4;
        break;
      default:
        activeStep = 0;
    }
  }

  // Menghitung total harga semua produk
  let totalHargaProduk = 0;
  if (historyData?.ringkasan_belanja) {
    totalHargaProduk = JSON.parse(historyData.ringkasan_belanja).reduce((total, item) => {
      const productDetails = getProductDetails(item.id_produk);
      const totalPrice = productDetails.price !== 'N/A' ? item.jumlah * productDetails.price : 0;
      return total + totalPrice;
    }, 0);
  }

  return (
    <div className='delivery-history-detail'>
      <div className='history-detail-card'>
        <div className='history-status-progress'>
          <Stack sx={{ width: '100%' }} spacing={4}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Stack>
        </div>
        {historyData && (
          <div className='history-shipping-address'>
            <span>Alamat Pengiriman</span>
            <div>
              <p>{historyData.no_hp}</p>
              {/* Menggunakan template literals untuk menangani kondisi tanda koma */}
              <p>{`${historyData.detail_lainnya ? `${historyData.detail_lainnya}, ` : ''}${historyData.detail ? `${historyData.detail}, ` : ''}${historyData.kecamatan ? `${historyData.kecamatan}, ` : ''}${historyData.kota_kabupaten}, ${historyData.provinsi}, ${historyData.kode_pos}`}</p>
            </div>
          </div>
        )}
        <div className='history-product-details'>
          {historyData?.ringkasan_belanja && JSON.parse(historyData.ringkasan_belanja).map((item, index) => {
            const productDetails = getProductDetails(item.id_produk);
            const totalPrice = productDetails.price !== 'N/A' ? item.jumlah * productDetails.price : 'N/A';
            return (
              <div key={index} className='product-item history-product-details'>
                <img src={`${urlImage}/${productDetails.image}`} alt={productDetails.name} />
                <div>
                  <h4>{productDetails.name}</h4>
                  <p>Jumlah : {item.jumlah}</p>
                  <p>Harga per x1 : Rp. {productDetails.price.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className='history-shopping-summary'>
          <table>
            <tbody>
              <tr>
                <td>Total Produk</td>
                <td>Rp. {totalHargaProduk.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Biaya Pengiriman</td>
                <td>Rp. {historyData?.biaya_pengiriman?.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Biaya Penanganan</td>
                <td>Rp. {historyData?.biaya_admin?.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Total Pesanan</td>
                <td>Rp. {(totalHargaProduk + (historyData?.biaya_pengiriman || 0) + (historyData?.biaya_admin || 0)).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Metode Pengiriman</td>
                <td>{historyData?.delivery}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HistoryDetail;
