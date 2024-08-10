import axios from "axios";

export const getData = async (url: string, config = {}) => {
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postData = async (url: string, data: {}, config = {}) => {
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const putData = async (url: string, data: {}, config = {}) => {
  try {
    const response = await axios.put(url, data, config);
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};
export const patchData = async (url: string, data: {}, config = {}) => {
  try {
    const response = await axios.patch(url, data, config);
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

export const deleteData = async (url: string, config = {}) => {
  try {
    const response = await axios.delete(url, config);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};
