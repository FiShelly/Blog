/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.back.typetag', [
        'ngRoute',
        'ui.bootstrap'
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
        '$scope',
        '$route',
        '$routeParams',
        '$http',
        '$modal',
        function ($scope, $route, $routeParams, $http,$modal) {
            console.log("enter BackTypetagController ~");
            $scope.obj = {typeName:"",flag:false};
            $scope.open = function (size,flag) {  //打开模态
                var modalInstance = $modal.open({
                    templateUrl: '/template/modal-type-tag.html',  //指向上面创建的视图
                    controller: 'ModalInstanceCtrl',// 初始化模态范围
                    size: size, //大小配置
                    resolve: {
                        obj: function () {
                            $scope.obj.flag = flag;
                            return  $scope.obj;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    console.log(selectedItem.typeName);
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };
        }
    ]);

    module.controller('ModalInstanceCtrl', function ($scope, $modalInstance, obj) { //依赖于modalInstance
        $scope.obj = obj;

        $scope.ok = function () {
            $modalInstance.close($scope.obj); //关闭并返回当前选项
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel'); // 退出
        }
    });
})(angular);