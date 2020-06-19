import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store';

import transmitter from "@/plugins/fetchTransmitter.js";

import testPage from "../views/componentTester.vue";

import home from '../views/home.vue';
import loginMain from '../views/Login_Main.vue';
import pageNotFound from '../views/pageNotFound.vue';
import registermain from "../views/Register_Main.vue";
import productmain from "../views/Product_Main";
import addProduct from "../views/New_Product";
import purchase from "../views/Purchase_Main";
import modificationmain from "../views/Modification_Main"

//

Vue.use(VueRouter);



const routes = [
  {
    path: '/',
    name: 'index',
    component: home,
    meta: {
      title: "중고차 매매 사이트"
    }
  },

  {
    path: "/user/Login_Main",
    name: "loginMain",
    component: loginMain
  },

  {
    path: "/user/Register_main",
    name: "registermain",
    component: registermain
  },

  {
    path: "/product/add",
    name: "addProduct",
    component: addProduct,
    meta: {
      loginRequired: true
    }
  },

  {
    path: "/product",
    name: "product",
    component: productmain,
    meta: {
      loginRequired: true
    }
  },

  {
    path: "/purchase",
    name: "purchase",
    component: purchase,
    meta: {
      loginRequired: true
    }
  },

  {
    path:"/user/modification",
    name:"usermodification",
    component: modificationmain,
    meta:{
      loginRequired: true
    }
  },

  {
    path: "/dev",
    name: "testing",
    component: testPage
  },


  {
    path: "*",
    name: "404NotFound",
    component: pageNotFound
  }
]

const router = new VueRouter({
  mode: "history",
  routes
});

router.originalPage = "/";//로그인 페이지로 강제 이동등의 이유로 다른 페이지로 리다이렉트 되었을 때 원래 가려던 곳을 기억하는 변수

console.log(router);

router.beforeEach(async function (to, from, next) {
  if(to.meta.loginRequired != true){
    next();
    return;
  }

  //인증이 필요한 페이지인가?
  //이미 인증이 되어 있는가?
  if(store.state.isUserInfoGetted == true){
    next();
    return;
  }

  //인증이 되어 있지 않으면 인증을 시도한다.
  await getUserInfo();

  //인증 결과 확인
  if(store.state.isUserInfoGetted == false){
    router.originalPage = to.fullPath;
    next({ path: '/user/Login_Main' });
    return;
  }

  next();
});


async function getUserInfo(){
      console.log("유저 정보를 요청합니다.");
      try {
        let response = await transmitter("/user/info", "GET", {}, "JSON");
        response = response.user;
        console.log(response);
        console.log(response.Id);
        console.log(response.PhoneNumber);
        let payload = {
          id: response.Id,
          name: response.Name,
          phoneNumber: response.PhoneNumber,
        };

        store.commit("setUserInfo", payload);
        console.log("유저 정보를 등록했습니다.");
      }catch(e) {
        console.log("http 상태 코드: " + e.httpStatus);
        console.log(e);
        return;
      }
    }

export default router
