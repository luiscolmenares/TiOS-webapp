/*
 *  Document   : controllers.js
 *  Author     : kikecolmenares
 *  Description: events controllers
 *
 */
 App.controller('AddEventCtrl', ['$scope', '$localStorage', '$window', 'UserService', 'OrganizationService', 'RoleService', 'ProjectService', 'DatasourceService', '$http', '$state', '$timeout', 'ProjectService', 'TriggerService', 'EventService',
    function ($scope, $localStorage, $window, UserService, OrganizationService, RoleService, ProjectService, DatasourceService, $http, $state, $timeout, ProjectService, TriggerService, EventService) {
       
        var today = new Date();
        var date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes();
        $scope.fromdate = date;
        $scope.fromtime = time;
        $scope.repeattext = '...';
        $scope.topic = "";
        $scope.broker = "";
        //$scope.repeatchecked = false; 
        $scope.isallday = false;
        $scope.weeklyrepeatshow = false;
        $scope.dailyrepeatshow = false;
        $scope.monthlyrepeatshow = false;
        $scope.yearlyrepeatshow = false;
        $scope.datasourceshow = false;
        $scope.notallday = true;
        $scope.allDay = function (){
            var isCheckedAllDay = $('#val-all-day-check').prop("checked");
            if (isCheckedAllDay) {
                $scope.isallday = true;
                $scope.notallday = false;
            } else {
                $scope.isallday = false;
                $scope.notallday = true;
            }
            
        }
        $scope.getDatapointsOptions = function () {
            ProjectService.GetDatapointsByDatasourceId($scope.selectedDatasource).then(function (response) {
                $scope.datapoints = response.datapoints;
            });
        };
        $scope.getDatasourceOptions = function () {
            console.log('getting datasources');
            console.log('$scope.selectedProject');
            console.log($scope.selectedProject.name);
            ProjectService.GetDatasourcesByProjectId($scope.selectedProject).then(function (response) {
                console.log(response.datasources);
                $scope.datasources = response.datasources;
            });

        };
        $scope.cancelRepeat = function(){
             //$scope.repeatchecked = false; 
             console.log('cancelado');

            var isCheckedRepeat = $('#val-repeat-check').prop("checked");
             console.log('isCheckedRepeat');
            console.log(isCheckedRepeat);
            console.log('$scope.repeatchecked');
            console.log($scope.repeatchecked);
            $scope.repeatchecked = false; 
            // if (isCheckedRepeat) {
            //         $scope.repeatchecked = false; 
            //     } else {
            //         $scope.repeatchecked = false; 
            //     }
        }
        $scope.clearRepeat = function (){
            $scope.repeattext = '...';
        }
        $scope.showRepeat = function (){
            console.log('repeat');
            var isCheckedRepeat = $('#val-repeat-check').prop("checked");
            if (isCheckedRepeat) {
                if ($scope.fromdate){
                    $('#modal-repeat').modal('show');
                } else {
                    $scope.repeatchecked = false; 
                    $.notify({
                        message : 'Please enter from date.'
                    }, {
                        type : 'warning'
                    });
                }            
                    } else {
                        console.log('repeat off');
                        $scope.clearRepeat();
                    }

        };

        $scope.createRepeat = function(){
            // $scope.repeats
            // $scope.repeatsDaily
            // $scope.repeatsWeekly
            // $scope.repeatsMonthly
            // $scope.repeatsYearly
            // $scope.ocurrency
            if($scope.repeats){
                // switch($scope.repeats) {

                // }

            } else {
                $scope.repeatchecked = false;
                $scope.repeattext = '...'
                $('#modal-repeat').modal('hide');
            }
            console.log("scope");
            console.log($scope);

            
            $('#modal-repeat').modal('hide');
        }

        $scope.getsRepeatsWeekly = function (){
            $scope.repeattext = ' Every '+$scope.repeatsweekly+' weeks';
            var weekdays = '';
            var isCheckedSunday = $('#sunday').prop("checked");
            if(isCheckedSunday){
                $scope.repeattext += 'Sunday';
            }
            var isCheckedMonday = $('#monday').prop("checked");
            var isCheckedTuesday = $('#tuesday').prop("checked");
            var isCheckedWednesday = $('#wednesday').prop("checked");
            var isCheckedThurday = $('#thusrday').prop("checked");
            var isCheckedFriday = $('#friday').prop("checked");
            var isCheckedSaturday = $('#Saturday').prop("checked");
            
        }
        $scope.getsRepeatsDaily = function (){
            $scope.repeattext = ' Every '+$scope.repeatsdaily+' days';
            
        }

        $scope.getRepeats = function (){
            console.log('repeats');
            console.log($scope.repeats);
            console.log('ocurrency radio');
            $scope.repocurrency = $('.ocurrency input:radio:checked').val();
            console.log($scope.repocurrency);
            switch($scope.repeats) {
                case 'daily':
                    $scope.weeklyrepeatshow = false; 
                    $scope.dailyrepeatshow = true;
                    $scope.monthlyrepeatshow = false;
                    $scope.yearlyrepeatshow = false;
                    $scope.repeattext = ' Daily';
                    
                    break;
                case 'weekday':
                    $scope.weeklyrepeatshow = false;
                    $scope.dailyrepeatshow = false;
                    $scope.monthlyrepeatshow = false;
                    $scope.yearlyrepeatshow = false;
                    $scope.repeattext = ' Weekly on weekdays';
                    
                    break;
                case 'm-w-f':
                    $scope.weeklyrepeatshow = false;
                    $scope.dailyrepeatshow = false;
                    $scope.monthlyrepeatshow = false;
                    $scope.yearlyrepeatshow = false;
                    $scope.repeattext = ' Weekly on Monday, Wednesday, Friday';
                    
                    break;
                case 't-t':
                    $scope.weeklyrepeatshow = false;
                    $scope.dailyrepeatshow = false;
                    $scope.monthlyrepeatshow = false;
                    $scope.yearlyrepeatshow = false;
                    $scope.repeattext = ' Weekly on Tuesday, Thursday';
                    
                    break;
                case 'weekly':
                    
                    $scope.weeklyrepeatshow = true;
                    $scope.dailyrepeatshow = false;
                    $scope.monthlyrepeatshow = false;
                    $scope.yearlyrepeatshow = false;
                    // if ($scope.repeatsweekly){
                    //     console.log('repeats weekly');
                    //     $scope.repeattext = 'Every '+ $scope.repeatsWeekly+' weeks' + weekdays;
                    // } else {
                        $scope.repeattext = ' Weekly';
                    //}

                    
                    break;
                case 'monthly':
                    $scope.weeklyrepeatshow = false;
                    $scope.dailyrepeatshow = false;
                    $scope.monthlyrepeatshow = true;
                    $scope.yearlyrepeatshow = false;
                    $scope.repeattext = ' Monthly';
                    
                    break;
                case 'yearly':
                    $scope.weeklyrepeatshow = false;
                    $scope.dailyrepeatshow = false;
                    $scope.monthlyrepeatshow = false;
                    $scope.yearlyrepeatshow = true;
                    $scope.repeattext = ' Anually on';
                    
                    break;
                default:
                    $scope.weeklyrepeatshow = false;
                    $scope.dailyrepeatshow = false;
                    $scope.monthlyrepeatshow = false;
                    $scope.repeattext = false;
                    $scope.repeattext = '...';
                    break;
                    
            } 
        };
        


        OrganizationService.GetAll()
                .then(function (result) {
                    console.log(result);
                    $scope.organizations = result.organizations;
                    //$scope.organizations = result;
                });
        ProjectService.GetAll()
                .then(function (result) {
                    console.log(result);
                    var proj
                    for (var i = result.projects.length - 1; i >= 0; i--) {
                        //Things[i]
                        result.projects[i].proj_org = result.projects[i].name + ', from ' + result.projects[i].organization_name

                    }
                    $scope.projects = result.projects;
                    //$scope.organizations = result;
                });

                $scope.getTimePickerOptions = function(){
                    var isCheckedAllDay = $('#val-all-day-check').prop("checked");
                 
                  if (isCheckedAllDay) {
                    $scope.fromtime
                    // if($scope.fromdate)
                    // {
                        console.log($scope.fromdate)
                    //
                   // $scope.fromdate = "new";
                   // $scope.todate = "new";

                }

          

        }

        EventService.GetEventActionTypes().
                    then(
                            function (response) {
                                $scope.actions = response.event_action_types;
                            });
    $scope.getDatapointsOptions = function () {
        console.log('$scope.selectedDatasource----===');
        console.log($scope.selectedDatasource);

            ProjectService.GetDatapointsByDatasourceId($scope.selectedDatasource).then(function (response) {
                $scope.datapoints = response.datapoints;
            });

            //get the topic 

            DatasourceService.GetById($scope.selectedDatasource)
                            .then(function (rest) {
                                if (rest.datasource.options) {
                                    $scope.topic = JSON.parse(rest.datasource.options).topic;
                                    $scope.broker = JSON.parse(rest.datasource.options).broker;
                                }
                                

                            });
        };

        $scope.getRecipients = function () {
            console.log('$scope.selectedaction-----');
            console.log($scope.selectedaction);
            switch($scope.selectedaction) {
                    case 1:
                    $scope.datasourceshow = false;
                        //Send Email
                        ProjectService.GetUsersByProjectId($scope.selectedProject.id).
                    then(
                            function (response) {
                                console.log('$scope.selectedProject');
                                console.log($scope.selectedProject);
                                console.log('recipients--->');
                                console.log(response);
                                $scope.recipients = response.users;
                            });

                        break;
                    case 2:
                    //SMS Message
                    $scope.datasourceshow = false;
                    ProjectService.GetUsersByProjectId($scope.selectedProject.id).
                    then(
                            function (response) {
                                console.log('$scope.selectedProject');
                                console.log($scope.selectedProject);
                                console.log('recipients--->');
                                console.log(response);
                                $scope.recipients = response.users;
                            });
                   
                        break;
                    case 3:
                    //System Notification
                    $scope.datasourceshow = false;
                    ProjectService.GetUsersByProjectId($scope.selectedProject.id).
                    then(
                            function (response) {
                                console.log('$scope.selectedProject');
                                console.log($scope.selectedProject);
                                console.log('recipients--->');
                                console.log(response);
                                $scope.recipients = response.users;
                            });
                   
                      
                        break;
                    case 4:
                    //Turn off
                     $scope.datasourceshow = true;
                     $scope.recipients = [];
                     ProjectService.GetDatasourcesByProjectId($scope.selectedProject.id).then(function (response) {
                            console.log(response.datasources);
                            $scope.datasources = response.datasources;
                        });
                        
                        break;
                    case 5:
                    //turn on
                    $scope.recipients = [];
                         $scope.datasourceshow = true;
                         ProjectService.GetDatasourcesByProjectId($scope.selectedProject.id).then(function (response) {
                            console.log(response.datasources);
                            $scope.datasources = response.datasources;
                        });
                        break;
                    case 6:
                    //new value
                    $scope.recipients = [];
                     $scope.datasourceshow = true;
                     ProjectService.GetDatasourcesByProjectId($scope.selectedProject.id).then(function (response) {
                            console.log(response.datasources);
                            $scope.datasources = response.datasources;
                        });
                    break;
                    default:
                        //code block
                        break;
}


            

        };

        

// +------------------+------------------+------+-----+---------+----------------+
// | Field            | Type             | Null | Key | Default | Extra          |
// +------------------+------------------+------+-----+---------+----------------+
// | id               | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
// | event_id         | int(11)          | YES  |     | NULL    |                |
// | title            | varchar(191)     | NO   |     | NULL    |                |
// | description      | varchar(191)     | YES  |     | NULL    |                |
// | action           | varchar(191)     | YES  |     | NULL    |                |
// | valueFrom        | varchar(191)     | YES  |     | NULL    |                |
// | ValueTo          | varchar(191)     | YES  |     | NULL    |                |
// | allDay           | tinyint(1)       | NO   |     | NULL    |                |
// | start            | varchar(191)     | NO   |     | NULL    |                |
// | end              | varchar(191)     | YES  |     | NULL    |                |
// | url              | varchar(191)     | YES  |     | NULL    |                |
// | className        | varchar(191)     | YES  |     | NULL    |                |
// | editable         | tinyint(1)       | YES  |     | NULL    |                |
// | startEditable    | tinyint(1)       | YES  |     | NULL    |                |
// | durationEditable | tinyint(1)       | YES  |     | NULL    |                |
// | resourceEditable | tinyint(1)       | YES  |     | NULL    |                |
// | rendering        | varchar(191)     | YES  |     | NULL    |                |
// | overlap          | tinyint(1)       | YES  |     | NULL    |                |
// | constraint       | varchar(191)     | YES  |     | NULL    |                |
// | color            | varchar(191)     | YES  |     | NULL    |                |
// | backgroundColor  | varchar(191)     | YES  |     | NULL    |                |
// | borderColor      | varchar(191)     | YES  |     | NULL    |                |
// | textColor        | varchar(191)     | YES  |     | NULL    |                |
// | active           | int(11)          | YES  |     | NULL    |                |
// | organization_id  | int(10) unsigned | NO   | MUL | NULL    |                |
// | project_id       | int(10) unsigned | NO   | MUL | NULL    |                |
// | datasource_id    | int(10) unsigned | NO   | MUL | NULL    |                |
// | datapoint_id     | int(10) unsigned | NO   | MUL | NULL    |                |
// | created_at       | timestamp        | YES  |     | NULL    |                |
// | updated_at       | timestamp        | YES  |     | NULL    |                |
// +------------------+------------------+------+-----+---------+----------------+

        $scope.createEvent = function () {
            console.log('scope total');
             console.log($scope);
            //console.log($scope.parent.checkOut);\
            var allDay = 0;
               var isCheckedAllDay = $('#val-all-day-check').prop("checked");
                 
                  if (isCheckedAllDay) {
                    allDay = 1;
                }
//              var isCheckedEmail = $('#val-activate-email').prop("checked");
//              var isCheckedSMS = $('#val-activate-sms').prop("checked");
                //create timestamp for event date
                if(($scope.from_date) && ($scope.from_time)){
                    var from_timestamp = Math.round(new Date($scope.from_date+" "+$scope.from_time).getTime()/1000);
                    console.log('timestamp---->');
                    console.log(from_timestamp);
                     console.log('recipients');;
                      console.log($scope.recipients);

                }
                //create action
                if($scope.selectedaction){
                    console.log('selectedaction id');
                    console.log($scope.selectedaction);
                    var myJsonRecipients = JSON.stringify($scope.recipientIDArray);
                    var action_array = [];
                    var topic = "";
                   switch($scope.selectedaction) {
                    case 1:
                        //Send Email
                        // action_array.push({
                        //     "action" : "send-email",
                        //     "recipients" : myJsonRecipients,
                        //     "message" : $scope.custommessage,
                        //     "triggered" : 0,
                        // })
                    var actionts = {
                            "action" : "send-email",
                            "recipients" : myJsonRecipients,
                            "message" : $scope.custommessage,
                            "triggered" : 0,
                    };
                        break;
                    case 2:
                    
                    var actionts = {
                            "action" : "sms-message",
                            "recipients" : myJsonRecipients,
                            "message" : $scope.custommessage,
                            "triggered" : 0,
                    };
                        
                        break;
                    case 3:
                       var actionts = {
                            "action" : "system-notification",
                            "recipients" : myJsonRecipients,
                            "message" : $scope.custommessage,
                            "triggered" : 0,
                    };
                        break;
                    case 4:
                    if($scope.selectedDatasource){
                

                            var actionts = {
                            "action" : "turn-off",
                            "recipients" : myJsonRecipients,
                            "message" : $scope.custommessage,
                            "triggered" : 0,
                            "topic" : $scope.topic,
                            "broker" : $scope.broker,
                    };



                    }
                    
                        
                        break;
                    case 5:
                            var actionts = {
                            "action" : "turn-on",
                            "recipients" : myJsonRecipients,
                            "message" : $scope.custommessage,
                            "triggered" : 0,
                            "topic" : $scope.topic,
                            "broker" : $scope.broker,
                            };
                            
                        break;
                    default:
                        //code block
                        break;
                    } //end switch
                        } //end if
                        console.log('action array to push');
                        console.log(actionts);
                        //push to array
                         action_array.push(actionts);
var isCheckedRepeat = $('#val-repeat-check').prop("checked");

                 if(isCheckedRepeat == true) 
                 {
                    
                    if($scope.repocurrence == 'never'){
                        $scope.ocurrency = 365;
                    }
                    console.log('$scope.ocurrency-----+++++++++');
                    console.log($scope.ocurrency);
                        var description = {
                            "ocurrence" : $scope.repocurrence,
                            "count" : $scope.ocurrency,
                            "repeats" : $scope.repeats,
                            "every" : 'none', //to review
                            "valueFrom": from_timestamp
                            };
                        var add_time = 0;
                        //for (var i =  1; i <= $scope.ocurrency; i++) {
                            // use $.param jQuery function to serialize data from JSON 
                                 var event = $.param({
                                     title: $scope.title,
                                     description: JSON.stringify(description),
                                     action: JSON.stringify(action_array),
                                     //valueFrom: from_timestamp,                   
                                     allday: allDay,
                                     color: '#fac5a5',
                                     organization_id: $scope.selectedProject.organization_id,
                                     project_id: $scope.selectedProject.id,
                                     datasource_id: 0,
                                     datapoint_id: 0,
                                     active: 1, 
                                     end: 'after',
                                 });
                            EventService.Create(event)
                             .then(function(response){       
                             console.log('Event created');
                            console.log(response);     
                            swal("New event has been created", "", "success");
                                $state.go('systemevents', {redirect: true});
                                 $timeout(function () {
//initDataTableFull();
                                    $state.reload();
                                }, 1000);             
                        });
                        //from_timestamp = from_timestamp + 86400;
                    //} 
                
                 
             
                 } else{
                     var description = {
                            "ocurrence" : 'none',
                            "count" :'none',
                            "repeats" : 'none',
                            "every" : 'none',
                            "valueFrom": from_timestamp
                            };
                    var event = $.param({
                                     title: $scope.title,
                                     description: JSON.stringify(description),
                                     action: JSON.stringify(action_array),
                                     //valueFrom: from_timestamp,                   
                                     allday: allDay,
                                     color: '#fac5a5',
                                     organization_id: $scope.selectedProject.organization_id,
                                     project_id: $scope.selectedProject.id,
                                     datasource_id: 0,
                                     datapoint_id: 0,
                                     active: 1, 
                                     end: 'after',
                                 });

                    EventService.Create(event)
                 .then(function(response){
                    console.log('Event created');
                    console.log(response);
                    swal("New event has been created", "", "success");
                                $state.go('systemevents', {redirect: true});
                                 $timeout(function () {
//initDataTableFull();
                                    $state.reload();
                                }, 1000);      

                 })
                 }

                 

//                     email: $scope.email,
//                     phone: $scope.phone,
//                     password: $scope.password,
//                     notes: $scope.notes,
//                     role_id: $scope.selectedRole.id,
//                     organization_id: $scope.selectedOrganization.id,
//                     active: activation,
//                     activation_email: activation_email,
//                     active_sms: activation_sms,
//                 });
//                 EventService.Create(user)
//                         .then(function (response) {
//                             console.log(response);
//                             if (response.success == false) {
//                                 swal("Error Creating new user", "", "error");
//                             } else {
//                                 swal("New user has been created", "", "success");
//                                 $state.go('users', {redirect: true});
//                                 $timeout(function () {
// //initDataTableFull();
//                                     $state.reload();
//                                 }, 1000);
//                             }
//                         });

//             }

        };


// Init Material Forms Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
//         var initValidationMaterial = function () {
//             jQuery('.js-validation-material').validate({
//                 ignore: [],
//                 errorClass: 'help-block text-right animated fadeInDown',
//                 errorElement: 'div',
//                 errorPlacement: function (error, e) {
//                     jQuery(e).parents('.form-group > div').append(error);
//                 },
//                 highlight: function (e) {
//                     var elem = jQuery(e);

//                     elem.closest('.form-group').removeClass('has-error').addClass('has-error');
//                     elem.closest('.help-block').remove();
//                 },
//                 success: function (e) {
//                     var elem = jQuery(e);

//                     elem.closest('.form-group').removeClass('has-error');
//                     elem.closest('.help-block').remove();
//                 },
//                 rules: {
//                     'val-name': {
//                         required: true,
//                         minlength: 3
//                     },
//                     'val-email': {
//                         required: true,
//                         email: true
//                     },
//                     'val-password': {
//                         required: true,
//                         minlength: 5
//                     },
//                     'val-confirm-password': {
//                         required: true,
//                         equalTo: '#val-password'
//                     },
//                     'val-role': {
//                         required: true,
//                     },
//                     'val-organization': {
//                         required: true,
//                     },
//                     'val-phone': {
//                         required: true,
//                         //phoneUS: true
//                     }
//                 },
//                 messages: {
//                     'val-name': {
//                         required: 'Please enter a name',
//                         minlength: 'The name must consist of at least 3 characters'
//                     },
//                     'val-email': 'Please enter a valid email address',
//                     'val-password': {
//                         required: 'Please provide a password',
//                         minlength: 'Your password must be at least 5 characters long'
//                     },
//                     'val-confirm-password': {
//                         required: 'Please provide a password',
//                         minlength: 'Your password must be at least 5 characters long',
//                         equalTo: 'Please enter the same password as above'
//                     },
//                     'val-role': 'Please select a role',
//                     'val-organization': 'Please select an organization',
//                     'val-phone': 'Please provide a phone number',
//                 }
//             });
//         };

// // Init Material Forms Validation
//         initValidationMaterial();

// // Init Validation on Select2 change
//         jQuery('[data-js-select2]').on('change', function () {
//             jQuery(this).valid();
//         });
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
    }
]);


App.directive('repeatModal', function () {
    return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
        restrict: "EA",
        scope: false,
        templateUrl: '/assets/js/modules/event/views/repeat-modal.html'
        //templateUrl: '/src/assets/js/modules/project/views/project-user-modal.html'
    };
});