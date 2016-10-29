/**
 * Created by FiShelly on 2016/10/29.
 */
'use strict';

(function(angular) {
    // ����Ĭ��angular�ṩ���첽�������֧���Զ���ص�������
    // angular�������Ļص��������Ʋ�������֧��
    var http = angular.module('blog.service.http', []);
    http.service('HttpService', ['$http','$location', function($http,$location) {
        // url : http://api.douban.com/vsdfsdf -> <script> -> html�Ϳ��Զ�ִ��
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
                //����ɹ�
                callback(data);
            }).error(function(data,status,headers,config) {
                callback(null);
            });
        }
    }]);
})(angular);
