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
export const getNewMember = params => { return axios.post(`${base}/NewMember`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getTitle = params => { return axios.post(`${base}/Title`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getJob = params => { return axios.post(`${base}/Job`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getMajor = params => { return axios.post(`${base}/Major`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getMemberByProvince = params => { return axios.post(`${base}/MemberByProvince`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getCompanyByProvince = params => { return axios.post(`${base}/CompanyByProvince`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getMemberByYear = params => { return axios.post(`${base}/MemberByYear`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getMemberByMonth = params => { return axios.post(`${base}/MemberByMonth`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
export const getMemberByDay = params => { return axios.post(`${base}/MemberByDay`, params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data); };
