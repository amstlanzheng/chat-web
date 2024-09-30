// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@element-plus/nuxt','@nuxtjs/mdc', '@nuxt/content'],
  runtimeConfig: {
    public: {
        apiBase: process.env.API_BASE_URL,
    },
  },
  plugins: ['~/plugins/element-plus.js'],
})