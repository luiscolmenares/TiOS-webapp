(function(){
    'use strict';

angular.module('Authentication')
 
.factory('AuthenticationService',
    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout', 'localStorageService', 'urls', 'UserService', '$sessionStorage',
    function (Base64, $http, $cookieStore, $rootScope, $timeout, localStorageService, urls, UserService, $sessionStorage) {
        var service = {};

        service.init = function(){
        if (service.isLoggedIn()){
            //alert('were logged in!');
            $rootScope.user = service.currentUser();
            $rootScope.loggeduser = service.currentLoggedUser();

            // console.log('Se guardan los menues: roleID');
            // console.log($rootScope.loggeduser.user);
            UserService.GetMenuItems($rootScope.loggeduser.user.role_id)
                    .then(function(data){
                        // console.log('menuitems!!');
                        // console.log(data);
                        $rootScope.menuitems = data.menuitems;
                        //localStorageService.set('menuitems', data);  
                    });

            //service.setUserSessionStorage();
        }
        };

        service.Login = function (username, password, callback) {

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
            // $timeout(function(){
            //     var response = { success: username === 'test' && password === 'test' };
            //     if(!response.success) {
            //         response.message = 'Username or password is incorrect';
            //     }
            //     callback(response);
            // }, 1000);


            /* Use this for real authentication
             ----------------------------------------------*/
            // $http.post('http://api.dev/api/oauth/access_token', { username: username, password: password, grant_type: 'password', client_id: 'g3b259fde3ed9ff3843839b', client_secret: '3d7f5f8f793d59c25502c0ae8c4a95b' })
            //    .success(function (response) {
            //        callback(response);
            //    });

            $http({
              method: "post", 
              url: urls.BASE_API_SERVER+"oauth/token", 
              //data:  "client_id=" + clientId + "&client_secret=" + clientSecret + "password=pwd&username=sampleuser&grant_type=password" + "&scope=read%20write",
              //web api LOCAL
              // data: {grant_type: 'password', client_id: '2', client_secret: 'vrRb128Iq24zxDUh70hBxHzufs3YcfS506sJOxpM', username: username, password: password },
              //web api DIGITALOCEAN
              data: {grant_type: 'password', client_id: '2', client_secret: 'zmO6BEWZ74aG4RybIHVAVDHlki8JOl2DrkauMY0W', username: username, password: password },
              
              //withCredentials: true,
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
                }
            })                
               .success(function(data) {

                    $sessionStorage.user = data; 
                     callback(data);
                })
                .error(function(data, status) {
                    //alert("ERROR: " + data);
                    callback(data);
                });
            

        };

        service.setUserSessionStorage = function (){
            // console.log('saving user to session storage..');
            // console.log($rootScope.globals.currentUser.username);
            // console.log('data');
            // console.log(data);
            UserService.GetByUsername($rootScope.globals.currentUser.username).
                    then(function (resp) {
                        // console.log('Current User - saving to localStorageService...');
                        // console.log(resp);
                        $sessionStorage.loggeduser = resp;
                        localStorageService.set('loggeduser', resp);  
                        
                    });

        };
        
 
        service.SetCredentials = function (username, password, data) {
            var authdata = Base64.encode(username + ':' + password);
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
            //console.log('saving globals to localstorage...');
            localStorageService.set('globals', data); 
            //console.log($rootScope.globals.currentUser.username);
            

        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
            localStorageService.remove('globals');
            localStorageService.remove('loggeduser');
            delete $sessionStorage.user;
            delete $sessionStorage.loggeduser;
            delete $sessionStorage.menuitems;

        };

        service.checkPermissionForView = function(view) {
            // alert('la vista es');
            // alert(view);
            if (!view.requiresAuthentication) {
                return true;
            }
             
            return userHasPermissionForView(view);
        };
         
         
        var userHasPermissionForView = function(view){
            if(!auth.isLoggedIn()){
                return false;
            }
             
            if(!view.permissions || !view.permissions.length){
                return true;
            }
             
            return auth.userHasPermission(view.permissions);
        };

        service.userHasPermission = function(permissions){

        if(!service.isLoggedIn()){
            return false;
        }
         
        var found = false;
        angular.forEach(permissions, function(permission, index){
            if ($sessionStorage.loggeduser.permissions.indexOf(permission) >= 0){
                found = true;
                return;
            }                        
        });
         
        return found;
    };

    service.userHasRole = function(userroles){
        // console.log('vemos si el usuario tiene el siguiente role');
        //     console.log(role);
        //     console.log('los roles que tiene el usuario son los siguientes');
        //     var loggeduser = localStorageService.get('loggeduser');
        //     console.log(loggeduser.user.role_name);
        if(!service.isLoggedIn()){
            return false;
        } else {
            var loggeduser = localStorageService.get('loggeduser');
            var found = false;
             angular.forEach(userroles, function(userrole, index){
            if (loggeduser.user.role_name.indexOf(userrole) >= 0){
                found = true;
                //alert('si lo tiene!');
                return;
            }                        
        });
         
        return found;

        }
         
        
    };

    service.currentUser = function(){
        return $sessionStorage.user;
        };

        service.isLoggedIn = function(){
            if ($sessionStorage.user != null){
                return true;
            }
            return false;
        //return $sessionStorage.user != null;
        //return localStorageService.get('loggeduser') != null;
        }; 

        service.currentLoggedUser = function(){
        //return $sessionStorage.loggeduser;
        return $sessionStorage.loggeduser;
        };
 
        return service;
    }])
 
.factory('Base64', function () {
    /* jshint ignore:start */
 
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
 
    /* jshint ignore:end */
});
}());
