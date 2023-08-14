import qs from 'qs';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8080';

axios.defaults.timeout = 60000; //30s


axios.defaults.headers = {

    'Content-Type': 'text/plain;charset=UTF-8'

}

axios.defaults.paramsSerializer = (params) => {

    // Sample implementation of query string building
    return qs.stringify(params, { arrayFormat: 'repeat' })
    // let result = '';

    // Object.keys(params).forEach(key => {
    //     if ((params[key] != undefined)) {
    //         result +=qs.stringify(params, { arrayFormat: 'repeat' })
    //         // result += `${key}=${encodeURIComponent(params[key])}&`;
    //     }

    // });

    // return result.substr(0, result.length - 1);

}
// 请求拦截器
axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        Message.error("请求发送失败");
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);


/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @returns {Promise}
 */

export function Get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err)
        })
    });
}

export function Post(url, data, config) {
    return new Promise((resolve, reject) => {
        axios.post(url, data, config)
            .then((res) => {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
