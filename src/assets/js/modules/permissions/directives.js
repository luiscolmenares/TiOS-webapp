App.directive('permission', ['AuthenticationService', function(AuthenticationService) {
   return {
       restrict: 'A',
       scope: {
          permission: '='
       },
 
       link: function (scope, elem, attrs) {
            scope.$watch(AuthenticationService.isLoggedIn, function() {
                if (AuthenticationService.userHasPermission(scope.permission)) {
                    elem.show();
                } else {
                    elem.hide();
                    //alert('pa afuera');
                }
            });                
       }
   };
}]);
  
App.directive('userRole', ['AuthenticationService', '$rootScope', 'UserService', '$state', '$location', function(AuthenticationService, $rootScope, UserService, $state, $location) {
   return {
       restrict: 'A',
       scope: {
          userRole: '='
       },
 
       link: function (scope, elem, attrs) {
            scope.$watch(AuthenticationService.isLoggedIn, function() {
              // console.log('$rootScope.globals');
              // console.log($rootScope.globals);
               if ($rootScope.globals.currentUser){
                UserService.GetByUsername($rootScope.globals.currentUser.username).
                        then(function (resp) {
                          //console.log(resp.success);
                          //console.log(resp.user);
                          //if(resp.success = 'false'){
                            if(resp.user == null){
                            //console.log('es falso');
                            //$location.path('/500');
                            //$location.path('/login');

                          } else {
                              if (AuthenticationService.userHasRole(scope.userRole)) {
                                //console.log('se deberia mostrar la opcion admin dashboard');
                                  elem.show();
                              } else {
                                //console.log('se deberia esconder la opcion admin dashboard');
                                  elem.hide();
                              }

                          }
                         

                        });

               }
               
                
            });                
       }
   };
}]);