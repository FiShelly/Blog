/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.back.login', [
        'ngRoute',
        'blog.service.http'
    ]);

    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'template/back-login-template.html',
            controller: 'BackLoginController'
        }).when('/login/:ec', {
            templateUrl: 'template/back-login-template.html',
            controller: 'BackLoginController'
        });
    }]);
    //控制器
    module.controller('BackLoginController', [
        '$rootScope',
        '$scope',
        '$route',
        '$routeParams',
        '$location',
        'HttpService',
        function ($rootScope,$scope, $route, $routeParams,$location,HttpService) {
            //$scope.loginId = "";
            //$scope.loginId = "";
            $scope.remember = false;
            var loginMsg = JSON.parse(localStorage.getItem("user"));
            if(loginMsg){
                $scope.loginId = loginMsg.loginId;
                $scope.password = loginMsg.password;
            }
            if($routeParams.ec == -1){
                $scope.msg = "未登录或登录超时，请重新登录";
            }

            $scope.loginValidate = function(){
                HttpService.ajax('/user/login', {loginId:$scope.loginId,password:$scope.password},function (data) {
                    if(data.status == '0'){
                        //$rootScope.user = {
                        //    loginId:"fishelly",
                        //    name : "fishelly.",
                        //    position : "Java开发工程师 & Web前端工程师",
                        //    signature : "耐得住寂寞，经得起诱惑，受得起挫折.",
                        //    label : ['Java','Web前端','工程师'],
                        //    introduce : "~~~耐得住寂寞，经得起诱惑，受得起挫折.",
                        //
                        //    headImg : "images/fish1.jpg"
                        //};
                        //$http.post('/user/saveOrUpdateUser',{
                        //    isUpdate:false,
                        //    user:$rootScope.user,
                        //    password:"110210"
                        //}).success(function(data,status,headers,config){
                        //    if(data.status == '0'){
                        //        console.log("save fialed");
                        //    } else {
                        //        $rootScope.user = data.user;
                        //        $rootScope.isLogin = true;
                        //    }
                        //}).error(function(data,status,headers,config){
                        //    $scope.errorMsg = data.msg;
                        //    console.log("fail");
                        //});
                    } else if(data.status == '-1') {
                        $scope.msg = data.msg;
                        return;
                    } else{
                        $rootScope.isLogin = true;
                        $rootScope.user = data.user;
                    }
                    if($scope.remember){
                        localStorage.setItem("loginMsg",JSON.stringify( {loginId:$scope.loginId,password:$scope.password}));
                    }
                    localStorage.setItem("user",JSON.stringify($rootScope.user));
                    sessionStorage.setItem("user",JSON.stringify($rootScope.user));
                    $location.path("/back/personal");
                });
                //$http.post('/user/login',{loginId:$scope.loginId,password:$scope.password}).success(function(data,status,headers,config){
                //    console.log(data);
                //    if(data.status == '0'){
                //        //$rootScope.user = {
                //        //    loginId:"fishelly",
                //        //    name : "fishelly.",
                //        //    position : "Java开发工程师 & Web前端工程师",
                //        //    signature : "耐得住寂寞，经得起诱惑，受得起挫折.",
                //        //    label : ['Java','Web前端','工程师'],
                //        //    introduce : "~~~耐得住寂寞，经得起诱惑，受得起挫折.",
                //        //
                //        //    headImg : "images/fish1.jpg"
                //        //};
                //        //$http.post('/user/saveOrUpdateUser',{
                //        //    isUpdate:false,
                //        //    user:$rootScope.user,
                //        //    password:"110210"
                //        //}).success(function(data,status,headers,config){
                //        //    if(data.status == '0'){
                //        //        console.log("save fialed");
                //        //    } else {
                //        //        $rootScope.user = data.user;
                //        //        $rootScope.isLogin = true;
                //        //    }
                //        //}).error(function(data,status,headers,config){
                //        //    $scope.errorMsg = data.msg;
                //        //    console.log("fail");
                //        //});
                //    } else if(data.status == '-1') {
                //            console.log("login faild");
                //            $scope.msg = data.msg;
                //            return;
                //    } else{
                //        $rootScope.isLogin = true;
                //        $rootScope.user = data.user;
                //    }
                //    localStorage.setItem("user",JSON.stringify($rootScope.user));
                //    sessionStorage.setItem("user",JSON.stringify($rootScope.user));
                //    $location.path("/back/personal");
                //}).error(function(data,status,headers,config){
                //    $scope.errorMsg = data.msg;
                //});
            }
        }
    ]);
})(angular,localStorage);