/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.back.comment', [
        'ngRoute',
        'blog.service.http',
        'blog.service.modal'
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
        '$rootScope',
        '$scope',
        '$route',
        '$routeParams',
        'HttpService',
        'ModalService',
        '$location',
        function ($rootScope, $scope, $route, $routeParams, HttpService, ModalService,$location) {
            if(!sessionStorage.getItem("user")){
                //$location.path("/login/-1");
            } else {
                $rootScope.isLogin = true;
            }
            var queryComment = function () {
                HttpService.ajax('/comment/page/query', {flag:true},function (data) {
                        if (data) {
                            $scope.comments = data.comments;
                            $rootScope.isReady = false;
                        }
                    });
            };
            $scope.delete = function (id,aid) {
                HttpService.ajax('/comment/delete/'+id,{},function(data){
                    var obj = function () {
                        return data;
                    };
                    updateCount(aid);
                    ModalService.open('/template/modal-tip-msg.html', 'ModalInstanceCtrl', 'md', obj);
                    for(var i = 0;i<$scope.comments.length;i++){
                        if($scope.comments[i].id == id){
                            $scope.comments.splice(i,1);
                            break;
                        }
                    }
                });
            };
            var updateCount = function(id){
                var obj =  {"commentCount": -1};
                HttpService.ajax('/article/updateCount/'+id,{query:obj},function(data){});
            };
            queryComment();
        }
    ]);
})(angular);