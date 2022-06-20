import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //context
  const {
    state: { user },
  } = useContext(Context);
  //router
  const router = useRouter();
  //redirect if user is logged in
  useEffect(() => {
    if (user !== null) router.push("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/forgot-password", { email });
      setSuccess(true);
      toast(`Check your email for password reset code`);
      setLoading(false);
    } catch (err) {
      toast(err.response.data);
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/reset-password", {
        email,
        code,
        newPassword,
      });
      setEmail("");
      setCode("");
      setnewPassword("");
      setLoading(false);
      toast("Great! Now you can log in with your new password");
    } catch (err) {
      toast(err.response.data);
      setLoading(false);
    }
  };
  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">
        Forgot Password
      </h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={success ? handleResetPassword : handleSubmit}>
          <input
            type="email"
            className="form-control md-4 p-4 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />
          {success && (
            <>
              <input
                type="code"
                className="form-control md-4 p-4 mb-3"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter secret code"
                required
              />

              <input
                type="password"
                className="form-control md-4 p-4 mb-3"
                value={newPassword}
                onChange={(e) => setnewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </>
          )}

          <button
            className="btn btn-primary btn-block p-2"
            disabled={loading || !email}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};
export default ForgotPassword;
