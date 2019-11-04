/*
 *  Document   : controllers.js
 *  Author     : kikecolmenares
 *  Description: organization controllers
 *
 */

App.controller('OrganizationViewCtrl', ['$scope', '$localStorage', '$window', 'UserService', 'OrganizationService', '$http', '$state', '$timeout', '$stateParams', 'ProjectService',
    function ($scope, $localStorage, $window, UserService, OrganizationService, $http, $state, $timeout, $stateParams, ProjectService) {
        var organizationid = $stateParams.organizationId;
        var markers = [];

        // ProjectService.GetProjectsByOrganizationId($stateParams.organizationId)
        //             .then(function(data) {
        //                 console.log('GetProjectsByOrganizationId');
        //                 console.log(data);

        //             });
        // OrganizationService.GetById($stateParams.organizationId)
        OrganizationService.GetById($stateParams.organizationId)
                    .then(function (data){
                        $scope.organization = data.organization;
                    });

         ProjectService.GetProjectsByOrganizationId($stateParams.organizationId)
                    .then(function (data) {
                        $scope.projects = data.projects;
                        // Init Markers Map
                        var initMapMarkers = function () {
                            var mapMarkers =new GMaps({
                                div: '#js-map-markers',
                                lat: 41.850033,
                                lng: -87.6500523,
                                zoom: 3,
                                scrollwheel: false
                            });
                            
                            for (var i = 0; i < data.projects.length; i++) {
                                if (data.projects[i].address_1 != null) {
                                    // console.log(data.projects[i].name);
                                    var name = data.projects[i].name;
                                    
                                    GMaps.geocode({
                                        address: data.projects[i].address_1 + data.projects[i].city + data.projects[i].zip,
                                        callback: function (results, status) {
                                            if ((status === 'OK') && results) {

                                                var latlng = results[0].geometry.location;
                                                console.log(name);

                                                // mapSearch.removeMarkers();
                                                // mapSearch.addMarker({ lat: latlng.lat(), lng: latlng.lng() });
                                                 mapMarkers.addMarker({ lat: latlng.lat(), lng: latlng.lng() , title: name, animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>'+name+'</strong>'}});
                                                // markers.push({ lat: latlng.lat(), lng: latlng.lng() , title: name, animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>'+name+'</strong>'}});
                                                 mapMarkers.fitBounds(results[0].geometry.viewport);
                                            } else {
                                                alert('Address not found!');
                                            }

                                        }
                                    });
                                }
                            }

                            

                            //add Markers
                           // mapMarkers.addMarkers(markers);
                            // mapMarkers.addMarkers([
                            //     {lat: 37.70, lng: -122.49, title: 'Marker #1', animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>Marker #1</strong>'}},
                            //     {lat: 37.76, lng: -122.46, title: 'Marker #2', animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>Marker #2</strong>'}},
                            //     {lat: 37.72, lng: -122.41, title: 'Marker #3', animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>Marker #3</strong>'}},
                            //     {lat: 37.78, lng: -122.39, title: 'Marker #4', animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>Marker #4</strong>'}},
                            //     {lat: 37.74, lng: -122.46, title: 'Marker #5', animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>Marker #5</strong>'}}
                            // ]);

                        };

// console.log('markers----');
//                             console.log(markers);
                        // // var initMapSearch = function(){
                        // // // Init Map
                        // // var mapSearch = new GMaps({
                        // //     div: '#js-map-search',
                        // //     lat: 20,
                        // //     lng: 0,
                        // //     zoom: 2,
                        // //     scrollwheel: false
                        // // });

                        // // GMaps.geocode({
                        // //     address: data.project.address + data.project.city + data.project.zip,
                        // //     callback: function (results, status) {
                        // //         if ((status === 'OK') && results) {
                        // //             var latlng = results[0].geometry.location;

                        // //             mapSearch.removeMarkers();
                        // //             mapSearch.addMarker({ lat: latlng.lat(), lng: latlng.lng() });
                        // //             mapSearch.fitBounds(results[0].geometry.viewport);
                        // //         } else {
                        // //             alert('Address not found!');
                        // //         }
                        // //     }
                        // // });


                        // };
                        // initMapSearch();
                        initMapMarkers();
                    });


    }]);

App.controller('OrganizationCtrl', ['$scope', '$localStorage', '$window', 'UserService', 'OrganizationService', '$http', '$state', '$timeout',
    function ($scope, $localStorage, $window, UserService, OrganizationService, $http, $state, $timeout) {

        /*
         *Function Create Organization
         */
        $scope.createOrganization = function () {
            var isChecked = $('#val-activate').prop("checked");
            if ($scope.organizationname && $scope.phone && $scope.address)
            {
                var activation = 0;
//console.log('updating Organization...');
                if (isChecked) {
                    activation = 1;
                }
                // var activation = 0;
                // console.log('saving Organization...');
                // if ($scope.activate == true) {
                //     activation = 1;
                // }
// use $.param jQuery function to serialize data from JSON 
                var organization = $.param({
                    name: $scope.organizationname,
                    email: $scope.email,
                    phone: $scope.phone,
                    address: $scope.address,
                    address2: $scope.address2,
                    notes: $scope.notes,
                    active: activation,
                });
                OrganizationService.Create(organization)
                        .then(function (response) {
                            console.log(response);
                            if (response.success == false) {
                                swal("Error Creating new organization", "", "error");
                            } else {
                                swal("New Organization has been created", "", "success");
                                $state.go('organizations', {redirect: true});
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
                    'val-organizationname': {
                        required: true,
                        minlength: 3
                    },
                    'val-phone': {
                        required: true,
                        phoneUS: true
                    },
                    'val-address': {
                        required: true,
                        minlength: 3
                    }

                },
                messages: {
                    'val-organizationname': {
                        required: 'Please enter a name to the organization',
                        minlength: 'Organization name must consist of at least 3 characters'
                    },
                    'val-phone': {
                        required: 'Please enter a phone number',
                        minlength: 'Organization phone number must consist of at least 3 characters'
                    },
                    'val-address': {
                        required: 'Please enter an address for the organization',
                        minlength: 'Organization address must consist of at least 3 characters'
                    }
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

/*
 *  Description: organization list controller
 */
App.controller('OrganizationTablesCtrl', ['$scope', 'organizations', '$localStorage', '$window', '$http', 'localStorageService', '$timeout', 'OrganizationService', '$state', 'AuthenticationService', '$rootScope', 'ProjectService',
    function ($scope, organizations, $localStorage, $window, $http, localStorageService, $timeout, OrganizationService, $state, AuthenticationService, $rootScope, ProjectService) {
        /*
         *Function Reload
         */
        $scope.reload = function () {
            $state.reload();
        };
        $scope.organization = [];

        var orglist = [];

        $(document).on("click", ".view-organization", function () {
            var organizationid = $(this).data('id');
            OrganizationService.GetById(organizationid)
                    .then(function (data) {
                        $scope.organization = data.organization;
                        $('#modal-organization').modal('show');
                    });
        });

        $(document).on("click", ".view-organization-edit", function () {
            var organizationid = $(this).data('id');
            OrganizationService.GetById(organizationid)
                    .then(function (data) {
                        $scope.organization = data.organization;
                        $('#modal-organization-edit').modal('show');
                    });
        });

        $(document).on("click", ".view-organization-delete", function () {
            var organizationid = $(this).data('id');
            OrganizationService.GetById(organizationid)
                    .then(function (data) {
                        $scope.organization = data.organization;
                        $('#modal-organization-delete').modal('show');
                    });
        });


        /*
         *Function Update Organization
         */
        $scope.updateOrganization = function (organizationid) {
            var isChecked = $('#val-active').prop("checked");
//alert(isChecked);
            // console.log('updating org...');
            // console.log('$scope.id');
            // console.log($scope.organization.id);
            // console.log('$scope.organizationname');
            // console.log($scope.organization.name);
            // console.log('$scope.phone');
            // console.log($scope.organization.phone);
            // console.log('$scope.address');
            // console.log($scope.organization.address);


            if ($scope.organization.id && $scope.organization.name && $scope.organization.phone && $scope.organization.address)
            {
                var activation = 0;
//console.log('updating Organization...');
                if (isChecked) {
                    activation = 1;
                }
                console.log('$scope.active');
                console.log(activation);
// use $.param jQuery function to serialize data from JSON 
                var organization = $.param({
                    id: $scope.organization.id,
                    name: $scope.organization.name,
                    email: $scope.organization.email,
                    phone: $scope.organization.phone,
                    address: $scope.organization.address,
                    address2: $scope.organization.address2,
                    notes: $scope.organization.notes,
                    active: activation
                });
                OrganizationService.Update(organization, $scope.organization.id)
                        .then(function (response) {
                            //console.log(response);
                            if (response.success == false) {
                                swal("Error Updating new organization", "", "error");
                            } else {
                                localStorageService.remove('organizations');
                                swal("Organization has been updated", "", "success");

                                var oTable = $('.js-dataTable-full-2').dataTable();
                                oTable.fnClearTable();
                                oTable.fnDestroy();
                                organizations.fetchOrganizations(function (data) {

//   console.log('saving organization in localStorage...');
                            if (AuthenticationService.userHasRole(["super"])){
                                    localStorageService.set('organizations', data);
                                    //userslist = data;
                                } else {
                                    var filteredorganizations = data.filter(function (organization){
                                        return organization.id == $rootScope.loggeduser.user.organization_id;
                                    });
                                    localStorageService.set('organizations', filteredorganizations);
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

                                $('#modal-organization-edit').modal('hide');


//$state.go('organizations');
                            }
                        });
            }
        };

        $scope.deleteOrganization = function (organizationid) {
            console.log('id');
            console.log($scope.organization.id);
          ProjectService.GetUserCountByOrganizationId($scope.organization.id)
          .then(function(response){
            console.log('tiene users');
            console.log(response);
            if (response > 0){
                swal("Error Deleting this organization", "Users already assigned to this organization", "error");
                $('#modal-organization-delete').modal('hide');
            } else {
                if ($scope.organization.id && $scope.organization.name && $scope.organization.phone && $scope.organization.address)
            {
                var activation = 0;
//console.log('updating Organization...');
                var isChecked = $('#val-active').prop("checked");
                if (isChecked) {
                    activation = 1;
                }
                console.log('$scope.active');
                console.log(activation);

                OrganizationService.Delete($scope.organization.id)
                        .then(function (response) {
                            console.log(response);
                            if (response.success == false) {
                                swal("Error Delete this organization", "", "error");
                            } else {
                                localStorageService.remove('organizations');
                                swal("Organization has been Deleted", "", "success");

                                var oTable = $('.js-dataTable-full-2').dataTable();
                                oTable.fnClearTable();
                                oTable.fnDestroy();
                                organizations.fetchOrganizations(function (data) {

//   console.log('saving organization in localStorage...');
                                    localStorageService.set('organizations', data);
                                    orglist = data;

//   //$scope.organizationslist = data;
                                });
                                $timeout(function () {
//initDataTableFull();
                                    $state.reload();
                                }, 1000);

                                

                                $('#modal-organization-delete').modal('hide');


//$state.go('organizations');
                            }
                        });
            }
            }
            
          });
            
//document.getElementById("demo").innerHTML = x;
        };


// Init full DataTable, for more examples you can check out https://www.datatables.net/

        var initDataTableFull = function () {
            // organizations.fetchOrganizations(function (data) {
            //     localStorageService.set('organizations', data);
            //     orglist = data;
            // });


            organizations.fetchOrganizations(function (data) {
                if (AuthenticationService.userHasRole(["super"])){
                    console.log('user has role super');
                    console.log('data to localstorage');
                    console.log(data);
                localStorageService.set('organizations', data);
                //orglist = data;
            } else {
                // console.log('fetching filtered organizations');
                // console.log('$rootScope.loggeduser.organization_id');
                // console.log($rootScope.loggeduser.user.organization_id);
                var filteredorganizations = data.filter(function (organization){
                    // console.log('organization.id');
                    // console.log(organization.id)
                    return organization.id == $rootScope.loggeduser.user.organization_id;
                });
                 console.log('filteredorganizations');
                 console.log(filteredorganizations);
                localStorageService.set('organizations', filteredorganizations);
            }
        });

            console.log('init datatable...');
            $('.js-dataTable-full-2').dataTable({
                columnDefs: [{orderable: false, targets: [4]}],
                pageLength: 10,
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
                data: localStorageService.get('organizations'),
//data: dataset,
                "columns": [
                    //{"data": "id"},
                    {"data": "name",
                    "render": function (data, type, row) {

                      return "<a href='#/organization/" + row.id + "/view' data-ui-sref='organizationview({organizationId:" + row.id + "})'>"+data+"</a>";


                    }
                    },
                    {"data": "phone",
                        "className": "hidden-xs sorting"},
                    {"data": "notes",
                        "className": "hidden-xs sorting"},
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
                                actions = "<div class='btn-group'><button class='btn btn-xs btn-default view-organization' data-toggle='modal' data-id='" + data + "' href='#modal-organization' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-organization-edit' data-toggle='modal' data-id='" + data + "' href='#modal-organization-edit' type='button'><i class='fa fa-pencil'></i></button><button class='btn btn-xs btn-default view-organization-delete' data-toggle='modal' data-id='" + data + "' href='#modal-organization-delete' type='button' ng-click='initModalData()'><i class='fa fa-times'></i></button></div>";
                            } else {
                                actions = "<div class='btn-group'><button class='btn btn-xs btn-default view-organization' data-toggle='modal' data-id='" + data + "' href='#modal-organization' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-organization-edit' data-toggle='modal' data-id='" + data + "' href='#modal-organization-edit' type='button'><i class='fa fa-pencil'></i></button>";
                            
                            }
                            return actions;
                        }},
                ],
                createdRow: function (row, data, index) {
                    if (data.deleted_at)
                        //$(row).addClass('trashed-data');
                    $(row).addClass('hide');
                }

            });

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
                             { extend: 'excel',text: '<i class="fa fa-file-excel-o"></i>', className: 'btn btn-xs btn-default' , filename:'Organizations'},
                             { extend: 'csv',text: '<i class="fa fa-file-o"></i>', className: 'btn btn-xs btn-default' , filename:'Organizations'},
                             { extend: 'pdf',text: '<i class="fa fa-file-pdf-o"></i>', className: 'btn btn-xs btn-default' , filename:'Organizations'},
                             { extend: 'print',text: '<i class="fa fa-print"></i>', className: 'btn btn-xs btn-default', title:'LIot - Organizations'}
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

    }]);
// Organization Triggers controller
App.controller('OrganizationTriggersCtrl', ['$scope', '$stateParams', '$filter', 'urlBuilder', 'urls', '$state', '$timeout', '$sessionStorage', 'triggers', 'localStorageService', 'DatasourceService', 'TriggerService', 'ProjectService',
    function ($scope, $stateParams, $filter, urlBuilder, urls, $state, $timeout, $sessionStorage, triggers, localStorageService, DatasourceService, TriggerService, ProjectService) {
      $scope.triggerAskProject = function (){
        $('#modal-trigger-addask').modal('hide');

          $timeout(function () {
            $state.go('addtrigger', {projectId: $scope.selectedProject.id});
                                }, 1000);


      };

      $scope.deleteTrigger = function () {
            TriggerService.Delete($scope.trigger.id).then(function (response) {
                if (response.success === false) {
                    swal("Error deleting Trigger", "", "error");
                } else {
                    swal("Trigger has been Deleted", "", "success");
                    $timeout(function () {
                        $state.reload();
                    }, 1000);
                }
                $('#modal-trigger-delete').modal('hide');
            });
        };

       
        $scope.trigger = [];

        var Triglist = [];
        var datasources = [];
        var datapoints = [];

        

      $scope.reload = function () {
            $state.reload();
        };
        $(document).on("click", ".addask-trigger", function () {

                ProjectService.GetProjectsByOrganizationId($sessionStorage.loggeduser.user.organization_id)
                    .then(function (result) {
                        console.log(result);
                        var proj
                        for (var i = result.projects.length - 1; i >= 0; i--) {
                            //Things[i]
                            result.projects[i].proj_org = result.projects[i].name;

                        }
                        $scope.projects = result.projects;
                        //$scope.organizations = result;
                    });

                        $('#modal-trigger-addask').modal('show');

        });

        $(document).on("click", ".view-trigger", function () {
            var triggerid = $(this).data('id');
            //alert('triggerid: ' + triggerid);
            TriggerService.GetById(triggerid)
                    .then(function (response) {
                        console.log(response.trigger[0]);
                        $scope.trigger = response.trigger[0];
                        $('#modal-trigger-view').modal('show');
                    });
        });

        function myIndexOf(o, arr) {

            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name == o) {
                    return i;
                }
            }

            return -1;
        } 
$(document).on("click", ".view-trigger-edit", function () {
            var dataid = $(this).data('id');

            TriggerService.GetById(dataid).then(function (response) {
               $scope.trigger = angular.copy(response.trigger[0]);
               console.log('TRIGGER--->');
               console.log(response.trigger[0].project_id);
               
              DatasourceService.GetDatasourcesByProjectId(response.trigger[0].project_id)
                .then (function (rest) {
                    $scope.datasources = rest.datasources;
                    $scope.selectDatasourceObject = $scope.datasources[myIndexOf($scope.trigger.datasource_name, $scope.datasources)];
                });

                DatasourceService.GetDatapointsByDatasourceId($scope.trigger.datasource_id)
                .then(function (rest){
                    $scope.datapoints = rest.datapoints;
                    $scope.selectDatapointObject = $scope.datapoints[myIndexOf($scope.trigger.datapoint_name, $scope.datapoints)];

                });

                TriggerService.GetOperators()
                .then(function (rest){
                    $scope.operators = rest.operators;
                    $scope.selectOperatorObject = $scope.operators[myIndexOf($scope.trigger.operator_name, $scope.operators)];
                });

                TriggerService.GetTriggerTypes()
                .then(function (response) {
                                $scope.actions = response.trigger_action_types;
                                $scope.selectActionObject = $scope.actions[myIndexOf($scope.trigger.action_name, $scope.actions)];
                            });
                // Init simple wizard, for more examples you can check out http://vadimg.com/twitter-bootstrap-wizard-example/
        var initWizardSimple = function () {
            jQuery('.js-wizard-simple').bootstrapWizard({
                'tabClass': '',
                'firstSelector': '.wizard-first',
                'previousSelector': '.wizard-prev',
                'nextSelector': '.wizard-next',
                'lastSelector': '.wizard-last',
                'onTabShow': function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var percent = (current / total) * 100;

                    // Get vital wizard elements
                    var wizard = navigation.parents('.block');
                    var progress = wizard.find('.wizard-progress > .progress-bar');
                    var btnPrev = wizard.find('.wizard-prev');
                    var btnNext = wizard.find('.wizard-next');
                    var btnFinish = wizard.find('.wizard-finish');

                    // Update progress bar if there is one
                    if (progress) {
                        progress.css({width: percent + '%'});
                    }

                    // If it's the last tab then hide the last button and show the finish instead
                    if (current >= total) {
                        btnNext.hide();
                        btnFinish.show();
                    } else {
                        btnNext.show();
                        //Show Submit button for edit (any tab)
                        btnFinish.show();
                    }
                }
            });
        };

        // Init wizards with validation, for more examples you can check out http://vadimg.com/twitter-bootstrap-wizard-example/
        var initWizardValidation = function () {
            // Get forms
            var form1 = jQuery('.js-form1');
            var form2 = jQuery('.js-form2');

            // Prevent forms from submitting on enter key press
            form1.add(form2).on('keyup keypress', function (e) {
                var code = e.keyCode || e.which;

                if (code === 13) {
                    e.preventDefault();
                    return false;
                }
            });

            // Init form validation on classic wizard form
            var validator1 = form1.validate({
                errorClass: 'help-block animated fadeInDown',
                errorElement: 'div',
                errorPlacement: function (error, e) {
                    jQuery(e).parents('.form-group > div').append(error);
                },
                highlight: function (e) {
                    jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                    jQuery(e).closest('.help-block').remove();
                },
                success: function (e) {
                    jQuery(e).closest('.form-group').removeClass('has-error');
                    jQuery(e).closest('.help-block').remove();
                },
                rules: {
                    'validation-classic-firstname': {
                        required: true,
                        minlength: 2
                    },
                    'validation-classic-lastname': {
                        required: true,
                        minlength: 2
                    },
                    'validation-classic-email': {
                        required: true,
                        email: true
                    },
                    'validation-classic-details': {
                        required: true,
                        minlength: 5
                    },
                    'validation-classic-city': {
                        required: true
                    },
                    'validation-classic-skills': {
                        required: true
                    },
                    'validation-classic-terms': {
                        required: true
                    }
                },
                messages: {
                    'validation-classic-firstname': {
                        required: 'Please enter a firstname',
                        minlength: 'Your firtname must consist of at least 2 characters'
                    },
                    'validation-classic-lastname': {
                        required: 'Please enter a lastname',
                        minlength: 'Your lastname must consist of at least 2 characters'
                    },
                    'validation-classic-email': 'Please enter a valid email address',
                    'validation-classic-details': 'Let us know a few thing about yourself',
                    'validation-classic-skills': 'Please select a skill!',
                    'validation-classic-terms': 'You must agree to the service terms!'
                }
            });

            // Init form validation on the other wizard form
            var validator2 = form2.validate({
                errorClass: 'help-block text-right animated fadeInDown',
                errorElement: 'div',
                errorPlacement: function (error, e) {
                    jQuery(e).parents('.form-group > div').append(error);
                },
                highlight: function (e) {
                    jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                    jQuery(e).closest('.help-block').remove();
                },
                success: function (e) {
                    jQuery(e).closest('.form-group').removeClass('has-error');
                    jQuery(e).closest('.help-block').remove();
                },
                rules: {
                    'validation-firstname': {
                        required: true,
                        minlength: 2
                    },
                    'validation-lastname': {
                        required: true,
                        minlength: 2
                    },
                    'validation-email': {
                        required: true,
                        email: true
                    },
                    'validation-details': {
                        required: true,
                        minlength: 5
                    },
                    'validation-city': {
                        required: true
                    },
                    'validation-skills': {
                        required: true
                    },
                    'validation-terms': {
                        required: true
                    }
                },
                messages: {
                    'validation-firstname': {
                        required: 'Please enter a firstname',
                        minlength: 'Your firtname must consist of at least 2 characters'
                    },
                    'validation-lastname': {
                        required: 'Please enter a lastname',
                        minlength: 'Your lastname must consist of at least 2 characters'
                    },
                    'validation-email': 'Please enter a valid email address',
                    'validation-details': 'Let us know a few thing about yourself',
                    'validation-skills': 'Please select a skill!',
                    'validation-terms': 'You must agree to the service terms!'
                }
            });

            // Init classic wizard with validation
            jQuery('.js-wizard-classic-validation').bootstrapWizard({
                'tabClass': '',
                'previousSelector': '.wizard-prev',
                'nextSelector': '.wizard-next',
                'onTabShow': function (tab, nav, index) {
                    var total = nav.find('li').length;
                    var current = index + 1;

                    // Get vital wizard elements
                    var wizard = nav.parents('.block');
                    var btnNext = wizard.find('.wizard-next');
                    var btnFinish = wizard.find('.wizard-finish');

                    // If it's the last tab then hide the last button and show the finish instead
                    if (current >= total) {
                        btnNext.hide();
                        btnFinish.show();
                    } else {
                        btnNext.show();
                        btnFinish.hide();
                    }
                },
                'onNext': function (tab, navigation, index) {
                    var valid = form1.valid();

                    if (!valid) {
                        validator1.focusInvalid();

                        return false;
                    }
                },
                onTabClick: function (tab, navigation, index) {
                    return false;
                }
            });

            // Init wizard with validation
            jQuery('.js-wizard-validation').bootstrapWizard({
                'tabClass': '',
                'previousSelector': '.wizard-prev',
                'nextSelector': '.wizard-next',
                'onTabShow': function (tab, nav, index) {
                    var total = nav.find('li').length;
                    var current = index + 1;

                    // Get vital wizard elements
                    var wizard = nav.parents('.block');
                    var btnNext = wizard.find('.wizard-next');
                    var btnFinish = wizard.find('.wizard-finish');

                    // If it's the last tab then hide the last button and show the finish instead
                    if (current >= total) {
                        btnNext.hide();
                        btnFinish.show();
                    } else {
                        btnNext.show();
                        btnFinish.hide();
                    }
                },
                'onNext': function (tab, navigation, index) {
                    var valid = form2.valid();

                    if (!valid) {
                        validator2.focusInvalid();

                        return false;
                    }
                },
                onTabClick: function (tab, navigation, index) {
                    return false;
                }
            });
        };
        /*
         *Function Update trigger
         */
        $scope.updateTrigger  = function () {
            var isChecked = $('#val-active').prop("checked");

            if ($scope.trigger.id && $scope.selectDatasourceObject.id && $scope.selectDatapointObject.id && $scope.trigger.value && $scope.selectOperatorObject.id)
            {

                var activation = 0;
//console.log('updating Organization...');
                if (isChecked) {
                    activation = 1;
                }
                console.log('$scope.active');
                console.log(activation);
// use $.param jQuery function to serialize data from JSON 
                var trigger = $.param({
                    name: $scope.trigger.name,
                    operator: $scope.trigger.operator,
                    value: $scope.trigger.value,
                    trigger_action_type_id: $scope.selectOperatorObject.id,
                    project_id: $scope.trigger.project_id,
                    datasource_id: $scope.selectDatasourceObject.id,
                    datapoint_id: $scope.selectDatapointObject.id,
                    notes: $scope.trigger.notes,
                    active: activation

                });

                TriggerService.Update(trigger, $scope.trigger.id)
                        .then(function (response) {
                            console.log(response);
                            if (response.success == false) {
                                swal("Error Updating trigger", "", "error");
                            } else {
                                localStorageService.remove('triggers');
                                swal("Trigger has been updated", "", "success");

                                var oTable = $('.js-dataTable-full').dataTable();
                                oTable.fnClearTable();
                                oTable.fnDestroy();
                                triggers.fetchTriggers(function (data) {

//   console.log('saving user in localStorage...');
                                    localStorageService.set('triggers', data);
                                    tgrslist = data;

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

                                $('#modal-trigger-edit').modal('hide');


//$state.go('organizations');
                            }
                        });
            }
        };
                


        // Init simple wizard
        initWizardSimple();

        // Init wizards with validation
        initWizardValidation();
                


                $('#modal-trigger-edit').modal('show');
            });
        });

$(document).on("click", ".view-trigger-delete", function () {
                     // Init simple wizard, for more examples you can check out http://vadimg.com/twitter-bootstrap-wizard-example/
        var initWizardSimple = function () {
            jQuery('.js-wizard-simple').bootstrapWizard({
                'tabClass': '',
                'firstSelector': '.wizard-first',
                'previousSelector': '.wizard-prev',
                'nextSelector': '.wizard-next',
                'lastSelector': '.wizard-last',
                'onTabShow': function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var percent = (current / total) * 100;

                    // Get vital wizard elements
                    var wizard = navigation.parents('.block');
                    var progress = wizard.find('.wizard-progress > .progress-bar');
                    var btnPrev = wizard.find('.wizard-prev');
                    var btnNext = wizard.find('.wizard-next');
                    var btnFinish = wizard.find('.wizard-finish');

                    // Update progress bar if there is one
                    if (progress) {
                        progress.css({width: percent + '%'});
                    }

                    // If it's the last tab then hide the last button and show the finish instead
                    if (current >= total) {
                        btnNext.hide();
                        btnFinish.show();
                    } else {
                        btnNext.show();
                        //Show Submit button for edit (any tab)
                        btnFinish.show();
                    }
                }
            });
        };
            var dataid = $(this).data('id');
            TriggerService.GetById(dataid)
                    .then(function (response) {
                        console.log(response.trigger[0]);
                        $scope.trigger = response.trigger[0];
                        initWizardSimple();
                $('#modal-trigger-delete').modal('show');
            });
        });





      // Init full DataTable, for more examples you can check out https://www.datatables.net/
        var initDataTableFull = function () {
            function isOrganization(value) {
              return value.organization_id == $sessionStorage.loggeduser.user.organization_id;
            }
            function isProject(value) {
              return value.project_id == $sessionStorage.loggeduser.user.organization_id;
            }
            triggers.fetchTriggers(function (data) {
                var tgrlist = data.filter(isOrganization);
                // console.log('after filter');
                // console.log(tgrlist);
                localStorageService.set('triggers', tgrlist);
                trglist = data;
            });
            console.log('init datatable...');
            $('.js-dataTable-full-2').dataTable({
                columnDefs: [{orderable: false, targets: [4]}],
                pageLength: 10,
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
                data: localStorageService.get('triggers'),
//data: dataset,
                "columns": [
                    {"data": "id"},
                    {"data": "name"},
                    {"data": "project_name"},
                    {"data": "description",
                        "className": "hidden-xs sorting"},
                    {"data": "operator",
                        "className": "hidden-xs sorting"},
                    {"data": "value"},
                    {"data": "notes"},
                    {"data": "active",
                        "render": function (data, type, row) {
                            if (data == '1') {
                                return "<span class='label label-success'>enabled</span>";
                            }
                            return "<span class='label label-danger'>disabled</span>";

                        }
                    },
                    {"data": "id",
                        "orderable": false,
                        "render": function (data, type, row) {
// return "<div class='btn-group'><button class='btn btn-xs btn-default view-admin' data-toggle='modal' data-id='"+data+"' data-target='#modal-small' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default' type='button'><i class='fa fa-pencil'></i></button><button class='btn btn-xs btn-default' type='button'><i class='fa fa-times'></i></button></div>";
                            return "<div class='btn-group'><button class='btn btn-xs btn-default view-trigger' data-toggle='modal' data-id='" + data + "' href='#modal-trigger-view' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-trigger-edit' data-toggle='modal' data-id='" + data + "' href='#modal-trigger-edit' type='button'><i class='fa fa-pencil'></i></button><button class='btn btn-xs btn-default view-trigger-delete' data-toggle='modal' data-id='" + data + "' href='#modal-trigger-delete' type='button' ng-click='initModalData()'><i class='fa fa-times'></i></button></div>";
                        }},
                ],
                filter: function(value, index){
                    return value > 20 ? true : false;
                },
                createdRow: function (row, data, index) {
                    if (data.deleted_at)
                        //$(row).addClass('trashed-data');
                    $(row).addClass('hide');
                }

            });

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
                             { extend: 'excel',text: '<i class="fa fa-file-excel-o"></i>', className: 'btn btn-xs btn-default' , filename:'Triggers'},
                             { extend: 'csv',text: '<i class="fa fa-file-o"></i>', className: 'btn btn-xs btn-default' , filename:'Triggers'},
                             { extend: 'pdf',text: '<i class="fa fa-file-pdf-o"></i>', className: 'btn btn-xs btn-default' , filename:'Triggers'},
                             { extend: 'print',text: '<i class="fa fa-print"></i>', className: 'btn btn-xs btn-default', title:'Triggers' }
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

}
]);

// Organization Events controller
App.controller('OrganizationEventsCtrl', ['$scope', '$localStorage', '$window', 'EventService', '$sessionStorage', '$state',
    function ($scope, $localStorage, $window, EventService, $sessionStorage, $state) {
      //    console.log('$sessionStorage');
      // console.log($sessionStorage.loggeduser.user.organization_id);
      $scope.reload = function () {
            $state.reload();
        };
      var daten = new Date();
            var dn = daten.getDate();
            var mn = daten.getMonth();
            var yn = daten.getFullYear();
      var events_array = [];
      var events_array_2 = [{
        
                        title: 'Lights On',
                        start: new Date(yn, mn, 1),
                        color: '#faeab9'
                    
      }];
        EventService.GetAllByOrganizationId($sessionStorage.loggeduser.user.organization_id)
        .then(function(data){
            console.log('events---==-=-=');
            console.log(data.events);
            console.log('events-lenght--==-=-=');
            console.log(data.events.length);
            $scope.events = data.events;

             // Add new event in the event list
        var addEvent = function () {
            var eventInput = jQuery('.js-add-event');
            var eventInputVal = '';

            // When the add event form is submitted
            jQuery('.js-form-add-event').on('submit', function () {
                eventInputVal = eventInput.prop('value'); // Get input value

                // Check if the user entered something
                if (eventInputVal) {
                    // Add it to the events list
                    jQuery('.js-events')
                            .prepend('<li class="animated fadeInDown">' +
                                    jQuery('<div />').text(eventInputVal).html() +
                                    '</li>');

                    // Clear input field
                    eventInput.prop('value', '');

                    // Re-Init Events
                    initEvents();
                }

                return false;
            });
        };

        // Init drag and drop event functionality
        var initEvents = function () {
            jQuery('.js-events')
                    .find('li')
                    .each(function () {
                        var event = jQuery(this);

                        // create an Event Object
                        var eventObject = {
                            title: jQuery.trim(event.text()),
                            color: event.css('background-color')};

                        // store the Event Object in the DOM element so we can get to it later
                        jQuery(this).data('eventObject', eventObject);

                        // make the event draggable using jQuery UI
                        jQuery(this).draggable({
                            zIndex: 999,
                            revert: true,
                            revertDuration: 0
                        });
                    });
        };

        // Init FullCalendar
        var initCalendar = function () {
            // var date = new Date();
            // var d = date.getDate();
            // var m = date.getMonth();
            // var y = date.getFullYear();
            //add events to array
        for (var i = $scope.events.length - 1; i >= 0; i--) {
            // console.log('valueform----000---');
            // console.log($scope.events[i]['valueFrom']);
            var date = new Date(parseInt($scope.events[i]['valueFrom'])*1000);
            // console.log('valueform----000---ad date');
            // console.log(date);
            // console.log($scope.events[i]['valueFrom']);
            var d = date.getDate();
            // console.log('getDate');
            // console.log(d);
            var m = date.getMonth();
            // console.log('getMonth');
            // console.log(m);
            var y = date.getFullYear();
            // console.log('getFullYear');
            // console.log(y);
            var mm = date.getMinutes();
            // console.log('getMinutes');
            // console.log(m);
            var h = date.getHours();
            // console.log('getHours');
            // console.log(h);
            var event_to_array = {
                            "title" : $scope.events[i]['title'],   
                            "start" : new Date(y, m, d, h, mm),
                            "color": '#faeab9'
                            
                                            
                            };

            events_array.push(event_to_array);
            
        }
        // console.log('events array');
        // console.log(events_array);
        // console.log('events array2');
        // console.log(events_array_2);

            jQuery('.js-calendar').fullCalendar({
                loading: function(bool) {
                  if (bool) 
                    //$('#loading').show();
                    $scope.helpers.uiBlocks('#calendarcontainer', 'state_loading');
                  else 
                      $scope.helpers.uiBlocks('#calendarcontainer', 'state_normal');
                },
                firstDay: 1,
                //editable: true,
                //droppable: true,
                header: {
                    left: 'title',
                    right: 'prev,next month,agendaWeek,agendaDay'
                },
                // drop: function (date, allDay) { // this function is called when something is dropped
                //     // retrieve the dropped element's stored Event Object
                //     var originalEventObject = jQuery(this).data('eventObject');

                //     // we need to copy it, so that multiple events don't have a reference to the same object
                //     var copiedEventObject = jQuery.extend({}, originalEventObject);

                //     // assign it the date that was reported
                //     copiedEventObject.start = date;

                //     // render the event on the calendar
                //     // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                //     jQuery('.js-calendar').fullCalendar('renderEvent', copiedEventObject, true);

                //     // remove the element from the "Draggable Events" list
                //     jQuery(this).remove();
                // },
                events: events_array,
                // events: [
                //     {
                //         title: 'Lights On',
                //         start: new Date(y, m, 1),
                //         allDay: true,
                //         color: '#faeab9'
                //     },
                //     {
                //         title: 'Lights Off',
                //         start: new Date(y, m, 2)
                //     },
                //     {
                //         title: 'AC On',
                //         start: new Date(y, m, 5),
                //         end: new Date(y, m, 8),
                //         allDay: true,
                //         color: '#fac5a5'
                //     },
                //     {
                //         title: 'AC Off',
                //         start: new Date(y, m, 9),
                //         end: new Date(y, m, 11),
                //         allDay: true,
                //         color: '#fac5a5'
                //     },
                //     {
                //         id: 999,
                //         title: 'AC check (repeated)',
                //         start: new Date(y, m, d - 3, 15, 0)
                //     },
                //     {
                //         id: 999,
                //         title: 'AC Check (repeated)',
                //         start: new Date(y, m, d + 2, 15, 0)
                //     },
                //     {
                //         title: 'Temperature Check',
                //         start: new Date(y, m, d - 1),
                //         end: new Date(y, m, d - 1),
                //         allDay: true,
                //         color: '#faeab9'
                //     },
                //     {
                //         title: 'Lights Check',
                //         start: new Date(y, m, d + 5, 14, 00),
                //         color: '#fac5a5'
                //     },
                //     {
                //         title: 'Weekend setup',
                //         start: new Date(y, m, d, 9, 0),
                //         end: new Date(y, m, d, 12, 0),
                //         allDay: true,
                //         color: '#faeab9'
                //     },
                //     {
                //         title: 'AC Temperature Control',
                //         start: new Date(y, m, 15),
                //         end: new Date(y, m, 16),
                //         allDay: true,
                //         color: '#faeab9'
                //     },
                //     {
                //         title: 'Iot Service Manteinance',
                //         start: new Date(y, m, d + 8, 21, 0),
                //         end: new Date(y, m, d + 8, 23, 30),
                //         allDay: true
                //     },
                //     {
                //         title: 'Device check',
                //         start: new Date(y, m, 23),
                //         end: new Date(y, m, 25),
                //         allDay: true,
                //         url: 'http://twitter.com/pixelcave',
                //         color: '#32ccfe'
                //     }
                // ]
            });
        };

        // Add Event functionality
        addEvent();

        // FullCalendar, for more examples you can check out http://fullcalendar.io/
        initEvents();
        initCalendar();



        });

        

       
    }
]);

// Organization Reports controller
App.controller('OrganizationReportsCtrl', ['$scope', '$stateParams', '$filter', 'urlBuilder', 'urls', '$state', '$timeout', '$sessionStorage', 'organizations', 'AuthenticationService', 'OrganizationService', 'ProjectService', 'DatapointService',
    function ($scope, $stateParams, $filter, urlBuilder, urls, $state, $timeout, $sessionStorage, organizations, AuthenticationService, OrganizationService, ProjectService, DatapointService) {
$scope.disabled = true;

      //$scope.getProjectsOptions = function (){
          ProjectService.GetProjectsByOrganizationId($sessionStorage.loggeduser.user.organization_id).then(function (response) {
              $scope.projects = response.projects;
          });
      //};
      $scope.getDatapointsOptions = function () {
          ProjectService.GetDatapointsByDatasourceId($scope.selectedDatasource).then(function (response) {
              $scope.datapoints = response.datapoints;
          });
      };
      $scope.getDatasourcesOptions = function () {
          ProjectService.GetDatasourcesByProjectId($scope.selectedProject).then(function (response) {
              console.log(response.datasources);
              $scope.datasources = response.datasources;
          });

      };

      $scope.enableGenerateButton = function () {
              $scope.disabled = false;
          };



      $scope.resetform = function(){
        $scope.daterange1 = "";
        $scope.daterange2 = "";
        $scope.selectedOrganization = "";
        $scope.selectedProject = "";
        $scope.selectedDatasource = "";
        $scope.selectedDatapoint = "";
      };

      $scope.whatClassIsIt= function(value){
        if(value=="3")
          {return "si si-bell bg-smooth"}
        else if(value=="2")
          {return "si si-screen-smartphone bg-default";}
        else if(value=="1")
          {return "si si-envelope bg-flat";}
        else 
          {return "fa fa-flash"}
      }

      $scope.printDiv = function (){
        html2canvas([document.getElementById('printableArea')], {
        onrendered: function(canvas) {
        // canvas is the final rendered <canvas> element
        var img_report    = canvas.toDataURL("image/png");

            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWin.window.focus();
        popupWin.document.write('<!DOCTYPE html><html><head>' +
            '<title>TiOS - IOT Platform Report</title>' +
            '<link rel="stylesheet" id="css-bootstrap" href="assets/css/bootstrap.min.css">' + 
            '</head><body onload="window.print()"><img src="'+img_report+'"/></body></html>');
        popupWin.onbeforeunload = function (event) {
            popupWin.close();
            return '.\n';
        };
        popupWin.onabort = function (event) {
            popupWin.document.close();
            popupWin.close();
        }
    } else {
        var popupWin = window.open('', '_blank', 'width=800,height=600');
        popupWin.document.open();
        popupWin.document.write('<!DOCTYPE html><html><head>' +
            '<link rel="stylesheet" id="css-bootstrap" href="assets/css/bootstrap.min.css">' + 
            '</head><body onload="window.print()"><img src="'+img_report+'"/></body></html>');
        popupWin.document.close();
    }
    popupWin.document.close();

    return true;


    }
});
      }


      // organizations.fetchOrganizations(function (data) {
      //   if (AuthenticationService.userHasRole(["super"])){
      //     OrganizationService.GetAll()
      //     .then(function (data) {
      //       $scope.organizations = data.organizations;
      //     });
      //   } else {
      //     var filteredorganizations = data.filter(function (organization){
      //       return organization.id == $rootScope.loggeduser.user.organization_id;
      //     });
      //     $scope.organizations = filteredorganizations;
      //   }
      // });
      //Create Online Report
      $scope.createOnlineReport = function(){
        console.log('Organization Selected');
        console.log($scope.selectedOrganization);
        console.log('Project Selected');
        console.log($scope.selectedProject);
        console.log('Datasource Selected');
        console.log($scope.selectedDatasource);
        console.log('Datapoint Selected');
        console.log($scope.selectedDatapoint);
        console.log('from date');
        console.log($scope.daterange1);
        console.log('to date');
        console.log($scope.daterange2);

        if($scope.daterange1 != ''){
          var dateObject1 = (new Date($scope.daterange1).getTime()/1000);
          //var theUnixTime1 = dateObject1..getTime();
          var dateObject2 = (new Date($scope.daterange2).getTime()/1000);
          //var theUnixTime2 = dateObject2..getTime();
           console.log('from date Unixtime');
          console.log(dateObject1);
          console.log('to date Unixtime');
          console.log(dateObject2);

        } else {
          var dateObject1 = 0;
          var dateObject2 = 0;
        }
        

        if($scope.selectedDatapoint != null){
          DatapointService.GetById($scope.selectedDatapoint)
          .then(function(data){
            $scope.datapoint = data.datapoint;
          });
          DatapointService.getDatapointValuesByDateRange($scope.selectedDatapoint, dateObject1, dateObject2)
          .then(function(response){
            if (response.success == false) {
                $.notify({
                        // options
                        icon: 'glyphicon glyphicon-warning-sign',
                        message: 'Error getting the data.'
                        },{
                        // settings
                        type: 'danger',
                        //allow_dismiss: false,
                        delay: 0,
                        icon_type: 'class',
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutUp'
                        },
                        });
                    } else {

            }
            console.log('datapointvalues----->');
            console.log(response);
            $scope.datapointvalues = response;
            ///get last read
            console.log('last read------>');
            console.log($scope.datapointvalues.sensordata[0].created_at);
            $scope.lastread = $scope.datapointvalues.sensordata[0].created_at;
             //////
        //Line Chart
         var initChartsChartJS = function () {
            // Get Chart Containers
            var chartLinesCon = jQuery('.js-chartjs-lines-report')[0].getContext('2d');
            // var chartBarsCon = jQuery('.js-chartjs-bars')[0].getContext('2d');
            // var chartRadarCon = jQuery('.js-chartjs-radar')[0].getContext('2d');

            // Set Chart and Chart Data variables
            var chartLines, chartBars, chartRadar;
            var chartLinesBarsRadarData;

            // Set global chart options
            var globalOptions = {
                scaleFontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                scaleFontColor: '#999',
                scaleFontStyle: '600',
                tooltipTitleFontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                tooltipCornerRadius: 3,
                maintainAspectRatio: false,
                responsive: true,
            };

            //var lineChartLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
            // var lineChartLabels = function (){

            //   for (var i = $scope.datapointvalues.sensordata.length - 1; i >= 0; i--) {
            //     $scope.datapointvalues.sensordata[i].created_at
            //   }
            //   return ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
            // }

          //Mock Data
           // Lines/Bar/Radar Chart Data
            var chartLinesBarsRadarData = {
                 labels: _.pluck($scope.datapointvalues.sensordata, '_blank'),
                //labels: ["", "", "", "", "", "", ""], // To hide horizontal labels
                datasets: [
                    // {
                    //     label: 'Last Week',
                    //     fillColor: 'rgba(220,220,220,.3)',
                    //     strokeColor: 'rgba(220,220,220,1)',
                    //     pointColor: 'rgba(220,220,220,1)',
                    //     pointStrokeColor: '#fff',
                    //     pointHighlightFill: '#fff',
                    //     pointHighlightStroke: 'rgba(220,220,220,1)',
                    //     data: [30, 32, 40, 45, 43, 38, 55]
                    // },
                    {
                        label: 'Selected Period',
                        fillColor: 'rgba(171, 227, 125, .3)',
                        strokeColor: 'rgba(171, 227, 125, 1)',
                        pointColor: 'rgba(171, 227, 125, 1)',
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(171, 227, 125, 1)',
                        data: _.pluck($scope.datapointvalues.sensordata, 'data')
                    }
                ]
            };

            // Init Charts
            chartLines = new Chart(chartLinesCon).Line(chartLinesBarsRadarData, globalOptions);
            // chartBars = new Chart(chartBarsCon).Bar(chartLinesBarsRadarData, globalOptions);
            // chartRadar = new Chart(chartRadarCon).Radar(chartLinesBarsRadarData, globalOptions);


          };     
        //Pie Chart
        var initChartsFlot = function () {
          console.log('pie config....');
          console.log($scope.datapointvalues.triggersnotifications);
          var flotPie = jQuery('.js-flot-pie-report');
          // Pie Chart
            jQuery.plot(flotPie,
                    [
                        {
                            label: 'SMS',
                            data: $scope.datapointvalues.triggersnotifications.sms_count
                        },
                        {
                            label: 'Email',
                            data: $scope.datapointvalues.triggersnotifications.email_count
                        },
                        {
                            label: 'System Notification',
                            data: $scope.datapointvalues.triggersnotifications.push_count
                        },
                        {
                            label: 'On Trigger',
                            data: $scope.datapointvalues.triggersnotifications.on_count
                        },
                        {
                            label: 'Off Trigger',
                            data: $scope.datapointvalues.triggersnotifications.off_count
                        }
                    ],
                    {
                        colors: ['#5c90d2', '#44b4a6', '#ff6c9d', '#abe37d', '#fadb7d'],
                        legend: {show: false},
                        series: {
                            pie: {
                                show: true,
                                radius: 1,
                                label: {
                                    show: true,
                                    radius: 2 / 3,
                                    formatter: function (label, pieSeries) {
                                        return '<div class="flot-pie-label">' + label + '<br>' + Math.round(pieSeries.percent) + '%</div>';
                                    },
                                    background: {
                                        opacity: .75,
                                        color: '#000000'
                                    }
                                }
                            }
                        }
                    }
            );
        }
        initChartsChartJS();
        initChartsFlot();
        //////

          });


        }


      }
    }
    ]);

// Organization Triggers controller
App.controller('OrganizationNotificationsCtrl', ['$scope', '$stateParams', '$filter', 'urlBuilder', 'urls', '$state', '$timeout', '$sessionStorage', 'TriggerService',
    function ($scope, $stateParams, $filter, urlBuilder, urls, $state, $timeout, $sessionStorage, TriggerService) {
         // function toTimestamp(strDate){
      //    var datum = Date.parse(strDate);
      //    return datum/1000;
      // }
      console.log('$sessionStorage');
      console.log($sessionStorage.loggeduser.user.organization_id);
      var deleteTN = function (id){
        TriggerService.DeleteNotificationById(id)
        .then(function(response){

          if (response.success == false) {
                //$('#modal-delete-dashboard').modal('hide');
                //swal("Error Deleting This Trigger Notification", "", "error");
                $.notify({
                // options
                icon: 'glyphicon glyphicon-warning-sign',
                message: "Error Deleting This Trigger Notification"
                },{
                // settings
                type: 'warning',
                //allow_dismiss: false,
                delay: 0,
                icon_type: 'class',
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
                });
            } else {
                //$('#modal-delete-dashboard').modal('hide');
                //swal("Trigger Notification has been deleted", "", "success");
                $.notify({
                // options
                icon: 'glyphicon glyphicon-warning-sign',
                message: "Trigger Notification has been deleted"
                },{
                // settings
                type: 'success',
                //allow_dismiss: false,
                delay: 0,
                icon_type: 'class',
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
                });
            }
            // $timeout(function () {
            //     //initDataTableFull();
            //     $state.reload();
            // }, 3000);

        });
      };

       /*
         *Function Reload
         */
        $scope.reload = function () {
            $state.reload();
        };

        $scope.deleteTrigNot = function (id) {
          $scope.helpers.uiBlocks('#notificationtable', 'state_loading');
          deleteTN(id);
          getNotifications();
          setTimeout(function () {
                                    //$state.reload();
                                    //$scope.getNotifications();
                                    $scope.helpers.uiBlocks('#notificationtable', 'state_normal');
                                }, 3000);
        };

        $scope.panelLoading = function() {
          $scope.helpers.uiBlocks('#notificationtable', 'state_loading');
          getNotifications();
          //$state.reload();
          // setTimeout(function () {
          //                          $state.reload();
          //                       }, 4000);
          setTimeout(function () {
                                    //$state.reload();
                                    //$scope.getNotifications();
                                    $scope.helpers.uiBlocks('#notificationtable', 'state_normal');
                                }, 3000);

        };
// alert(toTimestamp('02/13/2009 23:31:30'));
      //Get Notifications
      var getNotifications = function(){

        TriggerService.GetTriggersNotificationByOrganizatioId($sessionStorage.loggeduser.user.organization_id)
      .then(function (data){
        // console.log('notifications--->');
        // console.log(data);
        //$scope.timelinedate = toTimestamp()
        for (var i = data.notifications.length - 1; i >= 0; i--) {
          data.notifications[i].created_at = new Date(data.notifications[i].created_at);
          
        }
        $scope.notifications = data.notifications;
      });
      }
      

      $scope.whatClassIsIt= function(value){
     if(value=="3")
            {return "si si-bell bg-smooth"}
     else if(value=="2")
         {return "fa fa-mobile-phone bg-default";}
     else if(value=="1")
         {return "si si-envelope bg-flat";}
       else 
        {return "fa fa-flash"}
    }

getNotifications();


}
]);

App.directive('organizationModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/organization/views/organization-modal.html'
        //templateUrl: '/src/assets/js/modules/organization/views/organization-modal.html'
    };
});

App.directive('organizationEditModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/organization/views/organization-modal-edit.html'
        // templateUrl: '/src/assets/js/modules/organization/views/organization-modal-edit.html'
    };
});

App.directive('organizationDeleteModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/organization/views/organization-modal-delete.html'
        // templateUrl: '/src/assets/js/modules/organization/views/organization-modal-delete.html'
    };
});
