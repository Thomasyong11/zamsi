import React from "react";
import {
  FacebookOutlined,
  InstagramFilled,
  TwitterFilled,
} from "@ant-design/icons";
import { Menu } from "antd";
const { Item } = Menu;
const Footer = () => {
  return (
    <div className="bg-dark">
      <div className="d-flex p-2">
        <h3 className="col-md-6 text-white">
          This is a web app i created with react.js, nextjs and mongodb to learn
          more about reactjs
        </h3>
        <hr />
        <p className="col text-danger m-1">
          Please do not purchase anything on here with real money use the test
          card details
        </p>
        <span className="text-warning col m-1">
          USE <p>4242 4242 4242 4242</p> as your card number
        </span>
        <span className="col text-warning col m-1 ">
          and use 222 as the cvc
        </span>
      </div>
    </div>
  );
};

export default Footer;
