import axios from 'axios';
import { defineNuxtPlugin } from '#app';


export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const instance = axios.create({
      baseURL: config.public.apiBase, // 使用环境变量
      timeout: 10000, // 设置请求超时
      headers: {
          'Content-Type': 'application/json', // 设置默认请求头
          // 你可以添加其他请求头
      },
  });

  // 如果你的后端需要带上凭据（例如 cookies），可以设置 withCredentials
  instance.defaults.withCredentials = true;

  // 添加响应拦截器
  instance.interceptors.response.use(
      (response) => {
          if (response.status === 200) {
              return response.data; // 返回数据
          } else {
              return Promise.reject(new Error(`Error: ${response.status}`));
          }
      },
      (error) => {
          return Promise.reject(error);
      }
  );

  // 将 Axios 实例注入到 Nuxt 应用中
  nuxtApp.provide('axios', instance);
});
