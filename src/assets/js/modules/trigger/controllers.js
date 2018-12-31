// Tables DataTables Controller
App.controller('TablesTriggerTablesCtrl', ['$scope', '$localStorage', '$state', '$timeout', '$stateParams', 'TriggerService', 'urls', 'ProjectService', 'DatasourceService', 'DatapointService', 'triggers', 'localStorageService',
    function ($scope, $localStorage, $state, $timeout, $stateParams, TriggerService, urls, ProjectService, DatasourceService, DatapointService, triggers, localStorageService) {
        $scope.deleteTrigger = function () {
            TriggerService.Delete($scope.trigger.id).then(function (response) {
                if (response.success === false) {
                    swal("Error deleting Trigger", "", "error");
                } else {
                    localStorageService.remove('triggers');
                                swal("Trigger has been Deleted", "", "success");

                                var oTable = $('.js-dataTable-full-2').dataTable();
                                oTable.fnClearTable();
                                oTable.fnDestroy();
                                triggers.fetchTriggers(function (data) {

//   console.log('saving organization in localStorage...');
                                    localStorageService.set('triggers', data);
                                    triggerlist = data;

//   //$scope.organizationslist = data;
                                });
                                $timeout(function () {
//initDataTableFull();
                                    $state.reload();
                                }, 1000);
                $('#modal-trigger-delete').modal('hide');
            }
            });
        };
        $scope.projectId = $stateParams.projectId;
        ProjectService.GetById($stateParams.projectId).
        then(function (result){
            $scope.project = result.project;
        });

         /*
         *Function Reload
         */
        $scope.reload = function () {
            $state.reload();
        };

        function myIndexOf(o, arr) {

            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name == o) {
                    return i;
                }
            }

            return -1;
        } 
        $scope.trigger = [];

        var Triglist = [];
        var datasources = [];
        var datapoints = [];

        DatasourceService.GetDatasourcesByProjectId($stateParams.projectId)
        .then (function (rest) {
            console.log('datasources for this project--->');
            console.log(rest);
            $scope.datasources = rest.datasources;
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
        $(document).on("click", ".view-trigger-edit", function () {
            var dataid = $(this).data('id');
            TriggerService.GetById(dataid).then(function (response) {
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
                $scope.trigger = angular.copy(response.trigger[0]);
                console.log ('trigger para el scope');
                console.log($scope.trigger);
//en el array de roles, poneos el datasource del trigger como default
                $scope.selectDatasourceObject = $scope.datasources[myIndexOf($scope.trigger.datasource_name, $scope.datasources)];
                console.log('datasource Objeto seleccionado ---');
                console.log(myIndexOf($scope.trigger.datasource_name, $scope.datasources));
                console.log($scope.selectDatasourceObject);

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
            // TriggerService.GetAllByProjectId($stateParams.projectId)
            // .then (function (response){
            //     localStorageService.set('triggers', response);
            // });
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
                            // return "<div class='btn-group'><button class='btn btn-xs btn-default view-trigger' data-toggle='modal' data-id='" + data + "' href='#modal-trigger-view' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-trigger-edit' data-toggle='modal' data-id='" + data + "' href='#modal-trigger-edit' type='button'><i class='fa fa-pencil'></i></button><button class='btn btn-xs btn-default view-trigger-delete' data-toggle='modal' data-id='" + data + "' href='#modal-trigger-delete' type='button' ng-click='initModalData()'><i class='fa fa-times'></i></button></div>";
                            return "<div class='btn-group'><button class='btn btn-xs btn-default view-trigger' data-toggle='modal' data-id='" + data + "' href='#modal-trigger-view' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-trigger-delete' data-toggle='modal' data-id='" + data + "' href='#modal-trigger-delete' type='button' ng-click='initModalData()'><i class='fa fa-times'></i></button></div>";
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

        
        /*
         *Function Create trigger
         */
        $scope.createTrigger = function () {

            if ($scope.triggername)
            {
                var activation = 0;
                console.log('saving Trigger...');
                if ($scope.activate == true) {
                    activation = 1;
                }
// use $.param jQuery function to serialize data from JSON 
                var trigger = $.param({
                    name: $scope.triggername,
                    operator: $scope.operator,
                    value: $scope.value,
                    trigger_action_type_id: $scope.selectedAction,
                    project_id: $scope.projectId, 
                    datasource_id: $scope.selectedDatasource,
                    datapoint_id: $scope.selectedDatapoint,
                    notes: $scope.notes,
                    active: activation,
                    custommesage: $scope.custommessage,
                    act_datasource_id: $scope.selectedDatasourceAct,
                    // datapoint_id: $scope.selectedDatapointAct,
                    act_new_value: $scope.value_act,
                });

                console.log(trigger);
                TriggerService.Create(trigger)
                        .then(function (response) {
                            console.log(response);
                            if (response.success == false) {
                                swal("Error Creating new trigger", "", "error");
                            } else {
                                swal("New Trigger has been created", "", "success");
                                //$state.go('triggers', {redirect: true});
                                $state.go('triggers', {projectId: $stateParams.projectId});
                                $timeout(function () {
//initDataTableFull();
                                    $state.reload();
                                }, 1000);
                            }
                        });
            }
        };

        $scope.getDatapointsOptions = function () {

            ProjectService.GetDatapointsByDatasourceId($scope.selectDatasourceObject.id).
                    then(
                            function (response) {
                                $scope.datapoints = response.datapoints;
                            });

        };
      

            ProjectService.GetDatasourcesByProjectId($stateParams.projectId).
                    then(
                            function (response) {
                                $scope.datasources = response.datasources;
                            });

            TriggerService.GetTriggerTypes().
                    then(
                            function (response) {
                                $scope.actions = response.trigger_action_types;
                            });
    }

]);

// Forms Wizard Controller
App.controller('TriggerFormsWizardCtrl', ['$scope', '$localStorage', '$window', 'DatasourceService', '$state', '$stateParams', 'ProjectService', 'TriggerService',
    function ($scope, $localStorage, $window, DatasourceService, $state, $stateParams, ProjectService, TriggerService) {
         $scope.projectId = $stateParams.projectId;
         $scope.showNewValue = false;
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
                    'validation-triggername': {
                        required: true,
                        minlength: 2
                    },
                    'validation-datasource': {
                        required: true,
                    },
                    'validation-datapoint': {
                        required: true,
                    },
                    'validation-operator': {
                        required: true,
                    },
                    'validation-value': {
                        required: true,
                        // integer: true,
                    },
                    'validation-action': {
                        required: true,
                    }
                },
                messages: {
                    'validation-triggername': {
                        required: 'Please enter Trigger name',
                        minlength: 'Your firtname must consist of at least 2 characters'
                    },
                    'validation-datasource': 'Please select a datasource',
                    'validation-datapoint': 'Please select a datapoint',
                    'validation-operator': 'Please select an operator',
                    'validation-action': 'Please select an action'
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
         *Function Create trigger
         */
        $scope.createTrigger = function () {
             var isChecked = $('#val-activate').prop("checked");
             //var recipients = "none";
            if ($scope.triggername)
            {
                var myJsonRecipients = JSON.stringify($scope.recipientIDArray);
                var activation = 0;
                console.log('saving Trigger...');
                if (isChecked) {
                    activation = 1;
                }
            //Value "between"
            if($scope.value2){
                $scope.value = $scope.value+', '+$scope.value2;
            }
            //var isChecked = $('#recipient_' + recipient.id).prop("checked");
// use $.param jQuery function to serialize data from JSON 
                var trigger = $.param({
                    name: $scope.triggername,
                    operator: $scope.operator,
                    value: $scope.value,
                    trigger_action_type_id: $scope.selectedAction,
                    project_id: $scope.projectId, 
                    datasource_id: $scope.selectedDatasource,
                    // datapoint_id: $scope.selectedDatapoint,
                    datapoint_id: 1,
                    notes: $scope.notes,
                    active: activation,
                    recipients: myJsonRecipients,
                    custommessage: $scope.custommessage,
                    act_datasource_id: $scope.selectedDatasourceAct,
                    // act_datapoint_id: $scope.selectedDatapointAct,
                    act_datapoint_id: 0,
                    act_new_value: $scope.value_act,
                });

                console.log(trigger);
                TriggerService.Create(trigger)
                        .then(function (response) {
                            console.log(response);
                            if (response.success == false) {
                                swal("Error Creating new trigger", "", "error");
                            } else {
                                swal("New Trigger has been created", "", "success");
                                //$state.go('triggers', {redirect: true});
                                $state.go('triggers', {projectId: $stateParams.projectId});
                            }
                        });
            }
        };

        $scope.getDatapointsOptions = function () {

            ProjectService.GetDatapointsByDatasourceId($scope.selectedDatasource).
                    then(
                            function (response) {
                                $scope.datapoints = response.datapoints;
                            });

        };
      
        $scope.getRecipients = function () {

            if(($scope.selectedAction == 1) || ($scope.selectedAction == 2)|| ($scope.selectedAction == 3)) {
                console.log("$scope.datasources_act");
                console.log($scope.datasources_act);
                $scope.datasources_act = [];
                ProjectService.GetUsersByProjectId($stateParams.projectId).
                    then(
                            function (response) {
                                console.log('$stateParams.projectId');
                                console.log($stateParams.projectId);
                                console.log('recipients--->');
                                console.log(response);
                                $scope.recipients = response.users;
                            });


            } else{

                ProjectService.GetDatasourcesByProjectId($stateParams.projectId).
                    then(
                            function (response) {

                                console.log(response.datasources);
                                $scope.datasources_act = response.datasources;
                            });

            }
            if ($scope.selectedAction == 6){
                $scope.showNewValue = true;

            }

            
        };

         $scope.addToList = function () {
//data-id='" + data + "'
           //alert('hola');
           $scope.recipientIDArray = [];
              angular.forEach($scope.recipients, function(recipient){
                if (!!recipient.selected) $scope.recipientIDArray.push(recipient.id);
              })

              console.log('recipientIDArray');
              console.log($scope.recipientIDArray);

        };


            ProjectService.GetDatasourcesByProjectId($stateParams.projectId).
                    then(
                            function (response) {

                                console.log(response.datasources);
                                $scope.datasources = response.datasources;
                            });

            TriggerService.GetTriggerTypes().
                    then(
                            function (response) {

                                // console.log('Triggers--->');
                                // console.log(response.trigger_action_types);
                                $scope.actions = response.trigger_action_types;
                            });

            TriggerService.GetOperators()
                .then(function (rest){
                    // console.log('operators--->');
                    // console.log(rest);
                    $scope.operators = rest.operators;
                    //$scope.selectedOperator = $scope.operators[myIndexOf($scope.trigger.datapoint_name, $scope.datapoints)];

                });

            TriggerService.GetTriggerTypes().
                    then(
                            function (response) {
                                $scope.actions = response.trigger_action_types;
                            });




// Init simple wizard
        initWizardSimple();
// Init wizards with validation
        initWizardValidation();
    }
]);


App.directive('triggerViewModal', function () {
    return {
        restrict: "EA",
        scope: false,
        //templateUrl: '/src/assets/js/modules/trigger/views/trigger-modal-view.html'
        templateUrl: '/assets/js/modules/trigger/views/trigger-modal-view.html'
    };
});
App.directive('triggerAskaddModal', function () {
    return {
        restrict: "EA",
        scope: false,
        //templateUrl: '/src/assets/js/modules/trigger/views/trigger-modal-view.html'
        templateUrl: '/assets/js/modules/trigger/views/trigger-modal-addask.html'
    };
});
App.directive('triggerEditModal', function () {
    return {
        restrict: "EA",
        scope: false,
        // templateUrl: '/src/assets/js/modules/trigger/views/trigger-modal-edit.html'
        templateUrl: '/assets/js/modules/trigger/views/trigger-modal-edit.html'
    };
});
App.directive('triggerDeleteModal', function () {
    return {
        restrict: "EA",
        scope: false,
        // templateUrl: '/src/assets/js/modules/trigger/views/trigger-modal-delete.html'
        templateUrl: '/assets/js/modules/trigger/views/trigger-modal-delete.html'
    };
});