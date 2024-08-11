import axios, { ResponseType } from "axios";
import { useCallback } from "react";

const useAxois = () => {
  const generateHeader = (): Record<string, string> => {
    const storedata = JSON.parse(localStorage.getItem("creads") ?? "''");
    const header: Record<string, string> = {};
    if (storedata !== "") {
      header["Authorization"] = `Bearer ${storedata.access}` as string;
    }
    return header;
  };

  const axoisGet = useCallback(
    async (
      url: string,
      params: Record<string, unknown> = {},
      responseType: ResponseType = "json"
    ) => {
      console.log({ url, params, responseType });
      return axios
        .get(`${import.meta.env.VITE_API_URL}${url}`, {
          params: params,
          headers: {
            ...generateHeader(),
          },
          responseType: responseType,
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
    []
  );

  const axiosPost = useCallback(
    async (
      url: string,
      body: Record<string, unknown>,
      isFile: boolean = false,
      responseType: ResponseType = "json"
    ) => {
      return await axios
        .post(`${import.meta.env.VITE_API_URL}${url}`, body, {
          headers: {
            ...generateHeader(),
            "Content-Type": isFile ? "multipart/form-data" : "application/json",
          },
          responseType,
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
    []
  );

  const axiosPut = useCallback(
    async (
      url: string,
      body: Record<string, unknown>,
      isFile: boolean = false,
      responseType: ResponseType = "json"
    ) => {
      return await axios
        .put(`${import.meta.env.VITE_API_URL}${url}`, body, {
          headers: {
            ...generateHeader(),
            "Content-Type": isFile ? "multipart/form-data" : "application/json",
          },
          responseType,
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
    []
  );

  const axiosPatch = useCallback(
    async (
      url: string,
      body: Record<string, unknown>,
      isFile: boolean = false,
      responseType: ResponseType = "json"
    ) => {
      return await axios
        .patch(`${import.meta.env.VITE_API_URL}${url}`, body, {
          headers: {
            ...generateHeader(),
            "Content-Type": isFile ? "multipart/form-data" : "application/json",
          },
          responseType,
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
    []
  );

  const axiosDelete = useCallback(async (url: string) => {
    return await axios
      .delete(`${import.meta.env.VITE_API_URL}${url}`, {
        headers: {
          ...generateHeader(),
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  return {
    axoisGet,
    axiosPost,
    axiosPut,
    axiosPatch,
    axiosDelete,
  };
};

export default useAxois;
