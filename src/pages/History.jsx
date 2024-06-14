import React, { useEffect, useState } from "react";
import axios from "axios";
import CardHistory from "../components/history/CardHistory";
import MenuHistory from "../components/history/MenuHistory";
import "../components/history/History.css";

const DeliveryHistory = () => {

  return (
    <section className='delivery-history'>
      <div>
        <MenuHistory />
        {/* <div className="card-history-position"> */}
          <CardHistory />
        {/* </div> */}
      </div>
    </section>
  );
};

export default DeliveryHistory;
