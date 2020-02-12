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

function showModal(params = { title: '注意', content: '', showCancel: true, cancelText: '取消', cancelColor: '#000', confirmText: '确定', confirmColor: "#3CC51F" }) {
    return wxPromisify('showModal', params);
}
/**
 * 跳转到登录页
 */
function toLoginPage() {
    wx.navigateTo({ url: '/pages/login/main' });
}

/**
 * 弹窗提醒是否重新登录
 * info 为提示信息
 * isBack 为点击取消是否返回上一页
 */
function isLoginModal(info = '登录过期', isBack = true) {
    let params;
    params = {
        title: "注意",
        content: info+"，是否重新登录？"
    };
    showModal(params).then(res => {
        if (res.confirm) {
            // 用户点击确定
            toLoginPage();
        } else {
            // 用户点击取消
            wx.removeStorageSync('session3rd');
            if(isBack){
                wx.navigateBack({
                    delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                });
            }            
        }
    });
}


export default {
    login,
    getUserInfo,
    getSetting,
    checkSession,
    request,
    showModal,
    toLoginPage,
    isLoginModal
}