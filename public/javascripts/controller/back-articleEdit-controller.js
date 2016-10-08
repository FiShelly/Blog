/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular,editormd) {
    var module = angular.module('blog.back.articleEdit', [
        'ngRoute'
    ]);

    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/back/article/edit', {
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
        function ($scope, $route, $routeParams, $http) {
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
        }
    ]);

})(angular,editormd);