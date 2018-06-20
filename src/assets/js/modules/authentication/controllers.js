(function (){
    'use strict';
 
angular.module('Authentication')
.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService', 'UserService', '$sessionStorage', 'localStorageService',
    function ($scope, $rootScope, $location, AuthenticationService, UserService, $sessionStorage, localStorageService) {
        // reset login status
        //console.log('clearing credentials');
        AuthenticationService.ClearCredentials();
 
        $scope.login = function () {
            //console.log('starting login process');
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function(response) {
                //console.log(response);
                if(response.access_token) {
                   // console.log('Response success');
                    //AuthenticationService.setUserSessionStorage($scope.username);

                    AuthenticationService.SetCredentials($scope.username, $scope.password, response);
                    UserService.GetByUsername($rootScope.globals.currentUser.username).
                        then(function (resp) {
                            //console.log('Current User - saving to localStorageService...');
                            //console.log(resp);
                            $sessionStorage.loggeduser = resp;
                            localStorageService.set('loggeduser', resp);  
                            if ($sessionStorage.loggeduser.user.role_name == "super"){
                                $location.path('/admin/dashboard');
                            } else {
                                $location.path('/home/dashboard');
                            }
                            
                            
                        });
                    
                    
                } else {
                    //console.log('Response NOT success');
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
    }]);
}());
