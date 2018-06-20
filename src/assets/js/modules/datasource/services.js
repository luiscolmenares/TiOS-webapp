(function () {
    'use strict';

    angular
            .module('app')
            .factory('DatasourceService', DatasourceService);

    DatasourceService.$inject = ['$http', 'urls'];
    function DatasourceService($http, urls) {
        var service = {};

//service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetDatapointsByDatasourceId = GetDatapointsByDatasourceId;
        service.GetDatasourcesByProjectId = GetDatasourcesByProjectId;
        service.GetDatasourceTypes = GetDatasourceTypes;
        service.GetDatasourceTypeById = GetDatasourceTypeById;
        service.GetDatasourceProtocolTypeById = GetDatasourceProtocolTypeById;
        service.GetDatasourceProtocolTypes = GetDatasourceProtocolTypes;
        service.AttachProject = AttachProject;

        return service;

// function GetAll() {
//     return $http.get('http://api.dev/api/organizations').then(handleSuccess, handleError('Error getting all organizations'));
// }

        function GetById(id) {
            return $http.get(urls.BASE_API + 'datasource/' + id).then(handleSuccess, handleError('Error getting organization by id'));
        }

        function Create(datasource) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'datasource/create', datasource, config).then(handleSuccess, handleError('Error creating datasource'));
        }

        function Update(datasource, datasource_id) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'datasource/edit/' + datasource_id, datasource, config).then(handleSuccess, handleError('Error updating organization'));
        }

        function Delete(id) {
            return $http.delete(urls.BASE_API + 'datasource/delete/' + id).then(handleSuccess, handleError('Error deleting organization'));
        }
        function GetDatasourcesByProjectId(projectId) {
            return $http.get(urls.BASE_API + 'project/' + projectId + '/datasources').then(handleSuccess, handleError('Error getting all datasources'));
        }
        function GetDatapointsByDatasourceId(datasourceId) {
            return $http.get(urls.BASE_API + 'datasource/' + datasourceId + '/datapoints').then(handleSuccess, handleError('Error getting all datapoints'));
        }
        function GetDatasourceTypes() {
            return $http.get(urls.BASE_API + 'datasources/type').then(handleSuccess, handleError('Error getting all datasource types'));
        }
        function GetDatasourceTypeById(typeId) {
            return $http.get(urls.BASE_API + 'datasource/types/' + typeId).then(handleSuccess, handleError('Error getting datasource by Id'));
        }
        function GetDatasourceProtocolTypeById(protocolId) {
            return $http.get(urls.BASE_API + 'datasource/protocols/' + protocolId).then(handleSuccess, handleError('Error getting datasource protocol by Id'));
        }
        function GetDatasourceProtocolTypes() {
            return $http.get(urls.BASE_API + 'datasource/protocols').then(handleSuccess, handleError('Error getting all datasource protocol types'));
        }

        function AttachProject(datasourceId, projectId) {
            return $http.get(urls.BASE_API + 'datasource/' + datasourceId + '/project/' + projectId).then(handleSuccess, handleError('Error attaching project'));
        }

// private functions

        function handleSuccess(res) {
            console.log('success');
            return res.data;
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }
    }

})();
// // Create and register the new "projects" service
// App.factory('datasourcetype', ['$http', 'urls', function($http, urls){

//   return {
//     fetchDatasourceTypes: function(callback){
// $http.get(urls.BASE_API+"datasource/types")
//         .then(function (response) {
//             console.log('fetching datasourcetypes');
//           console.log(response);
//           callback(response.data.datasourcetypes);
//         });

//         }
//     }
//   }]);