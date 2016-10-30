/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.article', [
        'ngRoute',
    ]);

    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/article/:id', {
            templateUrl: 'template/blog-article-template.html',
            controller: 'BlogArticleController'
        });
    }]);
    //控制器
    module.controller('BlogArticleController', [
        '$scope',
        '$route',
        '$routeParams',
        '$http',
        function ($scope, $route, $routeParams, $http) {
            console.log("enter BlogArticleController ~");

        }
    ]);
})(angular);