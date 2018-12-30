/*
*  Document   : controllers.js
*  Author     : @kikecolmenares
*  Description: projects controller
*
*/
App.controller('ProjectCtrl', ['$scope', '$localStorage', '$window', 'OrganizationService', 'ProjectService', '$http', '$state', 'AuthenticationService', '$rootScope', 'organizations', '$timeout', 'localStorageService',
    function ($scope, $localStorage, $window, OrganizationService, ProjectService, $http, $state, AuthenticationService, $rootScope, organizations, $timeout, localStorageService) {
//clear triggers JIC
localStorageService.remove('triggers');
$scope.selectedOrganization = null;
$scope.projects = [];

organizations.fetchOrganizations(function (data) {
    if (AuthenticationService.userHasRole(["super"])){
        OrganizationService.GetAll()
        .then(function (data) {
            $scope.organizations = data.organizations;
        });
    } else {
        var filteredorganizations = data.filter(function (organization){
            return organization.id == $rootScope.loggeduser.user.organization_id;
        });
        $scope.organizations = filteredorganizations;
    }
});

$scope.createProject = function () {
    var isChecked = $('#val-activate').prop("checked");
    if ($scope.projectname && $scope.selectedOrganization)
    {

        var activation = 0;
        console.log('saving Project...');
// if ($scope.activate == true) {
//     activation = 1;
// }
if (isChecked) {
    console.log('activado');
    activation = 1;
}
// use $.param jQuery function to serialize data from JSON 
var project = $.param({
    name: $scope.projectname,
    notes: $scope.notes,
    active: activation,
    organization_id: $scope.selectedOrganization,
});
ProjectService.Create(project)
.then(function (response) {
    console.log(response);
    if (response.success == false) {
        swal("Error Creating new project", "", "error");
    } else {
        if ($scope.selectedOrganization) {
            ProjectService.AttachOrganization(response.id, $scope.selectedOrganization)
            .then(function (response) {
                console.log('Organization Attached');
            });
        }
        swal("New Project has been created", "", "success");
        $state.go('projects', {redirect: true});
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
            'val-projectname': {
                required: true,
                minlength: 3
            },
            'val-organization': {
                required: true
            },
            'val-notes': {
                required: false
            },
            'val-actvate': {
                required: false
            }
        },
        messages: {
            'val-projectname': {
                required: 'Please enter a project name',
                minlength: 'Your project must consist of at least 3 characters'
            },
            'val-organization': 'Please select an organization!',
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
*  Description: project list controller
*/
App.controller('ProjectTablesCtrl', ['$scope', 'projects', '$localStorage', '$window', '$http', 'localStorageService', 'ProjectService', '$state', 'OrganizationService', 'AuthenticationService', '$rootScope', '$timeout',
    function ($scope, projects, $localStorage, $window, $http, localStorageService, ProjectService, $state, OrganizationService, AuthenticationService, $rootScope, $timeout) {
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

$(document).on("click", ".view-project", function () {
    var projectid = $(this).data('id');
    ProjectService.GetById(projectid)
    .then(function (data) {
        $scope.project = data.project;
        OrganizationService.GetByProjectId(projectid)
        .then(function (result) {
//Mandamos el organization al scope
console.log(result.organization);
console.log($scope.organizations);
$scope.organization = result.organization;
$scope.project.organization = $scope.organization.name;

});
        $('#modal-project').modal('show');
    });
});

$(document).on("click", ".view-project-edit", function () {
    var projectid = $(this).data('id');
    ProjectService.GetById(projectid)
    .then(function (data) {
        $scope.project = data.project;
//Obtenemos la organizacion
OrganizationService.GetByProjectId(projectid)
.then(function (result) {
//Mandamos el organization al scope
console.log(result.organization);
console.log($scope.organizations);
$scope.organization = result.organization;
//en el array de organization, poneos el role del user como default
$scope.selectOrganizationObject = $scope.organizations[myIndexOf($scope.organization, $scope.organizations)];
console.log('organization Objeto selecceionado ---');
console.log(myIndexOf($scope.organization, $scope.organizations));
console.log($scope.selectOrganizationObject);

});
$('#modal-project-edit').modal('show');
});
});

$(document).on("click", ".view-project-delete", function () {
    var projectid = $(this).data('id');
    ProjectService.GetById(projectid)
    .then(function (data) {
        $scope.project = data.project;
// console.log(data.project);
OrganizationService.GetByProjectId(projectid)
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
$('#modal-projects-delete').modal('show');
});
});


/*
*Function Update Project
*/
$scope.updateProject = function (projectid) {
    var isChecked = $('#val-active').prop("checked");

    if ($scope.project.id && $scope.project.name)
    {
        var activation = 0;
//console.log('updating Organization...');
if (isChecked) {
    activation = 1;
}

// use $.param jQuery function to serialize data from JSON 
var project = $.param({
    id: $scope.project.id,
    name: $scope.project.name,
    notes: $scope.project.notes,
    active: activation,
    organization_id: $scope.selectOrganizationObject.id
});
ProjectService.Update(project, $scope.project.id)
.then(function (response) {
    console.log(response);
    if (response.success == false) {
        swal("Error Updating project", "", "error");
    } else {
        localStorageService.remove('projects');
        swal("Project has been updated", "", "success");

        var oTable = $('.js-dataTable-full').dataTable();
        oTable.fnClearTable();
        oTable.fnDestroy();
        projects.fetchProjects(function (data) {
            if (AuthenticationService.userHasRole(["super"])){
                localStorageService.set('projects', data);
            } else {
                var filteredprojects = data.filter(function (project){
                    return project.organization_id == $rootScope.loggeduser.user.organization_id;
                });
                localStorageService.set('projects', filteredprojects);
            }

        });
        $timeout(function () {

            $state.reload();
        }, 1000);

        $('#modal-project-edit').modal('hide');

    }
});
}
};
$scope.deleteProject = function () {
    ProjectService.GetUserCountByProjectId($scope.project.id)
    .then(function(response){
        console.log('tiene users');
        console.log(response);
        if (response > 0){
            swal("Error Deleting this project", "Users already assigned to this project.", "error");
            $('#modal-projects-delete').modal('hide');
        } else { 
            ProjectService.GetDashboardCountByOrganizationId($scope.project.id)
            .then(function(resp) {
                console.log('tiene dashboard');
                console.log(resp);
                if (resp >0){
                    swal("Error Deleting this project", "Dashboards already created to this project.", "error");
                    $('#modal-projects-delete').modal('hide');
                } else{
                    ProjectService.GetDatasourceCountByProjectId($scope.project.id)
                    .then(function(res){
                        console.log('tiene datasource');
                        console.log(res);
                        if(res > 0){
                            swal("Error Deleting this project", "Datasources already created to this project.", "error");
                            $('#modal-projects-delete').modal('hide');
                        } else {
                            ProjectService.GetTriggerCountByProjectId($scope.project.id)
                            .then(function(data){
                                console.log('tiene Triggers');
                                console.log(data);
                                if (data > 0){
                                    swal("Error Deleting this project", "Triggers already created to this project.", "error");
                                    $('#modal-projects-delete').modal('hide');
                                } else {
                                    ProjectService.Delete($scope.project.id)
                                    .then(function (response) {
                                        if (response.success == false) {
                                            swal("Error Deleting This Project", "", "error");
                                        } else {
//$state.reload();
localStorageService.remove('projects');
swal("This Project has been deleted", "", "success");

var oTable = $('.js-dataTable-full-2').dataTable();
oTable.fnClearTable();
oTable.fnDestroy();
projects.fetchProjects(function (data) {
    localStorageService.set('projects', data);
    projectlist = data;
});

$timeout(function () {
//initDataTableFull();
$state.reload();
}, 1000);
$('#modal-projects-delete').modal('hide');
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

// Init full DataTable, for more examples you can check out https://www.datatables.net/

var initDataTableFull = function () {

    projects.fetchProjects(function (data) {
        if (AuthenticationService.userHasRole(["super"])){
            localStorageService.set('projects', data);
        } else {
            var filteredprojects = data.filter(function (project){
                return project.organization_id == $rootScope.loggeduser.user.organization_id;
            });
            localStorageService.set('projects', filteredprojects);
        }
    });

    console.log('init datatable...');
    $('.js-dataTable-full-2').dataTable({
        columnDefs: [{orderable: false, targets: [4]}],
        pageLength: 10,
        lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
        data: localStorageService.get('projects'),
//data: dataset,
"columns": [
{"data": "id"},
{"data": "name"},
{"data": "organization_name"},
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
    if (AuthenticationService.userHasRole(["super", "admin", "owner"])){
        actions = "<div class='btn-group'><a class='btn btn-xs btn-default' href='#/project/" + data + "/settings' data-ui-sref='projectsettings({projectId:" + data + "})'><i class='fa fa-gear'></i></a><button class='btn btn-xs btn-default view-project' data-toggle='modal' data-id='" + data + "' href='#modal-project' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-project-edit' data-toggle='modal' data-id='" + data + "' href='#modal-project-edit' type='button'><i class='fa fa-pencil'></i></button><button class='btn btn-xs btn-default view-project-delete' data-toggle='modal' data-id='" + data + "' href='#modal-project-delete' type='button' ng-click='initModalData()'><i class='fa fa-times'></i></button></div>";
    } else {
        actions = "<div class='btn-group'><a class='btn btn-xs btn-default' href='#/project/" + data + "/settings' data-ui-sref='projectsettings({projectId:" + data + "})'><i class='fa fa-gear'></i></a><button class='btn btn-xs btn-default view-project' data-toggle='modal' data-id='" + data + "' href='#modal-project' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-project-edit' data-toggle='modal' data-id='" + data + "' href='#modal-project-edit' type='button'><i class='fa fa-pencil'></i></button></div>";

    }
    return actions;
}},
],
createdRow: function (row, data, index) {
    if (data.deleted_at)
// $(row).addClass('trashed-data');
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
    { extend: 'excel',text: '<i class="fa fa-file-excel-o"></i>', className: 'btn btn-xs btn-default' , filename:'Projects'},
    { extend: 'csv',text: '<i class="fa fa-file-o"></i>', className: 'btn btn-xs btn-default' , filename:'Projects'},
    { extend: 'pdf',text: '<i class="fa fa-file-pdf-o"></i>', className: 'btn btn-xs btn-default' , filename:'Projects'},
    { extend: 'print',text: '<i class="fa fa-print"></i>', className: 'btn btn-xs btn-default', title:'Projects' }
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

App.directive('projectModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
//templateUrl: '/src/assets/js/modules/project/views/project-modal.html'
templateUrl: '/assets/js/modules/project/views/project-modal.html'
};
});

App.directive('projectEditModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/project/views/project-modal-edit.html'
//templateUrl: '/src/assets/js/modules/project/views/project-modal-edit.html'
};
});

App.directive('projectDeleteModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/project/views/project-modal-delete.html'
//templateUrl: '/src/assets/js/modules/project/views/project-modal-delete.html'
};
});

// Project dashboard controller
App.controller('ProjectDashboardCtrl', ['$scope', 
    '$stateParams', 
    'ProjectService', 
    '$filter', 
    'urlBuilder', 
    'urls', 
    'DatasourceService', 
    'DatapointService', 
    'DashboardService', 
    '$timeout', 
    '$state', 
    '$http',
    '$interval',
// 'MqttClient',
function ($scope, $stateParams, ProjectService, $filter, urlBuilder, urls, DatasourceService, DatapointService, DashboardService, $timeout, $state, $http, $interval) {

// $scope.mqttdata = "NA";

//      var host = urls.MQTT_BROKER;
//      var port = urls.MQTT_BROKER_PORT;
//      var id = "wmflwek";

//      // MqttClient.init(host, port, id);
//      mqtt = new Paho.MQTT.Client(host,port,id);
//      var options = {
//          useSSL: true,
//          timeout: 3,
//          onSuccess: onConnect,
//          onFailure: failureCallback,
//          userName: "kike",
//          password: "K1k3355453",

//      };

//      mqtt.onMessageArrived = onMessageArrived;

//      mqtt.connect(options);


// MqttClient.connect({onSuccess: successCallback});

// MqttClient.connect(options);
// MqttClient.onMessageArrived= onMessageArrived;



// Flot charts, for more examples you can check out http://www.flotcharts.org/flot/examples/
// var initChartsFlot = function () {

//     var flotLive = jQuery('.js-flot-live');

// // Live Chart
// var dataLive = [];

// function getRandomData() { // Random data generator

//     if (dataLive.length > 0)
//         dataLive = dataLive.slice(1);

//     while (dataLive.length < 20) {
//         var prev = dataLive.length > 0 ? dataLive[dataLive.length - 1] : 50;
//         var y = prev + Math.random() * 10 - 5;
//         if (y < 0)
//             y = 0;
//         if (y > 100)
//             y = 100;
//         dataLive.push(y);
//     }

//     var res = [];
//     for (var i = 0; i < dataLive.length; ++i)
//         res.push([i, dataLive[i]]);

// // Show live chart info
// jQuery('.js-flot-live-info').html(y.toFixed(0) + '&deg;C');

// return res;
// }

// function getMqttData() { // Random data generator

//     if (dataLive.length > 0)
//         dataLive = dataLive.slice(1);

//     while (dataLive.length < 20) {
//         var prev = dataLive.length > 0 ? dataLive[dataLive.length - 1] : 50;
//         var y = prev + Math.random() * 10 - 5;
//         if (y < 0)
//             y = 0;
//         if (y > 100)
//             y = 100;
//         dataLive.push(y);
//     }

//     var res = [];
//     for (var i = 0; i < dataLive.length; ++i)
//         res.push([i, dataLive[i]]);

// // Show live chart info
// jQuery('.js-flot-live-info').html(y.toFixed(0) + '&deg;C');

// return res;
// }

// function updateChartLive() { // Update live chart
// // console.log(getMqttData());
// chartLive.setData([getMqttData()]);
// chartLive.draw();
// setTimeout(updateChartLive, 700);
// }

// var chartLive = jQuery.plot(flotLive, // Init live chart
//     [{data: getRandomData()}],
//     {
//         series: {
//             shadowSize: 0
//         },
//         lines: {
//             show: true,
//             lineWidth: 2,
//             fill: true,
//             fillColor: {
//                 colors: [{opacity: .2}, {opacity: .2}]
//             }
//         },
//         colors: ['#75b0eb'],
//         grid: {
//             borderWidth: 0,
//             color: '#aaaaaa'
//         },
//         yaxis: {
//             show: true,
//             min: 0,
//             max: 110
//         },
//         xaxis: {
//             show: false
//         }
//     }
//     );

// updateChartLive(); // Start getting new data


// };

// initChartsFlot();
/*
*Function Reload
*/
$scope.reload = function () {
    $state.reload();
};
// Chart.js Charts, for more examples you can check out http://www.chartjs.org/docs
var globalOptions = {
    scaleFontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    scaleFontColor: '#999',
    scaleFontStyle: '600',
    tooltipTitleFontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    tooltipCornerRadius: 3,
    maintainAspectRatio: false,
    responsive: true,
    scaleOverride : true,
    scaleSteps : 10,
    scaleStepWidth : 10,
    scaleStartValue : 0,
//scaleShowLabels: false,
//showScale: false,
};

DashboardService.GetPanelsType()
.then(function (data){
    $scope.panelstype = data.panelstype;
});


$scope.switch = function(panel){
    var isChecked = jQuery('#val-activate-panel_' + panel.id).prop("checked");
    if (isChecked) {
        $scope.activate = 1;
    } else {
        $scope.activate = 0;
    }
    DatasourceService.GetById(panel.datasource_id)
    .then(function (resp){
        var optionsStr = JSON.parse(resp.datasource.options);
        $scope.broker = urls.BASE_NR;
//$scope.broker = optionsStr.broker;d
$scope.topic = optionsStr.topic;
ProjectService.ThingDiscreteStatus($scope.broker, $scope.topic, $scope.activate).
then(function(response){
    if (response.success != null){
        $.notify({
            message : 'Something went wrong - '+response.message
        }, {
            type : 'danger'
        });
    } else {
        var message = 'Succesfully switched ';
        if ($scope.activate == 0){
            message = message + 'OFF';
        } 
        if ($scope.activate == 1){
            message = message + 'ON';
        } 
        $.notify({
            message: message
        },{     
            type: 'success'
        });
    }

});   
});





};
$scope.changeRange = function (panel) {
    var date = panel.date.split('to');
    var startDate = date[0];
    var endDate = date[1];
    console.log(panel.sensorData);
    var newData = _.filter(panel.sensorData, function (item) {
        if (moment(startDate).format('YYYY-MMM-DD') <= moment(item.created_at).format('YYYY-MMM-DD') && moment(item.created_at).format('YYYY-MMM-DD') < moment(endDate).format('YYYY-MMM-DD')) {
            return item;
        }
    });
    var newDataPanel = {sensorData: newData, id: panel.id, date: date};
    if (panel.type === '1') {
        initLine(newDataPanel);
    } else {
        initBar(newDataPanel);
    }
};
var initLine = function (panel) {
    $timeout(function () {
        var chartLinesCon = jQuery('#panel_' + panel.id)[0].getContext('2d');
        var chartLines;
        var chartLineData = {
            labels: _.pluck(panel.sensorData, 'created_at'),
            datasets: [
            {
                label: 'Last Week',
                fillColor: 'rgba(220,220,220,.3)',
                strokeColor: 'rgba(220,220,220,1)',
                pointColor: 'rgba(220,220,220,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,220,220,1)',
                data: _.pluck(panel.sensorData, 'data')
            }
            ]
        };

        chartLines = new Chart(chartLinesCon).Line(chartLineData, globalOptions);
    }, 200);
};
var initBar = function (panel) {
    $timeout(function () {
        var chartBarsCon = jQuery('#panel_' + panel.id)[0].getContext('2d');
// Set Chart and Chart Data variables
var chartBars;
var chartBarData = {
    labels: _.pluck(panel.sensorData, 'created_at'),
    datasets: [
    {
        label: 'Last Week',
        fillColor: 'rgba(220,220,220,.3)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: _.pluck(panel.sensorData, 'data')
    }
    ]
};

chartBars = new Chart(chartBarsCon).Bar(chartBarData, globalOptions);
}, 200);
};
$scope.initLineChart = function (panel) {

    $timeout(function () {
        var chartLinesCon = jQuery('#panel_' + panel.id)[0].getContext('2d');
        var chartLines;
        var chartLineData = {
            labels: (_.pluck(panel.sensorData, 'created_at')).reverse(),

            datasets: [
            {
                label: 'Last Week',
                fillColor: 'rgba(220,220,220,.3)',
                strokeColor: 'rgba(220,220,220,1)',
                pointColor: 'rgba(220,220,220,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,220,220,1)',
                data: (_.pluck(panel.sensorData, 'data')).reverse()
            }
            ]
        };

        chartLines = new Chart(chartLinesCon).Line(chartLineData, globalOptions);
    }, 200);
};
$scope.initBarChart = function (panel) {
    $timeout(function () {
        var chartBarsCon = jQuery('#panel_' + panel.id)[0].getContext('2d');
// Set Chart and Chart Data variables
var chartBars;
var chartBarData = {
    labels: (_.pluck(panel.sensorData, 'created_at')).reverse(),
    datasets: [
    {
        label: 'Last Week',
        fillColor: 'rgba(220,220,220,.3)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: (_.pluck(panel.sensorData, 'data')).reverse()
    }
    ]
};

chartBars = new Chart(chartBarsCon).Bar(chartBarData, globalOptions);
}, 200);

};
//Delete Panel Modal
$(document).on("click", ".panel-delete", function () {
    var panelid = $(this).data('id');
    ProjectService.GetPanelById(panelid)
    .then(function (data) {
        console.log('panel');
        console.log(data.panel);
        $scope.panel = data.panel[0];
        $('#modal-delete-panel').modal('show');
    });
});
//Delete panel function
$scope.deletePanel = function() {

    ProjectService.DeletePanel($scope.panel.id)
    .then(function (response){
        if (response.success == false) {
            $('#modal-delete-panel').modal('hide');
            swal("Error Deleting This Panel", "", "error");
        } else {
            $('#modal-delete-panel').modal('hide');
            swal("Panel has been deleted", "", "success");
        }
        $timeout(function () {
//initDataTableFull();
$state.reload();
}, 3000);
    });

}
//Edit panel Modal
$(document).on("click", ".panel-edit", function () {
    var panelid = $(this).data('id');
//alert(panelid);
$scope.panels_type = array(

    );


ProjectService.GetPanelById(panelid)
.then(function (data) {
    console.log('panel');
    console.log(data);
    $scope.panel = data.panel;
//             OrganizationService.GetByProjectId(projectid)
//                     .then(function (result) {
//                         console.log(result.organization);
//                         console.log($scope.organizations);
//                         $scope.organization = result.organization;
//                         $scope.project.organization = $scope.organization.name;

//                     });
$('#modal-edit-panel').modal('show');
});
});
//variables
$scope.project = [];
$scope.dashboard = [];
$scope.panels = [];

//get the project 
ProjectService.GetById($stateParams.projectId).then(function (data) {
    $scope.project = data.project;
});

//get the dashboard 
DashboardService.GetById($stateParams.dashboardId).then(function (data) {
    $scope.dashboard = data.dashboard;
});
$scope.getDatapointsOptions = function () {
    ProjectService.GetDatapointsByDatasourceId($scope.selectedDatasource).then(function (response) {
        $scope.datapoints = response.datapoints;
    });
};
$scope.getDatasourceOptions = function () {
    var value = $scope.paneltype;
    console.log(value);
    ProjectService.GetActiveDatasourcesByProjectId($stateParams.projectId).then(function (response) {
        console.log(response.datasources);
// $active_datasources = 
$scope.datasources = response.datasources;
});

};
$scope.createPanel = function () {
//alert('creating panel');
console.log('panel a guardar');
console.log($scope);

if ($scope.panelname)
{
    var activation = 0;
    console.log('saving Panel...');
    console.log($scope);
    if ($scope.activate == true) {
        activation = 1;
    }
    if ($scope.selectedPaneltype == 10){
        $scope.selectedDatapoint = 1;
    }

    console.log('selectedDatapoint');
    console.log($scope.selectedDatapoint);
    if (angular.isUndefined($scope.selectedDatapoint)){
        $scope.selectedDatapoint = 1;
    }
// use $.param jQuery function to serialize data from JSON 
var panel = $.param({
    name: $scope.panelname,
    type: $scope.selectedPaneltype,
    data: $scope.paneldata,
    options: $scope.paneloptions,
    active: activation,
    dashboard_id: $stateParams.dashboardId,
    datasource_id: $scope.selectedDatasource,
    datapoint_id: $scope.selectedDatapoint
});
ProjectService.CreatePanel(panel)
.then(function (response) {
    console.log(response);
//App.loader('show');
if (response.success == false) {
    $('#modal-add-panel').modal('hide');
    swal("Error Creating new panel", "", "error");
} else {
    $('#modal-add-panel').modal('hide');
    swal("New Panel has been created", "", "success");
//$state.go('projects', { redirect : true });
}
$timeout(function () {
//initDataTableFull();
//App.loader('hide')
$state.reload();
}, 3000);

});

}

};


/*
*  Panels Type
+----+-----------------------------------+------------+------------+------------+
| id | name                              | created_at | updated_at | deleted_at |
+----+-----------------------------------+------------+------------+------------+
|  1 | Chart - Lines - Temperature       | NULL       | NULL       | NULL       |
|  2 | Chart - Bars - Temperature        | NULL       | NULL       | NULL       |
|  3 | Widget - Temperature              | NULL       | NULL       | NULL       |
|  4 | Widget - Humidity                 | NULL       | NULL       | NULL       |
|  5 | History Log - Temperature         | NULL       | NULL       | NULL       |
|  6 | History Log - Humidity            | NULL       | NULL       | NULL       |
|  7 | Widget - Gauge - Temperature      | NULL       | NULL       | NULL       |
|  8 | Widget - Gauge - Humidity         | NULL       | NULL       | NULL       |
|  9 | Widget - Gauge - Power(Kwh)       | NULL       | NULL       | NULL       |
| 10 | Widget - Power Switch             | NULL       | NULL       | NULL       |
| 11 | Chart - Lines - Humidity          | NULL       | NULL       | NULL       |
| 12 | Chart - Bars - Humidity           | NULL       | NULL       | NULL       |
| 13 | Widget - Gauge - Voltage          | NULL       | NULL       | NULL       |
| 14 | Chart - Lines - Voltage           | NULL       | NULL       | NULL       |
| 15 | Chart - Bars - Voltage            | NULL       | NULL       | NULL       |
| 16 | History Log - Voltage             | NULL       | NULL       | NULL       |
| 17 | Chart - Lines - Power(Kwh)        | NULL       | NULL       | NULL       |
| 18 | Chart - Bars - Power(Kwh)         | NULL       | NULL       | NULL       |
| 19 | History Log - Power(Kwh)          | NULL       | NULL       | NULL       |
| 20 | Widget - Gauge - Electric Current | NULL       | NULL       | NULL       |
| 21 | Chart - Lines - Electric Current  | NULL       | NULL       | NULL       |
| 22 | Chart - Bars - Electric Current   | NULL       | NULL       | NULL       |
| 23 | History Log - Electric Current    | NULL       | NULL       | NULL       |
| 24 | MQTT Widget - Gauge - Temperature | NULL       | NULL       | NULL       |
| 25 | MQTT Widget - Temperature         | NULL       | NULL       | NULL       |
+----+-----------------------------------+------------+------------+------------+
*/

var generateChartData = function (panels) {
    $scope.connected_flag=0;
    angular.forEach(panels, function (panel) {
        if (panel.type === '1') {
            if (!_.findWhere($scope.lineChart, {type: panel.type, datapoint_id: panel.datapoint_id, datasource_id: panel.datasource_id})) {
                angular.extend($scope.lineChart, panel.sensorData);
            }
        }
        if (panel.type === '2') {
            if (!_.findWhere($scope.barChart, {type: panel.type, datapoint_id: panel.datapoint_id, datasource_id: panel.datasource_id})) {
                angular.extend($scope.barChart, panel.sensorData);
            }
        }
        if (panel.type === '3') {
console.log('panle');
console.log(panel);
var count = 0;// this is default cont value.
// $scope.$apply(function () {
    // The  $interval function is used to auto refresh the count div.
      // var auto = $interval(function() {
      //   // panel.sensorData.data = count ;
      //   // count++;
      //   init();
      // }, 3000);
    // setTimeout(function () {
    //     $scope.$apply(function () {
    //         // $scope.message = "Timeout called!";
    //         console.log('update!');
    //     });
    // }, 2000);

// });
angular.extend($scope.widgetTemperatureChart, panel.sensorData);
//

}
if (panel.type === '4') {
    angular.extend($scope.widgetHumidityChart, panel.sensorData);
}
if (panel.type === '5') {
    if (!_.findWhere($scope.historyTemperatureChart, {type: panel.type, datapoint_id: panel.datapoint_id, datasource_id: panel.datasource_id})) {
        angular.extend($scope.historyTemperatureChart, panel.sensorData);
    }
}
if (panel.type === '6') {
    if (!_.findWhere($scope.historyHumidityChart, {type: panel.type, datapoint_id: panel.datapoint_id, datasource_id: panel.datasource_id})) {
        angular.extend($scope.historyHumidityChart, panel.sensorData);
    }
}
if (panel.type === '7') {
// angular.extend($scope.widgetTemperatureChart, panel.sensorData);
angular.extend($scope.widgetTemperatureChart, panel.sensorData);
}
if (panel.type === '8') {
    angular.extend($scope.widgetHumidityChart, panel.sensorData);
}
if (panel.type === '9') {
    angular.extend($scope.widgetPowerChart, panel.sensorData);
}
if (panel.type === '24') {

    panel.sensorData = 25;
    var Mqttconnection;
    var host = panel.MQTTInfo.broker;
    var port = Number(panel.MQTTInfo.port);
    var id = "js_paho_id_" + parseInt(Math.random() * 100, 10);
    var path = "/ws";


//     function onConnected(recon,url){
// console.log(" in onConnected " +reconn);
// $scope.connected_flag=1;
// alert('dentro: '+$scope.connected_flag);
// }

function onConnectionLost(message){
    console.log("connection lost");
// document.getElementById("status").innerHTML = "Connection Lost";
// document.getElementById("messages").innerHTML ="Connection Lost";
$.notify({
    message: 'Connection Lost. '+message.errorCode+': '+message.errorMessage,
},{     
    type: 'danger'
});
$scope.connected_flag=0;
}
// var topic = panel.MQTTInfo.topic;
// var topic1 = "org1/room1/monitor/temperature";
// var topic2 = "org1/room2/monitor/temperature";
// var topic = "org1/room2/monitor/temperature"];

// MqttClient.init(host, port, id);
// $scope.MQTTconnect = function(){
    $scope.connected_flag=1;

    $scope.mqtt = new Paho.MQTT.Client(host,port,path,id);
    options = {
        useSSL: true,
        timeout: 3,
        onSuccess: onConnect,
        onFailure: failureCallback,
        userName: "kike",
        password: "K1k3355453",

    };

    $scope.mqtt.onMessageArrived = onMessageArrived;
    $scope.mqtt.onConnectionLost = onConnectionLost;
// mqtt.onConnected = onConnected;
// connect the client
$scope.mqtt.connect(options);
// alert(mqtt.host);

// }


// mqtt.subscribe(panel.MQTTInfo.topic);
function sonFailure(message){
    $.notify({
        message: 'messageerrorCode: '+message.errorCode+': '+message.errorMessage,
    },{     
        type: 'danger'
    });
}

function sonSuccess(){
    $.notify({
        message: 'topico: '+panel.MQTTInfo.topic,
    },{     
        type: 'success'
    });
}

function onConnect() {
    if ($scope.connect = false){
        $scope.connect = true;

    }
    else{
        console.log('MQTT connected');
    $scope.connected_flag=1;
// alert('dentro: '+$scope.connected_flag);
$.notify({
    message: 'MQTT connected.'
},{     
    type: 'success'
});
// MqttClient.subscribe('org1/room1/monitor/temperature');
var soptions={
    onSuccess:sonSuccess,
    onFailure: sonFailure
};

$scope.mqtt.subscribe(panel.MQTTInfo.topic, soptions);
// $.notify({
//     message: 'topic: '+panel.MQTTInfo.topic,
// },{     
//     type: 'success'
// });

// mqtt.subscribe(topic2);

// $.notify({
//         message: 'topic: '+topic2,
//     },{     
//         type: 'success'
//     });
//     // message = new Paho.MQTT.Message("Hello from app nuevo");
//     // message.destinationName = "test";
//     // MqttClient.send(message);
    }
    

}
//initial load
// $scope.loadData();

function onMessageArrived(message) {
//chequear los panels que usen MQTT Broker
console.log("Topic:     " + message.destinationName);
// mqtt.subscribe(message.destinationName);


console.log("en el scope");
$scope.$apply(function () {
    updateSensorData(message);

});
console.log(panel.sensorData);
console.log("onMessageArrivedCB:"+message.payloadString);
// loadData(message.payloadString);
}
function updateSensorData(message){
    panel.sensorData = message.payloadString;
}
function failureCallback(message) {
    console.log('Connection Failed- Retrying')
    $.notify({
        message: 'Connection Failed- Retrying in 30sg'
    },{     
        type: 'warning'
    });
    setTimeout($scope.MQTTconnect(), 3000000);

}
// if(angular.isUndefined(mqtt)){
// alert('fuera: '+$scope.connected_flag);
if($scope.connected_flag == 0){
    // alert('procediendo a conectar');
    $scope.MQTTconnect();
} else {
    // alert('ya esta conectado');
// onConnect();
// var soptions={
//     onSuccess:sonSuccess,
//     onFailure: sonFailure
// };
// mqtt.subscribe(panel.MQTTInfo.topic, soptions);
}

// MQTTconnect()
// }


angular.extend($scope.widgetTemperatureChart, panel.sensorData);
}
// if (panel.type === '10') {
//     angular.extend($scope.widgetSwitch, panel.sensorData);
// }
//                 }
//                 if (panel.type === '10') {
//                     if (!_.findWhere($scope.historyTemperatureChart, {type: panel.type, datapoint_id: panel.datapoint_id, datasource_id: panel.datasource_id})) {
//                         angular.extend($scope.historyTemperatureChart, panel.sensorData);
//                     }
//                 }
//                 if (panel.type === '11') {
//                     if (!_.findWhere($scope.historyHumidityChart, {type: panel.type, datapoint_id: panel.datapoint_id, datasource_id: panel.datasource_id})) {
//                         angular.extend($scope.historyHumidityChart, panel.sensorData);
//                     }
//                 }
});
};
var init = function () {
    $scope.lineChart = [];
    $scope.barChart = [];
    $scope.radarChart = [];
    $scope.donutChart = [];
    $scope.liveChart = [];
    $scope.widgetLinesChart = [];
    $scope.widgetBarChart = [];
    $scope.widgetTemperatureChart = {};
    $scope.widgetHumidityChart = {};
    $scope.historyTemperatureChart = [];
    $scope.historyHumidityChart = [];
// $scope.MQTTconnect();
ProjectService.GetPanelsByDashboardId($stateParams.dashboardId).then(function (data) {
    angular.forEach(data, function (panel) {
        panel.date = {startDate: null, endDate: null};
    });

    $scope.panels = data;

    generateChartData(data);
//                initChartsChartJS();
});
};
init();
 var auto = $interval(function() {
        // panel.sensorData.data = count ;
        // count++;
        init();
      }, 10000);
// init();
}
]);



// Project dashboard controller
App.controller('ProjectDashboardsCtrl', ['$scope', '$stateParams', 'ProjectService', '$filter', 'urlBuilder', 'urls', 'DatasourceService', 'DatapointService', '$state', '$timeout', 'AuthenticationService', '$sessionStorage', 'DashboardService',
    function ($scope, $stateParams, ProjectService, $filter, urlBuilder, urls, DatasourceService, DatapointService, $state, $timeout, AuthenticationService, $sessionStorage, DashboardService) {

        if (AuthenticationService.userHasRole(["super", "admin", "owner", "member"])){

// ProjectService.GetWidgetCountByDashboardId($sessionStorage.loggeduser.user.organization_id).then(function (data) {
//     $scope.usercount = data;
// });
// ProjectService.GetGraphCountByDashboardId($sessionStorage.loggeduser.user.organization_id).then(function (data) {
//     $scope.projectscount = data;
// });

/*
*Function Reload
*/
$scope.reload = function () {
    $state.reload();
};
//variables
$scope.project = [];
$scope.dashboards = [];

//get the project 
ProjectService.GetById($stateParams.projectId).then(function (data) {
//console.log(data);
$scope.project = data.project;
});
ProjectService.GetDashboardsByProjectId($stateParams.projectId).then(function (data) {
    console.log(data);
    var widgetcount = 0;
    var chartcount = 0;
    for (var i = data.dashboards.length - 1; i >= 0; i--) {
        for (var j = data.dashboards[i].panels.length - 1; j >= 0; j--) {
            if (data.dashboards[i].panels[j].type == "1"){
                chartcount = chartcount + 1;
            }
            if (data.dashboards[i].panels[j].type == "2"){
                chartcount = chartcount + 1;
            }
            if (data.dashboards[i].panels[j].type == "3"){
                chartcount = chartcount + 1;
            }
            if (data.dashboards[i].panels[j].type == "4"){
                chartcount = chartcount + 1;
            }
            if (data.dashboards[i].panels[j].type == "5"){
                chartcount = chartcount + 1;
            }
            if (data.dashboards[i].panels[j].type == "6"){
                chartcount = chartcount + 1;
            }
            if (data.dashboards[i].panels[j].type == "7"){
                chartcount = chartcount + 1;
            }
            if (data.dashboards[i].panels[j].type == "8"){
                widgetcount = widgetcount + 1;
            }
            if (data.dashboards[i].panels[j].type == "9"){
                widgetcount = widgetcount + 1;
            }
            if (data.dashboards[i].panels[j].type == "10"){
                widgetcount = widgetcount + 1;
            }
            if (data.dashboards[i].panels[j].type == "11"){
                widgetcount = widgetcount + 1;
            }
            if (data.dashboards[i].panels[j].type == "12"){
                widgetcount = widgetcount + 1;
            }
        }
        data.dashboards[i].widgetcount = widgetcount;
        data.dashboards[i].chartcount = chartcount;
    }

    $scope.dashboards = data.dashboards;
});
//get the dashboards, if any

//Delete Dashboard Modal
$(document).on("click", ".dashboard-delete", function () {
//alert('delete');
var dashboardid = $(this).data('id');
DashboardService.GetById(dashboardid)
.then(function (data) {
//console.log('panel');
//console.log(data.panel);
$scope.dashboard = data.dashboard;
$('#modal-delete-dashboard').modal('show');
});
});
//Delete panel function
$scope.deleteDashboard = function() {

    ProjectService.DeleteDashboard($scope.dashboard.id)
    .then(function (response){
        if (response.success == false) {
            $('#modal-delete-dashboard').modal('hide');
            swal("Error Deleting This Dashboard", "", "error");
        } else {
            $('#modal-delete-dashboard').modal('hide');
            swal("Dashboard has been deleted", "", "success");
        }
        $timeout(function () {
//initDataTableFull();
$state.reload();
}, 3000);
    });

}

//create Project Dashboard
$scope.createDashboard = function () {

    var isChecked = $('#val-activate').prop("checked");
//alert(isChecked);
if ($scope.dashboardname)
{
    var activation = 0;
    console.log('saving Dashboard...');
//if($scope.activate ==true){activation = 1;}
if (isChecked) {
    activation = 1;
}
// use $.param jQuery function to serialize data from JSON 
var dashboard = $.param({
    name: $scope.dashboardname,
    project_id: $stateParams.projectId,
    options: "{}",
    active: activation
});
ProjectService.CreateDashboard(dashboard)
.then(function (response) {
    console.log(response);
    if (response.success == false) {
        $('#modal-add-dashboard').modal('hide');
        swal("Error Creating new dashboard", "", "error");
    } else {
        $('#modal-add-dashboard').modal('hide');
        swal("New dashboard has been created", "", "success");
    }
    $timeout(function () {
//initDataTableFull();
$state.reload();
}, 3000);
});
//$state.reload();

}

}; 


} else {
//alert('no lo tiene');
$location.path('/401');
}





}
]);






// Project dashboard controller
App.controller('ProjectUsersCtrl', ['$scope', '$stateParams', 'ProjectService', '$filter', 'urlBuilder', 'urls', 'UserService', 'DatapointService', '$state', '$timeout', 'RoleService', 'OrganizationService', '$sessionStorage',
    function ($scope, $stateParams, ProjectService, $filter, urlBuilder, urls, UserService, DatapointService, $state, $timeout, RoleService, OrganizationService, $sessionStorage) {
        function myIndexOf(o, arr) {

            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name == o.name && arr[i].id == o.id) {
                    return i;
                }
            }

            return -1;
        }
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

$(document).on("click", ".view-project-user", function () {
    var userid = $(this).data('id');
    UserService.GetById(userid)
    .then(function (data) {
        $scope.user = data.user;
        $scope.projectId = $stateParams.projectId;

// console.log('projectid');
// console.log($scope.projectId);
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
$('#modal-project- user').modal('show');
});
});
/*
*Function Reload
*/
$scope.reload = function () {
    $state.reload();
};
//variables
$scope.project = [];
$scope.projectusers = [];
$scope.users = [];
//get all users
// UserService.GetAll().then(function (data) {
//     $scope.users = data.users;
// });
//Get users for the selected project, first get the organization
OrganizationService.GetByProjectId($stateParams.projectId)
.then(function (data){
    console.log('Get Org By Project ID');
    console.log(data.organization.id);
//$scope.organization_id = data.organization.id;
ProjectService.GetUsersByOrganizationId(data.organization.id)
.then(function (data) {
    console.log('Get Users by Org ID--->');
    console.log(data);
    $scope.users = data.users;
});
});

//get the project 
ProjectService.GetById($stateParams.projectId).then(function (data) {
    console.log(data);
    $scope.project = data.project;
});
ProjectService.GetUsersByProjectId($stateParams.projectId).then(function (data) {
    console.log(data);
    $scope.projectusers = data.users;
});
// console.log('Organization ID------->');
// console.log($sessionStorage.loggeduser.user.organization_id);


$scope.removeFromProject = function (userId) {
    ProjectService.RemoveUserFromProject(userId, $stateParams.projectId)
    .then(function (response){
        console.log(response);
        if (response.success == false) {
            swal("Error removing User from project", "", "error");
        } else {
            $('#modal-project-user').modal('hide');
            swal("User removed from Project", "", "success");

        }
        $timeout(function () {
//initDataTableFull();
$state.reload();
}, 3000);
    });
};

$scope.addUserToProject = function () {
    ProjectService.AddUserToProject($scope.selectUserObject.id, $stateParams.projectId).then(function (response) {
        console.log(response);
        if (response.success == false) {
            swal("Error Adding User to project", "", "error");
        } else {
            $('#modal-add-user').modal('hide');
            swal("User Added To Project", "", "success");

        }
        $timeout(function () {
//initDataTableFull();
$state.reload();
}, 3000);
    });
};


}
]);
// Project settings controller
App.controller('ProjectSettingsCtrl', ['$scope', '$stateParams', 'ProjectService', 'triggers', 'localStorageService',
    function ($scope, $stateParams, ProjectService, triggers, localStorageService) {
        console.log($stateParams);
        $scope.project = [];
//remove triggers on local storage
localStorageService.remove('triggers');
function isProject(value) {
    return value.project_id == $stateParams.projectId;
}
triggers.fetchTriggers(function (data) {
    var tgrlist = data.filter(isProject);
// console.log('after filter');
// console.log(tgrlist);
localStorageService.set('triggers', tgrlist);
trglist = data;
});

ProjectService.GetById($stateParams.projectId).then(function (data) {
    console.log(data);
    $scope.project = data.project;
});
ProjectService.GetDashboardCountByProjectId($stateParams.projectId).then(function (data) {
    console.log(data);
    $scope.dashboardcount = data;
});
ProjectService.GetUserCountByProjectId($stateParams.projectId).then(function (data) {
    console.log(data);
    $scope.usercount = data;
});
ProjectService.GetDatasourceCountByProjectId($stateParams.projectId).then(function (data) {
    console.log(data);
    $scope.datasourcecount = data;
});
ProjectService.GetTriggerCountByProjectId($stateParams.projectId).then(function (data) {
    console.log(data);
    $scope.triggercount = data;
});
ProjectService.GetSpacesCountByProjectId($stateParams.projectId).then(function (data) {
    console.log(data);
    $scope.spacescount = data;
});
}
]);

App.directive('dashboardModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/project/views/add-dashboard-modal.html'
// templateUrl: '/src/assets/js/modules/project/views/add-dashboard-modal.html'
};
});

App.directive('useraddModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/project/views/add-user-modal.html'
// templateUrl: '/src/assets/js/modules/project/views/add-user-modal.html'
};
});

App.directive('projectUserModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/project/views/project-user-modal.html'
//templateUrl: '/src/assets/js/modules/project/views/project-user-modal.html'
};
});

App.directive('panelModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/project/views/add-panel-modal.html'
// templateUrl: '/src/assets/js/modules/project/views/add-panel-modal.html'
};
});

App.directive('editdashboardModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/project/views/edit-dashboard-modal.html'
//templateUrl: '/src/assets/js/modules/project/views/edit-dashboard-modal.html'
};
});

App.directive('editpanelModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/project/views/edit-panel-modal.html'
//templateUrl: '/src/assets/js/modules/project/views/edit-dashboard-modal.html'
};
});

App.directive('deletepanelModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/project/views/delete-panel-modal.html'
//templateUrl: '/src/assets/js/modules/project/views/edit-dashboard-modal.html'
};
});

App.directive('deletedashboardModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/project/views/delete-dashboard-modal.html'
//templateUrl: '/src/assets/js/modules/project/views/edit-dashboard-modal.html'
};
});


