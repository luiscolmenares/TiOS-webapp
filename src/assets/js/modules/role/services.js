(function () {
    'use strict';
 
    angular
        .module('app')
        .factory('RoleService', RoleService);
 
    RoleService.$inject = ['$http', 'urls'];
    function RoleService($http, urls) {
        var service = {};
 
        service.GetAll = GetAll;
        //service.GetById = GetById;
        service.GetByUserId = GetByUserId;
        service.Create = Create;
        //service.Update = Update;
        //service.Delete = Delete;
 
        return service;
 
        function GetAll() {
            return $http.get(urls.BASE_API+'roles').then(handleSuccess, handleError('Error getting all roles'));
        }
 
        function GetByUserId(userId) {
           return $http.get(urls.BASE_API+'user/' + userId +'/role').then(handleSuccess, handleError('Error getting role by userid'));
        }
 
         function Create(role) {
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
             return $http.post(urls.BASE_API+'role/create', user, config).then(handleSuccess, handleError('Error creating role'));
         }
 
        //function Update(user) {
          //  return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        //}
 
        //function Delete(id) {
          //  return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        //}
 
        // private functions
 
        function handleSuccess(res) {
            //console.log('success!');
            return res.data;
        }
 
        function handleError(error) {
            //console.log('failed!');
            return function () {
                return { success: false, message: error };
            };
        }
    }
 
})();