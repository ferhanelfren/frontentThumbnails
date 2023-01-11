
var app = angular.module("app-upload-script", ['ngSanitize', 'ngAnimate', 'ngTouch']);

app.controller("appUploadController", function ($scope, $http, $timeout, $window, $filter, dateFilter)
{
    var vm = this;

    vm.openFromLeft = function () {
        alert('HI');
    }
    
});