/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular,editormd) {
    var module = angular.module('blog.back.articleEdit', [
        'ngRoute',
        'ui.select'
    ]);

    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/back/article/edit/:id', {
            templateUrl: 'template/back-articleEdit-template.html',
            controller: 'BackArticleEditController'
        });
    }]);
    //控制器
    module.controller('BackArticleEditController', [
        '$scope',
        '$route',
        '$routeParams',
        '$http',
        '$filter',
        '$interval',
        '$location',
        '$rootScope',
        function ($scope, $route, $routeParams, $http,$filter,$interval,$location,$rootScope) {
            console.log("enter BackArticleEditController ~");
            var testEditor = editormd("test-editormd", {
                width: "100%",
                markdown: "",
                autoHeight: true,
                path: '/markdown/lib/',
                saveHTMLToTextarea: true,
                //dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为 true
                //dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为 true
                //dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为 true
                //dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为 0.1
                //dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为 #fff
                imageUpload: true,
                imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
                imageUploadURL: "/upload?test=dfdf",
                onload: function () {
                    this.setMarkdown($scope.article.articleMd);
                    var barHeight = document.querySelector('.editormd-toolbar-container').offsetHeight + 1;
                    document.querySelector('.CodeMirror').style.marginTop = barHeight + 'px';
                }
                /*
                 上传的后台只需要返回一个 JSON 数据，结构如下：
                 {
                 success : 0 | 1,           // 0 表示上传失败，1 表示上传成功
                 message : "提示的信息，上传成功或上传失败及错误信息等。",
                 url     : "图片地址"        // 上传成功时才返回
                 }
                 */
            });
            var queryPage = function () {
                $http.post('/typetag/page/1/1000000', {
                    type: null
                }).success(function (data, status, headers, config) {
                    console.log(data);
                    if (data.status == '0') {
                        console.log("page fialed");
                    } else {
                        $scope.data = data.typetags;
                    }
                }).error(function (data, status, headers, config) {
                    $scope.errorMsg = data.msg;
                    console.log("fail");
                });
            };
            queryPage();
            if($routeParams.id == 0){
                $scope.article = {date:$filter('date')(new Date(),'yyyy-MM-dd HH:mm')};
            }

            $interval(function(){
                $scope.article.date =  $filter('date')(new Date(),'yyyy-MM-dd HH:mm');
            },60000);

            $scope.delete = function(status){
                console.log($scope.article.id);
                if($scope.article.id){
                    $scope.updateStatus(status);
                    return;
                }
                $location.path('/back/article/list')
            };
            $scope.publish = function(status){
                if($scope.article.id){
                    $scope.updateStatus(status);
                    return;
                }
                $scope.article.status = status;
                $scope.article.articleHtml = testEditor.getHTML();
                $scope.article.articleMd = testEditor.getMarkdown();
                $scope.article.readCount = 0;
                $scope.article.commentCount = 0;

                $http.post('/article/save', {
                    article:$scope.article
                }).success(function (data, status, headers, config) {
                    console.log(data);
                    if (data.status == '0') {
                        console.log("page fialed");
                    } else {
                        $scope.article = data.article;
                        updateCount(data.article.type,true);
                        console.log($scope.article.tag[0].name);
                        for(var i = 0;i<$scope.article.tag.length;i++){
                            updateCount($scope.article.tag[i].name,false);
                        }
                    }
                }).error(function (data, status, headers, config) {
                    $scope.errorMsg = data.msg;
                    console.log("fail");
                });
                console.log($scope.article);
            };

            var updateCount = function(name,type){
                $http.post('/typetag/updateCount', {
                    name:name,
                    type:type
                }).success(function (data, status, headers, config) {
                    if (data.status == '0') {
                        console.log("page fialed");
                    } else {
                        console.log(data);
                    }
                }).error(function (data, status, headers, config) {
                    $scope.errorMsg = data.msg;
                    console.log("fail");
                });
                console.log($scope.article);
            };

            $scope.updateStatus = function(status){
                $scope.article.status = status;
                $scope.article.articleHtml = testEditor.getHTML();
                $scope.article.articleMd = testEditor.getMarkdown();
                console.log("updateStatus");
                console.log($scope.article.articleMd);
                $http.post('/article/update', {
                    article:$scope.article
                }).success(function (data, status, headers, config) {
                    console.log(data);
                    if (data.status == '0') {
                        console.log("page fialed");
                    } else {
                        $scope.article = data.article;
                    }
                }).error(function (data, status, headers, config) {
                    $scope.errorMsg = data.msg;
                    console.log("fail");
                });
                console.log($scope.article);
            };
        }
    ]);

})(angular,editormd);