/**
 * Created by FiShelly on 2016/10/29.
 */
'use strict';

(function(angular) {
    // 由于默认angular提供的异步请求对象不支持自定义回调函数名
    // angular随机分配的回调函数名称不被豆瓣支持
    var http = angular.module('blog.service.http', []);
    http.service('HttpService', ['$http','$location', function($http,$location) {
        // url : http://api.douban.com/vsdfsdf -> <script> -> html就可自动执行
        this.ajax = function(url, data,callback) {
            $http.post(url, data).success(function (data, status, headers, config) {
                console.log(data);
                if (data.status == '0') {
                    callback(null);
                } else if (data.status == '-2'){
                    $location.path('/login/-1');
                }else {
                    callback(data);
                }
            }).error(function (data, status, headers, config) {
                callback(null);
            });
        };

        this.ajaxObj = function(httpObj,callback){
            $http(httpObj).success(function(data,status,headers,config) {
                //请求成功
                callback(data);
            }).error(function(data,status,headers,config) {
                callback(null);
            });
        }
    }]);
})(angular);
