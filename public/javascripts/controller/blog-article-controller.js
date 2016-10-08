/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.article', [
        'ngRoute',
    ]);

    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        console.log('entern blog type controller route');
        $routeProvider.when('/article', {
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