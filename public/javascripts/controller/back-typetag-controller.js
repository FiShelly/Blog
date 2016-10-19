/**
 * Created by FiShelly on 2016/10/5.
 */
(function (angular) {
    var module = angular.module('blog.back.typetag', [
        'ngRoute',
        'ui.bootstrap'
    ]);
    // 配置模块的路由
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/back/type/:page/:size', {
            templateUrl: 'template/back-type-template.html',
            controller: 'BackTypetagController'
        }).when('/back/tag/:page/:size', {
            templateUrl: 'template/back-tag-template.html',
            controller: 'BackTypetagController'
        });
    }]);
    //控制器
    module.controller('BackTypetagController', [
        '$scope',
        '$route',
        '$routeParams',
        '$http',
        '$modal',
        function ($scope, $route, $routeParams, $http,$modal) {
            console.log("enter BackTypetagController ~");
            $scope.obj = {name:"",id:"",type:true,isUpdate:false};
            $scope.open = function (size,flag,isUpdate,name,id) {  //打开模态
                var modalInstance = $modal.open({
                    templateUrl: '/template/modal-type-tag.html',  //指向上面创建的视图
                    controller: 'ModalInstanceCtrl',// 初始化模态范围
                    size: size, //大小配置
                    resolve: {
                        obj: function () {
                            $scope.obj.type = flag;
                            $scope.obj.isUpdate = isUpdate;
                            if(name){
                                $scope.obj.name=name;
                                $scope.obj.id=id;
                            }
                            return  $scope.obj;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    console.log(selectedItem);
                    var url = '/typetag/save';
                    if(selectedItem.isUpdate){
                        url = '/typetag/updateName'
                    }
                    $http.post(url,{
                        typetag:selectedItem
                    }).success(function(data,status,headers,config){
                        console.log(data);
                        if(data.status == '0'){
                            console.log("save fialed");
                        } else {
                            $route.reload();
                        }
                    }).error(function(data,status,headers,config){
                        $scope.errorMsg = data.msg;
                        console.log("fail");
                    });
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };

            $scope.page = [];
            $scope.curPage =  parseInt($routeParams.page);
            $scope.lineSize = parseInt($routeParams.size);


            $http.post('/typetag/page/'+$scope.curPage + "/" +$scope.lineSize ,{
                type:$scope.obj.type
            }).success(function(data,status,headers,config){
                console.log(data);
                if(data.status == '0'){
                    console.log("page fialed");
                } else {
                    $scope.typetags = data.typetags;
                    for(var i = 1;i<=data.size;i++){
                        $scope.page.push(i);
                    }
                }
            }).error(function(data,status,headers,config){
                $scope.errorMsg = data.msg;
                console.log("fail");
            });

            $scope.delete = function(id){
                $http.post('/typetag/delete' ,{
                    id:id
                }).success(function(data,status,headers,config){
                    console.log(data);
                    if(data.status == '0'){
                        console.log("delete fialed");
                    } else {
                        $route.reload();
                    }
                }).error(function(data,status,headers,config){
                    $scope.errorMsg = data.msg;
                    console.log("fail");
                });
            };

            $scope.go = function(page){
                console.log("=====================================pages");
                console.log(page);
                console.log("=====================================pagee");
                if (page >= 1 && page <= $scope.page.length){
                    console.log(123);
                    $route.updateParams({ page: page,size:$scope.lineSize });
                }
            }
        }
    ]);

    module.controller('ModalInstanceCtrl', function ($scope, $modalInstance, obj) { //依赖于modalInstance
        $scope.obj = obj;

        $scope.ok = function () {
            $modalInstance.close($scope.obj); //关闭并返回当前选项
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel'); // 退出
        }
    });
})(angular);