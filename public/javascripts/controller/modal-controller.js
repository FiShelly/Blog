/**
 * Created by FiShelly on 2016/10/29.
 */
/**
 * Created by FiShelly on 2016/10/5.
 */
    require('../angular.min');
    require('../ui-bootstrap-tpls');
    var moduleModal = angular.module('blog.back.modal', [
        'ui.bootstrap',
    ]);

    moduleModal.controller('ModalInstanceCtrl',[
        '$scope',
        '$modalInstance',
        'obj',
        function ($scope, $modalInstance, obj) { //依赖于modalInstance
            $scope.obj = obj;
            $scope.ok = function () {
                $modalInstance.close($scope.obj); //关闭并返回当前选项
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel'); // 退出
            }
        }]);

    module.exports = moduleModal;