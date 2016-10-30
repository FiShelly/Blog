/**
 * Created by FiShelly on 2016/10/4.
 */
(function (angular) {
    var module = angular.module('blog.index', [
        'ngRoute',
        'blog.service.http'
    ]);

    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/index', {
            templateUrl: 'template/blog-index-template.html',
            controller: 'BlogIndexController'
        });
    }]);
    //控制器
    module.controller('BlogIndexController', [
        '$rootScope',
        '$scope',
        '$route',
        '$routeParams',
        '$http',
        'HttpService',
        function ($rootScope,$scope, $route, $routeParams, $http,HttpService) {
            $rootScope.isReady = true;
            var i = 0;
            var validateReady = function(){
                if(i==3){
                    $rootScope.isReady = false;
                } else {
                    i+=1;
                }
            };
            var queryAllType = function () {
                HttpService.ajax('/typetag/page/1/1000000',{type: true},function(data){
                    if(data){
                        validateReady();
                        $scope.types = data.typetags;
                    }
                });
                HttpService.ajax('/article/page/index/1/5',{},function(data) {
                    if (data) {
                        validateReady();
                        $scope.article = data.articles[0];
                        $scope.articleList = data.articles;
                        $scope.article.author = 'Fishelly.';
                        for(var i = 0;i<$scope.types.length;i++){
                            if($scope.types[i].name == $scope.article.type){
                                $scope.article.typeUrl = "#/type/"+$scope.types[i].id;
                            }
                        }

                    }
                });
                HttpService.ajax('/user/getAuthor',{loginId: 'fishelly'},function(data){
                    if(data){
                        validateReady();
                        $scope.myself = data.author;
                        $scope.myself.follow = [{name: 'Github', url: 'https://github.com/FiShelly'}];
                        validateReady();
                    }
                });
            };
            queryAllType();
        }
    ]);
})(angular);