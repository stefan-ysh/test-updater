/* eslint-disable */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: "https://xxx.xxx.xxx",
  timeout: 100000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error: any) => {
    // 发送请求错误时做一些处理
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 在响应数据之前做一些处理
    return response.data;
  },
  (error: any) => {
    // 响应数据错误时做一些处理
    return Promise.reject(error);
  }
);

export const ChatApi = (data: { prompt: string }) => {
  return instance.post("/xxx", data,{
    headers: {
        "Content-Type": "application/json",
    }
  });
};
