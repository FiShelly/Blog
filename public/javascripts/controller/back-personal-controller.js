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
        '$scope',
        '$route',
        '$routeParams',
        '$http',
        function ($scope, $route, $routeParams, $http) {
            console.log("enter BlogArticleController ~");

        }
    ]);
})(angular);