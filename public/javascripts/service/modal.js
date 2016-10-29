/**
 * Created by FiShelly on 2016/10/29.
 */
'use strict';

(function(angular) {
    // 由于默认angular提供的异步请求对象不支持自定义回调函数名
    // angular随机分配的回调函数名称不被豆瓣支持
    var modal = angular.module('blog.service.modal', []);
    modal.service('ModalService', ['$modal', function($modal) {
        // url : http://api.douban.com/vsdfsdf -> <script> -> html就可自动执行
        this.open = function(url,controller,size,init){
             return $modal.open({
                templateUrl: url,  //指向上面创建的视图
                controller: controller,// 初始化模态范围
                size: size, //大小配置
                 resolve: {
                     obj: init
                 }
            });
        };

    }]);
})(angular);
