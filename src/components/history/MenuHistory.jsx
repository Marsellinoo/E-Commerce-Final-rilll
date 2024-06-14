import React from 'react';
import "./History.css";
import { PiNotePencil } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";
import { IoIosCheckboxOutline } from "react-icons/io";
import { CiDeliveryTruck } from "react-icons/ci";
import { GiReceiveMoney } from "react-icons/gi";
import { CiCircleCheck } from "react-icons/ci";

const menuItems = [
  { icon: <FaRegUser />, label: "Semua" },
  { icon: <PiNotePencil />, label: "Dibuat" },
  { icon: <IoIosCheckboxOutline />, label: "Dikonfirmasi" },
  { icon: <CiDeliveryTruck />, label: "Dikirim" },
  { icon: <GiReceiveMoney />, label: "Diterima" },
  { icon: <CiCircleCheck />, label: "Selesai" },
];

const MenuHistory = () => (
  <div className="history-menu">
    {menuItems.map((item, index) => (
      <button key={index} className="value">
        {item.icon}
        {item.label}
      </button>
    ))}
  </div>
);

export default MenuHistory;
