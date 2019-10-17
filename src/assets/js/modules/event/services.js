/*
*  Document   : controllers.js
*  Author     : kikecolmenares
*  Description: events services
*
*/

(function () {
	'use strict';

	angular
	.module('app')
	.factory('EventService', EventService);

	EventService.$inject = ['$http', 'urls'];
	function EventService($http, urls) {
		var service = {};

		service.GetAll = GetAll;
		service.GetEventsCount = GetEventsCount;
		service.GetAllByProjectId = GetAllByProjectId;
		service.GetAllByOrganizationId = GetAllByOrganizationId;
		service.GetById = GetById;
		service.Create = Create;
		service.Update = Update;
		service.Delete = Delete;
		service.GetEventActionTypes = GetEventActionTypes;

return service;

function GetAll() {
	return $http.get(urls.BASE_API + "events").then(handleSuccess, handleError('Error getting all events'));
}

function GetEventsCount() {
	return $http.get(urls.BASE_API + 'events/count').then(handleSuccess, handleError('Error counting events'));
}

function GetAllByProjectId(projectId) {
	return $http.get(urls.BASE_API + "events/project/" + projectId).then(handleSuccess, handleError('Error getting all events by projectId'));
}

function GetAllByOrganizationId(organizationId) {
	return $http.get(urls.BASE_API + "events/organization/" + organizationId).then(handleSuccess, handleError('Error getting all events by organizationId'));
}

function GetById(triggerId) {
	return $http.get(urls.BASE_API + "event/" + triggerId).then(handleSuccess, handleError('Error getting event by id'));
}

function Create(trigger) {
	var config = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		}
	};
	return $http.post(urls.BASE_API + 'event/create', trigger, config).then(handleSuccess, handleError('Error creating event'));
}

function Update(event, triggerId) {
	var config = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		}
	};
	return $http.post(urls.BASE_API + "event/edit/" + triggerId, trigger, config).then(handleSuccess, handleError('Error updating event'));
}

function Delete(id) {
	return $http.delete(urls.BASE_API + "event/delete/" + id).then(handleSuccess, handleError('Error deleting event'));
}

function GetEventActionTypes() {
	return $http.get(urls.BASE_API + "events/actions").then(handleSuccess, handleError('Error getting event actions'));
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
App.factory('events', ['$http', 'urls', function ($http, urls) {

	return {
		fetchEvents: function (callback) {
			$http.get(urls.BASE_API + "events")
			.then(function (response) {
				console.log('fetching events');
				console.log(response);
				callback(response.data.events);
			});

		}
	};
}]);