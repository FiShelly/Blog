/**
 * Created by FiShelly on 2016/10/5.
 */
    var moduleBlogType = angular.module('blog.type', [
        'ngRoute',
        'blog.service.http'
    ]);

    // 配置模块的路由
    moduleBlogType.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/type/:id', {
            templateUrl: 'template/blog-typeDetail-template.html',
            controller: 'BlogTypeController'
        });
    }]);
    //控制器
    moduleBlogType.controller('BlogTypeController', [
        '$rootScope',
        '$scope',
        '$route',
        '$routeParams',
        'HttpService',
        function ($rootScope,$scope, $route, $routeParams, HttpService) {
            $rootScope.isReady = false;
            var myself = localStorage.getItem('myself');
            if(myself){
                $rootScope.myself = JSON.parse(myself);
            }
            var typetags = sessionStorage.getItem('types');
            if(typetags){
                $rootScope.types = JSON.parse(typetags);
            }


            var queryType = function(flag){
                HttpService.ajax('/typetag/page/1/1000000',{type: flag},function(data){
                    if(data && flag){
                        $rootScope.types = data.typetags;
                    } else if(data && !flag){
                        $rootScope.tags = data.typetags;
                    }
                    if(data){
                        for(var i = 0;i<data.typetags.length;i++){
                            if(data.typetags[i].id == id){
                                $scope.firstTypeName = data.typetags[i].name;
                                if(data.typetags[i].type){
                                    queryTypePage(true);
                                } else {
                                    $scope.displayTagArticle({name:$scope.firstTypeName});
                                }
                                break;
                            }
                        }

                    }
                });
            };

            $scope.displayTagArticle = function(tag){
                $scope.firstTypeName = tag.name;
               queryTypePage();
            };

            var queryTypePage = function(type){
                var query = {type:$scope.firstTypeName,status:2};
                if(!type){
                    query = {'tag.name':$scope.firstTypeName,status:2};
                }
                HttpService.ajax('/article/page/query',{query:query},function(data) {
                    if (data.articles.length != 0) {
                        $scope.articleList = data.articles;
                        $scope.typeDetail = {
                            name:$scope.firstTypeName,
                            count:data.articles.length,
                            flag:true,
                            detail:[]
                        };
                        filterArticle();
                    } else {
                        $rootScope.isReady = true;
                        $scope.typeDetail = {
                            name: $scope.firstTypeName,
                            detail:[],
                            count:0
                        }
                    }
                });
            };
            var queryTypeName = function(id){
                // if($rootScope.types){
                //     for(var i = 0;i<$rootScope.types.length;i++){
                //         if($rootScope.types[i].id == id){
                //             $rootScope.firstTypeName = $rootScope.types[i].name;
                //             queryTypePage();
                //         }
                //     }
                // } else {
                    queryType(true);
                // }
                queryType(false);
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
                var alLength = $scope.articleList.length;
                for(var i = 0;i<alLength-1;i++){
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
                if(alLength != 0){
                    temp.year = $scope.articleList[i].date.substring(0,4);
                }
                temp.articleList.push($scope.articleList[i]);
                $scope.typeDetail.detail.push(temp);
                $rootScope.isReady = true;
            };
            var id = $routeParams.id;
            if(id != 0){
                queryTypeName(id);
            } else {
                queryType(true);
                queryType(false);
            }
            if(!$rootScope.myself){
                queryAuthor();
            }
        }
    ]);

    module.exports = moduleBlogType;