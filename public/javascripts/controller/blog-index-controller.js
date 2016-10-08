/**
 * Created by FiShelly on 2016/10/4.
 */
(function (angular) {
    var module = angular.module('blog.index', [
        'ngRoute'
    ]);

    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        console.log('entern blog type controller route');
        $routeProvider.when('/index', {
            templateUrl: 'template/blog-index-template.html',
            controller: 'BlogIndexController'
        });
    }]);
    //控制器
    module.controller('BlogIndexController', [
        '$scope',
        '$route',
        '$routeParams',
        '$http',
        function ($scope, $route, $routeParams, $http) {
            console.log("enter BlogIndexController ~");
            $scope.types = [
                {name: 'type1', url: '#/type1'},
                {name: 'type2', url: '#/type2'},
                {name: 'type3', url: '#/type3'},
                {name: 'type4', url: '#/type4'},
                {name: 'type5', url: '#/type5'},
                {name: 'type6', url: '#/type6'},
                {name: 'type7', url: '#/type7'},
                {name: 'type8', url: '#/type8'}

            ];
            $scope.myself = {
                headImg: '/images/fish1.jpg',
                introduce: 'some of my message, introduce me.',
                follow: [{name: 'Github', url: 'https://github.com/FiShelly'}]
            };

            $scope.article = {
                title: '我是标题',
                abstract: '文章内容简介文章内容简介文章内容简介文章内容简介',
                type: {name: '我是分类', url: '#myType'},
                url: '#articleF',
                date: '2016-09-20',
                author: 'Fishelly.'
            };

            $scope.articleList = [
                {date: '2016-09-20', title: 'article1', url: '#article1'},
                {date: '2016-09-19', title: 'article2', url: '#article2'},
                {date: '2016-09-18', title: 'article3', url: '#article3'},
                {date: '2016-09-17', title: 'article4', url: '#article4'},
                {date: '2016-09-16', title: 'article5', url: '#article5'},
                {date: '2016-09-15', title: 'article6', url: '#article6'},
                {date: '2016-09-14', title: 'article7', url: '#article7'}
            ];
        }
    ]);
})(angular);