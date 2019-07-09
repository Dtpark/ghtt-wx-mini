// 将微信提供的API重新封装
// import {wx} from 'wx';
/**
 * promise化接口
 */
function wxPromisify(functionName, params) {
    return new Promise((resolve, reject) => {
        wx[functionName]({
            ...params,
            success: res => resolve(res),
            fail: res => reject(res)
        });
    });
}

/**
 * 登录
 */
function login(params = {}) {
    return wxPromisify('login', params);
}

/**
 * 获取用户信息
 */
function getUserInfo(params = {}) {
    return wxPromisify('getUserInfo', params);
}

/**
 * 获取用户权限
 */
function getSetting(params = {}) {
    return wxPromisify('getSetting', params);
}

/**
 * 检查登录态是否过期
 */
function checkSession(params = {}) {
    return wxPromisify('checkSession', params);
}

/**
 * 发起 HTTPS 网络请求
 */
function request(url, data = {}, method = 'POST') {
    // return wxPromisify('request', params);
    return new Promise((resolve, reject) => {
        let header;
        switch (method) {
            case 'POST':
                header = { 'content-type': 'application/x-www-form-urlencoded' };
                break;
            case 'GET':
                header = { 'content-type': 'application/json' }
                break;
        }
        wx.request({
            url: url,
            data: data,
            method: method,
            header: header,

            success: res => resolve(res),
            fail: res => reject(res)
        });
    });
}

/**
 * 重新加载页面
 */
// function relauncn(){
//     let pages = getCurrentPages();//获取加载的页面
//     let currentPage = pages[pages.length - 1];//获取当前页面的对象
//     let url = currentPage.route;//当前页面url
//     wx.relauncn({
//         url: '/'+url
//     });
// }

/**
 * 提示框——wx.showModal
 * title: "提示", //提示的标题,
    content: "您尚未绑定一卡通系统是否进行绑定？", //提示的内容,
    showCancel: true, //是否显示取消按钮,
    cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
    cancelColor: "#000000", //取消按钮的文字颜色,
    confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
    confirmColor: "#3CC51F", //确定按钮的文字颜色,
 */

function showModal(params = { title: '', content: '', showCancel: true, cancelText: '取消', cancelColor: '#000', confirmText: '确定', confirmColor: "#3CC51F" }) {
    return wxPromisify('showModal', params);
}


export default {
    login,
    getUserInfo,
    getSetting,
    checkSession,
    request,
    showModal
}