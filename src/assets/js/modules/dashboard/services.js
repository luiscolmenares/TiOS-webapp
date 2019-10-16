(function () {
    'use strict';

    angular
    .module('app')
    .factory('DashboardService', DashboardService);

    DashboardService.$inject = ['$http', 'urls'];
    function DashboardService($http, urls) {
        var service = {};

        service.GetAll = GetAll;
        service.GetDashboardsCount = GetDashboardsCount;
        service.GetById = GetById;
        service.GetPanelsType = GetPanelsType;
// service.Create = Create;
// service.Update = Update;
// //service.Delete = Delete;
// service.AttachOrganization = AttachOrganization;
// service.GetUserCountByProjectId = GetUserCountByProjectId;
// service.GetDatasourceCountByProjectId = GetDatasourceCountByProjectId;
// service.GetDatasourcesByProjectId = GetDatasourcesByProjectId;
// service.GetDashboardsByProjectId = GetDashboardsByProjectId;
// service.CreateDashboard = CreateDashboard;

return service;

function GetAll() {
    return $http.get(urls.BASE_API+'dashboards').then(handleSuccess, handleError('Error getting all dashboards'));
}

function GetDashboardsCount() {
            return $http.get(urls.BASE_API + 'dashboards/count').then(handleSuccess, handleError('Error counting dashboards'));
}

function GetById(id) {
    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    };
    return $http.get(urls.BASE_API+'dashboard/' + id).then(handleSuccess, handleError('Error getting dashboard by id'));
}

function GetPanelsType() {
    return $http.get(urls.BASE_API+'panels/type').then(handleSuccess, handleError('Error getting all panels type'));
}

// function GetUserCountByProjectId(projectId) {
//     var config = {
//         headers : {
//             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//         }
//     }
//     return $http.get(urls.BASE_API+'project/' + projectId + '/users/count', config).then(handleSuccess, handleError('Error getting project by id'));

// }

// function GetDatasourceCountByProjectId(projectId) {
//     var config = {
//         headers : {
//             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//         }
//     }
//     return $http.get(urls.BASE_API+'project/' + projectId + '/datasources/count', config).then(handleSuccess, handleError('Error getting project by id'));

// }

// function GetDatasourceCountByProjectId(projectId) {
//     var config = {
//         headers : {
//             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//         }
//     }
//     return $http.get(urls.BASE_API+'project/' + projectId + '/datasources/count', config).then(handleSuccess, handleError('Error getting project by id'));

// }

// function GetDashboardsByProjectId(projectId) {
//     var config = {
//         headers : {
//             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//         }
//     }
//     return $http.get(urls.BASE_API+'project/' + projectId+ '/dashboards', config).then(handleSuccess, handleError('Error getting dashboard by project by id'));

// }

// function GetDatasourcesByProjectId(projectId) {
//     var config = {
//         headers : {
//             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//         }
//     }
//     return $http.get(urls.BASE_API+'project/' + projectId + '/datasources', config).then(handleSuccess, handleError('Error getting project by id'));

// }

// function Create(project) {
//     var config = {
//         headers : {
//             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//         }
//     }
//     return $http.post(urls.BASE_API+'project/create', project, config).then(handleSuccess, handleError('Error creating project'));
// }

// function Update(project, projectId) {
//     var config = {
//         headers : {
//             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//         }
//     }
//    return $http.post(urls.BASE_API+'project/edit/' + projectId, project, config).then(handleSuccess, handleError('Error updating project'));
// }

// //function Delete(id) {
//   //  return $http.delete('/api/projects/' + id).then(handleSuccess, handleError('Error deleting project'));
// //}
// function AttachOrganization(projectId, organizationId) {
//     return $http.get(urls.BASE_API+'organization/'+organizationId+'/project/'+projectId).then(handleSuccess, handleError('Error attaching organization'));
// }

// function CreateDashboard(dasboard) {
//     var config = {
//         headers : {
//             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//         }
//     }
//     return $http.post(urls.BASE_API+'dashboard/create', dasboard, config).then(handleSuccess, handleError('Error creating dashboard'));
// }

// private functions

function handleSuccess(res) {
    console.log('success!');
    console.log(res);
    return res.data;
}

function handleError(error) {
    return function () {
        return { success: false, message: error };
    };
}
}

})();

