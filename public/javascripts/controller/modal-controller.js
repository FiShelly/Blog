/**
 * Created by FiShelly on 2016/10/29.
 */
/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.back.modal', [
        'ui.bootstrap',
    ]);

    module.controller('ModalInstanceCtrl',[
        '$scope',
        '$modalInstance',
        'obj',
        function ($scope, $modalInstance, obj) { //依赖于modalInstance
            $scope.obj = obj;
            console.log(obj);
            $scope.ok = function () {
                $modalInstance.close($scope.obj); //关闭并返回当前选项
            };
            $scope.cancel = function () {
                console.log($scope.obj);
                $modalInstance.dismiss('cancel'); // 退出
            }
        }]);
})(angular);