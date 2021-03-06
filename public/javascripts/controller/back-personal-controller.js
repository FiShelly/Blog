/**
 * Created by FiShelly on 2016/10/5.
 */
require('../angular.min');
require('../angular-route.min');
require('../service/http');
require('../service/modal');
    var moduleBackPersonal = angular.module('blog.back.personal', [
        'ngRoute',
        'blog.service.http',
        'blog.service.modal'
    ]);

    // 配置模块的路由
    moduleBackPersonal.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/back/personal', {
            templateUrl: 'template/back-personal-template.html',
            controller: 'BackPersonalController'
        });
    }]);
    //控制器
    moduleBackPersonal.controller('BackPersonalController', [
        '$rootScope',
        '$scope',
        '$route',
        '$routeParams',
        'HttpService',
        'ModalService',
        function ($rootScope,$scope, $route, $routeParams,HttpService,ModalService) {
            if(!sessionStorage.getItem("user")){
                $location.path("/login/-1");
            } else {
                $rootScope.isLogin = true;
                
            }
            $scope.oldPw = "";
            $scope.newPw = "";
            $scope.rNewPw = "";
            if(!$rootScope.user){
                $rootScope.user = JSON.parse(localStorage.getItem("user"));
            }
            $scope.tip = function (data, size) {
                var obj = function () {
                    return data;
                };
                ModalService.open('/template/modal-tip-msg.html', 'ModalInstanceCtrl', size, obj);
            };
            $scope.saveOrUpdate = function(){
                HttpService.ajax('/user/saveOrUpdateUser',{ isUpdate:true, user:$rootScope.user},function(data){
                    if(data){
                        localStorage.setItem("user",JSON.stringify($rootScope.user));
                        $rootScope.user = data.user;
                        $scope.tip(data, 'md');
                    }
                });
            };

            $scope.updatePwd = function(){
                if($scope.newPw != $scope.rNewPw){
                    $scope.tip({msg:"两次密码输入不一致，请重新输入。"});
                    return;
                }
                HttpService.ajax('/user/updatePwd',{loginId:$rootScope.user.loginId,oldPwd:$scope.oldPw,password:$scope.newPw},function(data){
                    $scope.oldPw = "";
                    $scope.newPw = "";
                    $scope.rNewPw = "";
                    $scope.tip(data, 'md');
                });
            };

            $scope.uploadHeadImg = function(){
                
                var formData = new FormData(document.getElementById('personal_form'));
                formData.append('loginId',$scope.user.loginId);
                formData.append( "CustomField", "This is some extra data" );
                HttpService.ajaxObj({
                    method:'POST',
                    url: '/user/uploadHeadImg',
                    data: formData,
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": function () {
                            return undefined;
                        }
                    }
                },function(data){
                    $scope.user.headImg = data.headImg;
                    $scope.tip(data, 'md');
                });
            };
        }
    ]);
    module.exports = moduleBackPersonal;