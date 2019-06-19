// 封装登录流程
// const wxAPI = require('./wxAPI.js');
// const url = require('../config/config.js');
// const { regeneratorRuntime } = global;
import wxAPI from './wxAPI';
import url from './config';
// 登录流程
async function doLogin() {
    try {
        // 1.查看是否获取登录授权
        let userInfoRes = await wxAPI.getUserInfo();

        // 2.若获取授权成功则将用户信息存储至storage
        wx.setStorageSync('userInfoRes', JSON.stringify(userInfoRes));

        // 3.进行登录（服务器端）操作
        let login = await wxAPI.login();

        if (login.code) {
            // 调用登录接口成功，post 访问服务器
            let data = {
                code: login.code,
                rawData: userInfoRes.rawData,
                signature: userInfoRes.signature,
                encryptedData: userInfoRes.encryptedData,
                iv: userInfoRes.iv
            };
            let postRequest = await wxAPI.request(url.loginUrl, data);

            let result = postRequest.data;
            if (result.errcode == 0) {
                // 登录成功
                // 将登录态标识写入到storage
                wx.setStorageSync('session3rd', result.session3rd);
                // 将是否绑定各系统信息写入到storage
                wx.setStorageSync('edubind', result.eduSys);
                // 将是否绑定一卡通系统信息写入到storage
                wx.setStorageSync('campuscardbind',result.campus_card);
                return;
            }
        }

    } catch (e) {
        console.log(e);
        try {
            // 没有获取授权,跳转到登录界面
            let pages = getCurrentPages();//获取加载的页面
            let currentPage = pages[pages.length - 1];//获取当前页面的对象
            let url = currentPage.route;//当前页面url

            // 跳转到登陆授权页面
            wx.redirectTo({
                url: '/pages/login/main?url=/' + url
            });
        }catch(e){
            console.log(e)
        }
        
    }
}

// 检查是否登录
async function isLogin() {
    try {
        // 1. 检查 session_key 是否过期
        let checkSession = await wxAPI.checkSession();
        // 2.session 没有过期，检查本地 session3rd 是否存在
        if (wx.getStorageSync('session3rd')) {
            // session3rd 存在，暂时认为登录有效
            return;
        } else {
            // session3rd 不存在，重新执行登录流程
            await doLogin();
        }


    } catch (e) {
        // session_key 已经过期，重新执行登录流程
        // console.log(e);
        await doLogin();

    }
    // let checkSession = await wxAPI.checkSession();
}

export default {
    doLogin,
    isLogin
}