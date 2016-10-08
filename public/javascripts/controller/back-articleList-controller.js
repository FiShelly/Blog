/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.back.articleList', [
        'ngRoute'
    ]);

    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/back/article/list', {
            templateUrl: 'template/back-articleList-template.html',
            controller: 'BackArticleListController'
        });
    }]);
    //控制器
    module.controller('BackArticleListController', [
        '$scope',
        '$route',
        '$routeParams',
        '$http',
        function ($scope, $route, $routeParams, $http) {
            console.log("enter BackArticleListController ~");

        }
    ]);
})(angular);