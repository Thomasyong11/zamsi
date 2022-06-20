import { useEffect } from "react";
import { SyncOutlined } from "@ant-design/icons";
import UserRoute from "../../../components/routes/UserRoute";
import { useRouter } from "next/router";
import axios from "axios";

import React from "react";

const StripeSuccess = () => {
  const router = useRouter();
  //get id from url
  const { id } = router.query;

  useEffect(() => {
    if (id) successRequest();
  }, [id]);

  const successRequest = async () => {
    const { data } = await axios.get(`/api/stripe-success/${id}`);
    router.push(`/user/course/${data.course.slug}`); //data contains success & course
  };
  return (
    <UserRoute showNav={false}>
      <div className="row text-center">
        <div className="col-md-9 pb-">
          <div className="d-flex justify-content-center p-5">
            <SyncOutlined spin className="display-1 text-danger p-5" />
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </UserRoute>
  );
};

export default StripeSuccess;
