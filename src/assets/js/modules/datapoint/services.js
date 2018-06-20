(function () {
    'use strict';

    angular
            .module('app')
            .factory('DatapointService', DatapointService);

    DatapointService.$inject = ['$http', 'urls'];
    function DatapointService($http, urls) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetSensorData = GetSensorData;
        service.GetLastSensorData = GetLastSensorData;
        service.GetDatapointTypes = GetDatapointTypes;
        service.GetDatapointTypeById = GetDatapointTypeById;
//service.GetDatapointProtocolTypeById = GetDatapointProtocolTypeById;
//service.GetDatapointProtocolTypes = GetDatapointProtocolTypes;
        service.AttachDatasource = AttachDatasource;
        service.getDatapointValuesByDateRange = getDatapointValuesByDateRange;
        //service.SetControlValue = SetControlValue;

        return service;

        function GetAll(datasourceId) {
            return $http.get(urls.BASE_API + "datapoint/datasource/" + datasourceId).then(handleSuccess, handleError('Error getting all Datapoint'));
        }

        function GetById(id) {
            return $http.get(urls.BASE_API + "datapoint/" + id).then(handleSuccess, handleError('Error getting Datapoint by id'));
        }

        function Create(datapoint) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'datapoint/create', datapoint, config).then(handleSuccess, handleError('Error creating datapoint'));
        }

        function Update(datapoint, datapointId) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + "datapoint/edit/" + datapointId, datapoint, config).then(handleSuccess, handleError('Error updating datapoint'));
        }

        function Delete(id) {
            return $http.delete(urls.BASE_API + "datapoint/delete/" + id).then(handleSuccess, handleError('Error deleting datapoint'));
        }

        function GetDatapointTypes() {
            return $http.get(urls.BASE_API + 'datapoints/types').then(handleSuccess, handleError('Error getting all datapoint types'));
        }

        function GetSensorData(type, unitid, address, ip, port) {
            return $http.get(urls.BASE_API + 'node-red/sensor-data/type/' + type + '/unitid/' + unitid + '/address/' + address + '/ip/' + ip + '/port/' + port).then(handleSuccess, handleError('Error getting all sensor data'));
        }
        function GetLastSensorData(address, ip, port, type, unitid) {
            return $http.get(urls.BASE_API + 'node-red/last-sensor-data/address/' + address + '/ip/' + ip + '/port/' + port + '/type/' + type + '/unitid/' + unitid).then(handleSuccess, handleError('Error getting last sensor data'));
        }
        function GetDatapointTypeById(typeId) {
            return $http.get(urls.BASE_API + 'datapoint/types/' + typeId).then(handleSuccess, handleError('Error getting datapoint by Id'));
        }
        function GetDatapointProtocolTypeById(protocolId) {
            return $http.get(urls.BASE_API + 'datapoint/protocols/' + protocolId).then(handleSuccess, handleError('Error getting datapoint protocol by Id'));
        }
        function GetDatapointProtocolTypes() {
            return $http.get(urls.BASE_API + 'datapoint/protocols').then(handleSuccess, handleError('Error getting all datapoint protocol types'));
        }

        function AttachDatasource(datapointId, datasourceId) {
            return $http.get(urls.BASE_API + 'datapoint/' + datapointId + '/datasource/' + datasourceId).then(handleSuccess, handleError('Error attaching datasource'));
        }

         function getDatapointValuesByDateRange(datapointId, fromdate, todate) {
            return $http.get(urls.BASE_API + 'datapoint/' + datapointId + '/fromdate/' + fromdate + '/todate/' + todate).then(handleSuccess, handleError('Error getting datapoint values datasource'));
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