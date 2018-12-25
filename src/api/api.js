import axios from 'axios';

let base = "/api/muser.asmx"
// let base = "http://meeting.csco.org.cn/api/muser.asmx"
axios.defaults.withCredentials = true;
//登录
// export const requestLogin = params => { return axios.post(`${base}/user/login`, params).then(res => res.data); };

//退出登录
// export const retreatLogout = params => { return axios.post(`${base}/user/logout`, params).then(res => res.data); };

export const getIndexContent = params => { return axios.post(`${base}/MemberByYear`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getPayStatus = params => { return axios.post(`${base}/PayStatus`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getMemeberStatus = params => { return axios.post(`${base}/MemberType`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getEducationStatus = params => { return axios.post(`${base}/Education`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getNationStatus = params => { return axios.post(`${base}/Nation`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getGenderStatus = params => { return axios.post(`${base}/Gender`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
// export const getContent = params => { return axios.get(`${basea}/CompanyByCity`, { params: params }); };