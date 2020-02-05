(function () {
    'use strict';

    angular
            .module('app')
            .factory('DataanalyticsService', DataanalyticsService);

    DataanalyticsService.$inject = ['$http', 'urls'];
    function DataanalyticsService($http, urls) {
        var service = {};

        service.GetAll = GetAll;
        // service.getAllOrganizations = getAllOrganizations;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetSensorData = GetSensorData;
        service.GetLastSensorData = GetLastSensorData;
        service.GetDataanalyticsTypes = GetDataanalyticsTypes;
        service.GetDataanalyticsTypeById = GetDataanalyticsTypeById;
//service.GetDataanalyticsProtocolTypeById = GetDataanalyticsProtocolTypeById;
//service.GetDataanalyticsProtocolTypes = GetDataanalyticsProtocolTypes;
        service.AttachDatasource = AttachDatasource;
        service.getDataanalyticsValuesByDateRange = getDataanalyticsValuesByDateRange;
        //service.SetControlValue = SetControlValue;
        service.getAllOrganizations = getAllOrganizations;
        service.getProjectsNodes = getProjectsNodes;
        service.getSpacesNodes = getSpacesNodes;
        service.GetDatasourcesNodes = GetDatasourcesNodes;
        service.dataSourcesValues = dataSourcesValues;
        service.dataSourcesValuesByProject = dataSourcesValuesByProject;

        service.avgByOrganization =  avgByOrganization;
        service.minByOrganization =  minByOrganization;
        service.maxByOrganization =  maxByOrganization;
        service.countByOrganization =  countByOrganization;
        service.valuesByOrganization =  valuesByOrganization;
        service.monthValuesByOrganization =  monthValuesByOrganization;
        service.dayValuesByOrganization =  dayValuesByOrganization;
        service.minuteValuesByOrganization =  minuteValuesByOrganization;
        service.hourValuesByOrganization =  hourValuesByOrganization;
        service.avgByProject =  avgByProject;
        service.maxByProject =  maxByProject;
        service.minByProject =  minByProject;
        service.countByProject =  countByProject;
        service.valuesByProject =  valuesByProject;
        service.monthAvgValuesByProject =  monthAvgValuesByProject;
        service.dayAvgValuesByProject =  dayAvgValuesByProject;
        service.minuteAvgValuesByProject =  minuteAvgValuesByProject;
        service.hourAvgValuesByProject =  hourAvgValuesByProject;
        service.monthAvgValuesByDatasource =  monthAvgValuesByDatasource;
        service.dayAvgValuesByDatasource =  dayAvgValuesByDatasource;
        service.minuteAvgValuesByDatasource =  minuteAvgValuesByDatasource;
        service.projectsAvgByOrganizationId =  projectsAvgByOrganizationId;
        service.hourAvgValuesByDatasource =  hourAvgValuesByDatasource;
        service.monthValuesProjectsByOrgId =  monthValuesProjectsByOrgId;
        service.dayValuesProjectsByOrgId =  dayValuesProjectsByOrgId;
        service.hourValuesProjectsByOrgId =  hourValuesProjectsByOrgId;
        service.minuteValuesProjectsByOrgId =  minuteValuesProjectsByOrgId;
        service.spacesAvgByProjectId =  spacesAvgByProjectId;
        service.minuteSpacesAvgByProjectId =  minuteSpacesAvgByProjectId;
        service.hourSpacesAvgByProjectId =  hourSpacesAvgByProjectId;
        service.daySpacesAvgByProjectId =  daySpacesAvgByProjectId;
        service.monthSpacesAvgByProjectId =  monthSpacesAvgByProjectId;
        service.dayAvgDataourcesBySpaceId = dayAvgDataourcesBySpaceId;
        service.avgBySpaceId = avgBySpaceId;
        service.maxBySpaceId = maxBySpaceId;
        service.minBySpaceId = minBySpaceId;
        service.monthAvgDataourcesBySpaceId = monthAvgDataourcesBySpaceId;
        service.hourAvgDataourcesBySpaceId = hourAvgDataourcesBySpaceId;
        service.minuteAvgDataourcesBySpaceId = minuteAvgDataourcesBySpaceId;
        service.avgDataourcesBySpaceId = avgDataourcesBySpaceId;
        service.dataSourcesAvg = dataSourcesAvg;
        service.dataSourcesMax = dataSourcesMax;
        service.dataSourcesMin = dataSourcesMin;
        service.dataSourcesAvgByProject =  dataSourcesAvgByProject;
        service.dataSourcesMinByProject = dataSourcesMinByProject;
        service.dataSourcesMaxByProject = dataSourcesMaxByProject;

        return service;

        function GetAll(datasourceId) {
            return $http.get(urls.BASE_API + "Dataanalytics/datasource/" + datasourceId).then(handleSuccess, handleError('Error getting all Dataanalytics'));
        }

        function GetById(id) {
            return $http.get(urls.BASE_API + "Dataanalytics/" + id).then(handleSuccess, handleError('Error getting Dataanalytics by id'));
        }

        function Create(Dataanalytics) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'Dataanalytics/create', Dataanalytics, config).then(handleSuccess, handleError('Error creating Dataanalytics'));
        }

        function Update(Dataanalytics, DataanalyticsId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + "Dataanalytics/edit/" + DataanalyticsId, Dataanalytics, config).then(handleSuccess, handleError('Error updating Dataanalytics'));
        }

        function Delete(id) {
            return $http.delete(urls.BASE_API + "Dataanalytics/delete/" + id).then(handleSuccess, handleError('Error deleting Dataanalytics'));
        }

        function GetDataanalyticsTypes() {
            return $http.get(urls.BASE_API + 'Dataanalyticss/types').then(handleSuccess, handleError('Error getting all Dataanalytics types'));
        }

        function GetSensorData(type, unitid, address, ip, port) {
            return $http.get(urls.BASE_API + 'node-red/sensor-data/type/' + type + '/unitid/' + unitid + '/address/' + address + '/ip/' + ip + '/port/' + port).then(handleSuccess, handleError('Error getting all sensor data'));
        }
        function GetLastSensorData(address, ip, port, type, unitid) {
            return $http.get(urls.BASE_API + 'node-red/last-sensor-data/address/' + address + '/ip/' + ip + '/port/' + port + '/type/' + type + '/unitid/' + unitid).then(handleSuccess, handleError('Error getting last sensor data'));
        }
        function GetDataanalyticsTypeById(typeId) {
            return $http.get(urls.BASE_API + 'Dataanalytics/types/' + typeId).then(handleSuccess, handleError('Error getting Dataanalytics by Id'));
        }
        function GetDataanalyticsProtocolTypeById(protocolId) {
            return $http.get(urls.BASE_API + 'Dataanalytics/protocols/' + protocolId).then(handleSuccess, handleError('Error getting Dataanalytics protocol by Id'));
        }
        function GetDataanalyticsProtocolTypes() {
            return $http.get(urls.BASE_API + 'Dataanalytics/protocols').then(handleSuccess, handleError('Error getting all Dataanalytics protocol types'));
        }

        function AttachDatasource(DataanalyticsId, datasourceId) {
            return $http.get(urls.BASE_API + 'Dataanalytics/' + DataanalyticsId + '/datasource/' + datasourceId).then(handleSuccess, handleError('Error attaching datasource'));
        }

         function getDataanalyticsValuesByDateRange(DataanalyticsId, fromdate, todate) {
            return $http.get(urls.BASE_API + 'Dataanalytics/' + DataanalyticsId + '/fromdate/' + fromdate + '/todate/' + todate).then(handleSuccess, handleError('Error getting Dataanalytics values datasource'));
        }


        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }

        function getAllOrganizations() {
            return $http.get(urls.BASE_API + 'organizations').then(handleSuccess, handleError('Error getting all organizations'));
        }
    
        function getProjectsNodes(organizationId) {
            var config = {
                headers: {
                    'Content-Type': 'json'
                }
            };
            return $http.get(urls.BASE_API + 'organization/' + organizationId + '/projects', config).then(handleSuccess, handleError('Error getting projects by org id count'));
        }
    
        function GetDatasourcesNodes(projectId) {
            return $http.get(urls.BASE_API + 'project/' + projectId + '/datasources').then(handleSuccess, handleError('Error getting all datasources'));
        }
        
        function getSpacesNodes(projectId) {
            return $http.get(urls.BASE_API + 'project/'+projectId+'/spaces').then(handleSuccess, handleError('Error getting spaces by projectid'));
        }

        function dataSourcesAvg(dataSourceId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'datasource/' + dataSourceId + '/analytics/average', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dataSourcesMax(dataSourceId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'datasource/' + dataSourceId + '/analytics/max', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dataSourcesMin(dataSourceId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'datasource/' + dataSourceId + '/analytics/min', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dataSourcesCount(dataSourceId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'datasource/' + dataSourceId + '/analytics/Count', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dataSourcesValues(dataSourceId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'datasource/' + dataSourceId + '/analytics/values', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dataSourcesAvgByProject(projectId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/json;'
                }
            };

            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/average', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dataSourcesMaxByProject(projectId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/json;'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/max', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dataSourcesMinByProject(projectId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/json;'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/min', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dataSourcesCountByProject(projectId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/count', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dataSourcesValuesByProject(projectId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/values', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function avgByOrganization(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json;'
                }
            };
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/average', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function minByOrganization(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/min', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function maxByOrganization(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json;'
                }
            };
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/max', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function countByOrganization(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/count', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function valuesByOrganization(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/values', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function monthValuesByOrganization(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json;'
                }
            };
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/values/month', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dayValuesByOrganization(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/values/day', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function minuteValuesByOrganization(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json;'
                }
            };
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/values/minute', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function hourValuesByOrganization(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/values/hour', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function avgByProject(projectId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/json;'
                }
            };

            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/average', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function maxByProject(projectId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/json;'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/max', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function minByProject(projectId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/json;'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/min', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function countByProject(projectId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/json;'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/count', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function valuesByProject(projectId, dataValues) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/values', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function monthAvgValuesByProject(projectId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/values/average/month', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dayAvgValuesByProject(projectId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/values/average/day', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function minuteAvgValuesByProject(projectId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/values/average/minute', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function hourAvgValuesByProject(projectId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/values/average/hour', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function monthAvgValuesByDatasource(datasourceId, dataValues) {

            var config = { 
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'datasource/' + datasourceId + '/analytics/values/average/month', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dayAvgValuesByDatasource(datasourceId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'datasource/' + datasourceId + '/analytics/values/average/day', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function minuteAvgValuesByDatasource(datasourceId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'datasource/' + datasourceId + '/analytics/values/average/minute', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function hourAvgValuesByDatasource(datasourceId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'datasource/' + datasourceId + '/analytics/values/average/hour', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function projectsAvgByOrganizationId(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/average/projects', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function monthValuesProjectsByOrgId(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/values/month/projects', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dayValuesProjectsByOrgId(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/values/day/projects', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function hourValuesProjectsByOrgId(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/values/hour/projects', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function minuteValuesProjectsByOrgId(organizationId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            return $http.post(urls.BASE_API + 'organization/' + organizationId + '/analytics/values/minute/projects', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function spacesAvgByProjectId(projectId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/average/spaces', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function minuteSpacesAvgByProjectId(projectId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/values/average/minute/spaces', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function hourSpacesAvgByProjectId(projectId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/values/average/hour/spaces', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function daySpacesAvgByProjectId(projectId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/values/average/day/spaces', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function monthSpacesAvgByProjectId(projectId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'project/' + projectId + '/analytics/values/average/month/spaces', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function minuteAvgDataourcesBySpaceId(spaceId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'space/' + spaceId + '/analytics/values/average/minute/datasources', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function hourAvgDataourcesBySpaceId(spaceId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'space/' + spaceId + '/analytics/values/average/hour/datasources', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function dayAvgDataourcesBySpaceId(spaceId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'space/' + spaceId + '/analytics/values/average/day/datasources', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function monthAvgDataourcesBySpaceId(spaceId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http.post(urls.BASE_API + 'space/' + spaceId + '/analytics/values/average/month/datasources', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function avgDataourcesBySpaceId(spaceId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }; 
            return $http.post(urls.BASE_API + 'space/' + spaceId + '/analytics/average/datasources', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function maxBySpaceId(spaceId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }; 
            return $http.post(urls.BASE_API + 'space/' + spaceId + '/analytics/max/datasources', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function avgBySpaceId(spaceId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }; 
            return $http.post(urls.BASE_API + 'space/' + spaceId + '/analytics/average/datasources', dataValues, config).then(handleSuccess, handleError('error'));
        }

        function minBySpaceId(spaceId, dataValues) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }; 
            return $http.post(urls.BASE_API + 'space/' + spaceId + '/analytics/min/datasources', dataValues, config).then(handleSuccess, handleError('error'));
        }
    };
})();
