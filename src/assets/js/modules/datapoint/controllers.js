// Tables DataTables Controller
App.controller('TablesDatapointTablesCtrl', ['$scope', '$localStorage', '$state', '$timeout', '$stateParams', 'DatapointService', 'urls',
    function ($scope, $localStorage, $state, $timeout, $stateParams, DatapointService, urls) {
        $scope.datasourceId = $stateParams.datasourceId;
        $scope.isActive = function (active){
            //alert(active);
            if (active == "enabled"){
                return 'label label-success';
            } else {
                return 'label label-danger';
            }
        };
        $(document).on("click", ".view-datapoint-edit", function () {
            var dataid = $(this).data('id');
            DatapointService.GetById(dataid).then(function (response) {
                $scope.datapoint = angular.copy(response.datapoint);
                $('#modal-datapoint-edit').modal('show');
            });
        });
        $(document).on("click", ".view-datapoint-delete", function () {
            var dataid = $(this).data('id');
            DatapointService.GetById(dataid).then(function (response) {
                $scope.datapoint = angular.copy(response.datapoint);
                $('#modal-datapoint-delete').modal('show');
            });
        });
        $scope.editDatapoint = function () {
            var isChecked = $('#val-active').prop("checked");
            var activation = 0;
                if (isChecked) {
                    activation = 1;
                }

            var selectedoptions = {
                    'type': $scope.datapoint.type,
                    'unitid': $scope.datapoint.unitid,
                    'address': $scope.datapoint.address,
                };

            var datapoint = $.param({
                    id: $scope.datapoint.id,
                    name: $scope.datapoint.name,
                    type: $scope.datapoint.type,
                    unitid: $scope.datapoint.unitid,
                    address: $scope.datapoint.address,
                    data: $scope.datapoint.data,
                    options: JSON.stringify(selectedoptions),
                    active: activation,
                    notes: $scope.datapoint.notes, 
                    datasource_id: $scope.datasourceId,
                });
            DatapointService.Update(datapoint, $scope.datapoint.id).then(function (response) {
                if (response.success === false) {
                    swal("Error Updating Datapoint", "", "error");
                } else {
                    swal("Datapoint has been Updated", "", "success");
                    $timeout(function () {
                        $state.reload();
                    }, 1000);
                }
                $('#modal-datapoint-edit').modal('hide');
            });
        };
        $scope.deleteDatapoint = function () {
            DatapointService.Delete($scope.datapoint.id).then(function (response) {
                if (response.success === false) {
                    swal("Error in Delete Datapoint", "", "error");
                } else {
                    swal("Datapoint has been Deleted", "", "success");
                    $timeout(function () {
                        $state.reload();
                    }, 1000);
                }
                $('#modal-datapoint-delete').modal('hide');
            });
        };
        var loadDataPoint = function () {
            DatapointService.GetAll($stateParams.datasourceId).then(function (response) {
                for (var i = 0, len = response.datapoints.length; i < len; i++) {
                    //response.data.datasources[i].options = JSON.parse(response.data.datasources[i].options);
                    if (response.datapoints[i].active == 1){
                        response.datapoints[i].active = "enabled";
                    } else {
                        response.datapoints[i].active = "disabled";
                    }
                }
                $scope.datapoints = angular.copy(response.datapoints);
                DatapointService.GetDatapointTypes().then(function (result) {
                    $scope.datapointtypes = result.datapointtypes;
                });
            });
        };
        loadDataPoint();
    }
]);

// Forms Wizard Controller
App.controller('DatapointFormsWizardCtrl', ['$scope', '$localStorage', '$window', 'DatapointService', '$state', '$stateParams', 'SpaceService', '$stateParams', 'ProjectService', 'DatasourceService',
    function ($scope, $localStorage, $window, DatapointService, $state, $stateParams, SpaceService, $stateParams, ProjectService, DatasourceService) {
 
 console.log('-----stateparams');
 console.log($stateParams);
        DatasourceService.GetProjectByDatasourceId($stateParams.datasourceId).then(function (response){
            $scope.project = response.project;
            SpaceService.GetSpacesByProjectId($scope.project.id).then(function (response) {
                $scope.spaceslist = response.spaces;
            });
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
        $scope.selectedDatapointType = null;
        $scope.datapointtypes = [];
        DatapointService.GetDatapointTypes().then(function (result) {
            console.log('datapoints from controller');
            console.log(result);
            $scope.datapointtypes = result.datapointtypes;
        });
// });
        $scope.createDatapoint = function () {
             //$scope.notes = " ";
            var isChecked = $('#val-activate').prop("checked");
            console.log('saving Datapoint...');
            if ($scope.datapointname)
                $scope.data = "{}";
            {
                // var activation = 0;
                // console.log('saving Datapoint...');
                // if ($scope.activate == true) {
                //     activation = 1;
                // }

                var activation = 0;
                 if (isChecked) {
                    console.log('activado');
                    activation = 1;
                }

                var selectedoptions = {
                    'type': $scope.type,
                    'unitid': $scope.unitid,
                    'address': $scope.address,
                };
                var datapoint = $.param({
                    name: $scope.datapointname,
                    type: $scope.type,
                    unitid: $scope.unitid,
                    address: $scope.address,
                    options: JSON.stringify(selectedoptions),
                    datasource_id: $stateParams.datasourceId,
                    notes: $scope.notes,
                    data: $scope.data,
                    active: activation,
                    space_id: $scope.space_id
                });
                console.log('datapoint-->');
                console.log(datapoint);
                DatapointService.Create(datapoint).then(function (response) {
                    console.log(response);
                    if (response.success == false) {
                        swal("Error Creating new datapoint", "", "error");
                    } else {
                        // DatapointService.AttachDatasource(response.datapoint.id, $stateParams.datasourceId).then(function (response) {
                        //     console.log('Datasource Attached');
                        // });
                        swal("New Datapoint has been created", "", "success");
                        //$state.go('projects', {redirect: true});
                         $state.go('datapoints', {datasourceId: $stateParams.datasourceId});
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

App.directive('datapointEditModal', function () {
    return {
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/datapoint/views/edit_datapoint.html'
        // templateUrl: '/src/assets/js/modules/datapoint/views/edit_datapoint.html'
    };
});
App.directive('datapointDeleteModal', function () {
    return {
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/datapoint/views/delete_datapoint.html'
        //templateUrl: '/src/assets/js/modules/datapoint/views/delete_datapoint.html'
    };
});