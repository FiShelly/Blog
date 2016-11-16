/**
 * Created by FiShelly on 2016/10/5.
 */
require('../angular.min');
require('../angular-route.min');
require('../service/http');
require('../service/modal');
    var moduleBackArticleList = angular.module('blog.back.articleList', [
        'ngRoute',
        'blog.service.http',
        'blog.service.modal'
    ]);

    // 配置模块的路由
    moduleBackArticleList.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/back/article/list', {
            templateUrl: 'template/back-articleList-template.html',
            controller: 'BackArticleListController'
        });
    }]);
    //控制器
    moduleBackArticleList.controller('BackArticleListController', [
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
                
            }
            $scope.curPage = 1;
            $scope.lineSize = 500000;
            $scope.page = [];

            $scope.goEdit = function(id){
                for(var i = 0;i<$scope.articles.length;i++){
                    if($scope.articles[i].id == id){
                        $rootScope.article = $scope.articles[i];
                        break;
                    }
                }
                $location.path('/back/article/edit/'+id+'/'+$rootScope.article.status);
            };

            $scope.delete = function (id) {
                HttpService.ajax('/article/delete',{id: id,status:0},function(data){
                    if(data){
                        for(var i = 0;i<$scope.articles.length;i++){
                            if($scope.articles[i].id == id){
                                $scope.articles[i].status = 0;
                                break;
                            }
                        }
                        var obj = function () {
                            return data;
                        };
                        ModalService.open('/template/modal-tip-msg.html','ModalInstanceCtrl','md',obj);
                        
                    }
                });

            };

            var queryPage = function (status) {
                HttpService.ajax('/article/page/'+ $scope.curPage + "/" + $scope.lineSize,{status: status},function(data){
                    if(data){
                        $scope.articles = data.articles;
                        $scope.status = 2;
                        for (var i = 1; i <= data.size; i++) {
                            $scope.page.push(i);
                        }
                        
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

    module.exports = moduleBackArticleList;