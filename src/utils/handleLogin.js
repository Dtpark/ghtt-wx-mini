// 封装登录流程
// const wxAPI = require('./wxAPI.js');
// const url = require('../config/config.js');
// const { regeneratorRuntime } = global;
import wxAPI from './wxAPI';
import url from './config';
// 登录流程
async function doLogin() {
    let res = {
        errcode: null,
        errmsg: ''
    };
    let userInfoRes
    let login;
    let data;
    let postRequest;
    let result;

    try {
        // 1.进行登录（服务器端）操作
        login = await wxAPI.login();

        if (login.code) {
            // 调用登录接口成功
            // 2.查看是否获取登录授权
            userInfoRes = await wxAPI.getUserInfo();
            // 3.授权成功，post访问服务器
            data = {
                code: login.code,
                encryptedData: userInfoRes.encryptedData,
                iv: userInfoRes.iv
            };
            // console.log('dologin start request');
            postRequest = await wxAPI.request(url.loginUrl, data, 'POST');
            // console.log('dologin end request');
            // console.log(postRequest);
            result = postRequest.data;
            // console.log(result);
            res.errcode = result.errcode;
            res.errmsg = result.errmsg + '';
            // console.log(errcode);
            if (result.errcode == 0) {
                // 登录成功
                // console.log('登录成功');             
                // 将登录态标识写入到storage
                await wx.setStorageSync('session3rd', result.session3rd);
                // 将是否绑定各系统信息写入到storage
                await wx.setStorageSync('edubind', result.eduSys);
                // 将是否绑定一卡通系统信息写入到storage
                await wx.setStorageSync('campuscardbind', result.campus_card);
                // return;
            }
            return res;
        }

    } catch (e) {
        console.log(e);
        try {
            // 没有获取授权,跳转到登录界面
            // let pages = getCurrentPages();//获取加载的页面
            // let currentPage = pages[pages.length - 1];//获取当前页面的对象
            // let url = currentPage.route;//当前页面url

            // 跳转到登陆授权页面
            wx.navigateTo({
                // url: '/pages/login/main?url=/' + url
                url: '/pages/login/main'
            });
        } catch (e) {
            console.log(e)
        }

    }
}

export default {
    doLogin
}