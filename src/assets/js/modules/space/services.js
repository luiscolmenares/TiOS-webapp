(function () {
    'use strict';

    angular
            .module('app')
            .factory('SpaceService', SpaceService);

    SpaceService.$inject = ['$http', 'urls'];
    function SpaceService($http, urls) {
        var service = {};

        service.GetAll = GetAll;
        // service.GetGamesCount = GetGamesCount;
        service.GetSpacesByProjectId = GetSpacesByProjectId;
        service.GetById = GetById;
        //service.GetByUserId = GetByUserId;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get(urls.BASE_API + 'spaces').then(handleSuccess, handleError('Error getting all spaces'));
        }

        // function GetGamesCount() {
        //     return $http.get(urls.BASE_API + 'games/count').then(handleSuccess, handleError('Error counting games'));
        // }
        function GetSpacesByProjectId(projectId) {
            return $http.get(urls.BASE_API + 'project/'+projectId+'/spaces').then(handleSuccess, handleError('Error getting spaces by projectid'));
        }

        function GetById(id) {
            return $http.get(urls.BASE_API + 'space/' + id).then(handleSuccess, handleError('Error getting space by id'));
        }

        // function GetByGameId(gameId) {
        //     return $http.get(urls.BASE_API + 'space/' + gameId + '/space').then(handleSuccess, handleError('Error getting space by gameid'));
        // }



        function Create(space) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'space/create', space, config).then(handleSuccess, handleError('Error creating space'));
        }

        function Update(space, spaceid) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.post(urls.BASE_API + 'space/edit/' + spaceid, space, config).then(handleSuccess, handleError('Error updating space'));
        }

        function Delete(id) {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            return $http.delete(urls.BASE_API + 'space/delete/' + id, config).then(handleSuccess, handleError('Error deleting space'));
        }

// private functions

        function handleSuccess(res) {
           //console.log('Success');
           //console.log(res.data);
            return res.data;
        }

        function handleError(error) {
            return function () {
                return {success: false, message: error};
            };
        }
    }

})();

// Create and register the new "spaces" service
App.factory('spaces', ['$http', 'urls', function ($http, urls) {
   //console.log('fetching spaces first');
        return {
            fetchSpaces: function (callback) {
                $http.get(urls.BASE_API + "spaces")
                        .then(function (response) {
                           console.log('fetching spaces');
                           console.log(response.data);
                            callback(response.data);
                        });

            }
        };
    }]);