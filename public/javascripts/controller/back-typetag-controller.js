/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.back.typetag', [
        'ngRoute',
        'ui.bootstrap',
        'blog.back.modal',
        'blog.service.http',
        'blog.service.modal'
    ]);
    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/back/type', {
            templateUrl: 'template/back-type-template.html',
            controller: 'BackTypetagController'
        }).when('/back/tag', {
            templateUrl: 'template/back-tag-template.html',
            controller: 'BackTypetagController'
        });
    }]);
    //控制器
    module.controller('BackTypetagController', [
        '$rootScope',
        '$scope',
        '$route',
        '$routeParams',
        '$location',
        '$modal',
        'HttpService',
        'ModalService',
        function ( $rootScope,$scope, $route, $routeParams, $location, $modal, HttpService, ModalService) {
            if(!sessionStorage.getItem("user")){
                $location.path("/login/-1");
            } else {
                $rootScope.isLogin = true;
                $rootScope.isReady = false;
            }
            $scope.obj = {name: "", id: "", type: true, isUpdate: false};

            $scope.tip = function (data, size) {
                var obj = function () {
                    return data;
                };
                ModalService.open('/template/modal-tip-msg.html', 'ModalInstanceCtrl', size, obj);
                $rootScope.isReady = false;
            };

            $scope.open = function (size, flag, isUpdate, name, id) {  //打开模态
                var obj = function () {
                    $scope.obj.type = flag;
                    $scope.obj.isUpdate = isUpdate;
                    if (name) {
                        $scope.obj.name = name;
                        $scope.obj.id = id;
                    }
                    return $scope.obj;
                };
                var modalInstance = ModalService.open('/template/modal-type-tag.html', 'ModalInstanceCtrl', size, obj);
                modalInstance.result.then(function (selectedItem) {
                    $rootScope.isReady = true;
                    var url = '/typetag/save';
                    if (selectedItem.isUpdate) {
                        url = '/typetag/updateName'
                    }
                    HttpService.ajax('/typetag/getByName', {
                        name: selectedItem.name,
                        type: selectedItem.type
                    }, function (data) {
                        if (data.status == '2') {
                            HttpService.ajax(url, {typetag: selectedItem}, function (data) {
                                $route.reload();
                                $scope.tip(data, 'md');
                            });
                        } else if (data.status == '1') {
                            $scope.tip(data, 'md');
                        }
                    });
                });
            };

            $scope.page = [];

            if ($location.url().indexOf('tag') != -1) {
                $scope.obj.type = false;
            }

            $scope.delete = function (id) {
                $rootScope.isReady = true;
                HttpService.ajax('/typetag/delete', {id: id}, function (data) {
                    $route.reload();
                    $scope.tip(data, 'md');
                });
            };
            var queryPage = function () {
                $rootScope.isReady = true;
                HttpService.ajax('/typetag/page/1/100000', {type: $scope.obj.type}, function (data) {
                    $scope.typetags = data.typetags;
                    $rootScope.isReady = false;
                });
            };

            queryPage();
        }
    ]);

})(angular);