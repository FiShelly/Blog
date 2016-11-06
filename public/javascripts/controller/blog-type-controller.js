/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.type', [
        'ngRoute',
        'blog.service.http'
    ]);

    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/type/:id', {
            templateUrl: 'template/blog-typeDetail-template.html',
            controller: 'BlogTypeController'
        });
    }]);
    //控制器
    module.controller('BlogTypeController', [
        '$rootScope',
        '$scope',
        '$route',
        '$routeParams',
        'HttpService',
        function ($rootScope,$scope, $route, $routeParams, HttpService) {
            $rootScope.isReady = true;
            var queryType = function(){
                HttpService.ajax('/typetag/page/1/1000000',{type: true},function(data){
                    if(data){
                        $rootScope.types = data.typetags;
                    }
                    if(data && $scope.types[0].name){
                        $scope.firstTypeName = $rootScope.types[0].name;
                        queryTypePage();
                    }
                });
            };
            var queryTypePage = function(){
                HttpService.ajax('/article/page/query',{query:{type:$scope.firstTypeName,status:2}},function(data) {
                    if (data.articles.length != 0) {
                        $scope.articleList = data.articles;
                        $scope.typeDetail = {
                            name:$scope.firstTypeName,
                            count:data.articles.length,
                            detail:[]
                        };
                        filterArticle();
                        $rootScope.isReady = false;
                    }
                });
            };
            var queryTypeName = function(id){
                if($rootScope.types){
                    for(var i = 0;i<$rootScope.types.length;i++){
                        if($rootScope.types[i].id == id){
                            $rootScope.firstTypeName = $rootScope.types[i].name;
                            queryTypePage();
                        }
                    }
                } else {
                    queryType();
                }
            };
            var queryAuthor = function(){
                HttpService.ajax('/user/getAuthor',{loginId: 'fishelly'},function(data){
                    if(data){
                        $rootScope.myself = data.author;
                        $rootScope.myself.follow = [{name: 'Github', url: 'https://github.com/FiShelly'}];
                    }
                });
            };
            var filterArticle = function(){
                var temp = {year:"",articleList:[]};
                for(var i = 0;i<$scope.articleList.length-1;i++){
                    var str = $scope.articleList[i].date.substring(0,4);
                    var end = $scope.articleList[i+1].date.substring(0,4);
                    if( str == end){
                        temp.year = str;
                        temp.articleList.push($scope.articleList[i]);
                    } else {
                        $scope.typeDetail.detail.push(temp);
                        temp = {year:"",articleList:[]};
                    }
                }
                temp.articleList.push($scope.articleList[i]);
                $scope.typeDetail.detail.push(temp);

            };
            var id = $routeParams.id;
            if(id != 0){
                queryTypeName(id);
            } else {
                queryType();
            }
            if(!$rootScope.myself){
                queryAuthor();
            }
        }
    ]);
})(angular);