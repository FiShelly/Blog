/**
 * Created by FiShelly on 2016/10/29.
 */
'use strict';

(function(angular) {
    // ����Ĭ��angular�ṩ���첽�������֧���Զ���ص�������
    // angular�������Ļص��������Ʋ�������֧��
    var modal = angular.module('blog.service.modal', []);
    modal.service('ModalService', ['$modal', function($modal) {
        // url : http://api.douban.com/vsdfsdf -> <script> -> html�Ϳ��Զ�ִ��
        this.open = function(url,controller,size,init){
             return $modal.open({
                templateUrl: url,  //ָ�����洴������ͼ
                controller: controller,// ��ʼ��ģ̬��Χ
                size: size, //��С����
                 resolve: {
                     obj: init
                 }
            });
        };

    }]);
})(angular);
