/**
 * Created by FiShelly on 2016/11/7.
 */
(function (angular) {
    var app = angular.module('BlogIndexApp', [
        'ngRoute',
        'blog.index',
        'blog.type',
        'blog.article',
        'blog.back.personal',
        'blog.back.articleList',
        'blog.back.articleEdit',
        'blog.back.typetag',
        'blog.back.login',
        'blog.service.http',
        'blog.service.modal',
        'blog.back.comment',
        'blog.back.modal'
    ]);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/index'});
    }]);

    app.controller('AppController', [
        '$rootScope',
        '$scope',
        'ModalService',
        'HttpService',
        function ($rootScope, $scope, ModalService, HttpService) {
            $rootScope.isReady = true;
            if (sessionStorage.getItem("user")) {
                $rootScope.isLogin = true;
            }

            $scope.open = function (size) {  //打开模态
                var patternObj = {$regex: $scope.keyword, $options: 'i'};
                HttpService.ajax('/article/page/query', {
                    query: {
                        "title": patternObj,
                        "status": 2
                    }
                }, function (data) {
                    if (data.articles) {
                        $scope.articleList = data.articles;
                        console.log($scope.articleList);
                        var obj = function () {
                            return {
                                keyword: $scope.keyword,
                                count: $scope.articleList.length,
                                articleList: $scope.articleList
                            };
                        };
                    }
                    var modalInstance = ModalService.open('/template/modal-article-list.html', 'ModalInstanceCtrl', size, obj);
                    modalInstance.result.then(function (selectedItem) {});
                });
            };

        }
    ]);
})(angular);