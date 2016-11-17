/**
 * Created by FiShelly on 2016/11/7.
 */
    require('../angular.min');
    require('../angular-route.min');
    require('../angular-animate.min');
    require('../service/http');
    require('../service/modal');
    require('./modal-controller');
    require('./blog-type-controller');
    require('./blog-index-controller');
    require('./blog-article-controller');
    require('./back-typetag-controller');
    require('./back-personal-controller');
    require('./back-login-controller');
    require('./back-comment-controller');
    require('./back-articleList-controller');
    require('./back-articleEdit-controller');

    require('../../stylesheets/blog-index.css');
    require('../../stylesheets/login.css');
    require('../../stylesheets/select.min.css');



    var app = angular.module('BlogIndexApp', [
        'ngRoute',
        'ngAnimate',
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
    module.exports = app;