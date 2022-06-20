import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  AppstoreOutlined,
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Context } from "../context";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
//import { SubMenu } from "antd/lib/menu/SubMenu";

const { Item } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  //router
  const router = useRouter();

  // for when a user refreshes a page
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    router.push("/login");
  };
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[current]}
      className="mb-1"
    >
      <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
      >
        <Link href="/">
          <a>ZAMsi</a>
        </Link>
      </Item>

      {user && user.role && user.role.includes("Instructor") ? (
        //conditional rendering when user is an instructor
        <Item
          key="/instructor/course/create"
          onClick={(e) => setCurrent(e.key)}
          icon={<CarryOutOutlined />}
        >
          <Link href="/instructor/course/create">
            <a>Create course</a>
          </Link>
        </Item>
      ) : (
        <Item
          key="/user/become-instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
        >
          <Link href="/user/become-instructor">
            <a>Become an instructor</a>
          </Link>
        </Item>
      )}

      {user === null && (
        //conditional rendering for when no user is logged in
        <>
          <Item
            key="/login"
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
          >
            <Link href="/login">
              <a>Login</a>
            </Link>
          </Item>

          <Item
            key="/register"
            onClick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}
          >
            <Link href="/register">
              <a>Register</a>
            </Link>
          </Item>
        </>
      )}

      {user && user.role && user.role.includes("Instructor") && (
        <Item
          key="/instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
          className=""
        >
          <Link href="/instructor">
            <a>Instructor Dash</a>
          </Link>
        </Item>
      )}

      {user !== null && (
        //conditional rendering for when there is a user
        <>
          <Menu.SubMenu
            key={1}
            icon={<CoffeeOutlined />}
            //className="float-end"
            style={{ marginLeft: "auto" }}
            title={
              user && user.name.charAt(0).toUpperCase() + user.name.slice(1)
            }
          >
            <Menu.ItemGroup>
              <Item key="/user">
                <Link href="/user">
                  <a>Dashboard</a>
                </Link>
              </Item>
              <Item onClick={logout}>Logout</Item>
            </Menu.ItemGroup>
          </Menu.SubMenu>
        </>
      )}
    </Menu>
  );
};

export default TopNav;
