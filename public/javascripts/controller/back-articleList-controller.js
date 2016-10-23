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
        '$location',
        '$rootScope',
        function ($scope, $route, $routeParams, $http,$location,$rootScope) {
            console.log("enter BackArticleListController ~");
            $scope.curPage = 1;
            $scope.lineSize = 5;
            $scope.page = [];

            $scope.goEdit = function(id){
                for(var i = 0;i<$scope.articles.length;i++){
                    if($scope.articles[i].id == id){
                        $rootScope.article = $scope.articles[i];
                        break;
                    }
                }
                $location.path('/back/article/edit/'+id);
            };

            $scope.delete = function (id) {
                $http.post('/article/delete', {
                    id: id,
                    status:status
                }).success(function (data, status, headers, config) {
                    console.log(data);
                    if (data.status == '0') {
                        console.log("delete fialed");
                    } else {
                        for(var i = 0;i<$scope.articles.length;i++){
                            if($scope.articles[i].id == id){
                                $scope.articles[i].status = 0;
                                break;
                            }
                        }
                    }
                }).error(function (data, status, headers, config) {
                    $scope.errorMsg = data.msg;
                    console.log("fail");
                });
            };

            var queryPage = function (status) {
                $http.post('/article/page/' + $scope.curPage + "/" + $scope.lineSize, {
                    status: status
                }).success(function (data, status, headers, config) {
                    console.log(data);
                    if (data.status == '0') {
                        console.log("page fialed");
                    } else {
                        $scope.articles = data.articles;
                        $scope.status = 2;
                        for (var i = 1; i <= data.size; i++) {
                            $scope.page.push(i);
                        }
                    }
                }).error(function (data, status, headers, config) {
                    $scope.errorMsg = data.msg;
                    console.log("fail");
                });
            };
            $scope.go = function (page,status) {
                if (page >= 1 && page <= $scope.page.length) {
                    $scope.curPage = page;
                    queryPage(status);
                }
            };
            queryPage();

            $scope.filterArticle = function(status){
                $scope.status = status;
            };
        }
    ]);
})(angular);