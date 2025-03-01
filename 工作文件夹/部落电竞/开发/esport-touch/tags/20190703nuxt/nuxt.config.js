module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: '橘子电竞',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'user-scalable=no, width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Nuxt.js project'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  css: [{ //  全局css（会进行webpack打包处理）
      src: '~assets/common/main.less',
      lang: 'less',
      ssr: false
    },
    'element-ui/lib/theme-chalk/index.css'
  ],

  plugins: [{
      src: '~plugins/common/rem.js',
      ssr: false
    },
    {
      src: '~plugins/common/qs.js',
      ssr: false
    },
    {
      src: '~plugins/common/filter.js',
      ssr: false
    }, //全局过滤器
    {
      src: "~/plugins/vue-lazyload.js",
      ssr: false
    },
    {
      src: '~plugins/ElementUI',
      ssr: true,
    }


  ],
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#3B8070'
  },

  modules: ['@nuxtjs/axios','@nuxtjs/proxy'],
  // axios: {},
  // proxy: [['/api', {target: 'https://daily-api.esportzoo.com'}]],
  axios: {
    proxy: true, // 表示开启代理
    prefix: '/api', // 表示给请求url加个前缀 /api
    credentials: true, // 表示跨域请求时是否需要使用凭证
  },

  proxy: {
    '/api': {
      target: 'http://daily-api.esportzoo.com', // 目标接口域名
      // target: 'http://localhost:8080', // 目标接口域名
      changeOrigin: true, // 表示是否跨域
      pathRewrite: {
        '^/api': '/' // 把 /api 替换成 /
      },
    },
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    postcss: [
      require('postcss-px2rem')({
        remUnit: 100
      })
    ],
    vendor: ['element-ui'], //防止element-ui被打包多次
    // extend(config, {
    //   isDev,
    //   isClient
    // }) {
    //   if (isDev && isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/
    //     })
    //   }
    // }
  }
}
