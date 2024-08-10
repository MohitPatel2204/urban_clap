import { postData } from "../../../services/axiosrequests";

export const handleLogout = async () => {
  try {
    let storedata = JSON.parse(localStorage.getItem("creads") || "''");
    let config = { headers: { Authorization: `Bearer ${storedata.access}` } };

    const response = await postData(
      `${import.meta.env.VITE_API_URL}logout/`,
      "",
      config
    );
    localStorage.removeItem("creads");
  } catch (err) {
    console.log(err);
  }
};
