/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.article', [
        'ngRoute',
        'blog.service.http',
        'blog.service.modal'
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
        '$rootScope',
        '$scope',
        '$route',
        '$routeParams',
        'HttpService',
        '$sce',
        'ModalService',
        '$filter',
        function ($rootScope,$scope, $route, $routeParams, HttpService,$sce,ModalService,$filter) {
            
            var getCurArticle = function(){
                HttpService.ajax('/article/getById/'+$routeParams.id+'/2',{},function(data){
                    if(data){
                        $scope.article = data.article;
                        
                        $scope.article.articleHtml = $sce.trustAsHtml($scope.article.articleHtml);
                        changeNPA();
                        queryComment();
                        updateCount(false);
                    }
                });
            };
            //todo 需要优化
            var changeNPA = function(){
                HttpService.ajax('/article/page/query/',{query:{status:2}},function(data){
                    if(data){
                        var flaga = true;
                        var flagb = true;
                        for (var i = 0; i < data.articles.length; i++) {
                            if (data.articles[i].id == $scope.article.id && flaga) {
                                if (i - 1 >= 0) {
                                    $scope.article.next = data.articles[i - 1];
                                }
                                if (i + 1 <= data.articles.length) {
                                    $scope.article.pre = data.articles[i + 1]
                                }
                                flaga = false;
                                if(!flagb){
                                    break;
                                }
                            }
                            if(data.articles[i].type == $scope.article.type && flagb){
                                $scope.aboutArticle.push(data.articles[i]);
                                if($scope.aboutArticle.length>=5){
                                    flagb = false;
                                    if(!flaga){
                                        break;
                                    }
                                }
                            }

                        }
                    }
                });
            };
            var queryComment = function(){
                $scope.comment.article = {id:$scope.article.id,title:$scope.article.title};
                HttpService.ajax('/comment/page/query',{query:{article:$scope.comment.article}},
                    function(data){
                        if(data){
                            $scope.comments = data.comments;
                        }
                });
            };
            var queryArticle = function(){
                HttpService.ajax('/article/page/index/1/1',{},function(data) {
                    if (data.articles) {
                        $scope.article = data.articles[0];
                        $scope.article.author = 'Fishelly.';
                        
                        $scope.article.articleHtml = $sce.trustAsHtml($scope.article.articleHtml);
                        changeNPA();
                        queryComment();
                        $rootScope.articleId = data.articles[0].id;
                        updateCount(false);
                    }
                });
            };
            $scope.submitComment = function(){
                if($scope.remember){
                    localStorage.setItem("visitor",JSON.stringify($scope.comment.visitor));
                }
                if($scope.commentContent.indexOf('<quote') != -1){
                    $scope.comment.quotes = {};
                    $scope.comment.quotes.name = $scope.commentContent.match(/<quote-name>([\s\S]*?)<\/quote-name>/)[1];
                    $scope.comment.quotes.content = $scope.commentContent.match(/<quote-content>([\s\S]*?)<\/quote-content>/)[1];
                    $scope.comment.content = $scope.commentContent.replace(/<quote-name>([\s\S]*?)<\/quote-content>\n/,'');
                } else {
                    $scope.comment.content = $scope.commentContent;
                }
                $scope.comment.date = $filter('date')(new Date(),'yyyy-MM-dd HH:mm');
                HttpService.ajax('/comment/save',{comment:$scope.comment},function(data){
                    $scope.comments.push($scope.comment);
                    $scope.commentContent = '';
                    var obj = function () {
                        return data;
                    };
                    ModalService.open('/template/modal-tip-msg.html', 'ModalInstanceCtrl', 'md', obj);
                    updateCount(true);
                });
            };

            var updateCount = function(flag){
                var obj =  {"readCount": 1};
                if(flag){
                    obj = {"commentCount": 1};
                }
                HttpService.ajax('/article/updateCount/'+$routeParams.id,{query:obj},function(data){});
            };

            $scope.quote = function(comment){
                $scope.commentContent = '<quote-name>'+comment.visitor.name+'</quote-name>\n'+
                                '<quote-content>'+comment.content+'</quote-content>'+"\n";
                document.getElementById('comment').focus();
            };

            $scope.aboutArticle = [];
            $scope.comments = [];
            $scope.comment ={};
            $scope.remember = false;
            if(localStorage.getItem("visitor")){
                $scope.comment.visitor = JSON.parse(localStorage.getItem("visitor"));
                $scope.remember = true;
            }
            if($routeParams.id==0){
                queryArticle();
            } else {
                getCurArticle();
            }
        }
    ]);
})(angular,document);