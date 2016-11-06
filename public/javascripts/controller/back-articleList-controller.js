/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.back.articleList', [
        'ngRoute',
        'blog.service.http',
        'blog.service.modal'
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
        '$rootScope',
        '$scope',
        '$route',
        '$routeParams',
        '$location',
        'HttpService',
        'ModalService',
        function ($rootScope,$scope, $route, $routeParams,$location,HttpService,ModalService) {
            if(!sessionStorage.getItem("user")){
                $location.path("/login/-1");
            } else {
                $rootScope.isLogin = true;
                $rootScope.isReady = false;
            }
            $scope.curPage = 1;
            $scope.lineSize = 500000;
            $scope.page = [];

            $scope.goEdit = function(id){
                $rootScope.isReady = true;
                for(var i = 0;i<$scope.articles.length;i++){
                    if($scope.articles[i].id == id){
                        $rootScope.article = $scope.articles[i];
                        break;
                    }
                }
                console.log($rootScope.article);
                $location.path('/back/article/edit/'+id+'/'+$rootScope.article.status);
            };

            $scope.delete = function (id) {
                $rootScope.isReady = true;
                HttpService.ajax('/article/delete',{id: id,status:0},function(data){
                    if(data){
                        for(var i = 0;i<$scope.articles.length;i++){
                            console.log(id);
                            if($scope.articles[i].id == id){
                                console.log("12312312312");
                                $scope.articles[i].status = 0;
                                break;
                            }
                        }
                        var obj = function () {
                            return data;
                        };
                        ModalService.open('/template/modal-tip-msg.html','ModalInstanceCtrl','md',obj);
                        $rootScope.isReady = false;
                    }
                });

            };

            var queryPage = function (status) {
                $rootScope.isReady = true;
                HttpService.ajax('/article/page/'+ $scope.curPage + "/" + $scope.lineSize,{status: status},function(data){
                    if(data){
                        $scope.articles = data.articles;
                        $scope.status = 2;
                        for (var i = 1; i <= data.size; i++) {
                            $scope.page.push(i);
                        }
                        $rootScope.isReady = false;
                    }
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