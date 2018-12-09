import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import PageList from '@/components/pageList'
import addPage from '@/components/addPage'
import NewsList from '@/components/newsList'
import ProductList from '@/components/productList'
import addNews from '@/components/addNews'
import addProduct from '@/components/addProduct'
import Contact from '@/components/contact'
import Banner from '@/components/other/banner'
import Login from '@/components/login'
import Register from '@/components/register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        title: '控制台'
      },
      children: [
        {
          name: 'PageList',
          path: '/pageList',
          component: PageList,
          meta: {
            title: '页面'
          }
        },
        {
          name: 'AddPage',
          path: '/addPage',
          component: addPage,
          meta: {
            title: '页面编辑/发布'
          }
        },
        {
          name: 'NewsList',
          path: '/newsList',
          component: NewsList,
          meta: {
            title: '新闻列表'
          }
        },
        {
          name: 'ProductList',
          path: '/productList',
          component: ProductList,
          meta: {
            title: '产品列表'
          }
        },
        {
          name: 'AddNews',
          path: '/addNews',
          component: addNews,
          meta: {
            title: '新闻编辑/发布'
          }
        },
        {
          name: 'AddProduct',
          path: '/addProduct',
          component: addProduct,
          meta: {
            title: '产品编辑/发布'
          }
        },
        {
          name: 'Contact',
          path: '/contact',
          component: Contact,
          meta: {
            title: '联系表单'
          }
        },
        {
          name: 'Banner',
          path: '/banner',
          component: Banner,
          meta: {
            title: 'Banner编辑'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        title: '注册'
      }
    }
  ]
})
