(function () {
    'use strict';

    angular.module('app')
            .factory('ProjectService', ProjectService);

    ProjectService.$inject = ['$http', 'urls'];
    function ProjectService($http, urls) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetProjectsCount = GetProjectsCount;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.AttachOrganization = AttachOrganization;
        service.GetUserCountByProjectId = GetUserCountByProjectId;
        service.GetUsersByOrganizationId = GetUsersByOrganizationId;
        service.GetUserCountByOrganizationId = GetUserCountByOrganizationId;
        service.GetProjectCountByOrganizationId = GetProjectCountByOrganizationId;
        service.GetProjectsByOrganizationId = GetProjectsByOrganizationId;
        service.GetSpacesCountByProjectId = GetSpacesCountByProjectId;
        service.GetDatasourceCountByProjectId = GetDatasourceCountByProjectId;
        service.GetActiveDatasourcesByProjectId = GetActiveDatasourcesByProjectId;
        service.GetDatasourcesByProjectId = GetDatasourcesByProjectId;
        service.GetUsersByProjectId = GetUsersByProjectId;
        service.GetDashboardsByProjectId = GetDashboardsByProjectId;
        service.GetDatapointsByDatasourceId = GetDatapointsByDatasourceId;
        service.GetDashboardCountByProjectId = GetDashboardCountByProjectId;
        service.GetDashboardCountByOrganizationId = GetDashboardCountByOrganizationId;
        service.GetTriggersCountByOrganizationId = GetTriggersCountByOrganizationId;
        service.GetTriggerCountByProjectId = GetTriggerCountByProjectId;
        service.AddUserToProject = AddUserToProject;
        service.CreateDashboard = CreateDashboard;
        service.DeleteDashboard = DeleteDashboard;
        service.CreatePanel = CreatePanel;
        service.GetPanelById = GetPanelById;
        service.DeletePanel = DeletePanel;
        service.GetPanelsByDashboardId = GetPanelsByDashboardId;
        service.GetSensorByPanel = GetSensorByPanel;
        service.ThingDiscreteStatus = ThingDiscreteStatus;
        service.ThingDiscreteStatusApi = ThingDiscreteStatusApi;
        service.RemoveUserFromProject = RemoveUserFromProject;
        service.CreateMobileNotification = CreateMobileNotification;
        service.CreateDatasourceSensorData = CreateDatasourceSensorData;
        service.GetDatasourceDetails = GetDatasourceDetails

        return service;

        function GetAll() {
            return $http.get(urls.BASE_API + 'projects').then(handleSuccess, handleError('Error getting all projects'));
        }

        function GetById(id) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'project/' + id).then(handleSuccess, handleError('Error getting project by id'));
        }

        function GetProjectsCount() {
            return $http.get(urls.BASE_API + 'projects/count').then(handleSuccess, handleError('Error counting projects'));
        }

        function GetUserCountByProjectId(projectId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'project/' + projectId + '/users/count', config).then(handleSuccess, handleError('Error getting users count'));

        }

        function GetUsersByOrganizationId(organizationId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'organization/' + organizationId + '/users', config).then(handleSuccess, handleError('Error getting users'));

        }

        function GetUserCountByOrganizationId(organizationId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'organization/' + organizationId + '/users/count', config).then(handleSuccess, handleError('Error getting users count'));

        }

        function GetProjectsByOrganizationId(organizationId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'organization/' + organizationId + '/projects', config).then(handleSuccess, handleError('Error getting projects by org id count'));

        }

        function GetProjectCountByOrganizationId(organizationId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'organization/' + organizationId + '/projects/count', config).then(handleSuccess, handleError('Error getting projects count by org id'));

        }


        function GetSpacesCountByProjectId(projectId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'project/' + projectId + '/spaces/count', config).then(handleSuccess, handleError('Error getting spaces count by id'));

        }

        function GetDatasourceCountByProjectId(projectId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'project/' + projectId + '/datasources/count', config).then(handleSuccess, handleError('Error getting project by id'));

        }

        function GetDashboardCountByProjectId(projectId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'project/' + projectId + '/dashboards/count', config).then(handleSuccess, handleError('Error getting dashboard count by id'));

        }

        function GetDashboardCountByOrganizationId(organizationId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'organization/' + organizationId + '/dashboards/count', config).then(handleSuccess, handleError('Error getting dashboard count by organization id'));

        }

        function GetTriggersCountByOrganizationId(organizationId){
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'organization/' + organizationId + '/triggers/count', config).then(handleSuccess, handleError('Error getting trigger count by organization id'));

        }

        function GetTriggerCountByProjectId(projectId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'project/' + projectId + '/trigger/count', config).then(handleSuccess, handleError('Error getting trigger count by id'));

        }

        function GetDashboardsByProjectId(projectId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'project/' + projectId + '/dashboards', config).then(handleSuccess, handleError('Error getting dashboard by project by id'));

        }


        function GetDatasourcesByProjectId(projectId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'project/' + projectId + '/datasources', config).then(handleSuccess, handleError('Error getting project by id'));

        }

        function GetActiveDatasourcesByProjectId(projectId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'project/' + projectId + '/datasources/actives', config).then(handleSuccess, handleError('Error getting project by id'));

        }


        function GetDatapointsByDatasourceId(datasourceId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'datasource/' + datasourceId + '/datapoints', config).then(handleSuccess, handleError('Error getting project by id'));

        }

        function GetPanelsByDashboardId(dashboardId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'dashboard/' + dashboardId + '/panels', config).then(handleSuccess, handleError('Error getting panels by dashboard id'));

        }

        function GetUsersByProjectId(projectId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'project/' + projectId + '/users', config).then(handleSuccess, handleError('Error getting users by project id'));

        }

        function GetSensorByPanel(panel) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'node-red/sensor-data/address/' + panel.address + '/ip/' + panel.ip + '/port/' + panel.port + '/type/' + panel.type + '/unitid/' + panel.unitid, config).then(handleSuccess, handleError('Error getting project by id'));

        }

        function Create(project) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'project/create', project, config).then(handleSuccess, handleError('Error creating project'));
        }

        function Update(project, projectId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'project/edit/' + projectId, project, config).then(handleSuccess, handleError('Error updating project'));
        }

        function Delete(id) {
            return $http.delete(urls.BASE_API + 'project/delete/' + id).then(handleSuccess, handleError('Error deleting project'));
        }
        function AttachOrganization(projectId, organizationId) {
            return $http.get(urls.BASE_API + 'organization/' + organizationId + '/project/' + projectId).then(handleSuccess, handleError('Error attaching organization'));
        }

        function AddUserToProject(userId, projectId) {
            return $http.get(urls.BASE_API + 'user/' + userId + '/project/' + projectId).then(handleSuccess, handleError('Error attaching user'));
        }

        function CreateDashboard(dashboard) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'dashboard/create', dashboard, config).then(handleSuccess, handleError('Error creating dashboard'));
        }

        function DeleteDashboard(id) {
            return $http.delete(urls.BASE_API + 'dashboard/delete/' + id).then(handleSuccess, handleError('Error deleting dashboard'));
        }

        function CreatePanel(panel) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            // console.log(panel);
            return $http.post(urls.BASE_API + 'panel/create', panel, config).then(handleSuccess, handleError('Error creating panel'));
        }

        function GetPanelById(panelid) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'panel/' + panelid).then(handleSuccess, handleError('Error getting panel by id'));
        }


        function DeletePanel(id) {
            return $http.delete(urls.BASE_API + 'panel/delete/' + id).then(handleSuccess, handleError('Error deleting panel'));
        }

        function ThingDiscreteStatus(broker, topic, value) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            //return $http.get(urls.BASE_NR + 'thingstatus?topic='+ topic + '&value=' + value, config).then(handleSuccess, handleError('Error sending request to API'));
            return $http.get(broker + '/thingstatus?topic='+ topic + '&value=' + value, config).then(handleSuccess, handleError('Error sending request to API'));
        }

        function ThingDiscreteStatusApi(thing) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'thingstatus', thing, config).then(handleSuccess, handleError('Error creating thing status'));
        
            //return $http.get(urls.BASE_NR + 'thingstatus?topic='+ topic + '&value=' + value, config).then(handleSuccess, handleError('Error sending request to API'));
            // return $http.get(broker + '/thingstatus?topic='+ topic + '&value=' + value, config).then(handleSuccess, handleError('Error sending request to API'));
        }

        function RemoveUserFromProject (userId, projectId){
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'remove/user/' + userId + '/project/' + projectId, config).then(handleSuccess, handleError('Error sending request to API'));

        }

        function CreateMobileNotification(mobilenotification) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'mobile/notification/create', mobilenotification, config).then(handleSuccess, handleError('Error creating mobilenotification'));
        }

        function CreateDatasourceSensorData(sensordata) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'datasourcesensordata/create', sensordata, config).then(handleSuccess, handleError('Error creating sensordata'));
        }

// private functions

        function handleSuccess(res) {
            console.log('success!');
            console.log(res);
            return res.data;
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }

        function GetDatasourceDetails(projectId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.get(urls.BASE_API + 'project/' + projectId + '/hp/datasources', config).then(handleSuccess, handleError('Error getting dashboard count by id'));

        }
    }

})();

// Create and register the new "projects" service
App.factory('projects', ['$http', 'urls', function ($http, urls) {

        return {
            fetchProjects: function (callback) {
                $http.get(urls.BASE_API + "projects")
                        .then(function (response) {
                            console.log('fetching projects');
                            console.log(response);
                            callback(response.data.projects);
                        });

            }
        };
    }]);

App.factory('urlBuilder', function ($httpParamSerializer) {
    function buildUrl(url, params) {
        var serializedParams = $httpParamSerializer(params);
        var res = serializedParams.replace(/&/g, "/");
        res = res.replace(/=/g, "/");
        if (serializedParams.length > 0) {
            url += ((url.indexOf('?') === -1) ? '/' : '&') + res;
        }

        return url;
    }

    return buildUrl;
});
