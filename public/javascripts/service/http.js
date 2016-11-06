/**
 * Created by FiShelly on 2016/10/29.
 */
'use strict';

(function(angular) {
    var http = angular.module('blog.service.http', []);
    http.service('HttpService', ['$http','$location', function($http,$location) {
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
                callback(data);
            }).error(function(data,status,headers,config) {
                callback(null);
            });
        }
    }]);
})(angular);
