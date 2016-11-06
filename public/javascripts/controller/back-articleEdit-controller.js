/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular,editormd) {
    var module = angular.module('blog.back.articleEdit', [
        'ngRoute',
        'ui.select',
        'blog.service.http',
        'blog.service.modal'
    ]);

    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/back/article/edit/:id/:status', {
            templateUrl: 'template/back-articleEdit-template.html',
            controller: 'BackArticleEditController'
        });
    }]);
    //控制器
    module.controller('BackArticleEditController', [
        '$rootScope',
        '$scope',
        '$route',
        '$routeParams',
        '$filter',
        '$interval',
        '$location',
        'HttpService',
        'ModalService',
        function ($rootScope,$scope, $route, $routeParams,$filter,$interval,$location,HttpService,ModalService) {
            if(!sessionStorage.getItem("user")){
                $location.path("/login/-1");
            } else {
                $scope.isLogin = true;
            }
            var testEditor = editormd("test-editormd", {
                width: "100%",
                height: 740,
                path: '/markdown/lib/',
                theme : "dark",
                previewTheme : "dark",
                editorTheme : "pastel-on-dark",
                markdown : '',
                autoFocus:false,
                codeFold : true,
                //syncScrolling : false,
                saveHTMLToTextarea : true,    // 保存 HTML 到 Textarea
                searchReplace : true,
                //watch : false,                // 关闭实时预览
                htmlDecode : "style,script,iframe|on*",            // 开启 HTML 标签解析，为了安全性，默认不开启
                //toolbar  : false,             //关闭工具栏
                //previewCodeHighlight : false, // 关闭预览 HTML 的代码块高亮，默认开启
                emoji : true,
                taskList : true,
                tocm            : true,         // Using [TOCM]
                tex : true,                   // 开启科学公式TeX语言支持，默认关闭
                flowChart : true,             // 开启流程图支持，默认关闭
                sequenceDiagram : true,       // 开启时序/序列图支持，默认关闭,
                //dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
                //dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
                //dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
                //dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
                //dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
                imageUpload : true,
                imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
                imageUploadURL : "./blog/uploadBlogImg",
                onload : function() {
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
                HttpService.ajax('/typetag/page/1/1000000',{type: null},function(data){
                    if(data){
                        $scope.data = data.typetags;
                    }
                });
            };
            $scope.tip = function (data, size) {
                var obj = function () {
                    return data;
                };
                ModalService.open('/template/modal-tip-msg.html', 'ModalInstanceCtrl', size, obj);
            };
            if($scope.article || $routeParams.id == 0){
                $rootScope.isReady = false;
                queryPage();
            } else {
                $rootScope.isReady = true;
                HttpService.ajax('/article/getById/'+$routeParams.id+'/'+$routeParams.status,{},function(data){
                    if(data){
                        $scope.article = data.article;
                        $rootScope.isReady = false;
                        queryPage();
                    }

                });
            }

            if($routeParams.id == 0){
                $scope.article = {date:$filter('date')(new Date(),'yyyy-MM-dd HH:mm')};
            }
            $interval(function(){
                $scope.article.date =  $filter('date')(new Date(),'yyyy-MM-dd HH:mm');
            },60000);

            $scope.delete = function(status){
                $rootScope.isReady = true;
                if($scope.article.id){
                    $scope.updateStatus(status);
                    return;
                }
                $location.path('/back/article/list');
                $rootScope.isReady = false;
            };
            $scope.publish = function(status){
                $rootScope.isReady = true;
                console.log($scope.article.id+"====");
                if($scope.article.id){
                    $scope.updateStatus(status);
                    return;
                }
                $scope.article.status = status;
                $scope.article.articleHtml = testEditor.getHTML();
                $scope.article.articleMd = testEditor.getMarkdown();
                $scope.article.readCount = 0;
                $scope.article.commentCount = 0;
                HttpService.ajax('/article/save',{ article:$scope.article},function(data){
                    if(data){
                        $scope.article = data.article;
                        updateCount(data.article.type,true);
                        for(var i = 0;i<$scope.article.tag.length;i++){
                            updateCount($scope.article.tag[i].name,false);
                        }
                        $scope.tip(data, 'md');
                        testEditor.previewing();
                    }
                    $rootScope.isReady = false;
                });
            };

            var updateCount = function(name,type){
                HttpService.ajax('/typetag/updateCount',{  name:name,type:type},function(data){});
            };

            $scope.updateStatus = function(status){
                $scope.article.status = status;
                $scope.article.articleHtml = testEditor.getHTML();
                $scope.article.articleMd = testEditor.getMarkdown();
                HttpService.ajax('/article/update',{ article:$scope.article},function(data){
                    $scope.article = data.article;
                    $scope.tip(data, 'md');
                    testEditor.previewing();
                    $rootScope.isReady = false;
                });

            };
        }
    ]);

})(angular,editormd);