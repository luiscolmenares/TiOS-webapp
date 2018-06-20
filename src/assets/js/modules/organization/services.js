(function () {
    'use strict';

    angular
            .module('app')
            .factory('OrganizationService', OrganizationService);

    OrganizationService.$inject = ['$http', 'urls'];
    function OrganizationService($http, urls) {
        var service = {};

        service.GetAll = GetAll;
        service.GetOrganizationsCount = GetOrganizationsCount;
        service.GetById = GetById;
        service.GetByUserId = GetByUserId;
        service.GetByProjectId = GetByProjectId;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetOrganizationsProjectsDashboards = GetOrganizationsProjectsDashboards;

        return service;

        function GetAll() {
            return $http.get(urls.BASE_API + 'organizations').then(handleSuccess, handleError('Error getting all organizations'));
        }

        function GetOrganizationsCount() {
            return $http.get(urls.BASE_API + 'organizations/count').then(handleSuccess, handleError('Error counting organizations'));
        }

        function GetById(id) {
            return $http.get(urls.BASE_API + 'organization/' + id).then(handleSuccess, handleError('Error getting organization by id'));
        }

        function GetByUserId(userId) {
            return $http.get(urls.BASE_API + 'user/' + userId + '/organization').then(handleSuccess, handleError('Error getting organization by userid'));
        }

        function GetByProjectId(projectId) {
            return $http.get(urls.BASE_API + 'project/' + projectId + '/organization').then(handleSuccess, handleError('Error getting organization by projectId'));
        }

        function Create(organization) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'organization/create', organization, config).then(handleSuccess, handleError('Error creating organization'));
        }

        function Update(organization, organizatiodid) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'organization/edit/' + organizatiodid, organization, config).then(handleSuccess, handleError('Error updating organization'));
        }

        function Delete(id) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.delete(urls.BASE_API + 'organization/delete/' + id, config).then(handleSuccess, handleError('Error deleting organization'));
        }

        function GetOrganizationsProjectsDashboards() {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'organizations/projects/dashboards', config).then(handleSuccess, handleError('Error getting org, projects, dashboards'));

        }

// private functions

        function handleSuccess(res) {
            console.log('Success');
            console.log(res.data);
            return res.data;
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }
    }

})();

// Create and register the new "organizations" service
App.factory('organizations', ['$http', 'urls', function ($http, urls) {

        return {
            fetchOrganizations: function (callback) {
                $http.get(urls.BASE_API + "organizations")
                        .then(function (response) {
                            console.log('fetching organization');
                            console.log(response);
                            callback(response.data.organizations);
                        });

            }
        };
    }]);