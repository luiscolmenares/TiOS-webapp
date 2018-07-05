/*
*  Description: spaces list controller
*/
App.controller('SpaceTablesCtrl', ['$scope', 'spaces', '$localStorage', '$window', '$http', 'localStorageService', 'ProjectService', '$state', 'OrganizationService', 'AuthenticationService', '$rootScope', '$timeout', 'SpaceService', '$stateParams',
    function ($scope, spaces, $localStorage, $window, $http, localStorageService, ProjectService, $state, OrganizationService, AuthenticationService, $rootScope, $timeout, SpaceService, $stateParams) {
/*
*Function Reload
*/
$scope.reload = function () {
    $state.reload();
};
$scope.project = [];
$scope.organizations = [];
//Obtenemos las organizaciones y los mandamos al scope
OrganizationService.GetAll()
.then(function (result) {
    console.log(result);
    $scope.organizations = result.organizations;
});
var projectlist = [];
function myIndexOf(o, arr) {

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].name == o.name && arr[i].id == o.id) {
            return i;
        }
    }

    return -1;
}

$(document).on("click", ".add-space", function () {
    // alert($stateParams.projectId);
    $scope.project_id = $stateParams.projectId;
    OrganizationService.GetByProjectId($scope.project_id)
    .then(function (result) {
        $scope.organization_id = result.organization.id;
        // console.log(results);
    });

    $('#modal-space-add').modal('show');
});

$(document).on("click", ".view-space", function () {
    var spaceid = $(this).data('id');
    SpaceService.GetById(spaceid)
    .then(function (data) {
        $scope.space = data.space;
        $('#modal-space').modal('show');
    });
});

$scope.spaceslist = [];

 $scope.loadSpaces = function () {
            console.log('loading spaces');
            SpaceService.GetSpacesByProjectId($stateParams.projectId).then(function (response) {
                console.log('from spaces service--->');
                console.log(response.spaces);
                $scope.spaceslist = response.spaces;
            });
        };

$(document).on("click", ".view-space-edit", function () {
    var spaceid = $(this).data('id');
    SpaceService.GetById(spaceid)
    .then(function (data) {
        console.log(data);
        $scope.space = data;
// //Obtenemos la organizacion
// OrganizationService.GetByProjectId($stateParams.projectId)
// .then(function (result) {
// //Mandamos el organization al scope
// // console.log(result.organization);
// // console.log($scope.organizations);
// $scope.organization = result.organization;
// //en el array de organization, poneos el role del user como default
// $scope.selectOrganizationObject = $scope.organizations[myIndexOf($scope.organization, $scope.organizations)];
// console.log('organization Objeto selecceionado ---');
// console.log(myIndexOf($scope.organization, $scope.organizations));
// console.log($scope.selectOrganizationObject);

// });
$('#modal-space-edit').modal('show');
});
});

$(document).on("click", ".view-space-delete", function () {
    var spaceid = $(this).data('id');
    SpaceService.GetById(spaceid)
    .then(function (data) {
        $scope.space = data.space;
// console.log(data.space);
OrganizationService.GetBySpaceId(spaceid)
.then(function (result) {
//Mandamos el organization al scope
// console.log(result.organization);
// console.log($scope.organizations);
$scope.organization = result.organization;
//en el array de organization, poneos el role del user como default
$scope.selectOrganizationObject = $scope.organizations[myIndexOf($scope.organization, $scope.organizations)];
// console.log('organization Objeto selecceionado ---');
// console.log(myIndexOf($scope.organization, $scope.organizations));
// console.log($scope.selectOrganizationObject);

});
$('#modal-spaces-delete').modal('show');
});
});


/*
*Function Update Space
*/
$scope.updateSpace = function (spaceid) {
    // var isChecked = $('#val-active').prop("checked");

    if ($scope.space.id && $scope.space.name)
    {
        var activation = 0;

// use $.param jQuery function to serialize data from JSON 
var space = $.param({
    id: $scope.space.id,
    name: $scope.space.name,
    image: $scope.space.image,
    project_id: $scope.space.project_id,
    organization_id: $scope.space.organization_id
});
SpaceService.Update(space, $scope.space.id)
.then(function (response) {
    console.log(response);
    if (response.success == false) {
        swal("Error Updating space", "", "error");
    } else {
        localStorageService.remove('spaces');
        swal("Space has been updated", "", "success");

        // var oTable = $('.js-dataTable-full').dataTable();
        // oTable.fnClearTable();
        // oTable.fnDestroy();
        // spaces.fetchSpaces(function (data) {
        //     if (AuthenticationService.userHasRole(["super"])){
        //         localStorageService.set('spaces', data);
        //     } else {
        //         var filteredspaces = data.filter(function (space){
        //             return space.organization_id == $rootScope.loggeduser.user.organization_id;
        //         });
        //         localStorageService.set('spaces', filteredspaces);
        //     }

        // });
        $timeout(function () {

            $state.reload();
        }, 1000);

        $('#modal-space-edit').modal('hide');

    }
});
}
};
/*
*Function create space
*/
$scope.createSpace= function () {
    console.log('$scope.space!!!!');
console.log($scope);

    if ($scope.name)
    {

// use $.param jQuery function to serialize data from JSON 
var space = $.param({
    name: $scope.name,
    image: 'space.jpg',
    organization_id: $scope.organization_id,
    project_id: $scope.project_id,
});
SpaceService.Create(space)
.then(function (response) {
   //console.log(response);
    if (response.success == false) {
        swal("Error creating Space", "", "error");
    } else {
        swal("New Space created!", "", "success");
//         var oTable = $('.js-dataTable-full-2').dataTable();
//         oTable.fnClearTable();
//     oTable.fnDestroy();
//     sportevents.fetchSportevents(function (data) {

// //  //console.log('saving organization in localStorage...');

//     localStorageService.set('sportevents', data);


// //   //$scope.organizationslist = data;
// });
    $timeout(function () {
//initDataTableFull();
$state.reload();
}, 1000);

        $('#modal-space-add').modal('hide');
    }
});

}

};
$scope.deleteSpace = function () {
    SpaceService.GetUserCountBySpaceId($scope.space.id)
    .then(function(response){
        console.log('tiene users');
        console.log(response);
        if (response > 0){
            swal("Error Deleting this space", "Users already assigned to this space.", "error");
            $('#modal-spaces-delete').modal('hide');
        } else { 
            SpaceService.GetDashboardCountByOrganizationId($scope.space.id)
            .then(function(resp) {
                console.log('tiene dashboard');
                console.log(resp);
                if (resp >0){
                    swal("Error Deleting this space", "Dashboards already created to this space.", "error");
                    $('#modal-spaces-delete').modal('hide');
                } else{
                    SpaceService.GetDatasourceCountBySpaceId($scope.space.id)
                    .then(function(res){
                        console.log('tiene datasource');
                        console.log(res);
                        if(res > 0){
                            swal("Error Deleting this space", "Datasources already created to this space.", "error");
                            $('#modal-spaces-delete').modal('hide');
                        } else {
                            SpaceService.GetTriggerCountBySpaceId($scope.space.id)
                            .then(function(data){
                                console.log('tiene Triggers');
                                console.log(data);
                                if (data > 0){
                                    swal("Error Deleting this space", "Triggers already created to this space.", "error");
                                    $('#modal-spaces-delete').modal('hide');
                                } else {
                                   SpaceService.Delete($scope.space.id)
                                   .then(function (response) {
                                    if (response.success == false) {
                                        swal("Error Deleting This Space", "", "error");
                                    } else {
                //$state.reload();
                localStorageService.remove('spaces');
                swal("This Space has been deleted", "", "success");

                var oTable = $('.js-dataTable-full-2').dataTable();
                oTable.fnClearTable();
                oTable.fnDestroy();
                spaces.fetchSpaces(function (data) {
                    localStorageService.set('spaces', data);
                    spacelist = data;
                });

                $timeout(function () {
//initDataTableFull();
$state.reload();
}, 1000);
                $('#modal-spaces-delete').modal('hide');
            }
        });
                               }
                           });

                        }
                    });

                }
            });

        }
    });

};

// // Init full DataTable, for more examples you can check out https://www.datatables.net/

// var initDataTableFull = function () {

//     // spaces.fetchSpaces(function (data) {
//     //     if (AuthenticationService.userHasRole(["super"])){
//     //         localStorageService.set('spaces', data);
//     //     } else {
//     //         var filteredspaces = data.filter(function (space){
//     //             return space.organization_id == $rootScope.loggeduser.user.organization_id;
//     //         });
//     //         localStorageService.set('spaces', filteredspaces);
//     //     }
//     // });

//     console.log('init datatable...');
//     $('.js-dataTable-full-spaces').dataTable({
//         columnDefs: [{orderable: false, targets: [4]}],
//         pageLength: 10,
//         lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
//         // data: localStorageService.get('spaces'),
//         data: $scope.spaceslist,
// //data: dataset,
// "columns": [
// {"data": "id"},
// {"data": "name"},
// {"data": "organization_id"},
// {"data": "project_id"},
// // {"data": "active",
// // "render": function (data, type, row) {
// // // If display or filter data is requested, format the date
// // if (data == '1') {
// //     return "<span class='label label-success'>enabled</span>";
// // }

// // // Otherwise the data type requested (`type`) is type detection or
// // // sorting data, for which we want to use the integer, so just return
// // // that, unaltered
// // return "<span class='label label-danger'>disabled</span>";

// // }
// // },
// {"data": "id",
// "orderable": false,
// "render": function (data, type, row) {
//     var actions = "";
//     if (AuthenticationService.userHasRole(["super", "admin", "owner"])){
//         actions = "<div class='btn-group'><button class='btn btn-xs btn-default view-space' data-toggle='modal' data-id='" + data + "' href='#modal-space' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-space-edit' data-toggle='modal' data-id='" + data + "' href='#modal-space-edit' type='button'><i class='fa fa-pencil'></i></button><button class='btn btn-xs btn-default view-space-delete' data-toggle='modal' data-id='" + data + "' href='#modal-space-delete' type='button' ng-click='initModalData()'><i class='fa fa-times'></i></button></div>";
//     } else {
//         actions = "<div class='btn-group'><button class='btn btn-xs btn-default view-space' data-toggle='modal' data-id='" + data + "' href='#modal-space' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-space-edit' data-toggle='modal' data-id='" + data + "' href='#modal-space-edit' type='button'><i class='fa fa-pencil'></i></button></div>";

//     }
//     return actions;
// }},
// ],
// createdRow: function (row, data, index) {
//     if (data.deleted_at)
// // $(row).addClass('trashed-data');
// $(row).addClass('hide');
// }

// });

// };



// // DataTables Bootstrap integration
// var bsDataTables = function () {
//     var DataTable = jQuery.fn.dataTable;

// // Set the defaults for DataTables init
// jQuery.extend(true, DataTable.defaults, {
//     dom:
//     "<'row'<'col-sm-6'l><'col-sm-6 text-right btn-group'B>>" +
//     "<'row'<'col-sm-6'i><'col-sm-6'f>>" +
//     "<'row'<'col-sm-12'tr>>" +
//     "<'row'<'col-sm-12'p>>",
//     renderer: 'bootstrap',
//     buttons: [
//     { extend: 'copy', text: '<i class="fa fa-copy"></i>', className: 'btn btn-xs btn-default' },
//     { extend: 'excel',text: '<i class="fa fa-file-excel-o"></i>', className: 'btn btn-xs btn-default' , filename:'Spaces'},
//     { extend: 'csv',text: '<i class="fa fa-file-o"></i>', className: 'btn btn-xs btn-default' , filename:'Spaces'},
//     { extend: 'pdf',text: '<i class="fa fa-file-pdf-o"></i>', className: 'btn btn-xs btn-default' , filename:'Spaces'},
//     { extend: 'print',text: '<i class="fa fa-print"></i>', className: 'btn btn-xs btn-default', title:'Spaces' }
//     ],
//     oLanguage: {
//         sLengthMenu: "_MENU_",
//         sInfo: "Showing <strong>_START_</strong>-<strong>_END_</strong> of <strong>_TOTAL_</strong>",
//         oPaginate: {
//             sPrevious: '<i class="fa fa-angle-left"></i>',
//             sNext: '<i class="fa fa-angle-right"></i>'
//         }
//     }
// });

// // Default class modification
// jQuery.extend(DataTable.ext.classes, {
//     sWrapper: "dataTables_wrapper form-inline dt-bootstrap",
//     sFilterInput: "form-control",
//     sLengthSelect: "form-control"
// });

// // Bootstrap paging button renderer
// DataTable.ext.renderer.pageButton.bootstrap = function (settings, host, idx, buttons, page, pages) {
//     var api = new DataTable.Api(settings);
//     var classes = settings.oClasses;
//     var lang = settings.oLanguage.oPaginate;
//     var btnDisplay, btnClass;

//     var attach = function (container, buttons) {
//         var i, ien, node, button;
//         var clickHandler = function (e) {
//             e.preventDefault();
//             if (!jQuery(e.currentTarget).hasClass('disabled')) {
//                 api.page(e.data.action).draw(false);
//             }
//         };

//         for (i = 0, ien = buttons.length; i < ien; i++) {
//             button = buttons[i];

//             if (jQuery.isArray(button)) {
//                 attach(container, button);
//             } else {
//                 btnDisplay = '';
//                 btnClass = '';

//                 switch (button) {
//                     case 'ellipsis':
//                     btnDisplay = '&hellip;';
//                     btnClass = 'disabled';
//                     break;

//                     case 'first':
//                     btnDisplay = lang.sFirst;
//                     btnClass = button + (page > 0 ? '' : ' disabled');
//                     break;

//                     case 'previous':
//                     btnDisplay = lang.sPrevious;
//                     btnClass = button + (page > 0 ? '' : ' disabled');
//                     break;

//                     case 'next':
//                     btnDisplay = lang.sNext;
//                     btnClass = button + (page < pages - 1 ? '' : ' disabled');
//                     break;

//                     case 'last':
//                     btnDisplay = lang.sLast;
//                     btnClass = button + (page < pages - 1 ? '' : ' disabled');
//                     break;

//                     default:
//                     btnDisplay = button + 1;
//                     btnClass = page === button ?
//                     'active' : '';
//                     break;
//                 }

//                 if (btnDisplay) {
//                     node = jQuery('<li>', {
//                         'class': classes.sPageButton + ' ' + btnClass,
//                         'aria-controls': settings.sTableId,
//                         'tabindex': settings.iTabIndex,
//                         'id': idx === 0 && typeof button === 'string' ?
//                         settings.sTableId + '_' + button :
//                         null
//                     })
//                     .append(jQuery('<a>', {
//                         'href': '#'
//                     })
//                     .html(btnDisplay)
//                     )
//                     .appendTo(container);

//                     settings.oApi._fnBindAction(
//                         node, {action: button}, clickHandler
//                         );
//                 }
//             }
//         }
//     };

//     attach(
//         jQuery(host).empty().html('<ul class="pagination"/>').children('ul'),
//         buttons
//         );
// };

// // TableTools Bootstrap compatibility - Required TableTools 2.1+
// if (DataTable.TableTools) {
// // Set the classes that TableTools uses to something suitable for Bootstrap
// jQuery.extend(true, DataTable.TableTools.classes, {
//     "container": "DTTT btn-group",
//     "buttons": {
//         "normal": "btn btn-default",
//         "disabled": "disabled"
//     },
//     "collection": {
//         "container": "DTTT_dropdown dropdown-menu",
//         "buttons": {
//             "normal": "",
//             "disabled": "disabled"
//         }
//     },
//     "print": {
//         "info": "DTTT_print_info"
//     },
//     "select": {
//         "row": "active"
//     }
// });

// // Have the collection use a bootstrap compatible drop down
// jQuery.extend(true, DataTable.TableTools.DEFAULTS.oTags, {
//     "collection": {
//         "container": "ul",
//         "button": "li",
//         "liner": "a"
//     }
// });
// }
// };

 var initDataTableFull = function () {
            jQuery('.js-dataTable-full').dataTable({
                columnDefs: [{orderable: false, targets: [4]}],
                pageLength: 10,
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]]
            });
        };
        var initDataTableSimple = function () {
            jQuery('.js-dataTable-simple').dataTable({
                columnDefs: [{orderable: false, targets: [4]}],
                pageLength: 10,
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
                searching: false,
                oLanguage: {
                    sLengthMenu: ""
                },
                dom:
                        "<'row'<'col-sm-12'tr>>" +
                        "<'row'<'col-sm-6'i><'col-sm-6'p>>"
            });
        };
        var bsDataTables = function () {
            var DataTable = jQuery.fn.dataTable;

// Set the defaults for DataTables init
            jQuery.extend(true, DataTable.defaults, {
                dom:
                        "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
                        "<'row'<'col-sm-12'tr>>" +
                        "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                renderer: 'bootstrap',
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
        initDataTableSimple();
        initDataTableFull();
        // $scope.loadDatasources();

 $scope.loadSpaces();

}]);

App.directive('spaceAddModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/space/views/space_add.html'
//templateUrl: '/src/assets/js/modules/organization/views/organization-modal.html'
};
}); 

App.directive('spaceViewModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/space/views/space_view.html'
//templateUrl: '/src/assets/js/modules/organization/views/organization-modal.html'
};
});

App.directive('spaceEditModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/space/views/space_edit.html'
// templateUrl: '/src/assets/js/modules/organization/views/organization-modal-edit.html'
};
});

App.directive('spaceDeleteModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/space/views/space_delete.html'
        // templateUrl: '/src/assets/js/modules/organization/views/organization-modal-delete.html'
    };
});