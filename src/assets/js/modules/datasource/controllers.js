// Tables DataTables Controller
App.controller('TablesDatasourceTablesCtrl', ['$scope', '$localStorage', '$timeout', '$http', '$stateParams', '$state', 'DatasourceService', 'urls', 'ProjectService', 'SpaceService','FileUploader',
    function ($scope, $localStorage, $timeout, $http, $stateParams, $state, DatasourceService, urls, ProjectService, SpaceService,FileUploader) {
        console.log($stateParams);
        $scope.projectId = $stateParams.projectId;
        $scope.datasourceslist = [];
        $scope.datasourcetypes = [];
        ProjectService.GetById($stateParams.projectId).
        then(function (result){
            $scope.project = result.project;
        });
        

        function myIndexOfTypes(o, arr) {

            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name == o.type) {
                    return i;
                }
            }

            return -1;
        }

        $scope.isActive = function (active){
            //alert(active);
            if (active == "enabled"){
                return 'label label-success';
            } else {
                return 'label label-danger';
            }
        };
        $scope.seeDataPoint = function (datasource) {
//            console.log(datasource);
            $state.go('datapoints', {datasourceId: datasource.id});
        };
        $scope.loadDatasources = function () {
            console.log('loading datasources');
            // DatasourceService.GetDatasourcesByProjectId($stateParams.projectId).then(function (response) {
            //     console.log('from datasource service--->');
            //     console.log(response);
            // });
            $http.get(urls.BASE_API + "project/" + $stateParams.projectId + "/datasources").then(function (response) {
                console.log(response);
                for (var i = 0, len = response.data.datasources.length; i < len; i++) {
                    if (response.data.datasources[i].active == 1){
                        response.data.datasources[i].active = "enabled";
                    } else {
                        response.data.datasources[i].active = "disabled";
                    }
                }
                $scope.datasourceslist = response.data.datasources;
            });
            
        };
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
        $(document).on("click", ".view-datasource-edit", function () {
            var dataid = $(this).data('id');
            SpaceService.GetSpacesByProjectId($stateParams.projectId).then(function (response) {
                $scope.spaceslist = response.spaces;
            });
            DatasourceService.GetDatasourceTypes()
                .then(function (result) {
                    console.log('datasources from controller');
                    console.log(result);
                    // $scope.datasourcetypes = result.datasourcetypes;
                    $scope.datasourcetypes = result.datasourcestype;
               
            DatasourceService.GetById(dataid)
                    .then(function (rest) {
                        console.log(rest);

                        $scope.datasource = rest.datasource;
                        // $scope.datasource.left_coordinate = parseInt(rest.datasource.left_coordinate);
                        // $scope.datasource.top_coordinate = parseInt(rest.datasource.top_coordinate);

                        
                        $scope.thing = function(){
                        if ($scope.datasource.options !== "{}") {
                                    console.log("es true");
                                    //$scope.datasource.topic = JSON.parse($scope.datasource.options).topic;
                                    return true;

                                } else {
                                    console.log("es false");
                                    return false;
                                }
                        
                        };
                        //organization to scope
                                    // console.log(result.organization);
                                    // console.log($scope.organizations);
                                    // $scope.organization = result.organization;
                                    //en el array de organization, poneos el role del user como default
                                    $scope.selectDatasourceTypeObject = $scope.datasourcetypes[myIndexOfTypes($scope.datasource, $scope.datasourcetypes)];
                                    console.log('selectDatasourceTypeObject type Objeto seleccionado ---');
                                    console.log(myIndexOfTypes($scope.datasource, $scope.datasourcetypes));
                                    console.log($scope.selectDatasourceTypeObject);

                        $scope.datasource.broker = JSON.parse($scope.datasource.options).broker;
                        $scope.datasource.brokerport = JSON.parse($scope.datasource.options).brokerport;
                         $scope.datasource.topic = JSON.parse($scope.datasource.options).topic;
                         // console.log('scope.datasource.topic');
                         // console.log($scope.datasource.topic);
                        $('#modal-datasource-edit').modal('show');
                    });
                     });
        });
        $(document).on("click", ".view-datasource-delete", function () {
            var dataid = $(this).data('id');
            DatasourceService.GetById(dataid)
                    .then(function (rest) {
                        console.log(rest);
                        $scope.datasource = rest.datasource;
                        $('#modal-datasource-delete').modal('show');
                    });
        });
        $scope.updateDatasource = function () {
            var isChecked = $('#val-active').prop("checked");
            var activation = 0;
//console.log('updating Organization...');
                if (isChecked) {
                    activation = 1;
                }
                var selectedoptions = {
                    "type": $scope.selectDatasourceTypeObject.name,
                    "broker": $scope.datasource.broker,
                    "port": $scope.datasource.brokerport,
                    "topic": $scope.datasource.topic,
                };
                var datasource = $.param({
                    id: $scope.datasource.id,
                    name: $scope.datasource.name,
                    type: $scope.selectDatasourceTypeObject.name,
                    type_codename: $scope.selectDatasourceTypeObject.type_codename,
                    unitid: $scope.datasource.unitid,
                    ip: $scope.datasource.ip,
                    port: $scope.datasource.port,
                    options: JSON.stringify(selectedoptions),
                    data: $scope.datasource.data,
                    notes: $scope.datasource.notes,
                    space_id: $scope.datasource.space_id,
                    active: activation,
                    project_id: $scope.projectId,
                    top_coordinate:$scope.datasource.top_coordinate,
                    left_coordinate:$scope.datasource.left_coordinate
                });

            DatasourceService.Update(datasource, $scope.datasource.id).
                then(function (response) {
                    console.log('updating datasource');
                if (response.success === false) {
                    swal("Error Creating new datasource", "", "error");
                } else {
                    swal("Datasource has been updated", "", "success");
                    $timeout(function () {
                        $state.reload();
                    }, 1000);
                }
                $('#modal-datasource-edit').modal('hide');
            });
        };
        $scope.deleteDatasource = function () {
            ProjectService.GetDatapointsByDatasourceId($scope.datasource.id)
            .then(function(response){
                if(response.datapoints.length > 0){

                    swal("Error Deleting this Datasource", "Datapoints already assigned to this datasource", "error");
                    $('#modal-datasource-delete').modal('hide');
                } else {
                        if ($scope.datasource.id && $scope.datasource.name) {
                                        DatasourceService.Delete($scope.datasource.id).then(function (response) {
                                            if (response.success === false) {
                                                swal("Error deleting this datasource", "", "error");
                                            } else {

                                                swal("Datasource has been deleted", "", "success");
                                                $timeout(function () {
                                                    $state.reload();
                                                }, 1000);
                                                $('#modal-datasource-delete').modal('hide');
                                            }
                                        });
                                    }
                }
            });
            
        };

        $(document).on("click", ".view-datasource-add-image", function () {
            var dataid = $(this).data('id');
            DatasourceService.GetById(dataid)
                    .then(function (rest) {
                        console.log(rest);
                        $scope.datasource = rest.datasource;
                        $('#modal-datasource-add-image').modal('show');
                    });
        });

        var uploader = $scope.uploader = new FileUploader({

            url: urls.BASE_API + 'datasource/upload/'
        });
        // FILTERS

        
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS
        
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) { };
        uploader.onAfterAddingFile = function(fileItem) {
            fileItem.url = urls.BASE_API + 'datasource/upload/' + $scope.datasource.id
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            addedFileItems.url = urls.BASE_API + 'datasource/upload/' + $scope.datasource.id
        };
        uploader.onBeforeUploadItem = function(item) { };
        uploader.onProgressItem = function(fileItem, progress) { };
        uploader.onProgressAll = function(progress) { };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            swal("Space image updated!", "", "success");
        
        $timeout(function () {
            //initDataTableFull();
            $state.reload();
        }, 1000);
        
        $('#modal-datasource-add-image').modal('hide');
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            swal("Error uploading datasource image", "", "error");
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) { };
        uploader.onCompleteItem = function(fileItem, response, status, headers) { };
        uploader.onCompleteAll = function() { };
        
        console.info('uploader', uploader);
        


        bsDataTables();
        initDataTableSimple();
        initDataTableFull();
        $scope.loadDatasources();
    }
]);

// Forms Wizard Controller
App.controller('DatasourceFormsWizardCtrl', ['$scope', '$localStorage', '$window', 'DatasourceService', '$state', '$stateParams', 'urls', 'SpaceService',
    function ($scope, $localStorage, $window, DatasourceService, $state, $stateParams, urls, SpaceService) {
// $scope.broker = urls.BASE_NR;
$scope.broker = urls.MQTT_BROKER;
$scope.brokerport = urls.MQTT_BROKER_PORT;
$scope.unitid = "999";
$scope.ip = "0.0.0.0";
$scope.port = "999";

SpaceService.GetSpacesByProjectId($stateParams.projectId).then(function (response) {
                $scope.spaceslist = response.spaces;
            });
// $('#val-thing').prop("checked") = true;
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
                        btnFinish.hide();
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

// Datasource form creation
        $scope.enableVerification = function(){
            $scope.show_verification = true;
        }
        $scope.thingDatasource = function(){
        var isChecked = $('#val-thing').prop("checked");
        if (isChecked) {
                    console.log('thing deactivated');
                    $scope.unitid = "";
                    $scope.ip = "";
                    $scope.port = "";

                } else {
                    console.log('thing activated');
                    $scope.unitid = "999";
                    $scope.ip = "0.0.0.0";
                    $scope.port = "999";
                }
        
        };
        $scope.selectedDatasourceType = null;
        $scope.datasourcestype = [];
        DatasourceService.GetDatasourceTypes()
                .then(function (result) {
                    console.log('datasources from controller');
                    console.log(result);
                    $scope.datasourcestype = result.datasourcestype;
                });
        // $scope.selectedDatasourceProtocolType = null;
        // $scope.datasourceprotocoltypes = [];
        // DatasourceService.GetDatasourceProtocolTypes()
        //         .then(function (result) {
        //             $scope.datasourceprotocoltypes = result.datasourceprotocoltypes;
        //         });
        $scope.createDatasource = function () {
            var isChecked = $('#val-activate').prop("checked");
            var isCheckedVerification = $('#val-verification').prop("checked");
            //$scope.data = "{}";
            console.log('saving Datasource...');
            if ($scope.datasourcename){
                var activation = 0;
                var verification = 0;
                 if (isChecked) {
                    console.log('activado');
                    activation = 1;
                }
                if (isCheckedVerification) {
                    console.log('activado');
                    verification = 1;
                }
               
                var selectedoptions = {
                    "type": $scope.datasourcetype,
                    "broker": $scope.broker,
                    "port": $scope.brokerport,
                    "topic": $scope.topic,
                };
                //var so = '{ "host": "190.72.231.86",  "port": "8899", "autoReconnect": "true", "reconnectTimeout": "1000", "timeout":  "5000", "unitId": "1" }';

                // use $.param jQuery function to serialize data from JSON 
                var datasource = $.param({
                    name: $scope.datasourcename,
                    type: $scope.datasourcetype,
                    unitid: $scope.unitid,
                    ip: $scope.ip,
                    port: $scope.port,
                    options: JSON.stringify(selectedoptions),
                    notes: $scope.notes,
                    data: $scope.data,
                    active: activation,
                    project_id: $stateParams.projectId,
                    space_id: $scope.space_id,
                    toggle: 0,
                    verification_enable: verification,
                    verification_digits: $scope.digits,
                    left_coordinate: $scope.leftcoordinate,
                    top_coordinate: $scope.topcoordinate
                });
                console.log('datasource-->');
                console.log(datasource);
                DatasourceService.Create(datasource)
                        .then(function (response) {
                            console.log(response);
                            if (response.success == false) {
                                swal("Error Creating new datasource", "", "error");
                            } else {
                                // if ($scope.selectedOrganization){  
                                // DatasourceService.AttachProject(response.id, $stateParams.projectId)
                                //         .then(function (response) {
                                //             console.log('Project Attached');
                                //         });
// }
                                swal("New Datasource has been created", "", "success");
                                //$state.go('datasources', {redirect: true});
                                 $state.go('datasources', {projectId: $stateParams.projectId});
                            }
                        });

            }

        };

// Init simple wizard
        initWizardSimple();
// Init wizards with validation
        initWizardValidation();
    }
]);

App.directive('datasourceEditModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/datasource/views/editdatasource.html'
        //templateUrl: '/src/assets/js/modules/datasource/views/editdatasource.html'
    };
});
App.directive('datasourceDeleteModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/datasource/views/delete_datasource.html'
        //templateUrl: '/src/assets/js/modules/datasource/views/delete_datasource.html'
    };
});
App.directive('datasourceAddImageModal', function () {
    return {
        //template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/datasource/views/datasource_add_image.html'
    };
});