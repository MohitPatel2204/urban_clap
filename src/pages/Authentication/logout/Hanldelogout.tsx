import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxois from "../../../hooks/axois";
import { toast } from "react-toastify";
import Toast from "../../../components/common/Toast";

const Hanldelogout = () => {
  const navigate = useNavigate();
  const { axiosPost } = useAxois();

  const logout = async () => {
    try {
      await axiosPost(`logout/`, {});
      localStorage.removeItem("creads");
      toast.success("Logout sucessfully...");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      navigate("/signin");
    }
  };
  useEffect(() => {
    logout();
  }, []);
  return (
    <React.Fragment>
      <Toast />
    </React.Fragment>
  );
};

export default Hanldelogout;
