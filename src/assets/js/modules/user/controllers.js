/*
 *  Document   : controllers.js
 *  Author     : kikecolmenares
 *  Description: User controllers
 *
 */
App.controller('UserCtrl', ['$scope', '$localStorage', '$window', 'UserService', 'OrganizationService', 'RoleService', 'ProjectService', 'DatasourceService', '$http', '$state', '$timeout',
    function ($scope, $localStorage, $window, UserService, OrganizationService, RoleService, ProjectService, DatasourceService, $http, $state, $timeout) {

        $scope.selectedOrganization = null;
        $scope.organizations = [];
        OrganizationService.GetAll()
                .then(function (result) {
                    console.log(result);
                    $scope.organizations = result.organizations;
                    //$scope.organizations = result;
                });

        $scope.selectedRole = null;
        $scope.roles = [];
        RoleService.GetAll()
                .then(function (result) {
                    console.log("roles!");
                    $scope.roles = result.roles;
                    //$scope.roles = result;
                });


        $scope.createUser = function () {
             var isChecked = $('#val-activate').prop("checked");
             var isCheckedEmail = $('#val-activate-email').prop("checked");
             var isCheckedSMS = $('#val-activate-sms').prop("checked");
            if ($scope.phone && $scope.email && $scope.name && $scope.password && ($scope.password == $scope.password2))
            {
                var activation = 0;
                var activation_email = 0;
                var activation_sms = 0;

                if (isChecked) {
                    activation = 1;
                }
                if (isCheckedEmail) {
                    activation_email = 1;
                }
                if (isCheckedSMS) {
                    activation_sms = 1;
                }
// use $.param jQuery function to serialize data from JSON 
                var user = $.param({
                    name: $scope.name,
                    email: $scope.email,
                    phone: $scope.phone,
                    password: $scope.password,
                    notes: $scope.notes,
                    role_id: $scope.selectedRole.id,
                    organization_id: $scope.selectedOrganization.id,
                    active: activation,
                    activation_email: activation_email,
                    active_sms: activation_sms,
                });
                UserService.Create(user)
                        .then(function (response) {
                            console.log(response);
                            if (response.success == false) {
                                swal("Error Creating new user", "", "error");
                            } else {
                                swal("New user has been created", "", "success");
                                $state.go('users', {redirect: true});
                                $timeout(function () {
//initDataTableFull();
                                    $state.reload();
                                }, 1000);
                            }
                        });

            }

        };


// Init Material Forms Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
        var initValidationMaterial = function () {
            jQuery('.js-validation-material').validate({
                ignore: [],
                errorClass: 'help-block text-right animated fadeInDown',
                errorElement: 'div',
                errorPlacement: function (error, e) {
                    jQuery(e).parents('.form-group > div').append(error);
                },
                highlight: function (e) {
                    var elem = jQuery(e);

                    elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                    elem.closest('.help-block').remove();
                },
                success: function (e) {
                    var elem = jQuery(e);

                    elem.closest('.form-group').removeClass('has-error');
                    elem.closest('.help-block').remove();
                },
                rules: {
                    'val-name': {
                        required: true,
                        minlength: 3
                    },
                    'val-email': {
                        required: true,
                        email: true
                    },
                    'val-password': {
                        required: true,
                        minlength: 5
                    },
                    'val-confirm-password': {
                        required: true,
                        equalTo: '#val-password'
                    },
                    'val-role': {
                        required: true,
                    },
                    'val-organization': {
                        required: true,
                    },
                    'val-phone': {
                        required: true,
                        //phoneUS: true
                    }
                },
                messages: {
                    'val-name': {
                        required: 'Please enter a name',
                        minlength: 'The name must consist of at least 3 characters'
                    },
                    'val-email': 'Please enter a valid email address',
                    'val-password': {
                        required: 'Please provide a password',
                        minlength: 'Your password must be at least 5 characters long'
                    },
                    'val-confirm-password': {
                        required: 'Please provide a password',
                        minlength: 'Your password must be at least 5 characters long',
                        equalTo: 'Please enter the same password as above'
                    },
                    'val-role': 'Please select a role',
                    'val-organization': 'Please select an organization',
                    'val-phone': 'Please provide a phone number',
                }
            });
        };

// Init Material Forms Validation
        initValidationMaterial();

// Init Validation on Select2 change
        jQuery('[data-js-select2]').on('change', function () {
            jQuery(this).valid();
        });
    }
]);

App.controller('UserOrgCtrl', ['$scope', '$localStorage', '$window', 'UserService', 'OrganizationService', 'RoleService', 'ProjectService', 'DatasourceService', '$http', '$state', '$timeout', '$sessionStorage',
    function ($scope, $localStorage, $window, UserService, OrganizationService, RoleService, ProjectService, DatasourceService, $http, $state, $timeout, $sessionStorage) {

        $scope.selectedOrganization = null;
        $scope.organizations = [];
        OrganizationService.GetAll()
                .then(function (result) {
                    console.log(result);
                    $scope.organizations = result.organizations;
                    //$scope.organizations = result;
                });

        $scope.selectedRole = null;
        $scope.roles = [];
        RoleService.GetAll()
                .then(function (result) {
                    console.log("roles!");
                    console.log($sessionStorage.loggeduser.user.role_name);

                    if ($sessionStorage.loggeduser.user.role_name != "super"){
                        result.roles.shift();

                    }
                    $scope.roles = result.roles;
                    //$scope.roles = result;
                });


        $scope.createUser = function () {
             var isChecked = $('#val-activate').prop("checked");
             var isCheckedEmail = $('#val-activate-email').prop("checked");
             var isCheckedSMS = $('#val-activate-sms').prop("checked");
            if ($scope.phone && $scope.email && $scope.name && $scope.password && ($scope.password == $scope.password2))
            {
                var activation = 0;
                var activation_email = 0;
                var activation_sms = 0;

                if (isChecked) {
                    activation = 1;
                }
                if (isCheckedEmail) {
                    activation_email = 1;
                }
                if (isCheckedSMS) {
                    activation_sms = 1;
                }
// use $.param jQuery function to serialize data from JSON 
                var user = $.param({
                    name: $scope.name,
                    email: $scope.email,
                    phone: $scope.phone,
                    password: $scope.password,
                    notes: $scope.notes,
                    role_id: $scope.selectedRole.id,
                    organization_id: $sessionStorage.loggeduser.user.organization_id,
                    active: activation,
                    activation_email: activation_email,
                    active_sms: activation_sms,
                });
                UserService.Create(user)
                        .then(function (response) {
                            console.log(response);
                            if (response.success == false) {
                                swal("Error Creating new user", "", "error");
                            } else {
                                swal("New user has been created", "", "success");
                                $state.go('users', {redirect: true});
                                $timeout(function () {
//initDataTableFull();
                                    $state.reload();
                                }, 1000);
                            }
                        });

            }

        };


// Init Material Forms Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
        var initValidationMaterial = function () {
            jQuery('.js-validation-material').validate({
                ignore: [],
                errorClass: 'help-block text-right animated fadeInDown',
                errorElement: 'div',
                errorPlacement: function (error, e) {
                    jQuery(e).parents('.form-group > div').append(error);
                },
                highlight: function (e) {
                    var elem = jQuery(e);

                    elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                    elem.closest('.help-block').remove();
                },
                success: function (e) {
                    var elem = jQuery(e);

                    elem.closest('.form-group').removeClass('has-error');
                    elem.closest('.help-block').remove();
                },
                rules: {
                    'val-name': {
                        required: true,
                        minlength: 3
                    },
                    'val-email': {
                        required: true,
                        email: true
                    },
                    'val-password': {
                        required: true,
                        minlength: 5
                    },
                    'val-confirm-password': {
                        required: true,
                        equalTo: '#val-password'
                    },
                    'val-role': {
                        required: true,
                    },
                    'val-organization': {
                        required: true,
                    },
                    'val-phone': {
                        required: true,
                        //phoneUS: true
                    }
                },
                messages: {
                    'val-name': {
                        required: 'Please enter a name',
                        minlength: 'The name must consist of at least 3 characters'
                    },
                    'val-email': 'Please enter a valid email address',
                    'val-password': {
                        required: 'Please provide a password',
                        minlength: 'Your password must be at least 5 characters long'
                    },
                    'val-confirm-password': {
                        required: 'Please provide a password',
                        minlength: 'Your password must be at least 5 characters long',
                        equalTo: 'Please enter the same password as above'
                    },
                    'val-role': 'Please select a role',
                    'val-organization': 'Please select an organization',
                    'val-phone': 'Please provide a phone number',
                }
            });
        };

// Init Material Forms Validation
        initValidationMaterial();

// Init Validation on Select2 change
        jQuery('[data-js-select2]').on('change', function () {
            jQuery(this).valid();
        });
    }
]);

// Tables DataTables Controller
App.controller('UserTablesCtrl', ['$scope', 'users', '$localStorage', '$window', '$http', 'RoleService', 'localStorageService', '$timeout', 'UserService', '$state', 'OrganizationService', 'AuthenticationService', '$rootScope', '$sessionStorage',
    function ($scope, users, $localStorage, $window, $http, RoleService, localStorageService, $timeout, UserService, $state, OrganizationService, AuthenticationService, $rootScope, $sessionStorage) {
        $scope.isSuper = false;

        console.log('user role----->');
        console.log($sessionStorage.loggeduser.user.role_name);
        if($sessionStorage.loggeduser.user.role_name == "super"){
                            $scope.isSuper = true;
                        }  

        /*
         *Function Reload
         */

// $scope.csString = "1,2,3,4,5,6,7,8,9,10";
        $scope.reload = function () {
            $state.reload();
        };
        function myIndexOf(o, arr) {

            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name == o.name && arr[i].id == o.id) {
                    return i;
                }
            }

            return -1;
        }

// UserService.GetAll()
//       .then(function(result){
//         console.log(result);
//         $scope.roles = result.roles;
//       });

        $scope.userslist = [];
        $scope.selectedRole = null;
        $scope.roles = [];
        $scope.checkroles = [];
//Obtenemoslos roles y los mandamos al scope
        RoleService.GetAll()
                .then(function (result) {
                    console.log('roles');
                    console.log(result.roles);
                    $scope.roles = result.roles;
                    //$rolesarray = array("roles" => result);
                    //$scope.roles = $rolesarray;
                });

//Obtenemos las organizaciones y los mandamos al scope
        OrganizationService.GetAll()
                .then(function (result) {
                    console.log(result.organizations);
                    $scope.organizations = result.organizations;
                    //$scope.organizations = result;
                });


        $(document).on("click", ".view-user", function () {
            var userid = $(this).data('id');
            UserService.GetById(userid)
                    .then(function (data) {
                        $scope.user = data.user;
                        RoleService.GetByUserId($scope.user.id)
                                .then(function (result) {
//Mandamos el Role al scope
                                    console.log(result.role);
                                    console.log($scope.roles);
                                    $scope.role = result.role;
//en el array de roles, poneos el role del user como default
                                    $scope.selectRoleObject = $scope.roles[myIndexOf($scope.role, $scope.roles)];
                                    console.log('Role Objeto seleccionado ---');
                                    console.log(myIndexOf($scope.role, $scope.roles));
                                    console.log($scope.selectRoleObject);


                                });

//Check the role to show organization dropdown
                        // console.log('loggeduser------>');
                        // console.log ($sessionStorage.loggeduser.user.role_name);        
                              

//Obtenemos la organizacion
                        OrganizationService.GetByUserId($scope.user.id)
                                .then(function (result) {
//Mandamos el organization al scope
                                    console.log(result.organization);
                                    console.log($scope.organizations);
                                    $scope.organization = result.organization;
//en el array de organization, poneos el role del user como default
                                    $scope.selectOrganizationObject = $scope.organizations[myIndexOf($scope.organization, $scope.organizations)];
                                    console.log('organization Objeto seleccionado ---');
                                    console.log(myIndexOf($scope.organization, $scope.organizations));
                                    console.log($scope.selectOrganizationObject);

                                });
                        $('#modal-user').modal('show');
                    });
        });
        $(document).on("click", ".view-user-edit", function () {
            var userid = $(this).data('id');
            UserService.GetById(userid)
                    .then(function (rest) {
//Mandamos el user al scope
                        $scope.user = rest.user;
//Obtenemos el Role del User
                        RoleService.GetByUserId($scope.user.id)
                                .then(function (result) {
//Mandamos el Role al scope
                                    console.log(result.role);
                                    console.log($scope.roles);
                                    $scope.role = result.role;
//en el array de roles, poneos el role del user como default
                                    $scope.selectRoleObject = $scope.roles[myIndexOf($scope.role, $scope.roles)];
                                    console.log('Role Objeto seleccionado ---');
                                    console.log(myIndexOf($scope.role, $scope.roles));
                                    console.log($scope.selectRoleObject);

                                });
//check if logged user is admin



//getting the organization
                        OrganizationService.GetByUserId($scope.user.id)
                                .then(function (result) {
//organization to scope
                                    console.log(result.organization);
                                    console.log($scope.organizations);
                                    $scope.organization = result.organization;
//en el array de organization, poneos el role del user como default
                                    $scope.selectOrganizationObject = $scope.organizations[myIndexOf($scope.organization, $scope.organizations)];
                                    console.log('organization Objeto seleccionado ---');
                                    console.log(myIndexOf($scope.organization, $scope.organizations));
                                    console.log($scope.selectOrganizationObject);

                                });

                        $('#modal-user-edit').modal('show');
                    });
        });

        $(document).on("click", ".view-user-delete", function () {
            var userid = $(this).data('id');
            UserService.GetById(userid)
                    .then(function (data) {
                        $scope.user = data.user;
                        RoleService.GetByUserId($scope.user.id)
                                .then(function (result) {
//Mandamos el Role al scope
                                    // console.log(result.role);
                                    // console.log($scope.roles);
                                    $scope.role = result.role;
//en el array de roles, poneos el role del user como default
                                    $scope.selectRoleObject = $scope.roles[myIndexOf($scope.role, $scope.roles)];
                                    // console.log('Role Objeto seleccionado ---');
                                    // console.log(myIndexOf($scope.role, $scope.roles));
                                    // console.log($scope.selectRoleObject);

                                });

//Obtenemos la organizacion
                        OrganizationService.GetByUserId($scope.user.id)
                                .then(function (result) {
//Mandamos el organization al scope
                                    console.log(result.organization);
                                    console.log($scope.organizations);
                                    $scope.organization = result.organization;
//en el array de organization, poneos el role del user como default
                                    $scope.selectOrganizationObject = $scope.organizations[myIndexOf($scope.organization, $scope.organizations)];
                                    console.log('organization Objeto seleccionado ---');
                                    console.log(myIndexOf($scope.organization, $scope.organizations));
                                    console.log($scope.selectOrganizationObject);

                                });
                        $('#modal-users-delete').modal('show');
                    });
        });

        /*
         *Function Update User
         */
        $scope.updateUser = function (userid) {
            var isChecked = $('#val-active').prop("checked");
            var isCheckedEmail = $('#val-active-email').prop("checked");
            var isCheckedSMS = $('#val-active-sms').prop("checked");
            // console.log('isCheckedEmail');
            // console.log(isCheckedEmail);
            // console.log('isCheckedSMS');
            // console.log(isCheckedSMS);



            if ($scope.user.id && $scope.user.name && $scope.user.phone && $scope.user.email)
            {

                var activation = 0;
                var activation_email = 0;
                var activation_sms = 0;

                if (isChecked) {
                    activation = 1;
                }
                if (isCheckedEmail) {
                    activation_email = 1;
                   
                }
                if (isCheckedSMS) {
                    activation_sms = 1;
                }
                // console.log('$scope.active');
                // console.log(activation);
// use $.param jQuery function to serialize data from JSON 
                var user = $.param({
                    id: $scope.user.id,
                    name: $scope.user.name,
                    email: $scope.user.email,
                    phone: $scope.user.phone,
                    notes: $scope.user.notes,
                    role_id: $scope.selectRoleObject.id,
                    organization_id: $scope.selectOrganizationObject.id,
                    active: activation,
                    active_email: activation_email,
                    active_sms: activation_sms
                });

                UserService.Update(user, $scope.user.id)
                        .then(function (response) {
                            console.log(response);
                            if (response.success == false) {
                                swal("Error Updating user", "", "error");
                            } else {
                                localStorageService.remove('users');
                                swal("User has been updated", "", "success");

                                var oTable = $('.js-dataTable-full').dataTable();
                                oTable.fnClearTable();
                                oTable.fnDestroy();
                                users.fetchUsers(function (data) {

//   console.log('saving user in localStorage...');
                         if (AuthenticationService.userHasRole(["super"])){
                                        localStorageService.set('users', data);
                                        //userslist = data;
                                    } else {
                                        var filteredusers = data.filter(function (user){
                                            return user.organization_id == $rootScope.loggeduser.user.organization_id;
                                        });
                                        localStorageService.set('users', filteredusers);
                                    }

//   //$scope.organizationslist = data;
                                });
                                $timeout(function () {
//initDataTableFull();
                                    $state.reload();
                                }, 1000);




// organizations.fetchOrganizations(function(data){

//       //   console.log('saving organization in localStorage...');
//       localStorageService.set('organizations', data);
//       orglist = data;

//       //   //$scope.organizationslist = data;
//     });

                                $('#modal-user-edit').modal('hide');


//$state.go('organizations');
                            }
                        });
            }
        };
        $scope.deleteUser = function (id) {
            // var x;
            // x = "You pressed OK!";
            if ($scope.user.id && $scope.user.name && $scope.user.phone && $scope.user.email)
            {
                var activation = 0;
//console.log('updating Organization...');
                var isChecked = $('#val-active').prop("checked");
                if (isChecked) {
                    activation = 1;
                }
                console.log('$scope.active');
                console.log(activation);
                UserService.Delete($scope.user.id)
                        .then(function (response) {
                            console.log(response);
                            if (response.success == false) {
                                swal("Error Delete This user", "", "error");
                            } else {
                                localStorageService.remove('users');
                                swal("This Record has been deleted", "", "success");

                                var oTable = $('.js-dataTable-full').dataTable();
                                oTable.fnClearTable();
                                oTable.fnDestroy();
                                users.fetchUsers(function (data) {
                                    localStorageService.set('users', data);
                                    usrslist = data;
                                });
                                $timeout(function () {
//initDataTableFull();
                                    $state.reload();
                                }, 1000);
                                $('#modal-users-delete').modal('hide');

                            }
                        });
            }


//document.getElementById("demo").innerHTML = x;
        };

// Init full DataTable, for more examples you can check out https://www.datatables.net/

        var initDataTableFull = function () {
            
            users.fetchUsers(function (data) {
                if (AuthenticationService.userHasRole(["super"])){
                localStorageService.set('users', data);
                //userslist = data;
            } else {
                var filteredusers = data.filter(function (user){
                    return user.organization_id == $rootScope.loggeduser.user.organization_id;
                });
                localStorageService.set('users', filteredusers);
            }
        });
        
    //}
            

            console.log('init datatable...');
            var table = $('.js-dataTable-full').dataTable({
                //dom: 'Bfrtip',
                columnDefs: [{orderable: false, targets: [4]}],
                pageLength: 10,
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
                
                
                data: localStorageService.get('users'),
//data: dataset,
                "columns": [
                    //{"data": "id"},
                    {"data": "name"},
                    {"data": "organization_name"},
                    {"data": "email",
                        "className": "hidden-xs sorting"},
// { "data": "role",
// "className": "hidden-xs sorting" },
// { "data": "organization",
// "className": "hidden-xs sorting" },
                    {"data": "active",
                        "render": function (data, type, row) {
// If display or filter data is requested, format the date
                            if (data == '1') {
                                return "<span class='label label-success'>enabled</span>";
                            }

// Otherwise the data type requested (`type`) is type detection or
// sorting data, for which we want to use the integer, so just return
// that, unaltered
                            return "<span class='label label-danger'>disabled</span>";

                        }
                    },
                    {"data": "id",
                        "orderable": false,
                        "render": function (data, type, row) {
                            var actions = "";
                            if (AuthenticationService.userHasRole(["super"])){
                                actions = "<div class='btn-group'><button class='btn btn-xs btn-default view-user' data-toggle='modal' data-id='" + data + "' href='#modal-user' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-user-edit' data-toggle='modal' data-id='" + data + "' href='#modal-user-edit' type='button'><i class='fa fa-pencil'></i></button><button  class='btn btn-xs btn-default view-user-delete' data-toggle='modal' data-id='" + data + "' href='#modal-user-delete' type='button' ng-click='initModalData()'><i user-role=\"['super']\" class='fa fa-times'></i></button></div>";
                            } else {
                                actions = "<div class='btn-group'><button class='btn btn-xs btn-default view-user' data-toggle='modal' data-id='" + data + "' href='#modal-user' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-user-edit' data-toggle='modal' data-id='" + data + "' href='#modal-user-edit' type='button'><i class='fa fa-pencil'></i></button></div>";
                            
                            }
                            return actions;
                            }},
                ],
                createdRow: function (row, data, index) {
                    if (data.deleted_at)
                        $(row).addClass('hide');
                }

            });
            // table.buttons().container()
            // .appendTo( $('.col-sm-6:eq(0)', table.table().container() ) );

        };

// DataTables Bootstrap integration
        var bsDataTables = function () {
            var DataTable = jQuery.fn.dataTable;

// Set the defaults for DataTables init
            jQuery.extend(true, DataTable.defaults, {
                dom:
                        "<'row'<'col-sm-6'l><'col-sm-6 text-right btn-group'B>>" +
                        "<'row'<'col-sm-6'i><'col-sm-6'f>>" +
                        "<'row'<'col-sm-12'tr>>" +
                        "<'row'<'col-sm-12'p>>",
                renderer: 'bootstrap',
                buttons: [
                             { extend: 'copy', text: '<i class="fa fa-copy"></i>', className: 'btn btn-xs btn-default' },
                             { extend: 'excel',text: '<i class="fa fa-file-excel-o"></i>', className: 'btn btn-xs btn-default' , filename:'Users'},
                             { extend: 'csv',text: '<i class="fa fa-file-o"></i>', className: 'btn btn-xs btn-default' , filename:'Users'},
                             { extend: 'pdf',text: '<i class="fa fa-file-pdf-o"></i>', className: 'btn btn-xs btn-default' , filename:'Users'},
                             { extend: 'print',text: '<i class="fa fa-print"></i>', className: 'btn btn-xs btn-default', title:'Users' }
                        ],
                oLanguage: {
                    sLengthMenu: "_MENU_",
                    sInfo: "Showing <strong>_START_</strong>-<strong>_END_</strong> of <strong>_TOTAL_</strong>",
                    oPaginate: {
                        sPrevious: '<i class="fa fa-angle-left"></i>',
                        sNext: '<i class="fa fa-angle-right"></i>'
                    }
                }
            });

// Default class modification
            jQuery.extend(DataTable.ext.classes, {
                sWrapper: "dataTables_wrapper form-inline dt-bootstrap",
                sFilterInput: "form-control",
                sLengthSelect: "form-control"
            });

// Bootstrap paging button renderer
            DataTable.ext.renderer.pageButton.bootstrap = function (settings, host, idx, buttons, page, pages) {
                var api = new DataTable.Api(settings);
                var classes = settings.oClasses;
                var lang = settings.oLanguage.oPaginate;
                var btnDisplay, btnClass;

                var attach = function (container, buttons) {
                    var i, ien, node, button;
                    var clickHandler = function (e) {
                        e.preventDefault();
                        if (!jQuery(e.currentTarget).hasClass('disabled')) {
                            api.page(e.data.action).draw(false);
                        }
                    };

                    for (i = 0, ien = buttons.length; i < ien; i++) {
                        button = buttons[i];

                        if (jQuery.isArray(button)) {
                            attach(container, button);
                        } else {
                            btnDisplay = '';
                            btnClass = '';

                            switch (button) {
                                case 'ellipsis':
                                    btnDisplay = '&hellip;';
                                    btnClass = 'disabled';
                                    break;

                                case 'first':
                                    btnDisplay = lang.sFirst;
                                    btnClass = button + (page > 0 ? '' : ' disabled');
                                    break;

                                case 'previous':
                                    btnDisplay = lang.sPrevious;
                                    btnClass = button + (page > 0 ? '' : ' disabled');
                                    break;

                                case 'next':
                                    btnDisplay = lang.sNext;
                                    btnClass = button + (page < pages - 1 ? '' : ' disabled');
                                    break;

                                case 'last':
                                    btnDisplay = lang.sLast;
                                    btnClass = button + (page < pages - 1 ? '' : ' disabled');
                                    break;

                                default:
                                    btnDisplay = button + 1;
                                    btnClass = page === button ?
                                            'active' : '';
                                    break;
                            }

                            if (btnDisplay) {
                                node = jQuery('<li>', {
                                    'class': classes.sPageButton + ' ' + btnClass,
                                    'aria-controls': settings.sTableId,
                                    'tabindex': settings.iTabIndex,
                                    'id': idx === 0 && typeof button === 'string' ?
                                            settings.sTableId + '_' + button :
                                            null
                                })
                                        .append(jQuery('<a>', {
                                            'href': '#'
                                        })
                                                .html(btnDisplay)
                                                )
                                        .appendTo(container);

                                settings.oApi._fnBindAction(
                                        node, {action: button}, clickHandler
                                        );
                            }
                        }
                    }
                };

                attach(
                        jQuery(host).empty().html('<ul class="pagination"/>').children('ul'),
                        buttons
                        );
            };

// TableTools Bootstrap compatibility - Required TableTools 2.1+
            if (DataTable.TableTools) {
// Set the classes that TableTools uses to something suitable for Bootstrap
                jQuery.extend(true, DataTable.TableTools.classes, {
                    "container": "DTTT btn-group",
                    "buttons": {
                        "normal": "btn btn-default",
                        "disabled": "disabled"
                    },
                    "collection": {
                        "container": "DTTT_dropdown dropdown-menu",
                        "buttons": {
                            "normal": "",
                            "disabled": "disabled"
                        }
                    },
                    "print": {
                        "info": "DTTT_print_info"
                    },
                    "select": {
                        "row": "active"
                    }
                });

// Have the collection use a bootstrap compatible drop down
                jQuery.extend(true, DataTable.TableTools.DEFAULTS.oTags, {
                    "collection": {
                        "container": "ul",
                        "button": "li",
                        "liner": "a"
                    }
                });
            }
        };

// Init Datatables
        bsDataTables();
        initDataTableFull();
//$scope.loadUsers();
    }
]);

App.directive('userModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/user/views/user-modal.html'
        // templateUrl: '/src/assets/js/modules/user/views/user-modal.html'
    };
});

App.directive('userEditModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/user/views/user-modal-edit.html'
        // templateUrl: '/src/assets/js/modules/user/views/user-modal-edit.html'
    };
});

App.directive('userDeleteModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/user/views/user-modal-delete.html'
        // templateUrl: '/src/assets/js/modules/user/views/user-modal-delete.html'
    };
});
