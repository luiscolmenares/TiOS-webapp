/*
 *  Document   : app.js
 *  Author     : pixelcave
 *  Description: Setting up and vital functionality for our App
 *
 */
// declare modules
angular.module('Authentication', []);
angular.module('Dashboard', []);
angular.module('ngMaterial', []);
angular.module('angularPaho', []);
angular.module('angularPahoConnection', []);
//Only for dev
Pusher.logToConsole = true;
var pusher = new Pusher('0cbe3c892f6f009260b0', {
      cluster: 'us2',
      encrypted: true
    });
// Create our angular module
var App = angular.module('app', [
    'Authentication',
    'Dashboard',
    'ngCookies',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'oc.lazyLoad',
    'LocalStorageModule',
    //'daterangepicker',
    'ngMaterial',
    'ngMessages',
    'angularjs-gauge',
    'angularPaho',
    'angularFileUpload',
    'angularPahoConnection'
    //'AngularPrint'
    //,
    //'ngWebSocket'
]);
App.constant('urls', {
//Local
BASE_API_SERVER: 'http://192.168.168.243:5000/',
BASE_API: 'http://192.168.168.243:5000/api/',
BASE_NR: 'http://192.168.168.243:1880',
MQTT_BROKER: 'mqtt.tiosplatform.com',
// MQTT_BROKER_PORT: 9001
MQTT_BROKER_PORT: 8083


//prod
// BASE_API_SERVER: 'https://api.tiosplatform.com/',
// BASE_API: 'https://api.tiosplatform.com/api/',
// BASE_NR: 'https://node-red.tiosplatform.com:1080',
// MQTT_BROKER: 'mqtt.tiosplatform.com',
// MQTT_BROKER_PORT: 9001,

});

// Router configuration
App.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
                .state('/', {
                    url: '/db',
                    controller: 'DashboardController',
                    templateUrl: 'assets/js/modules/dashboard/views/home.html',
                })
                .state('/users_datatable', {
                    url: '/db',
                    controller: 'DashboardController',
                    templateUrl: 'assets/js/modules/dashboard/views/home.html',
                })
                .state('angularjs', {
                    url: '/angularjs',
                    templateUrl: 'assets/views/ready_angularjs.html',
                })
                .state('hello', {
                    url: '/hello',
                    templateUrl: 'assets/views/hello.html',
                    controller: 'HelloCtrl',
                })
                .state('401', {
                    url: '/401',
                    templateUrl: 'assets/js/modules/authentication/views/401.html',
                })
                .state('500', {
                    url: '/500',
                    templateUrl: 'assets/js/modules/authentication/views/500.html',
                    //controller: 'ErrorController',
                })
                .state('login', {
                    url: '/login',
//templateUrl: 'assets/views/base_pages_login_v2.html'
                    controller: 'LoginController',
                    templateUrl: 'assets/js/modules/authentication/views/login_v2.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/pages/base_pages_login.js',
                                    ]
                                });
                            }]
                    }
//controller: 'MainCtrl',
                })
                .state('reminder', {
                    url: '/reminder',
//templateUrl: 'assets/views/base_pages_login_v2.html'
                    controller: 'ReminderCtrl',
                    templateUrl: 'assets/js/modules/authentication/views/reminder.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/pages/base_pages_reminder.js',
                                    ]
                                });
                            }]
                    }
//controller: 'MainCtrl',
                })
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'assets/views/ready_dashboard.html',
                    controller: 'DashboardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/slick/slick.min.css',
                                        'assets/js/plugins/slick/slick-theme.min.css',
                                        'assets/js/plugins/slick/slick.min.js',
                                        'assets/js/plugins/chartjs/Chart.min.js',
                                        // 'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        // 'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        // 'assets/js/plugins/sweetalert/sweetalert.min.js'
                                        
                                    ]
                                });
                            }]
                    },
                    //requiresAuthentication: true
                })
                 .state('homedashboard', {
                    url: '/home/dashboard',
                    templateUrl: 'assets/js/modules/dashboard/views/homedashboard.html',
                    controller: 'HomeDashboardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/slick/slick.min.css',
                                        'assets/js/plugins/slick/slick-theme.min.css',
                                        'assets/js/plugins/slick/slick.min.js',
                                        'assets/js/plugins/chartjs/Chart.min.js',
                                        // 'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        // 'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        // 'assets/js/plugins/sweetalert/sweetalert.min.js'
                                    ]
                                });
                            }]
                    },
                    //requiresAuthentication: true
                })
                .state('uiActivity', {
                    url: '/ui/activity',
                    templateUrl: 'assets/views/ui_activity.html',
                    controller: 'UiActivityCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('uiTabs', {
                    url: '/ui/tabs',
                    templateUrl: 'assets/views/ui_tabs.html'
                })
                .state('uiModalsTooltips', {
                    url: '/ui/modals-tooltips',
                    templateUrl: 'assets/views/ui_modals_tooltips.html'
                })
                .state('uiColorThemes', {
                    url: '/ui/color-themes',
                    templateUrl: 'assets/views/ui_color_themes.html'
                })
                .state('uiBlocksDraggable', {
                    url: '/ui/blocks-draggable',
                    templateUrl: 'assets/views/ui_blocks_draggable.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/jquery-ui/jquery-ui.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('uiChatFull', {
                    url: '/ui/chat/full',
                    templateUrl: 'assets/views/ui_chat_full.html',
                    controller: 'UiChatCtrl'
                })
                .state('uiChatFixed', {
                    url: '/ui/chat/fixed',
                    templateUrl: 'assets/views/ui_chat_fixed.html',
                    controller: 'UiChatCtrl'
                })
                .state('uiChatPopup', {
                    url: '/ui/chat/popup',
                    templateUrl: 'assets/views/ui_chat_popup.html',
                    controller: 'UiChatCtrl'
                })
                .state('tablesTools', {
                    url: '/tables/tools',
                    templateUrl: 'assets/views/tables_tools.html'
                })
                .state('tablesDatatables', {
                    url: '/tables/datatables',
                    templateUrl: 'assets/views/tables_datatables.html',
                    controller: 'TablesDatatablesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('organizations', {
                    url: '/system/organizations',
                    templateUrl: 'assets/js/modules/organization/views/organizations_list.html',
                    controller: 'OrganizationTablesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/datatables/responsive.dataTables.min.css',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.js',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.css',
                                        'assets/js/plugins/datatables/dataTables.responsive.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.css',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'

                                    ]
                                });
                            }]
                    }
                })
                .state('organizationorglist', {
                    url: '/organizations',
                    templateUrl: 'assets/js/modules/organization/views/organization-org-list.html',
                    controller: 'OrganizationTablesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/datatables/dataTables.buttons.min.js',
                                        'assets/js/plugins/datatables/buttons.flash.min.js',
                                        'assets/js/plugins/datatables/jszip.min.js',
                                        'assets/js/plugins/datatables/pdfmake.min.js',
                                        'assets/js/plugins/datatables/vfs_fonts.js',
                                        'assets/js/plugins/datatables/buttons.html5.min.js',
                                        'assets/js/plugins/datatables/buttons.print.min.js',
                                        'assets/js/plugins/datatables/responsive.dataTables.min.css',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.js',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.css',
                                        'assets/js/plugins/datatables/dataTables.responsive.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.css',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'

                                    ]
                                });
                            }]
                    }
                })
                .state('users', {
                    url: '/users',
                    templateUrl: 'assets/js/modules/user/views/users_list.html',
                    controller: 'UserTablesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/datatables/dataTables.buttons.min.js',
                                        'assets/js/plugins/datatables/buttons.flash.min.js',
                                        'assets/js/plugins/datatables/jszip.min.js',
                                        'assets/js/plugins/datatables/pdfmake.min.js',
                                        'assets/js/plugins/datatables/vfs_fonts.js',
                                        'assets/js/plugins/datatables/buttons.html5.min.js',
                                        'assets/js/plugins/datatables/buttons.print.min.js',
                                        'assets/js/plugins/datatables/responsive.dataTables.min.css',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.js',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.css',
                                        'assets/js/plugins/datatables/dataTables.responsive.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.css',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('projects', {
                    url: '/projects',
                    templateUrl: 'assets/js/modules/project/views/projects_list.html',
                    controller: 'ProjectTablesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        /*
                                         * Google Maps API Key (you will have to obtain a Google Maps API key to use Google Maps)
                                         * For more info please have a look at https://developers.google.com/maps/documentation/javascript/get-api-key#key
                                         */
                                        {type: 'js', path: '//maps.googleapis.com/maps/api/js?key=AIzaSyBetY7CSB_5cohAvLJmsFmUOp-grgezi_c'},
                                        'assets/js/plugins/gmapsjs/gmaps.min.js',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/datatables/dataTables.buttons.min.js',
                                        'assets/js/plugins/datatables/buttons.flash.min.js',
                                        'assets/js/plugins/datatables/jszip.min.js',
                                        'assets/js/plugins/datatables/pdfmake.min.js',
                                        'assets/js/plugins/datatables/vfs_fonts.js',
                                        'assets/js/plugins/datatables/buttons.html5.min.js',
                                        'assets/js/plugins/datatables/buttons.print.min.js',
                                        'assets/js/plugins/datatables/responsive.dataTables.min.css',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.js',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.css',
                                        'assets/js/plugins/datatables/dataTables.responsive.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.css',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('spaces', {
                    url: '/project/:projectId/spaces',
                    templateUrl: 'assets/js/modules/space/views/spaces_list.html',
                    controller: 'SpaceTablesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/datatables/dataTables.buttons.min.js',
                                        'assets/js/plugins/datatables/buttons.flash.min.js',
                                        'assets/js/plugins/datatables/jszip.min.js',
                                        'assets/js/plugins/datatables/pdfmake.min.js',
                                        'assets/js/plugins/datatables/vfs_fonts.js',
                                        'assets/js/plugins/datatables/buttons.html5.min.js',
                                        'assets/js/plugins/datatables/buttons.print.min.js',
                                        'assets/js/plugins/datatables/responsive.dataTables.min.css',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.js',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.css',
                                        'assets/js/plugins/datatables/dataTables.responsive.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.css',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('spaceview', {
                    url: '/project/:projectId/space/:spaceId',
                    templateUrl: 'assets/js/modules/space/views/space_view.html',
                    controller: 'SpaceViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/datatables/dataTables.buttons.min.js',
                                        'assets/js/plugins/datatables/buttons.flash.min.js',
                                        'assets/js/plugins/datatables/jszip.min.js',
                                        'assets/js/plugins/datatables/pdfmake.min.js',
                                        'assets/js/plugins/datatables/vfs_fonts.js',
                                        'assets/js/plugins/datatables/buttons.html5.min.js',
                                        'assets/js/plugins/datatables/buttons.print.min.js',
                                        'assets/js/plugins/datatables/responsive.dataTables.min.css',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.js',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.css',
                                        'assets/js/plugins/datatables/dataTables.responsive.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.css',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('datasources', {
                    url: '/project/:projectId/datasources',
                    templateUrl: 'assets/js/modules/datasource/views/datasources_list.html',
                    controller: 'TablesDatasourceTablesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        'assets/js/plugins/highlightjs/github-gist.min.css',
                                        'assets/js/plugins/highlightjs/highlight.pack.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('adddatasource', {
                    url: '/project/:projectId/datasource/add',
                    templateUrl: 'assets/js/modules/datasource/views/adddatasource.html',
                    controller: 'DatasourceFormsWizardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('datapoints', {
                    url: '/datasource/:datasourceId/datapoints',
                    templateUrl: 'assets/js/modules/datapoint/views/datapoints_list.html',
                    controller: 'TablesDatapointTablesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        'assets/js/plugins/highlightjs/github-gist.min.css',
                                        'assets/js/plugins/highlightjs/highlight.pack.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('adddatapoint', {
                    url: '/datasource/:datasourceId/datapoint/add',
                    templateUrl: 'assets/js/modules/datapoint/views/add_datapoint.html',
                    controller: 'DatapointFormsWizardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js'
                                    ]
                                });
                            }]
                    }
                })

                .state('triggers', {
                    url: '/project/:projectId/triggers',
                    templateUrl: 'assets/js/modules/trigger/views/triggers_list.html',
                    controller: 'TablesTriggerTablesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/datatables/dataTables.buttons.min.js',
                                        'assets/js/plugins/datatables/buttons.flash.min.js',
                                        'assets/js/plugins/datatables/jszip.min.js',
                                        'assets/js/plugins/datatables/pdfmake.min.js',
                                        'assets/js/plugins/datatables/vfs_fonts.js',
                                        'assets/js/plugins/datatables/buttons.html5.min.js',
                                        'assets/js/plugins/datatables/buttons.print.min.js',
                                        'assets/js/plugins/datatables/responsive.dataTables.min.css',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.js',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.css',
                                        'assets/js/plugins/datatables/dataTables.responsive.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.css',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                    ]
                                });
                            }]
                    }
                })

                .state('addtrigger', {
                    url: '/project/:projectId/trigger/add',
                    templateUrl: 'assets/js/modules/trigger/views/add_trigger.html',
                    controller: 'TriggerFormsWizardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('admindashboard', {
                    url: '/admin/dashboard',
                    templateUrl: 'assets/js/modules/dashboard/views/admin_dashboard.html',
                    controller: 'AdminDashboardCtrl',
                    // data: {
                    //     requiresAuthentication: true,
                    //     roles: ["super"]
                    // },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/slick/slick.min.css',
                                        'assets/js/plugins/slick/slick-theme.min.css',
                                        'assets/js/plugins/slick/slick.min.js',
                                        'assets/js/plugins/chartjs/Chart.min.js'
                                    ]
                                });
                            }]
                    },
                    
                })

                .state('nodered', {
                    url: '/nodered',
                    templateUrl: 'assets/js/modules/dashboard/views/nodered.html',
                    // controller: 'NoderedCtrl',
                    // resolve: {
                    //     deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    //             return $ocLazyLoad.load({
                    //                 insertBefore: '#css-bootstrap',
                    //                 serie: true,
                    //                 files: [
                    //                     'assets/js/plugins/slick/slick.min.css',
                    //                     'assets/js/plugins/slick/slick-theme.min.css',
                    //                     'assets/js/plugins/slick/slick.min.js',
                    //                     // 'assets/js/plugins/chartjs/Chart.min.js'
                    //                 ]
                    //             });
                    //         }]
                    // },
                    
                })

                .state('projectsettings', {
                    url: '/project/:projectId/settings',
                    templateUrl: 'assets/js/modules/project/views/projectsettings.html',
                    controller: 'ProjectSettingsCtrl',
// resolve: {
//     deps: ['$ocLazyLoad', function($ocLazyLoad) {
//         return $ocLazyLoad.load({
//             insertBefore: '#css-bootstrap',
//             serie: true,
//             files: [
//                 'assets/js/plugins/datatables/jquery.dataTables.min.css',
//                 'assets/js/plugins/datatables/jquery.dataTables.min.js',
//                 'assets/js/plugins/sweetalert/sweetalert.min.css',
//                 'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
//                 'assets/js/plugins/sweetalert/sweetalert.min.js'
//             ]
//         });
//     }]
// }
                })

                .state('projectview', {
                    url: '/project/:projectId/view',
                    templateUrl: 'assets/js/modules/project/views/project-view.html',
                    controller: 'ProjectSettingsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        /*
                                         * Google Maps API Key (you will have to obtain a Google Maps API key to use Google Maps)
                                         * For more info please have a look at https://developers.google.com/maps/documentation/javascript/get-api-key#key
                                         */
                                        {type: 'js', path: '//maps.googleapis.com/maps/api/js?key=AIzaSyBetY7CSB_5cohAvLJmsFmUOp-grgezi_c'},
                                        'assets/js/plugins/gmapsjs/gmaps.min.js'
                                    ]
                                });
                            }]
                    }

                })

                .state('websocket', {
                    url: '/websocket',
                    templateUrl: 'assets/js/modules/project/views/websocket.html',
                    //controller: 'WebSocketCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                insertBefore: '#css-bootstrap',
                                serie: true,
                                files: [
                                    //'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                    //'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                    'assets/js/plugins/sweetalert/sweetalert.min.css',
                                    'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                    'assets/js/plugins/sweetalert/sweetalert.min.js'
                                ]
                            });
                        }]
                    }
                })

                .state('projectdashboard', {
                    url: '/project/:projectId/dashboard/:dashboardId',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/project/views/projectdashboard.html',
                    controller: 'ProjectDashboardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/sparkline/jquery.sparkline.min.js',
                                        'assets/js/plugins/easy-pie-chart/jquery.easypiechart.min.js',
                                        'assets/js/plugins/chartjs/Chart.min.js',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/flot/jquery.flot.min.js',
                                        'assets/js/plugins/flot/jquery.flot.pie.min.js',
                                        'assets/js/plugins/flot/jquery.flot.stack.min.js',
                                        'assets/js/plugins/flot/jquery.flot.resize.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        'assets/js/plugins/underscore/underscore.js',
                                        //'assets/js/plugins/jquery-ui/jquery-ui.min.js',
                                        //'assets/js/plugins/angular-daterangepicker/js/angular-daterangepicker.min.js'

                                    ]
                                });
                            }]
                    }
                })

                .state('projectdashboards', {
                    url: '/project/:projectId/dashboards',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/project/views/projectdashboards.html',
                    controller: 'ProjectDashboardsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js'

                                    ]
                                });
                            }]
                    }
                })

                .state('systemdashboards', {
                    url: '/admin/dashboards',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/dashboard/views/system-dashboards.html',
                    controller: 'SystemDashboardsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js'

                                    ]
                                });
                            }]
                    }
                })

                .state('organizationdashboards', {
                    url: '/dashboards',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/dashboard/views/organization-dashboards.html',
                    controller: 'OrganizationDashboardsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js'

                                    ]
                                });
                            }]
                    }
                })

                .state('organizationview', {
                    url: '/organization/:organizationId/view',
                    templateUrl: 'assets/js/modules/organization/views/organization-view.html',
                    controller: 'OrganizationViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        /*
                                         * Google Maps API Key (you will have to obtain a Google Maps API key to use Google Maps)
                                         * For more info please have a look at https://developers.google.com/maps/documentation/javascript/get-api-key#key
                                         */
                                        {type: 'js', path: '//maps.googleapis.com/maps/api/js?key=AIzaSyBetY7CSB_5cohAvLJmsFmUOp-grgezi_c'},
                                        'assets/js/plugins/gmapsjs/gmaps.min.js'
                                    ]
                                });
                            }]
                    }

                })

                .state('systemtriggers', {
                    url: '/system/triggers',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/dashboard/views/system-triggers.html',
                    controller: 'SystemTriggersCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        // 'assets/js/plugins/select2/select2.min.css',
                                        // 'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        // 'assets/js/plugins/select2/select2.full.min.js',
                                        // 'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        // 'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        // 'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        // 'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        // 'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        // 'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        // 'assets/js/plugins/jquery-validation/jquery.validate.min.js'
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/datatables/dataTables.buttons.min.js',
                                        'assets/js/plugins/datatables/buttons.flash.min.js',
                                        'assets/js/plugins/datatables/jszip.min.js',
                                        'assets/js/plugins/datatables/pdfmake.min.js',
                                        'assets/js/plugins/datatables/vfs_fonts.js',
                                        'assets/js/plugins/datatables/buttons.html5.min.js',
                                        'assets/js/plugins/datatables/buttons.print.min.js',
                                        'assets/js/plugins/datatables/responsive.dataTables.min.css',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.js',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.css',
                                        'assets/js/plugins/datatables/dataTables.responsive.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.css',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',

                                    ]
                                });
                            }]
                    }
                })

                .state('organizationtriggers', {
                    url: '/triggers',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/dashboard/views/organization-triggers.html',
                    controller: 'OrganizationTriggersCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        // 'assets/js/plugins/select2/select2.min.css',
                                        // 'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        // 'assets/js/plugins/select2/select2.full.min.js',
                                        // 'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        // 'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        // 'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        // 'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        // 'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        // 'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        // 'assets/js/plugins/jquery-validation/jquery.validate.min.js'
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/datatables/dataTables.buttons.min.js',
                                        'assets/js/plugins/datatables/buttons.flash.min.js',
                                        'assets/js/plugins/datatables/jszip.min.js',
                                        'assets/js/plugins/datatables/pdfmake.min.js',
                                        'assets/js/plugins/datatables/vfs_fonts.js',
                                        'assets/js/plugins/datatables/buttons.html5.min.js',
                                        'assets/js/plugins/datatables/buttons.print.min.js',
                                        'assets/js/plugins/datatables/responsive.dataTables.min.css',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.js',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.css',
                                        'assets/js/plugins/datatables/dataTables.responsive.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.css',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',

                                    ]
                                });
                            }]
                    }
                })
                .state('systemevents', {
                    url: '/system/events',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/dashboard/views/system-events.html',
                    controller: 'SystemEventsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/datatables/dataTables.buttons.min.js',
                                        'assets/js/plugins/datatables/buttons.flash.min.js',
                                        'assets/js/plugins/datatables/jszip.min.js',
                                        'assets/js/plugins/datatables/pdfmake.min.js',
                                        'assets/js/plugins/datatables/vfs_fonts.js',
                                        'assets/js/plugins/datatables/buttons.html5.min.js',
                                        'assets/js/plugins/datatables/buttons.print.min.js',
                                        'assets/js/plugins/datatables/responsive.dataTables.min.css',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.js',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.css',
                                        'assets/js/plugins/datatables/dataTables.responsive.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.css',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',

                                    ]
                                });
                            }]
                    }
                })

                .state('organizationevents', {
                    url: '/events',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/dashboard/views/organization-events.html',
                    controller: 'OrganizationEventsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/fullcalendar/fullcalendar.min.css',
                                        'assets/js/plugins/jquery-ui/jquery-ui.min.js',
                                        'assets/js/plugins/fullcalendar/moment.min.js',
                                        'assets/js/plugins/fullcalendar/fullcalendar.min.js',
                                        'assets/js/plugins/fullcalendar/gcal.min.js'
                                    ]
                                });
                            }]
                    }
                })

                .state('systemreports', {
                    url: '/system/reports',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/dashboard/views/system-reports.html',
                    controller: 'SystemReportsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        // 'assets/js/plugins/select2/select2.min.css',
                                        // 'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        // 'assets/js/plugins/select2/select2.full.min.js',
                                        // 'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        // 'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        // 'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        // 'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        // 'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        // 'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        // 'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        // 'assets/js/core/jquery.slimscroll.min.js',
                                        // 'assets/js/core/jquery.scrollLock.min.js',
                                        // 'assets/js/core/jquery.appear.min.js',
                                        // 'assets/js/core/jquery.countTo.min.js',
                                        // 'assets/js/core/jquery.placeholder.min.js',
                                        // //'assets/js/core/js.cookie.min.js',
                                        // 'assets/js/plugins/magnific-popup/magnific-popup.min.js',

                                        'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker3.min.css',
                                        'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
                                        'assets/js/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css',
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.css',
                                        'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.min.css',
                                        'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.skinHTML5.min.css',
                                        'assets/js/plugins/dropzonejs/dropzone.min.css',
                                        'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.css',
                                        'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js',
                                        'assets/js/plugins/bootstrap-datetimepicker/moment.min.js',
                                        'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js',
                                        'assets/js/plugins/bootstrap-colorpicker/bootstrap-colorpicker.min.js',
                                        'assets/js/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/masked-inputs/jquery.maskedinput.min.js',
                                        'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.js',
                                        'assets/js/plugins/ion-rangeslider/js/ion.rangeSlider.min.js',
                                        'assets/js/plugins/dropzonejs/dropzone.min.js',
                                        'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',

                                        //'assets/js/plugins/sparkline/jquery.sparkline.min.js',
                                        //'assets/js/plugins/easy-pie-chart/jquery.easypiechart.min.js',
                                        'assets/js/plugins/chartjs/Chart.min.js',
                                        'assets/js/plugins/flot/jquery.flot.min.js',
                                        'assets/js/plugins/flot/jquery.flot.pie.min.js',
                                        //'assets/js/plugins/flot/jquery.flot.stack.min.js',
                                        //'assets/js/plugins/flot/jquery.flot.resize.min.js'
                                        'assets/js/plugins/underscore/underscore.js',
                                        // 'assets/js/plugins/ngPrint/ngPrint.js',
                                        // 'assets/js/plugins/ngPrint/ngPrint.css',

                                    ]
                                });
                            }]
                    }
                })

                .state('organizationusers', {
                    url: '/organization/users',
                    templateUrl: 'assets/js/modules/user/views/usersorg_list.html',
                    controller: 'UserTablesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                        'assets/js/plugins/datatables/jquery.dataTables.min.js',
                                        'assets/js/plugins/datatables/dataTables.buttons.min.js',
                                        'assets/js/plugins/datatables/buttons.flash.min.js',
                                        'assets/js/plugins/datatables/jszip.min.js',
                                        'assets/js/plugins/datatables/pdfmake.min.js',
                                        'assets/js/plugins/datatables/vfs_fonts.js',
                                        'assets/js/plugins/datatables/buttons.html5.min.js',
                                        'assets/js/plugins/datatables/buttons.print.min.js',
                                        'assets/js/plugins/datatables/responsive.dataTables.min.css',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.js',
                                        'assets/js/plugins/datatables/dataTables.bootstrap.min.css',
                                        'assets/js/plugins/datatables/dataTables.responsive.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.js',
                                        'assets/js/plugins/datatables/responsive.bootstrap.min.css',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'
                                    ]
                                });
                            }]
                    }
                })

                .state('organizationreports', {
                    url: '/reports',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/dashboard/views/organization-reports.html',
                    controller: 'OrganizationReportsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        // 'assets/js/plugins/select2/select2.min.css',
                                        // 'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        // 'assets/js/plugins/select2/select2.full.min.js',
                                        // 'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        // 'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        // 'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        // 'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        // 'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        // 'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        // 'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        // 'assets/js/core/jquery.slimscroll.min.js',
                                        // 'assets/js/core/jquery.scrollLock.min.js',
                                        // 'assets/js/core/jquery.appear.min.js',
                                        // 'assets/js/core/jquery.countTo.min.js',
                                        // 'assets/js/core/jquery.placeholder.min.js',
                                        // //'assets/js/core/js.cookie.min.js',
                                        // 'assets/js/plugins/magnific-popup/magnific-popup.min.js',

                                        'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker3.min.css',
                                        'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
                                        'assets/js/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css',
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.css',
                                        'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.min.css',
                                        'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.skinHTML5.min.css',
                                        'assets/js/plugins/dropzonejs/dropzone.min.css',
                                        'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.css',
                                        'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js',
                                        'assets/js/plugins/bootstrap-datetimepicker/moment.min.js',
                                        'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js',
                                        'assets/js/plugins/bootstrap-colorpicker/bootstrap-colorpicker.min.js',
                                        'assets/js/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/masked-inputs/jquery.maskedinput.min.js',
                                        'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.js',
                                        'assets/js/plugins/ion-rangeslider/js/ion.rangeSlider.min.js',
                                        'assets/js/plugins/dropzonejs/dropzone.min.js',
                                        'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',

                                        //'assets/js/plugins/sparkline/jquery.sparkline.min.js',
                                        //'assets/js/plugins/easy-pie-chart/jquery.easypiechart.min.js',
                                        'assets/js/plugins/chartjs/Chart.min.js',
                                        'assets/js/plugins/flot/jquery.flot.min.js',
                                        'assets/js/plugins/flot/jquery.flot.pie.min.js',
                                        //'assets/js/plugins/flot/jquery.flot.stack.min.js',
                                        //'assets/js/plugins/flot/jquery.flot.resize.min.js'
                                        'assets/js/plugins/underscore/underscore.js',
                                        // 'assets/js/plugins/ngPrint/ngPrint.js',
                                        // 'assets/js/plugins/ngPrint/ngPrint.css',
                                    ]
                                });
                            }]
                    }
                })

                .state('systemnotifications', {
                    url: '/system/notifications',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/dashboard/views/system-notifications.html',
                    controller: 'SystemNotificationsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/core/jquery.slimscroll.min.js',
                                        'assets/js/core/jquery.scrollLock.min.js',
                                        'assets/js/core/jquery.appear.min.js',
                                        'assets/js/core/jquery.countTo.min.js',
                                        'assets/js/core/jquery.placeholder.min.js',
                                        //'assets/js/core/js.cookie.min.js',
                                        'assets/js/plugins/magnific-popup/magnific-popup.min.js',
                                    ]
                                });
                            }]
                    }
                })

                .state('organizationnotifications', {
                    url: '/notifications',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/dashboard/views/organization-notifications.html',
                    controller: 'OrganizationNotificationsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/core/jquery.slimscroll.min.js',
                                        'assets/js/core/jquery.scrollLock.min.js',
                                        'assets/js/core/jquery.appear.min.js',
                                        'assets/js/core/jquery.countTo.min.js',
                                        'assets/js/core/jquery.placeholder.min.js',
                                        //'assets/js/core/js.cookie.min.js',
                                        'assets/js/plugins/magnific-popup/magnific-popup.min.js',

                                    ]
                                });
                            }]
                    }
                })

                .state('projectusers', {
                    url: '/project/:projectId/users',
//templateUrl: 'assets/views/ready_dashboard.html',
                    templateUrl: 'assets/js/modules/project/views/projectusers.html',
                    controller: 'ProjectUsersCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js',
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js'

                                    ]
                                });
                            }]
                    }
                })


                .state('formsPickersMore', {
                    url: '/forms/pickers-more',
                    templateUrl: 'assets/views/forms_pickers_more.html',
                    controller: 'FormsPickersMoreCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker3.min.css',
                                        'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
                                        'assets/js/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css',
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.css',
                                        'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.min.css',
                                        'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.skinHTML5.min.css',
                                        'assets/js/plugins/dropzonejs/dropzone.min.css',
                                        'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.css',
                                        'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js',
                                        'assets/js/plugins/bootstrap-datetimepicker/moment.min.js',
                                        'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js',
                                        'assets/js/plugins/bootstrap-colorpicker/bootstrap-colorpicker.min.js',
                                        'assets/js/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/masked-inputs/jquery.maskedinput.min.js',
                                        'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.js',
                                        'assets/js/plugins/ion-rangeslider/js/ion.rangeSlider.min.js',
                                        'assets/js/plugins/dropzonejs/dropzone.min.js',
                                        'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('formsEditors', {
                    url: '/forms/editors',
                    templateUrl: 'assets/views/forms_editors.html',
                    controller: 'FormsEditorsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/summernote/summernote.min.css',
                                        'assets/js/plugins/summernote/summernote.min.js',
                                        'assets/js/plugins/ckeditor/ckeditor.js'
                                    ]
                                });
                            }]
                    }
                })
// .state('formsValidation', {
//     url: '/forms/validation',
//     templateUrl: 'assets/views/forms_validation.html',
//     controller: 'FormsValidationCtrl',
//     resolve: {
//         deps: ['$ocLazyLoad', function($ocLazyLoad) {
//             return $ocLazyLoad.load({
//                 insertBefore: '#css-bootstrap',
//                 serie: true,
//                 files: [
//                     'assets/js/plugins/select2/select2.min.css',
//                     'assets/js/plugins/select2/select2-bootstrap.min.css',
//                     'assets/js/plugins/select2/select2.full.min.js',
//                     'assets/js/plugins/jquery-validation/jquery.validate.min.js',
//                     'assets/js/plugins/jquery-validation/additional-methods.min.js'
//                 ]
//             });
//         }]
//     }
// })
                .state('adduser', {
                    url: '/user/add',
                    templateUrl: 'assets/js/modules/user/views/adduser.html',
//controller: 'FormsValidationCtrl',
                    controller: 'UserCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('addusertoorg', {
                    url: '/organization/user/add',
                    templateUrl: 'assets/js/modules/user/views/addusertoorg.html',
//controller: 'FormsValidationCtrl',
                    controller: 'UserOrgCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('addevent', {
                    url: '/event/add',
                    templateUrl: 'assets/js/modules/event/views/add-event.html',
//controller: 'FormsValidationCtrl',
                    controller: 'AddEventCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [

                                        'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker3.min.css',
                                        'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
                                        'assets/js/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css',
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.css',
                                        'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.min.css',
                                        'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.skinHTML5.min.css',
                                        'assets/js/plugins/dropzonejs/dropzone.min.css',
                                        'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.css',
                                        'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js',
                                        'assets/js/plugins/bootstrap-datetimepicker/moment.min.js',
                                        'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js',
                                        'assets/js/plugins/bootstrap-colorpicker/bootstrap-colorpicker.min.js',
                                        'assets/js/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/masked-inputs/jquery.maskedinput.min.js',
                                        'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.js',
                                        'assets/js/plugins/ion-rangeslider/js/ion.rangeSlider.min.js',
                                        'assets/js/plugins/dropzonejs/dropzone.min.js',
                                        'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'
                                        
                                    ]
                                });
                            }]
                    }
                })
                .state('addproject', {
                    url: '/project/add',
                    templateUrl: 'assets/js/modules/project/views/addproject.html',
                    controller: 'ProjectCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('addorganization', {
                    url: '/organization/add',
                    templateUrl: 'assets/js/modules/organization/views/addorganization.html',
//controller: 'FormsValidationCtrl',
                    controller: 'OrganizationCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/select2/select2.min.css',
                                        'assets/js/plugins/select2/select2-bootstrap.min.css',
                                        'assets/js/plugins/select2/select2.full.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                        'assets/js/plugins/jquery-validation/additional-methods.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.css',
                                        'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                        'assets/js/plugins/sweetalert/sweetalert.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('formsWizard', {
                    url: '/forms/wizard',
                    templateUrl: 'assets/views/forms_wizard.html',
                    controller: 'FormsWizardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'assets/js/plugins/jquery-validation/jquery.validate.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('compCharts', {
                    url: '/components/charts',
                    templateUrl: 'assets/views/comp_charts.html',
                    controller: 'CompChartsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/sparkline/jquery.sparkline.min.js',
                                        'assets/js/plugins/easy-pie-chart/jquery.easypiechart.min.js',
                                        'assets/js/plugins/chartjs/Chart.min.js',
                                        'assets/js/plugins/flot/jquery.flot.min.js',
                                        'assets/js/plugins/flot/jquery.flot.pie.min.js',
                                        'assets/js/plugins/flot/jquery.flot.stack.min.js',
                                        'assets/js/plugins/flot/jquery.flot.resize.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('compCalendar', {
                    url: '/components/calendar',
                    templateUrl: 'assets/views/comp_calendar.html',
                    controller: 'CompCalendarCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/fullcalendar/fullcalendar.min.css',
                                        'assets/js/plugins/jquery-ui/jquery-ui.min.js',
                                        'assets/js/plugins/fullcalendar/moment.min.js',
                                        'assets/js/plugins/fullcalendar/fullcalendar.min.js',
                                        'assets/js/plugins/fullcalendar/gcal.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('compSliders', {
                    url: '/components/sliders',
                    templateUrl: 'assets/views/comp_sliders.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/slick/slick.min.css',
                                        'assets/js/plugins/slick/slick-theme.min.css',
                                        'assets/js/plugins/slick/slick.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('compScrolling', {
                    url: '/components/scrolling',
                    templateUrl: 'assets/views/comp_scrolling.html'
                })
                .state('compSyntaxHighlighting', {
                    url: '/components/syntax-highlighting',
                    templateUrl: 'assets/views/comp_syntax_highlighting.html',
                    controller: 'CompSyntaxHighlightingCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/highlightjs/github-gist.min.css',
                                        'assets/js/plugins/highlightjs/highlight.pack.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('compRating', {
                    url: '/components/rating',
                    templateUrl: 'assets/views/comp_rating.html',
                    controller: 'CompRatingCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/jquery-raty/jquery.raty.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('compTreeview', {
                    url: '/components/treeview',
                    templateUrl: 'assets/views/comp_treeview.html',
                    controller: 'CompTreeviewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/bootstrap-treeview/bootstrap-treeview.min.css',
                                        'assets/js/plugins/bootstrap-treeview/bootstrap-treeview.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('compMapsGoogle', {
                    url: '/components/maps/google',
                    templateUrl: 'assets/views/comp_maps.html',
                    controller: 'CompMapsGoogleCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        /*
                                         * Google Maps API Key (you will have to obtain a Google Maps API key to use Google Maps)
                                         * For more info please have a look at https://developers.google.com/maps/documentation/javascript/get-api-key#key
                                         */
                                        {type: 'js', path: '//maps.googleapis.com/maps/api/js?key=AIzaSyBetY7CSB_5cohAvLJmsFmUOp-grgezi_c'},
                                        'assets/js/plugins/gmapsjs/gmaps.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('compMapsGoogleFull', {
                    url: '/components/maps/google-full',
                    templateUrl: 'assets/views/comp_maps_full.html',
                    controller: 'CompMapsGoogleFullCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        /*
                                         * Google Maps API Key (you will have to obtain a Google Maps API key to use Google Maps)
                                         * For more info please have a look at https://developers.google.com/maps/documentation/javascript/get-api-key#key
                                         */
                                        {type: 'js', path: '//maps.googleapis.com/maps/api/js?key=AIzaSyBetY7CSB_5cohAvLJmsFmUOp-grgezi_c'},
                                        'assets/js/plugins/gmapsjs/gmaps.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('compMapsVector', {
                    url: '/components/maps/vector',
                    templateUrl: 'assets/views/comp_maps_vector.html',
                    controller: 'CompMapsVectorCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/jquery-jvectormap/jquery-jvectormap.min.css',
                                        'assets/js/plugins/jquery-jvectormap/jquery-jvectormap.min.js',
                                        'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-au-mill-en.js',
                                        'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-cn-mill-en.js',
                                        'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-de-mill-en.js',
                                        'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-europe-mill-en.js',
                                        'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-fr-mill-en.js',
                                        'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-in-mill-en.js',
                                        'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-us-aea-en.js',
                                        'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-world-mill-en.js',
                                        'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-za-mill-en.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('compGallerySimple', {
                    url: '/components/gallery/simple',
                    templateUrl: 'assets/views/comp_gallery_simple.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/magnific-popup/magnific-popup.min.css',
                                        'assets/js/plugins/magnific-popup/magnific-popup.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('compGalleryAdvanced', {
                    url: '/components/gallery/advanced',
                    templateUrl: 'assets/views/comp_gallery_advanced.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    insertBefore: '#css-bootstrap',
                                    serie: true,
                                    files: [
                                        'assets/js/plugins/magnific-popup/magnific-popup.min.css',
                                        'assets/js/plugins/magnific-popup/magnific-popup.min.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('blocks', {
                    url: '/blocks',
                    templateUrl: 'assets/views/api_blocks.html'
                })
                .state('layout', {
                    url: '/layout',
                    templateUrl: 'assets/views/api_layout.html'
                })
                .state('create', {
                    url: '/create',
                    templateUrl: 'assets/views/ready_create.html'
                });
    }
]);

// Tooltips and Popovers configuration
App.config(['$uibTooltipProvider',
    function ($uibTooltipProvider) {
        $uibTooltipProvider.options({
            appendToBody: true
        });
    }
]);
/**
 *  Cors usage example. 
 *  @author Georgi Naumov
 *  gonaumov@gmail.com for contacts and 
 *  suggestions. 
 **/
App.config(function ($httpProvider) {
//Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});
//filter for dates coming from Mysql
App.filter('dateToISO', function () {
    return function (input) {
        return new Date(input).toISOString();
    };
});

//Register the http interceptor to angular config.
App.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('accessTokenHttpInterceptor');
    }]);
// set a prefix to avoid overwriting any local storage variables from the rest of your app
App.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
            .setPrefix('App');
});
//Create a http interceptor factory
App.factory('accessTokenHttpInterceptor', ['$cookies', 'localStorageService',
    function ($cookies, localStorageService) {
        return {
//For each request the interceptor will set the bearer token header.
            request: function ($config) {
//Fetch token from cookie
//var token=$cookies.get['token'];
//Fetch token from localstorage
                if (localStorageService.get('globals'))
                {
                    var globals = localStorageService.get('globals');
//console.log(globals);
                    //var token = globals['access_token'];
                    var token = globals.access_token;

//set authorization header
                    //$config.headers['Authorization'] = 'Bearer ' + token;
                    $config.headers.Authorization = 'Bearer ' + token;
//console.log($config);
                }

                return $config;
            },
            response: function (response) {
//if you get a token back in your response you can use 
//the response interceptor to update the token in the 
//stored in the cookie
                if (response.config.headers.yourTokenProperty) {
//fetch token
                    var token = response.config.headers.yourTokenProperty;

//set token
                    $cookies.put('token', token);
                }
                return response;
            }
        };
    }]);
// Custom UI helper functions
App.factory('uiHelpers', function () {
    return {
// Handles active color theme
        uiHandleColorTheme: function (themeName) {
            var colorTheme = jQuery('#css-theme');

            if (themeName) {
                if (colorTheme.length && (colorTheme.prop('href') !== 'assets/css/themes/' + themeName + '.min.css')) {
                    jQuery('#css-theme').prop('href', 'assets/css/themes/' + themeName + '.min.css');
                } else if (!colorTheme.length) {
                    jQuery('#css-main').after('<link rel="stylesheet" id="css-theme" href="assets/css/themes/' + themeName + '.min.css">');
                }
            } else {
                if (colorTheme.length) {
                    colorTheme.remove();
                }
            }
        },
// Handles #main-container height resize to push footer to the bottom of the page
        uiHandleMain: function () {
            var lMain = jQuery('#main-container');
            var hWindow = jQuery(window).height();
            var hHeader = jQuery('#header-navbar').outerHeight();
            var hFooter = jQuery('#page-footer').outerHeight();

            if (jQuery('#page-container').hasClass('header-navbar-fixed')) {
                lMain.css('min-height', hWindow - hFooter);
            } else {
                lMain.css('min-height', hWindow - (hHeader + hFooter));
            }
        },
// Handles transparent header functionality (solid on scroll - used in frontend pages)
        uiHandleHeader: function () {
            var lPage = jQuery('#page-container');

            if (lPage.hasClass('header-navbar-fixed') && lPage.hasClass('header-navbar-transparent')) {
                jQuery(window).on('scroll', function () {
                    if (jQuery(this).scrollTop() > 20) {
                        lPage.addClass('header-navbar-scroll');
                    } else {
                        lPage.removeClass('header-navbar-scroll');
                    }
                });
            }
        },
// Handles sidebar and side overlay custom scrolling functionality
        uiHandleScroll: function (mode) {
            var windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var lPage = jQuery('#page-container');
            var lSidebar = jQuery('#sidebar');
            var lSidebarScroll = jQuery('#sidebar-scroll');
            var lSideOverlay = jQuery('#side-overlay');
            var lSideOverlayScroll = jQuery('#side-overlay-scroll');

// Init scrolling
            if (mode === 'init') {
// Init scrolling only if required the first time
                uiHandleScroll();
            } else {
// If screen width is greater than 991 pixels and .side-scroll is added to #page-container
                if (windowW > 991 && lPage.hasClass('side-scroll') && (lSidebar.length || lSideOverlay.length)) {
// If sidebar exists
                    if (lSidebar.length) {
// Turn sidebar's scroll lock off (slimScroll will take care of it)
                        jQuery(lSidebar).scrollLock('disable');

// If sidebar scrolling does not exist init it..
                        if (lSidebarScroll.length && (!lSidebarScroll.parent('.slimScrollDiv').length)) {
                            lSidebarScroll.slimScroll({
                                height: lSidebar.outerHeight(),
                                color: '#fff',
                                size: '5px',
                                opacity: 0.35,
                                wheelStep: 15,
                                distance: '2px',
                                railVisible: false,
                                railOpacity: 1
                            });
                        } else { // ..else resize scrolling height
                            lSidebarScroll
                                    .add(lSidebarScroll.parent())
                                    .css('height', lSidebar.outerHeight());
                        }
                    }

// If side overlay exists
                    if (lSideOverlay.length) {
// Turn side overlay's scroll lock off (slimScroll will take care of it)
                        jQuery(lSideOverlay).scrollLock('disable');

// If side overlay scrolling does not exist init it..
                        if (lSideOverlayScroll.length && (!lSideOverlayScroll.parent('.slimScrollDiv').length)) {
                            lSideOverlayScroll.slimScroll({
                                height: lSideOverlay.outerHeight(),
                                color: '#000',
                                size: '5px',
                                opacity: 0.35,
                                wheelStep: 15,
                                distance: '2px',
                                railVisible: false,
                                railOpacity: 1
                            });
                        } else { // ..else resize scrolling height
                            lSideOverlayScroll
                                    .add(lSideOverlayScroll.parent())
                                    .css('height', lSideOverlay.outerHeight());
                        }
                    }
                } else {
// If sidebar exists
                    if (lSidebar.length) {
// If sidebar scrolling exists destroy it..
                        if (lSidebarScroll.length && lSidebarScroll.parent('.slimScrollDiv').length) {
                            lSidebarScroll
                                    .slimScroll({destroy: true});
                            lSidebarScroll
                                    .attr('style', '');
                        }

// Turn sidebars's scroll lock on
                        jQuery(lSidebar).scrollLock('enable');
                    }

// If side overlay exists
                    if (lSideOverlay.length) {
// If side overlay scrolling exists destroy it..
                        if (lSideOverlayScroll.length && lSideOverlayScroll.parent('.slimScrollDiv').length) {
                            lSideOverlayScroll
                                    .slimScroll({destroy: true});
                            lSideOverlayScroll
                                    .attr('style', '');
                        }

// Turn side overlay's scroll lock on
                        jQuery(lSideOverlay).scrollLock('enable');
                    }
                }
            }
        },
// Handles page loader functionality
        uiLoader: function (mode) {
            var lBody = jQuery('body');
            var lpageLoader = jQuery('#page-loader');

            if (mode === 'show') {
                if (lpageLoader.length) {
                    lpageLoader.fadeIn(250);
                } else {
                    lBody.prepend('<div id="page-loader"></div>');
                }
            } else if (mode === 'hide') {
                if (lpageLoader.length) {
                    lpageLoader.fadeOut(250);
                }
            }
        },
// Handles blocks API functionality
        uiBlocks: function (block, mode, button) {
// Set default icons for fullscreen and content toggle buttons
            var iconFullscreen = 'si si-size-fullscreen';
            var iconFullscreenActive = 'si si-size-actual';
            var iconContent = 'si si-arrow-up';
            var iconContentActive = 'si si-arrow-down';

            if (mode === 'init') {
// Auto add the default toggle icons
                switch (button.data('action')) {
                    case 'fullscreen_toggle':
                        button.html('<i class="' + (button.closest('.block').hasClass('block-opt-fullscreen') ? iconFullscreenActive : iconFullscreen) + '"></i>');
                        break;
                    case 'content_toggle':
                        button.html('<i class="' + (button.closest('.block').hasClass('block-opt-hidden') ? iconContentActive : iconContent) + '"></i>');
                        break;
                    default:
                        return false;
                }
            } else {
// Get block element
                var elBlock = (block instanceof jQuery) ? block : jQuery(block);

// If element exists, procceed with blocks functionality
                if (elBlock.length) {
// Get block option buttons if exist (need them to update their icons)
                    var btnFullscreen = jQuery('[data-js-block-option][data-action="fullscreen_toggle"]', elBlock);
                    var btnToggle = jQuery('[data-js-block-option][data-action="content_toggle"]', elBlock);

// Mode selection
                    switch (mode) {
                        case 'fullscreen_toggle':
                            elBlock.toggleClass('block-opt-fullscreen');

// Enable/disable scroll lock to block
                            if (elBlock.hasClass('block-opt-fullscreen')) {
                                jQuery(elBlock).scrollLock('enable');
                            } else {
                                jQuery(elBlock).scrollLock('disable');
                            }

// Update block option icon
                            if (btnFullscreen.length) {
                                if (elBlock.hasClass('block-opt-fullscreen')) {
                                    jQuery('i', btnFullscreen)
                                            .removeClass(iconFullscreen)
                                            .addClass(iconFullscreenActive);
                                } else {
                                    jQuery('i', btnFullscreen)
                                            .removeClass(iconFullscreenActive)
                                            .addClass(iconFullscreen);
                                }
                            }
                            break;
                        case 'fullscreen_on':
                            elBlock.addClass('block-opt-fullscreen');

// Enable scroll lock to block
                            jQuery(elBlock).scrollLock('enable');

// Update block option icon
                            if (btnFullscreen.length) {
                                jQuery('i', btnFullscreen)
                                        .removeClass(iconFullscreen)
                                        .addClass(iconFullscreenActive);
                            }
                            break;
                        case 'fullscreen_off':
                            elBlock.removeClass('block-opt-fullscreen');

// Disable scroll lock to block
                            jQuery(elBlock).scrollLock('disable');

// Update block option icon
                            if (btnFullscreen.length) {
                                jQuery('i', btnFullscreen)
                                        .removeClass(iconFullscreenActive)
                                        .addClass(iconFullscreen);
                            }
                            break;
                        case 'content_toggle':
                            elBlock.toggleClass('block-opt-hidden');

// Update block option icon
                            if (btnToggle.length) {
                                if (elBlock.hasClass('block-opt-hidden')) {
                                    jQuery('i', btnToggle)
                                            .removeClass(iconContent)
                                            .addClass(iconContentActive);
                                } else {
                                    jQuery('i', btnToggle)
                                            .removeClass(iconContentActive)
                                            .addClass(iconContent);
                                }
                            }
                            break;
                        case 'content_hide':
                            elBlock.addClass('block-opt-hidden');

// Update block option icon
                            if (btnToggle.length) {
                                jQuery('i', btnToggle)
                                        .removeClass(iconContent)
                                        .addClass(iconContentActive);
                            }
                            break;
                        case 'content_show':
                            elBlock.removeClass('block-opt-hidden');

// Update block option icon
                            if (btnToggle.length) {
                                jQuery('i', btnToggle)
                                        .removeClass(iconContentActive)
                                        .addClass(iconContent);
                            }
                            break;
                        case 'refresh_toggle':
                            elBlock.toggleClass('block-opt-refresh');

// Return block to normal state if the demostration mode is on in the refresh option button - data-action-mode="demo"
                            if (jQuery('[data-js-block-option][data-action="refresh_toggle"][data-action-mode="demo"]', elBlock).length) {
                                setTimeout(function () {
                                    elBlock.removeClass('block-opt-refresh');
                                }, 2000);
                            }
                            break;
                        case 'state_loading':
                            elBlock.addClass('block-opt-refresh');
                            break;
                        case 'state_normal':
                            elBlock.removeClass('block-opt-refresh');
                            break;
                        case 'close':
                            elBlock.hide();
                            break;
                        case 'open':
                            elBlock.show();
                            break;
                        default:
                            return false;
                    }
                }
            }
        }
    };
});

// Run our App
App.run(function ($rootScope, uiHelpers, $location, $cookieStore, $http, AuthenticationService, $state, $sessionStorage) {
var channel = pusher.subscribe('my-channel');
    //Test Subscrition
    channel.bind('my-event', function(data) {
        var array_recipients = JSON.parse(data.recipients);
        //create an array with the recipients
         if(($rootScope.globals.currentUser) && ($sessionStorage.loggeduser)) {
            var is_recipient = array_recipients.indexOf($sessionStorage.loggeduser.user.id);
if(is_recipient < 0){

} else {

    $.notify({
    // options
    icon: 'glyphicon glyphicon-warning-sign',
    message: data.message
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

}
         }



    });
    // //System Notification 
    //  //var channel = pusher.subscribe('smartapi-channel');
    //  var channel = pusher.subscribe('my-channel');
    // //Test Subscrition
    // channel.bind('system-notification', function(data) {
    // //console.log(data.message);
    // $.notify({
    // // options
    // message: data.message
    // },{
    // // settings
    // type: 'success'
    // });
    // });



// Access uiHelpers easily from all controllers
    $rootScope.location = $location;
    $rootScope.helpers = uiHelpers;
    //se muestra el loader
    //console.log('se muestra el loader');
    $rootScope.helpers.uiBlocks('#sidebar-content', 'state_loading');
     setTimeout(function () {
                console.log('se esconde el loader');
                 $rootScope.helpers.uiBlocks('#sidebar-content', 'state_normal');
                 //$scope.helpers.uiBlocks('#sidebar-content', 'content_hide');
                 //$('#sidebar-content').removeClass('hide');
                 //$('#sidebar-content').addClass('hide');
            }, 5000);

    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }
    $rootScope.$on('$locationChangeStart', function (event, next, current) {

         AuthenticationService.init();
         console.log('logged');
         console.log($sessionStorage.loggeduser);

// redirect to login page if not logged in
        if(($rootScope.globals.currentUser) && ($sessionStorage.loggeduser)) {
            // console.log('tiene $rootScope.globals.currentUser');
            // console.log($rootScope.globals.currentUser);
            // console.log(AuthenticationService.checkPermissionForView(next));
            //Pusher implementation. Channels Subscription

        } else {
            // console.log('no tiene $rootScope.globals.currentUser y $sessionStorage.loggeduser');
            AuthenticationService.ClearCredentials();
            $location.path('/login');

        }

        if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
            //alert('No esta logeado');

            $location.path('/login');
        }
// redirect if user doesnt have the right permissions
        if ($rootScope.globals.currentUser && !AuthenticationService.checkPermissionForView(next)){
            //alert('No Tiene permiso');
            event.preventDefault();

            $location.path("/error/403");
        }
       // alert('tiene permiso?');
        //alert(!AuthenticationService.checkPermissionForView(next));
        // if (!AuthenticationService.checkPermissionForView(next)){
        //     alert('No Tiene permiso');
        //     event.preventDefault();
        //     $location.path("/login");
        // }
    });

// On window resize or orientation change resize #main-container & Handle scrolling
    var resizeTimeout;

    jQuery(window).on('resize orientationchange', function () {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(function () {
            $rootScope.helpers.uiHandleScroll();
            $rootScope.helpers.uiHandleMain();
        }, 150);
    });
});

// Application Main Controller
App.controller('AppCtrl', ['$scope', '$localStorage', '$window','MqttConnection',
    function ($scope, $localStorage, $window,MqttConnection) {
// Template Settings
        $scope.oneui = {
            version: '3.0', // Template version
            localStorage: false, // Enable/Disable local storage
            settings: {
                activeColorTheme: false, // Set a color theme of your choice, available: 'amethyst', 'city, 'flat', 'modern' and 'smooth'
                sidebarLeft: true, // true: Left Sidebar and right Side Overlay, false: Right Sidebar and left Side Overlay
                sidebarOpen: true, // Visible Sidebar by default (> 991px)
                sidebarOpenXs: false, // Visible Sidebar by default (< 992px)
                sidebarMini: false, // Mini hoverable Sidebar (> 991px)
                sideOverlayOpen: false, // Visible Side Overlay by default (> 991px)
                sideOverlayHover: false, // Hoverable Side Overlay (> 991px)
                sideScroll: true, // Enables custom scrolling on Sidebar and Side Overlay instead of native scrolling (> 991px)
                headerFixed: true // Enables fixed header
            }
        };

// If local storage setting is enabled
        if ($scope.oneui.localStorage) {
// Save/Restore local storage settings
            if ($scope.oneui.localStorage) {
                if (angular.isDefined($localStorage.oneuiSettings)) {
                    $scope.oneui.settings = $localStorage.oneuiSettings;
                } else {
                    $localStorage.oneuiSettings = $scope.oneui.settings;
                }
            }

// Watch for settings changes
            $scope.$watch('oneui.settings', function () {
// If settings are changed then save them to localstorage
                $localStorage.oneuiSettings = $scope.oneui.settings;
            }, true);
        }

// Watch for activeColorTheme variable update
        $scope.$watch('oneui.settings.activeColorTheme', function () {
// Handle Color Theme
            $scope.helpers.uiHandleColorTheme($scope.oneui.settings.activeColorTheme);
        }, true);

// Watch for sideScroll variable update
        $scope.$watch('oneui.settings.sideScroll', function () {
// Handle Scrolling
            setTimeout(function () {
                $scope.helpers.uiHandleScroll();
            }, 150);
        }, true);

// When view content is loaded
        $scope.$on('$viewContentLoaded', function () {
// Hide page loader
            $scope.helpers.uiLoader('hide');
            // setTimeout(function () {
            //     $scope.helpers.uiLoader('hide');
            // }, 2000);
            //$scope.helpers.uiBlocks('testheader','state_normal');
            $scope.helpers.uiBlocks('testheader','state_loading');

// Resize #main-container
            $scope.helpers.uiHandleMain();
        });

    }
]);


/*
 * Partial views controllers
 *
 */

// Side Overlay Controller
App.controller('SideOverlayCtrl', ['$scope', '$localStorage', '$window', 
    function ($scope, $localStorage, $window) {
// When view content is loaded
        $scope.$on('$includeContentLoaded', function () {
// Handle Scrolling
            $scope.helpers.uiHandleScroll();

        });

    }
]);

// Sidebar Controller
App.controller('SidebarCtrl', ['$rootScope', '$scope', '$state', '$localStorage', '$window', '$location', 'UserService', '$sessionStorage', 'AuthenticationService',
    function ($rootScope, $scope, $state, $localStorage, $window, $location, UserService, $sessionStorage, AuthenticationService) {
// When view content is loaded
// console.log($location.$$path);
// console.log($state);i
// f($location.$$path == '/login'){$scope.oneui.settings.sidebarOpen = false;}

//Test from blocks API
// console.log('deberia esconder');
// $scope.helpers.uiBlocks('#my-block-one', 'state_loading');
$scope.logout = function () {
            $window.localStorage.clear();
            $location.path('/login');
        };



$scope.loader = function () {
    // check if there is query in url
    $scope.myClass = [];
    $scope.addClass = function() {
    //$scope.myClass.push('block');
    };
    //$scope.helpers.uiBlocks('#sidebar-content', 'refresh_toggle');

};

        $scope.oneui.settings.sidebarOpen = false;
        $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    $state.current = toState;

//console.log($state.is('login'));

                    if (($state.is('login') == true) ||
                        ($state.is('404') == true) ||
                        ($state.is('500') == true) ||
                        ($state.is('reminder') == true)) {
                        $scope.oneui.settings.sidebarOpen = false;
                    } else {

                        $scope.oneui.settings.sidebarOpen = true;
                        console.log('se ponen los menuitems');
                        console.log($sessionStorage);
                        $sessionStorage.menuitems = $scope.menuitems;
                    }

                    
                }
        );
        $scope.$on('$includeContentLoaded', function () {
// Handle Scrolling
            $scope.helpers.uiHandleScroll();

// Get current path to use it for adding active classes to our submenus
            $scope.path = $location.path();
             setTimeout(function () {

                 //$scope.helpers.uiBlocks('#sidebar-content', 'refresh_toggle');
                 //$scope.helpers.uiBlocks('#sidebar-content', 'content_toggle');
                 //$('#sidebar-content').removeClass('hide');
            }, 5000);
            
        });
    }
]);
//Websockets
//.factory('MyData', function($websocket) {
// App.factory('MyData', ['$websocket', 'urls', function ($websocket, urls) {
//       // Open a WebSocket connection
//       //var dataStream = $websocket('ws://website.com/data');
//       var dataStream = $websocket('ws://192.168.1.5:5000/api/triggers');

//       var collection = [];

//       dataStream.onMessage(function(message) {
//         collection.push(JSON.parse(message.data));
//       });

//       var methods = {
//         collection: collection,
//         get: function() {
//           dataStream.send(JSON.stringify({ action: 'get' }));
//         }
//       };

//       return methods;
//     }])
// App.controller('WebSocketCtrl', function ($scope, MyData) {
//   //$scope.MyData = MyData;
// });

// Header Controller
App.controller('HeaderCtrl', ['$scope', '$localStorage', '$window', '$location',
    function ($scope, $localStorage, $window, $location) {
// When view content is loaded
        $scope.$on('$includeContentLoaded', function () {
// Transparent header functionality
            $scope.helpers.uiHandleHeader();
        });
        $scope.logOut = function () {
            $window.localStorage.clear();
            $location.path('/login');
        };
    }
]);
// moment.createFromInputFallback = function (config) {
//     config._d = new Date(config._i);
// };
// App.directive('ngDateRangePicker', function () {
//     return {
//         restrict: 'EA',
//         require: '?ngModel',
//         scope: {
//             startDate: '=startDate',
//             endDate: '=endDate',
//             ngModel: '=ngModel',
//             dateRange: '='
//         },
//         link: function postLink(scope, element, attrs, ngModel) {
//             element.daterangepicker({
//                 locale: {
//                     format: 'YYYY-MM-DD',
//                     separator: ' to '
//                 },
//                 showDropdowns: true,
//                 opens: 'left',
//                 drops: 'down',
//                 buttonClasses: ['btn', 'btn-sm'],
//                 applyClass: 'btn-primary',
//                 cancelClass: 'btn-default',
// //                separator: ' to ',
//                 ranges: {
//                     'Today': [moment(), moment()],
//                     'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//                     'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//                     'Last 30 Days': [moment().subtract(29, 'days'), moment()],
//                     'This Month': [moment().startOf('month'), moment().endOf('month')],
//                     'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//                 }
//             }, function (start, end, label) {
//                 scope.ngModel.startDate = start.format('YYYY-MM-DD');
//                 scope.ngModel.endDate = end.format('YYYY-MM-DD');
//                 scope.$apply();
//             });
//         }
//     };
// });.subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//                 }
//             }, function (start, end, label) {
//                 scope.ngModel.startDate = start.format('YYYY-MM-DD');
//                 scope.ngModel.endDate = end.format('YYYY-MM-DD');
//                 scope.$apply();
//             });
//         }
//     };
// });

(function() {
  angular.module('angularPaho').factory('MqttClient', [function() {

    // so we can use the member attributes inside our functions
    var client = {};

    // initialize attributes
    client._location = "";
    client._port = "";
    client._id = "";
    client._client = null;
    client._isConnected = false;

    // member functions
    client.init = init;
    client.connect = connect;
    client.disconnect = disconnect;
    client.send = send;
    client.startTrace = startTrace;
    client.stopTrace = stopTrace;
    client.subscribe = subscribe;
    client.unsubscribe = unsubscribe;

    return client;

    // onConnectionLost callback

    function _call(cb, args) {
      if (client._client) {
          cb.apply(this, args);
      } else {
        console.log('Angular-Paho: Client must be initialized first.  Call init() function.');
      }
    }

    function onConnectionLost(resp) {
      console.log("Angular-Paho: Connection lost on ", client._id, ", error code: ", resp);
      client._isConnected = false;
    }

    // connects to the MQTT Server
    function connect(options) {
      _call(_connect, [options]);
    }

    function _connect(options) {
      client._client.connect(options);
      client._isConnected = client._client.isConnected();
    }

    function disconnect() {
      _call(_disconnect);
    }

    function _disconnect() {
      client._client.disconnect();
      client._isConnected = false;
    }

    function init(location, port, id) {
      // initialize attributes
      client._location = location;
      client._port = port;
      client._id = id;

      // create the client and callbacks
      client._client = new Paho.MQTT.Client(client._location, Number(client._port), client._id);
      client._client.onConnectionLost = onConnectionLost;
      client._client.onMessageArrived = onMessageArrived;
    }

    function onMessageArrived(message) {
      console.log("onMessageArrived:"+message.payloadString);
    }

    function send(message) {
      _call(_send, [message]);
    }

    function _send(message) {
      client._client.send(message);
    }

    function startTrace() {
      _call(_startTrace);
    }

    function _startTrace() {
      client._client.startTrace();
    }

    function stopTrace() {
      _call(_stopTrace);
    }

    function _stopTrace() {
      client._client.stopTrace();
    }

    function subscribe(filter, options) {
      _call(_subscribe, [filter, options]);
    }

    function _subscribe(filter, options) {
      client._client.subscribe(filter, options);
    }

    function unsubscribe(filter, options) {
      _call(_unsubscribe, [filter, options]);
    }

    function _unsubscribe(filter, options) {
      client._client.unsubscribe(filter, options);
    }

  }]);
})();
(function() {
    angular.module('angularPahoConnection').factory('MqttConnection', [ 'urls','$rootScope', function(urls,$rootScope) {

            // Variable declear
            var host = urls.MQTT_BROKER;
            var port = Number(urls.MQTT_BROKER_PORT);
            var id = "js_paho_id_" + parseInt(Math.random() * 100, 10);
            var path = "/ws";
            var clientID = "clientID_" + parseInt(Math.random() * 100);
            var client = undefined;
            var currentState = {}; 

            currentState.subscribeTopic = subscribeTopic; 
            currentState.publish = publish;

            if(mqttConnected == undefined){
                var mqttConnected = false;
            }

            // Create a client instance
            client = new Paho.MQTT.Client(host,port,path,id);

            // set callback handlers
            client.onConnectionLost = onConnectionLost;
            client.onMessageArrived = onMessageArrived;

            options = {
                useSSL: true,
                timeout: 3,
                onSuccess: onConnect,
                onFailure: failureCallback,
                userName: "kike",
                password: "K1k3355453"
        
            };

            // connect the client
            if(client != undefined && mqttConnected == false){
                client.connect(options);
                mqttConnected = true;
            }
            
            // called when the client connects
            function onConnect() {
            // Once a connection has been made, make a subscription and send a message.
                // console.log("onConnect");
                mqttConnected = true;
            }

            // method to subscribe topic
            function subscribeTopic(topic){
                if(mqttConnected){
                    setTimeout(function(){
                        client.subscribe(topic);
                    },1000);
                }
                else{
                    reConnect();
                }                
            }

            // Method to send message
            function publish(message,topic){
                if(mqttConnected && (message != undefined || message != null)){
                    var messageSend = new Paho.MQTT.Message(message);
                    messageSend.destinationName = topic;
                    client.send(messageSend); 
                }else{
                    reConnect();
                }
            }

            // called when a message arrives
            function onMessageArrived(message) {
                $rootScope.$broadcast("ReciveMessage",message)
                // return message;
            }

            // called when the client loses its connection
            function onConnectionLost(responseObject) {
                if (responseObject.errorCode !== 0) {
                    console.error("onConnectionLost:"+responseObject.errorMessage);
                    mqttConnected = false;
                    reConnect();
                }
            }

            // method if disconnected
            function failureCallback(message) {
                console.log('Connection Failed- Retrying')
                mqttConnected = false;
                
                
                $.notify({
                    message: 'Connection Failed- Retrying in 5 min'
                },{     
                    type: 'warning'
                });
                reConnect();
            
            }

            // Method to reconnect mqtt
            function reConnect(){
                setTimeout(function(){
                    client.connect(options); 
                    mqttConnected = true;
                },300000);
            }
            
            return client,currentState;
    }]);
  })();