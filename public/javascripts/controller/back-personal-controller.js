/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.back.personal', [
        'ngRoute'
    ]);

    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/back/personal', {
            templateUrl: 'template/back-personal-template.html',
            controller: 'BackPersonalController'
        });
    }]);
    //控制器
    module.controller('BackPersonalController', [
        '$rootScope',
        '$scope',
        '$route',
        '$routeParams',
        '$http',
        function ($rootScope,$scope, $route, $routeParams, $http) {
            console.log($rootScope.user);
            $scope.oldPw = "";
            $scope.newPw = "";
            $scope.rNewPw = "";
            if(!$rootScope.user){
                $rootScope.user = JSON.parse(localStorage.getItem("user"));
                //缓存被清空的情况
            }


            $scope.saveOrUpdate = function(){
                console.log($scope.user);
                $http.post('/user/saveOrUpdateUser',{
                    isUpdate:true,
                    user:$rootScope.user
                }).success(function(data,status,headers,config){
                    console.log(data);
                    if(data.status == '0'){
                        console.log("save fialed");
                    } else {
                        localStorage.setItem("user",JSON.stringify($rootScope.user));
                        $rootScope.user = data.user;
                    }
                }).error(function(data,status,headers,config){
                    $scope.errorMsg = data.msg;
                    console.log(data);
                    console.log("fail");
                });
            };

            $scope.updatePwd = function(){
                if($scope.newPw != $scope.rNewPw){
                    return;
                }
                $http.post('/user/updatePwd',{
                    loginId:$rootScope.user.loginId,
                    oldPwd:$scope.oldPw,
                    password:$scope.newPw
                }).success(function(data,status,headers,config){
                    console.log(data);
                    if(data.status == '0'){
                        console.log("updatePwd fialed");
                    } else {
                        $scope.oldPw = "";
                        $scope.newPw = "";
                        $scope.rNewPw = "";
                    }
                }).error(function(data,status,headers,config){
                    $scope.errorMsg = data.msg;
                    console.log(data);
                    console.log("fail");
                });
            };

            $scope.uploadHeadImg = function(){
                console.log(123);
                var formData = new FormData(document.getElementById('personal_form'));
                formData.append('loginId',$scope.user.loginId);
                formData.append( "CustomField", "This is some extra data" );
                $http({
                    method:'POST',
                    url: '/user/uploadHeadImg',
                    data: formData,
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": function () {
                            return undefined;
                        }
                    }
                }).success(function(data,status,headers,config) {
                    //请求成功
                    $scope.user.headImg = data.headImg;
                    console.log("upload success");
                }).error(function(data,status,headers,config) {
                    console.log("upload faild");
                });


            };
        }
    ]);
})(angular,document,localStorage);