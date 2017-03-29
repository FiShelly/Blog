/**
 * Created by FiShelly on 2016/10/4.
 */
require('../angular.min');
require('../angular-route.min');
require('../service/http');
    var moduleBlogIndex = angular.module('blog.index', [
        'ngRoute',
        'blog.service.http'
    ]);

    // 配置模块的路由
moduleBlogIndex.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/index', {
            templateUrl: 'template/blog-index-template.html',
            controller: 'BlogIndexController'
        });
    }]);
    //控制器
moduleBlogIndex.controller('BlogIndexController', [
        '$rootScope',
        '$scope',
        '$route',
        '$routeParams',
        'HttpService',
        function ($rootScope,$scope, $route, $routeParams,HttpService) {
            $rootScope.isReady = false;

            var myself = localStorage.getItem('myself');
            if(myself){
                $rootScope.myself = JSON.parse(myself);
            }
            var typetags = sessionStorage.getItem('types');
            if(typetags){
                $rootScope.types = JSON.parse(typetags);
            }
            var sessionArticle = sessionStorage.getItem('article');
            if(sessionArticle){
                $scope.article = JSON.parse(sessionArticle);
                $scope.articleList = JSON.parse(sessionStorage.getItem('articleList'));
                $rootScope.isReady = true;
            }

            var i = 0;
            var validateReady = function(){
                if(i==2){
                    i=0;
                    
                } else {
                    i+=1;
                }
            };
            var queryAllType = function () {
                HttpService.ajax('/typetag/page/1/1000000',{type: true},function(data){
                    validateReady();
                    if(data){
                        $rootScope.types = data.typetags;
                        sessionStorage.setItem('types',JSON.stringify(data.typetags));
                    }
                });
                HttpService.ajax('/user/getAuthor',{loginId: 'fishelly'},function(data){
                    validateReady();
                    if(data){
                        $rootScope.myself = data.author;
                        $rootScope.myself.follow = [{name: 'Github', url: 'https://github.com/FiShelly'}];
                        localStorage.setItem('myself',JSON.stringify($rootScope.myself));
                        validateReady();
                    }
                });
                queryArticle();
            };
            var queryArticle = function(flag){
                HttpService.ajax('/article/page/index/1/5',{},function(data) {

                    if (data.articles.length != 0) {
                        $scope.article = data.articles[0] ;
                        $scope.articleList = data.articles;
                        $scope.article.author = 'Fishelly.';
                        $rootScope.articleId = data.articles[0].id;
                        for(var i = 0;i<$scope.types.length;i++){
                            if($scope.types[i].name == $scope.article.type){
                                $scope.article.typeUrl = "#/type/"+$scope.types[i].id;
                            }
                        }
                        sessionStorage.setItem('article',JSON.stringify($scope.article));
                        sessionStorage.setItem('articleList',JSON.stringify(data.articles));
                        $rootScope.isReady = true;
                    }
                    if(flag){
                        
                    } else {
                        validateReady();
                    }
                });
            };
            // if(!$rootScope.myself){
                queryAllType();
            // } else {
            //     queryArticle(true);
            // }

        }
    ]);

    module.exports = moduleBlogIndex