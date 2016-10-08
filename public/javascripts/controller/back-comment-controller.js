/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.back.comment', [
        'ngRoute'
    ]);

    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/back/comment', {
            templateUrl: 'template/back-comment-template.html',
            controller: 'BackCommentController'
        });
    }]);
    //控制器
    module.controller('BackCommentController', [
        '$scope',
        '$route',
        '$routeParams',
        '$http',
        function ($scope, $route, $routeParams, $http) {
            console.log("enter BackCommentController ~");

        }
    ]);
})(angular);