(function () {
    'use strict';

    angular
            .module('app')
            .factory('TriggerService', TriggerService);

    TriggerService.$inject = ['$http', 'urls'];
    function TriggerService($http, urls) {
        var service = {};

        service.GetAll = GetAll;
        service.GetTriggersCount = GetTriggersCount;
        service.GetAllByProjectId = GetAllByProjectId;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        // service.GetSensorData = GetSensorData;
        // service.GetLastSensorData = GetLastSensorData;
         service.GetTriggerTypes = GetTriggerTypes;
         service.GetTriggerTypeById = GetTriggerTypeById;
         service.GetOperators = GetOperators;
         service.GetAllNotifications = GetAllNotifications;
         service.DeleteNotificationById = DeleteNotificationById;
         service.GetTriggersNotificationByOrganizatioId = GetTriggersNotificationByOrganizatioId;
        // service.GetDatapointTypeById = GetDatapointTypeById;
//service.GetDatapointProtocolTypeById = GetDatapointProtocolTypeById;
//service.GetDatapointProtocolTypes = GetDatapointProtocolTypes;
        //service.AttachDatasource = AttachDatasource;

        return service;

        function GetAll() {
            return $http.get(urls.BASE_API + "nopagination/triggers").then(handleSuccess, handleError('Error getting all Triggers'));
        }

        function GetTriggersCount() {
            return $http.get(urls.BASE_API + 'triggers/count').then(handleSuccess, handleError('Error counting triggers'));
        }

        function GetAllByProjectId(projectId) {
            return $http.get(urls.BASE_API + "triggers/project/" + projectId).then(handleSuccess, handleError('Error getting all Triggers by projectId'));
        }

        function GetById(triggerId) {
            return $http.get(urls.BASE_API + "trigger/" + triggerId).then(handleSuccess, handleError('Error getting Trigger by id'));
        }

        function Create(trigger) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'trigger/create', trigger, config).then(handleSuccess, handleError('Error creating trigger'));
        }

        function Update(trigger, triggerId) {
             var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + "trigger/edit/" + triggerId, trigger, config).then(handleSuccess, handleError('Error updating trigger'));
        }

        function Delete(id) {
            return $http.delete(urls.BASE_API + "trigger/delete/" + id).then(handleSuccess, handleError('Error deleting trigger'));
        }

        function GetTriggerTypes() {
            return $http.get(urls.BASE_API + 'trigger/types').then(handleSuccess, handleError('Error getting all trigger types'));
        }

        function GetTriggerTypeById(id) {
            return $http.get(urls.BASE_API + 'trigger/type/' + id).then(handleSuccess, handleError('Error getting trigger type by Id'));
        }

        function GetOperators() {
            return $http.get(urls.BASE_API + 'operators').then(handleSuccess, handleError('Error getting operators'));
        }

        function GetAllNotifications(){
            return $http.get(urls.BASE_API + 'notifications').then(handleSuccess, handleError('Error getting notifications'));
        }

        function GetTriggersNotificationByOrganizatioId(organizationid){
            return $http.get(urls.BASE_API + 'organization/'+ organizationid +'/notifications').then(handleSuccess, handleError('Error getting notificcations by organization id'));
        }

        function DeleteNotificationById(id) {
            return $http.delete(urls.BASE_API + "notification/delete/" + id).then(handleSuccess, handleError('Error deleting notification'));
        }
        // function GetSensorData(type, unitid, address, ip, port) {
        //     return $http.get(urls.BASE_API + 'node-red/sensor-data/type/' + type + '/unitid/' + unitid + '/address/' + address + '/ip/' + ip + '/port/' + port).then(handleSuccess, handleError('Error getting all sensor data'));
        // }
        // function GetLastSensorData(address, ip, port, type, unitid) {
        //     return $http.get(urls.BASE_API + 'node-red/last-sensor-data/address/' + address + '/ip/' + ip + '/port/' + port + '/type/' + type + '/unitid/' + unitid).then(handleSuccess, handleError('Error getting last sensor data'));
        // }
        // function GetDatapointTypeById(typeId) {
        //     return $http.get(urls.BASE_API + 'datapoint/types/' + typeId).then(handleSuccess, handleError('Error getting datapoint by Id'));
        // }
        // function GetDatapointProtocolTypeById(protocolId) {
        //     return $http.get(urls.BASE_API + 'datapoint/protocols/' + protocolId).then(handleSuccess, handleError('Error getting datapoint protocol by Id'));
        // }
        // function GetDatapointProtocolTypes() {
        //     return $http.get(urls.BASE_API + 'datapoint/protocols').then(handleSuccess, handleError('Error getting all datapoint protocol types'));
        // }

        function AttachTrigger(triggerId, projectId) {
            return $http.get(urls.BASE_API + 'trigger/' + triggerId + '/project/' + projectId).then(handleSuccess, handleError('Error attaching trigger'));
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

// Create and register the new "triggers" service
App.factory('triggers', ['$http', 'urls', function ($http, urls) {

        return {
            fetchTriggers: function (callback) {
                $http.get(urls.BASE_API + "nopagination/triggers")
                        .then(function (response) {
                            console.log('fetching triggers');
                            console.log(response);
                            callback(response.data.triggers);
                        });

            }
        };
    }]);