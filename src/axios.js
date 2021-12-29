import axios, { AxiosRequestHeaders } from 'axios';
const qs = require('qs');

export default class ajax {

    static c_UserID = Number(sessionStorage.getItem("UserID"));
    static c_API_Token = sessionStorage.getItem("API_Token");

    static get(url, params) {
        return axios.get(url, { params, headers: this.get_header("GET") });
    }
    static post(url, params) {
        return axios.post(url, qs.stringify(params), { headers: this.get_header() });
    }
    static put(url, params) {
        return axios.put(url, qs.stringify(params), { headers: this.get_header() });
    }
    static delete(url, params) {
        return axios.delete(url, { data: qs.stringify(params), headers: this.get_header() });
    }

    static get_header(method = "") {
        return {
            'Authorization': 'Bearer ' + this.c_API_Token,
            'Auth': 'Bearer ' + this.c_API_Token,
            'Content-Type': method === 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
        }
    }

    static getRequestParm(Method, Body = {}, mode = 0) {
        let dict =
        {
            Method,
            "UserID": this.c_UserID,
        }
        let d = Object.assign(dict, this.ConverBody(Body));
        return d;
    }

    static getRestParm(Body = {}) {
        let dict = {
            "UserID": this.c_UserID,
        }
        let d = Object.assign(dict, this.ConverBody(Body));
        return d;
    }

    static ConverBody(Body, option = "") {
        let d = {};
        for (let key in Body) {
            let val = Body[key];
            if (typeof val === "object") {
                let b = ConverBody(val, option + key + "][");
                d = Object.assign(d, b);
            } else {
                d["Body[" + option + key + "]"] = val;
            }
        }
        return d;
    }

    static getUserID = function () {
        return this.c_UserID
    };
    static getAPI_Token = function () {
        return this.c_API_Token
    };
    static setUserID = function (UserID) {
        this.c_UserID = UserID;
        return this.c_UserID;
    };
    static setAPI_Token = function (API_Token) {
        this.c_API_Token = API_Token;
        return this.c_API_Token
    };

    static getParam(name, url = null) {
        if (url === null) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}