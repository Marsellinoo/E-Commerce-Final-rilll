import React from 'react';
import Chart from '../../pages/Chart';
import Log from '../../pages/Log';
import Users from '../../pages/Users';

const DashboardContent = ({ baseApi, toastConfig }) => {
    return (
        <div className='dashboard-content'>
            <Chart baseApi={baseApi} toastConfig={toastConfig} />
            <Log baseApi={baseApi} toastConfig={toastConfig} />
            <Users baseApi={baseApi} toastConfig={toastConfig} />
        </div>
    );
};

export default DashboardContent;
