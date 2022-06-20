import { useState, useEffect, useContext } from "react";
import { Context } from "../../context";
import InstructorRoute from "../../components/routes/InstructorRoute";
import axios from "axios";
import {
  SettingOutlined,
  DollarOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { stripeCurrencyFormatter } from "../../utils/helper";

import React from "react";

const InstructorRevenue = () => {
  const [balance, setBalance] = useState({ pending: [] });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    sendBalanceRequest();
  }, []);
  const sendBalanceRequest = async () => {
    const { data } = await axios.get("/api/instructor/balance");
    setBalance(data);
  };
  const handlePayoutSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/instructor/payout-settings");
      window.location.href = data;
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("unable to access payout settings.Try later");
    }
  };
  return (
    <InstructorRoute>
      <div className="container">
        <div className="row pt-2">
          <div className="col-md-8 offset-md-2 bg-light p-5">
            <h2>
              Revenue Report <DollarOutlined className="float-end" />
            </h2>
            <small>
              You get paid directly from stripe to your bank account every 48
              hours
            </small>
            <hr />
            <h4>
              Pending balance{" "}
              <span className="float-end">
                {balance.pending &&
                  balance.pending.map((bp, i) => (
                    <span key={i} className="float-end">
                      {stripeCurrencyFormatter(bp)}
                    </span>
                  ))}
              </span>
            </h4>
            <small>For 48 hours</small>
            <hr />
            <h4>
              Payouts{" "}
              {!loading ? (
                <SettingOutlined
                  className="float-end pointer"
                  onClick={handlePayoutSettings}
                />
              ) : (
                <SyncOutlined spin className="float-end" />
              )}
            </h4>
            <small>
              Update your stripe account details or view previous payouts
            </small>
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default InstructorRevenue;
