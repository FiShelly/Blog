/**
 * Created by FiShelly on 2016/10/29.
 */
'use strict';

(function(angular) {
    var modal = angular.module('blog.service.modal', []);
    modal.service('ModalService', ['$modal', function($modal) {
        this.open = function(url,controller,size,init){
             return $modal.open({
                templateUrl: url,
                controller: controller,
                size: size,
                 resolve: {
                     obj: init
                 }
            });
        };

    }]);
})(angular);
