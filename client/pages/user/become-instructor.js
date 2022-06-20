import axios from "axios";
import { useContext, useState } from "react";
import { Context } from "../../context";
import { Button } from "antd";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import UserRoute from "../../components/routes/UserRoute";

const BecomeInstructor = () => {
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
  } = useContext(Context);
  const becomeInstructor = () => {
    //console.log("Become instructor");
    setLoading(true);
    axios
      .post("/api/make-instructor")
      .then((res) => {
        console.log(res);
        window.location.href = res.data;
      })
      .catch((err) => {
        console.log(err.response.status);
        toast("Stripe onboarding failed.Try again");
        setLoading(false);
      });
  };
  return (
    <>
      <h1 className="jumbotron text-center square">Become Instructor</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pt-3" />
              <br />
              <h2>Setup payout to publish on Zamsi</h2>
              <p className="lead text-warning">
                Zamsi partners with stripe to transfer earnings to your bank
                account
              </p>
              <Button
                className="mb-3"
                type="primary"
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                onClick={becomeInstructor}
                disabled={
                  (user && user.role && user.role.includes("instructor")) ||
                  loading
                }
              >
                {loading ? "Processing..." : "Payout Setup"}
              </Button>
              <p className="lead">
                You will be redirected to stripe to complete on boarding process
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BecomeInstructor;
