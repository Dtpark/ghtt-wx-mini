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
                // 将时间戳写入到storage
                let timestamp = (new Date()).valueOf();
                await wx.setStorageSync('sessionDate', timestamp);
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

// 检查是否登录
async function isLogin() {
    // console.log('isLogin');
    let errcode;
    try {
        // console.log('start try');
        // 1. 检查 session_key 是否过期
        await wxAPI.checkSession();
        // 2.session 没有过期，检查本地 session3rd 和 sessiondDate 是否存在
        let session3rd = await wx.getStorageSync('session3rd');
        let sessionDate = await wx.getStorageSync('sessionDate');
        if (session3rd && sessionDate) {
            // session3rd 和 sessionDate存在，暂时认为登录有效

            // 上次请求时间距离本次是否超过1h（超过则说明登录态可能失效）
            // 获取当前时间戳（毫秒级）
            let timestamp = (new Date()).valueOf();
            let status = parseFloat((parseInt(timestamp) - parseInt(sessionDate)) / 1000);
            if (status > 3600) {
                // session3rd 超过一小时，应该过期了
                // 向服务器发送请求查询session3rd是否有效
                let data = {
                    'session3rd': session3rd
                };
                await wxAPI.request(url.isLoginUrl, data, 'POST')
                    .then(success => {
                        switch (success.data.errcode) {
                            case 0:
                                // 登录态有效
                                let time = (new Date()).valueOf();
                                wx.setStorageSync('sessionDate', time);
                                errcode = 0;
                                break;
                            default:
                                // 登录态过期，需要重新登录
                                errcode = 10;
                        }
                        // await console.log('isLogin over');
                    })

            } else {
                // 距离上次请求登录不足1h，认为登录态有效
                // console.log('不足一小时');
                errcode = 0;
            }
        } else {
            // session3rd 或 sessionDate 不存在，需要执行登录流程
            errcode = 10;
        }
        return errcode;


    } catch (e) {
        // session_key 已经过期，重新执行登录流程
        // console.log(e);
        return errcode = 10;
    }
    // let checkSession = await wxAPI.checkSession();
}

export default {
    doLogin,
    isLogin
}