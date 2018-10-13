// Dashboard Content Controller
App.controller('AdminDashboardCtrl', ['$scope', 
  '$localStorage', 
  '$window', 
  'AuthenticationService', 
  '$location', 
  'localStorageService', 
  'organizations', 
  'projects', 
  'users', 
  'OrganizationService',
  'UserService', 
  'ProjectService', 
  'DashboardService',
  'TriggerService',
  'triggers',
  'MqttClient',
  'urls',
  function ($scope, $localStorage, $window, AuthenticationService, $location, localStorageService, organizations, projects, users, OrganizationService, UserService, ProjectService, DashboardService, TriggerService, triggers, MqttClient, urls) {

    if (AuthenticationService.userHasRole(["super"])){
//Load organizations, users, projects and triggers
organizations.fetchOrganizations(function (data) {localStorageService.set('organizations', data);});
users.fetchUsers(function (data) {localStorageService.set('users', data);});
projects.fetchProjects(function (data) {localStorageService.set('projects', data);});
triggers.fetchTriggers(function (data) {localStorageService.set('triggers', data);});
// //MQTT TEST
// var ip = urls.MQTT_BROKER;
// var port = urls.MQTT_BROKER_PORT;
// var id = "test";

// MqttClient.init(ip, port, id);
// var options = {
//     useSSL: true,
//     timeout: 3,
//     onSuccess: successCallback,
//     onFailure: failureCallback,
//     userName: "kike",
//     password: "K1k3355453"
      
//      };
//     // MqttClient.connect({onSuccess: successCallback});
//     MqttClient.onMessageArrived= onMessageArrivedCallback;
//     MqttClient.connect(options);

//     function successCallback() {
//       console.log('MQTT conectado')
//       MqttClient.subscribe('/nodered');
//       message = new Paho.MQTT.Message("Hello from app nuevo");
//       message.destinationName = "test";
//       MqttClient.send(message);

//     }
//     function failureCallback() {
//       console.log('MQTT no conectado')

//     }
    
    // function onMessageArrivedCallback(r_message) {
    //   alert('mensaje')
    //   out_msg="Message received "+r_message.payloadString+"<br>";
    // out_msg=out_msg+"Message received Topic "+r_message.destinationName;
    // //console.log("Message received ",r_message.payloadString);
    // console.log(out_msg);
    // // document.getElementById("messages").innerHTML =out_msg;

    // }
    // function onMessageArrived(){
    //   alert('mensaje recibido');
    // out_msg="Message received "+r_message.payloadString+"<br>";
    // out_msg=out_msg+"Message received Topic "+r_message.destinationName;
    // //console.log("Message received ",r_message.payloadString);
    // console.log(out_msg);
    // // document.getElementById("messages").innerHTML =out_msg;
    // }
//Tiles data
OrganizationService.GetOrganizationsCount().then(function (data) {
  $scope.organizationscount = data;
});
UserService.GetUsersCount().then(function (data) {
  $scope.usercount = data;
});
ProjectService.GetProjectsCount().then(function (data) {
  $scope.projectscount = data;
});
DashboardService.GetDashboardsCount().then(function (data) {
  $scope.dashboardscount = data;
});
TriggerService.GetTriggersCount().then(function (data) {
  $scope.triggerscount = data;
});

} else {

}

}
]);

// Dashboard Content Controller
App.controller('HomeDashboardCtrl', ['$scope', '$localStorage', '$window', 'AuthenticationService', '$location', 'ProjectService', '$stateParams', '$sessionStorage', 'users', 'organizations', 'projects', '$rootScope', 'localStorageService', 'triggers',
  function ($scope, $localStorage, $window, AuthenticationService, $location, ProjectService, $stateParams, $sessionStorage, users, organizations, projects, $rootScope, localStorageService, triggers) {

    console.log('$$sessionStorage.loggeduser');
    console.log($sessionStorage.loggeduser.user);

//preload Organization, users and projects
//Users
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
//Organizations
organizations.fetchOrganizations(function (data) {
  if (AuthenticationService.userHasRole(["super"])){
    localStorageService.set('organizations', data);
  } else {
    var filteredorganizations = data.filter(function (organization){
      return organization.id == $rootScope.loggeduser.user.organization_id;
    });
    localStorageService.set('organizations', filteredorganizations);
  }
});
//Projects
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
//Triggers
function isOrganization(value) {
  return value.organization_id == $sessionStorage.loggeduser.user.organization_id;
}
triggers.fetchTriggers(function (data) {
  var tgrlist = data.filter(isOrganization);
// console.log('after filter');
// console.log(tgrlist);
localStorageService.set('triggers', tgrlist);
trglist = data;
});

if (AuthenticationService.userHasRole(["super", "admin", "owner", "member"])){
//Tiles data
ProjectService.GetUserCountByOrganizationId($sessionStorage.loggeduser.user.organization_id).then(function (data) {
  $scope.usercount = data;
});
ProjectService.GetProjectCountByOrganizationId($sessionStorage.loggeduser.user.organization_id).then(function (data) {
  $scope.projectscount = data;
});
ProjectService.GetDashboardCountByOrganizationId($sessionStorage.loggeduser.user.organization_id).then(function (data) {
  $scope.dashboardscount = data;
});
ProjectService.GetTriggersCountByOrganizationId($sessionStorage.loggeduser.user.organization_id).then(function (data) {
  $scope.triggerscount = data;
});
} else {
//alert('no lo tiene');
$location.path('/401');
}

}
]);

// System dashboard controller
App.controller('SystemDashboardsCtrl', ['$scope', '$stateParams', 'ProjectService', '$filter', 'urlBuilder', 'urls', 'DatasourceService', 'DatapointService', '$state', '$timeout', '$sessionStorage', 'OrganizationService', 'DashboardService',
  function ($scope, $stateParams, ProjectService, $filter, urlBuilder, urls, DatasourceService, DatapointService, $state, $timeout, $sessionStorage, OrganizationService, DashboardService) {

    console.log('$$sessionStorage.loggeduser');
    console.log($sessionStorage.loggeduser.user);
/*
*Function Reload
*/
$scope.reload = function () {
  $state.reload();
};
//variables
$scope.organizations = [];
$scope.projects = [];
$scope.dashboards = [];

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

//get the organizations,  projects and dashboards by organization
OrganizationService.GetOrganizationsProjectsDashboards()
.then(function(data){
  for (var m = data.organizations.length - 1; m >= 0; m--) {
    for (var k = data.organizations[m].projects.projects.length - 1; k >= 0; k--) {
      for (var i = data.organizations[m].projects.projects[k].dashboards.length - 1; i >= 0; i--) {
        var widgetcount = 0;
        var chartcount = 0;
        for (var j = data.organizations[m].projects.projects[k].dashboards[i].panels.length - 1; j >= 0; j--) {
          if (data.organizations[m].projects.projects[k].dashboards[i].panels[j].type == "1"){
            chartcount = chartcount + 1;
          }
          if (data.organizations[m].projects.projects[k].dashboards[i].panels[j].type == "2"){
            chartcount = chartcount + 1;
          }
          if (data.organizations[m].projects.projects[k].dashboards[i].panels[j].type == "3"){
            chartcount = chartcount + 1;
          }
          if (data.organizations[m].projects.projects[k].dashboards[i].panels[j].type == "4"){
            chartcount = chartcount + 1;
          }
          if (data.organizations[m].projects.projects[k].dashboards[i].panels[j].type == "5"){
            chartcount = chartcount + 1;
          }
          if (data.organizations[m].projects.projects[k].dashboards[i].panels[j].type == "6"){
            chartcount = chartcount + 1;
          }
          if (data.organizations[m].projects.projects[k].dashboards[i].panels[j].type == "7"){
            chartcount = chartcount + 1;
          }                
          if (data.organizations[m].projects.projects[k].dashboards[i].panels[j].type == "8"){
            widgetcount = widgetcount + 1;
          }
          if (data.organizations[m].projects.projects[k].dashboards[i].panels[j].type == "9"){
            widgetcount = widgetcount + 1;
          }
          if (data.organizations[m].projects.projects[k].dashboards[i].panels[j].type == "10"){
            widgetcount = widgetcount + 1;
          }
          if (data.organizations[m].projects.projects[k].dashboards[i].panels[j].type == "11"){
            widgetcount = widgetcount + 1;
          }
          if (data.organizations[m].projects.projects[k].dashboards[i].panels[j].type == "12"){
            widgetcount = widgetcount + 1;
          }
        }
        data.organizations[m].projects.projects[k].dashboards[i].widgetcount = widgetcount;
        data.organizations[m].projects.projects[k].dashboards[i].chartcount = chartcount;
      }

    }
  }
  $scope.organizations = data.organizations;
});


}
]);

// Organization dashboard controller
App.controller('OrganizationDashboardsCtrl', ['$scope', '$stateParams', 'ProjectService', '$filter', 'urlBuilder', 'urls', 'DatasourceService', 'DatapointService', '$state', '$timeout', '$sessionStorage', 'OrganizationService',
  function ($scope, $stateParams, ProjectService, $filter, urlBuilder, urls, DatasourceService, DatapointService, $state, $timeout, $sessionStorage, OrganizationService) {

    console.log('$$sessionStorage.loggeduser');
    console.log($sessionStorage.loggeduser.user);
/*
*Function Reload
*/
$scope.reload = function () {
  $state.reload();
};
//variables
//$scope.project = [];
$scope.projects = [];
$scope.dashboards = [];

//get the projects and dashboards by organization
ProjectService.GetProjectsByOrganizationId($sessionStorage.loggeduser.user.organization_id)
.then(function(data){

  for (var k = data.projects.length - 1; k >= 0; k--) {

    for (var i = data.projects[k].dashboards.length - 1; i >= 0; i--) {
      var widgetcount = 0;
      var chartcount = 0;
      for (var j = data.projects[k].dashboards[i].panels.length - 1; j >= 0; j--) {
        if (data.projects[k].dashboards[i].panels[j].type == "1"){
          chartcount = chartcount + 1;
        }
        if (data.projects[k].dashboards[i].panels[j].type == "2"){
          chartcount = chartcount + 1;
        }
        if (data.projects[k].dashboards[i].panels[j].type == "3"){
          chartcount = chartcount + 1;
        }
        if (data.projects[k].dashboards[i].panels[j].type == "4"){
          chartcount = chartcount + 1;
        }
        if (data.projects[k].dashboards[i].panels[j].type == "5"){
          chartcount = chartcount + 1;
        }
        if (data.projects[k].dashboards[i].panels[j].type == "6"){
          chartcount = chartcount + 1;
        }
        if (data.projects[k].dashboards[i].panels[j].type == "7"){
          chartcount = chartcount + 1;
        }                
        if (data.projects[k].dashboards[i].panels[j].type == "8"){
          widgetcount = widgetcount + 1;
        }
        if (data.projects[k].dashboards[i].panels[j].type == "9"){
          widgetcount = widgetcount + 1;
        }
        if (data.projects[k].dashboards[i].panels[j].type == "10"){
          widgetcount = widgetcount + 1;
        }
        if (data.projects[k].dashboards[i].panels[j].type == "11"){
          widgetcount = widgetcount + 1;
        }
        if (data.projects[k].dashboards[i].panels[j].type == "12"){
          widgetcount = widgetcount + 1;
        }
      }

      data.projects[k].dashboards[i].widgetcount = widgetcount;
      data.projects[k].dashboards[i].chartcount = chartcount;

    }

  }
  $scope.projects = data.projects;
});

}
]);

// System Triggers controller
App.controller('SystemTriggersCtrl', ['$scope', '$stateParams', '$filter', 'urlBuilder', 'urls', '$state', '$timeout', '$sessionStorage', 'triggers', 'localStorageService', 'DatasourceService', 'TriggerService', 'ProjectService',
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


    $scope.trigger = [];

    var Triglist = [];
    var datasources = [];
    var datapoints = [];



    $scope.reload = function () {
      $state.reload();
    };
    $(document).on("click", ".addask-trigger", function () {

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
// function isProject(value) {
//   return value.project_id == $stateParams.projectId;
// }
triggers.fetchTriggers(function (data) {
//var tgrlist = ;
// console.log('after filter');
//console.log(tgrlist);
localStorageService.set('triggers', data);
var trglist = data;
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
{"data": "organization_name"},
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

}
]);

// System Events controller
App.controller('SystemEventsCtrl', ['$scope', '$stateParams', '$filter', 'urlBuilder', 'urls', '$state', '$timeout', '$sessionStorage', 'EventService', 'events', 'localStorageService',
  function ($scope, $stateParams, $filter, urlBuilder, urls, $state, $timeout, $sessionStorage, EventService, events, localStorageService) {
    var eventlist = [];
/*
*Function Reload
*/
$scope.reload = function () {
  $state.reload();
};
$(document).on("click", ".view-event", function () {
  var eventid = $(this).data('id');
  EventService.GetById(eventid)
  .then(function (data) {
    $scope.event = data.event[0];
    $scope.event.eventdate = convertTimestamp(data.event[0].valueFrom);
    $('#modal-event-view').modal('show');
  });
});

$(document).on("click", ".view-event-delete", function () {
  var eventid = $(this).data('id');
  EventService.GetById(eventid)
  .then(function (data) {
    $scope.event = data.event[0];
    $scope.event.eventdate = convertTimestamp(data.event[0].valueFrom);
    $('#modal-event-delete').modal('show');
  });
});

$scope.deleteEvent = function () {
  EventService.Delete($scope.event.id).then(function (response) {
    if (response.success === false) {
      swal("Error deleting Event", "", "error");
    } else {
      localStorageService.remove('events');
      swal("Event has been Deleted", "", "success");

      var oTable = $('.js-dataTable-full-events').dataTable();
      oTable.fnClearTable();
      oTable.fnDestroy();
      events.fetchEvents(function (data) {

//   console.log('saving organization in localStorage...');
localStorageService.set('events', data);
eventlist = data;

//   //$scope.organizationslist = data;
});
      $timeout(function () {
//initDataTableFull();
$state.reload();
}, 1000);
      $('#modal-event-delete').modal('hide');
    }

  });
};


// Init full DataTable, for more examples you can check out https://www.datatables.net/

var initDataTableFull = function () {
// function isProject(value) {
//   return value.project_id == $stateParams.projectId;
// }
// triggers.fetchTriggers(function (data) {
//     var tgrlist = data.filter(isProject);
//     // console.log('after filter');
//     // console.log(tgrlist);
//     localStorageService.set('triggers', tgrlist);
//     trglist = data;
// });
events.fetchEvents(function (data) {
//var eventlist = data.filter(isProject);
// console.log('after filter');
// console.log(tgrlist);
localStorageService.set('events', data);
eventlist = data;
});

console.log('init datatable...');
$('.js-dataTable-full-events').dataTable({
  columnDefs: [{orderable: false, targets: [4]}],
  pageLength: 10,
  lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
  data: localStorageService.get('events'),
//data: dataset,
"columns": [
{"data": "id"},
{"data": "action", 
"render": function(data, type, row){
 var obj = JSON.parse(data);
 if(obj['action']=="turn-on")
  {return "<i class='list-timeline-icon fa fa-power-off' style='border-radius: 50%;padding: 8px; color: #ffffff; background-color: #46c37b'></i>";}
else if(obj['action']=="turn-off")
  {return "<i class='list-timeline-icon fa fa-power-off' style='border-radius: 50%;padding: 8px; color: #ffffff; background-color: #d26a5c'></i>";}
else if(obj['action']=="sms-message")
  {return "<i class='si si-screen-smartphone bg-default' style='border-radius: 50%;padding: 8px; color: #ffffff;'></i>";}
else if(obj['action']=="send-email")
  {return "<i class='list-timeline-icon si si-envelope bg-flat' style='border-radius: 50%;padding: 8px; color: #ffffff;'></i>";}
else if(obj['action']=="system-notification")
  {return "<i class='list-timeline-icon si si-bell bg-smooth' style='border-radius: 50%;padding: 8px; color: #ffffff;'></i>";}
else if(obj['action']=="new-value")
  {return "<i class='list-timeline-icon fa fa-power-off bg-default' style='border-radius: 50%;padding: 8px; color: #ffffff;'></i>";}
else
  {return "<i class='list-timeline-icon fa fa-power-off bg-default' style='border-radius: 50%;padding: 8px; color: #ffffff;'></i>"}
    //return obj[0]['action'];
  }
},
{"data": "title"},
{"data": "valueFrom",
"render": function(data, type, row){
 return convertTimestamp(data);
}
},
{"data": "active",
"render": function (data, type, row) {
  if (data == '1') {
    return "<span class='label label-success'>active</span>";
  }
  return "<span class='label label-info'>delivered</span>";

}
},
{"data": "id",
"orderable": false,
"render": function (data, type, row) {
// return "<div class='btn-group'><button class='btn btn-xs btn-default view-admin' data-toggle='modal' data-id='"+data+"' data-target='#modal-small' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default' type='button'><i class='fa fa-pencil'></i></button><button class='btn btn-xs btn-default' type='button'><i class='fa fa-times'></i></button></div>";
      // return "<div class='btn-group'><button class='btn btn-xs btn-default view-trigger' data-toggle='modal' data-id='" + data + "' href='#modal-trigger-view' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-trigger-edit' data-toggle='modal' data-id='" + data + "' href='#modal-trigger-edit' type='button'><i class='fa fa-pencil'></i></button><button class='btn btn-xs btn-default view-trigger-delete' data-toggle='modal' data-id='" + data + "' href='#modal-trigger-delete' type='button' ng-click='initModalData()'><i class='fa fa-times'></i></button></div>";
      return "<div class='btn-group'><button class='btn btn-xs btn-default view-event' data-toggle='modal' data-id='" + data + "' href='#modal-event-view' type='button' ng-click='initModalData()'><i class='fa fa-eye'></i></button><button class='btn btn-xs btn-default view-event-delete' data-toggle='modal' data-id='" + data + "' href='#modal-event-delete' type='button' ng-click='initModalData()'><i class='fa fa-times'></i></button></div>";
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
  { extend: 'excel',text: '<i class="fa fa-file-excel-o"></i>', className: 'btn btn-xs btn-default' , filename:'Events'},
  { extend: 'csv',text: '<i class="fa fa-file-o"></i>', className: 'btn btn-xs btn-default' , filename:'Events'},
  { extend: 'pdf',text: '<i class="fa fa-file-pdf-o"></i>', className: 'btn btn-xs btn-default' , filename:'Events'},
  { extend: 'print',text: '<i class="fa fa-print"></i>', className: 'btn btn-xs btn-default', title:'Events' }
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

// System Reports controller
App.controller('SystemReportsCtrl', ['$scope', '$stateParams', '$filter', 'urlBuilder', 'urls', '$state', '$timeout', '$sessionStorage', 'organizations', 'AuthenticationService', 'OrganizationService', 'ProjectService', 'DatapointService',
  function ($scope, $stateParams, $filter, urlBuilder, urls, $state, $timeout, $sessionStorage, organizations, AuthenticationService, OrganizationService, ProjectService, DatapointService) {
    $scope.disabled = true;
    $scope.getProjectsOptions = function (){
      ProjectService.GetProjectsByOrganizationId($scope.selectedOrganization).then(function (response) {
        $scope.projects = response.projects;
      });
    };
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

// System Triggers controller
App.controller('SystemNotificationsCtrl', ['$scope', '$stateParams', '$filter', 'urlBuilder', 'urls', '$state', '$timeout', '$sessionStorage', 'TriggerService',
  function ($scope, $stateParams, $filter, urlBuilder, urls, $state, $timeout, $sessionStorage, TriggerService) {
// function toTimestamp(strDate){
//    var datum = Date.parse(strDate);
//    return datum/1000;
// }
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

  TriggerService.GetAllNotifications()
  .then(function (data){
console.log('notifications--->');
console.log(data);
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
function convertTimestamp(timestamp) {
var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
yyyy = d.getFullYear(),
mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
dd = ('0' + d.getDate()).slice(-2),     // Add leading 0.
hh = d.getHours(),
h = hh,
min = ('0' + d.getMinutes()).slice(-2),   // Add leading 0.
ampm = 'AM',
time;

if (hh > 12) {
  h = hh - 12;
  ampm = 'PM';
} else if (hh === 12) {
  h = 12;
  ampm = 'PM';
} else if (hh == 0) {
  h = 12;
}

// ie: 2013-02-18, 8:35 AM  
time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

return time;
}

App.directive('eventViewModal', function () {
  return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/event/views/event-modal-view.html'
//templateUrl: '/src/assets/js/modules/organization/views/organization-modal.html'
};
});
App.directive('eventDeleteModal', function () {
  return {
//template: '<div class="modal" id="modal-small" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="block block-themed block-transparent remove-margin-b"><div class="block-header bg-primary-dark"><ul class="block-options"><li><button data-dismiss="modal" type="button"><i class="si si-close"></i></button></li></ul><h3 class="block-title">Terms &amp; Conditions</h3></div><div class="block-content"><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p><p>Dolor posuere proin blandit accumsan senectus netus nullam curae, ornare laoreet adipiscing luctus mauris adipiscing pretium eget fermentum, tristique lobortis est ut metus lobortis tortor tincidunt himenaeos habitant quis dictumst proin odio sagittis purus mi, nec taciti vestibulum quis in sit varius lorem sit metus mi.</p></div></div><div class="modal-footer"><button class="btn btn-sm btn-default" type="button" data-dismiss="modal">Close</button><button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"><i class="fa fa-check"></i> Ok</button></div></div></div></div>'
restrict: "EA",
scope: false,
templateUrl: '/assets/js/modules/event/views/event-modal-delete.html'
//templateUrl: '/src/assets/js/modules/organization/views/organization-modal.html'
};
});

