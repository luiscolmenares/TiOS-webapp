// Components Treeview Controller
    
App.controller('CompAnalyticsTreeCtrl', ['$rootScope', '$scope', '$localStorage', '$window', '$http', 'urls', 'DataanalyticsService', function ($rootScope, $scope, $localStorage, $window, $http, urls, DataanalyticsService ) {

    $scope.fromDate =  new Date();// null;
    $scope.toDate = new Date();// null;
    $scope.organizationsCount;
    $scope.treeData;
    $scope.i = '';
    $rootScope.organizations = [];
    $scope.isNodeProjects = false;
    $scope.isNodeSpaces = false; 
    $scope.nodeProjects = [];
    $scope.nodeSpaces = [];
    $scope.allProjects = [];
    $scope.allSpaces = [];
    $scope.organizationId = '';
    $scope.projectId = '';
    $scope.isNodeSpaces = false;
    $scope.spaceId = '';
    $scope.datasourceAverage;
    $scope.datasources1 = [];
    $scope.datasourcesValues = [];
    $scope.datasourcesValuesByProject = [];
    $scope.dataSourcesOfSpace = [];
    $scope.datasourceCheckedId = '';
    $scope.fromDateEpoch = null;
    $scope.toDateEpoch = null;
    $scope.displayRequest = false;
    $scope.durationValues = [];
    $scope.resolutions = '';
    $scope.organizationCheckedId = '';
    $scope.projectCheckedId = ''; 
    $scope.resolutionSelected = '';
    $scope.chart = {type: "lineChart"};
    $scope.dataSourcesType = '';
    $scope.expandedNode;
    $scope.selectedNodeName = null;
    $scope.list;
    $scope.expandedSpace;
    $scope.expandedSpaceDatasources;
    $scope.dataPieDataChart  = [];
    $scope.orgDataValues = {
        "datasource_type": '',
        "from_date": null, 
        "to_date": null 
    }
    $scope.nodeType = '';
    $scope.dataSources = {type: 'temperature'};
    $scope.resolution = {type: 'hour'};
    $scope.projectDataValues = {
        "datasource_type": '',
        "from_date": null, 
        "to_date": null,
        'spaces': [] 
    }
    $scope.spacesByProjectDataValues = {
        "datasource_type": '',
        "from_date": null, 
        "to_date": null,
    }
    $scope.filters = {
        name : 'avg' 
    }
    $scope.spacesSelected = [];
    $scope.loader = false;
    $scope.noPieData = true;
    $scope.selectedOrg = null;
    $scope.selectedProject = null;
    $scope.selectedDatasource = null;
    $scope.projectIdOfSpace = '';
    $scope.average = null;
    $scope.minimum = null;
    $scope.maximum = null;
    $scope.durations = [];
    $scope.monthsName = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    //reset dates to current date
    $scope.resetDates = function() {

        $(document).ready(function() {
        // reset datepickers to today's date
        $("#fromDate").datepicker().datepicker('setDate', new Date());
        $("#toDate").datepicker().datepicker('setDate', new Date());

        //reset checked radio boxes and checkboxes with radioinstant class to unchecked
            $(':checkbox').each(function () {
                $(this).removeAttr('checked');
            })

            $('.radioinstant:radio').each(function () {
                $(this).removeAttr('checked');
            })
        });

    }

    //initialize UI-tree view
    var initTreeViews = function () {

        // var organizationsCount = ($scope.organizations).length;
        $scope.treeDataNodes = []; 

        $scope.treeData = [
            {
                text: 'Organizations',
                href: '#parent1',
                tags: ['4'],
                nodes: $scope.treeDataNodes
            }
        ];

        jQuery('.js-tree-simple').treeview({
            data: $scope.treeData,
            color: '#555',
            expandIcon: 'fa fa-plus',
            collapseIcon: 'fa fa-minus',
            onhoverColor: '#f9f9f9',
            selectedColor: '#555',
            selectedBackColor: '#f1f1f1',
            showBorder: false,
            levels: 3
        });
    
        // Init Icons Tree
        jQuery('.js-tree-icons').treeview({
            data: $scope.treeData,
            color: '#555',
            expandIcon: 'fa fa-plus',
            collapseIcon: 'fa fa-minus',
            nodeIcon: 'fa fa-folder text-primary',
            onhoverColor: '#f9f9f9',
            selectedColor: '#555',
            selectedBackColor: '#f1f1f1',
            showBorder: false,
            levels: 3
        });

        // Init Alternative Icons Tree
        jQuery('.js-tree-icons-alt').treeview({
            data: $scope.treeData,
            color: '#555',
            expandIcon: 'fa fa-angle-down',
            collapseIcon: 'fa fa-angle-up',
            nodeIcon: 'fa fa-file-o text-city',
            onhoverColor: '#f9f9f9',
            selectedColor: '#555',
            selectedBackColor: '#f1f1f1',
            showBorder: false,
            levels: 3
        });

        // Init Badges Tree
        jQuery('.js-tree-badges').treeview({
            data: $scope.treeData,
            color: '#555',
            expandIcon: 'fa fa-plus',
            collapseIcon: 'fa fa-minus',
            nodeIcon: 'fa fa-folder text-primary',
            onhoverColor: '#f9f9f9',
            selectedColor: '#555',
            selectedBackColor: '#f1f1f1',
            showTags: true,
            levels: 3
        });

        // Init Collapsed Tree
        jQuery('.js-tree-collapsed').treeview({
            data: $scope.treeData,
            color: '#555',
            expandIcon: 'fa fa-plus',
            collapseIcon: 'fa fa-minus',
            nodeIcon: 'fa fa-folder text-primary-light',
            onhoverColor: '#f9f9f9',
            selectedColor: '#555',
            selectedBackColor: '#f1f1f1',
            showTags: true,
            levels: 1
        });

        jQuery('.js-tree-json').treeview({
            data: $scope.treeDataJson,
            color: '#555',
            expandIcon: 'fa fa-arrow-down',
            collapseIcon: 'fa fa-arrow-up',
            nodeIcon: 'fa fa-file-code-o text-flat',
            onhoverColor: '#f9f9f9',
            selectedColor: '#555',
            selectedBackColor: '#f1f1f1',
            showTags: true,
            levels: 3,
            selectable: true
        });
    };

    //initialize datepicker
    App.directive('jsDatepicker', function () {
        return {
            link: function (scope, element) {
                jQuery(element).datepicker({
                    weekStart: 1,
                    autoclose: true,
                    todayHighlight: true
                });
            }
        };
    });

        //initialize dateTimepicker
    App.directive('jsDatetimepicker', function () {
        return {
            link: function (scope, element, attrs) {
                var options = (typeof scope.$eval(attrs.jsDatetimepicker) !== 'undefined') ? scope.$eval(attrs.jsDatetimepicker) : new Object();
    
                jQuery(element).datetimepicker({
                    format: options.format ? options.format : false,
                    useCurrent: options.useCurrent ? options.useCurrent : false,
                    locale: moment.locale('' + (options.locale ? options.locale : '') +''),
                    showTodayButton: options.showTodayButton ? options.showTodayButton : false,
                    showClear: options.showClear ? options.showClear : false,
                    showClose: options.showClose ? options.showClose : false,
                    sideBySide: options.sideBySide ? options.sideBySide : false,
                    inline: options.inline ? options.inline : false,
                    icons: {
                        time: 'si si-clock',
                        date: 'si si-calendar',
                        up: 'si si-arrow-up',
                        down: 'si si-arrow-down',
                        previous: 'si si-arrow-left',
                        next: 'si si-arrow-right',
                        today: 'si si-size-actual',
                        clear: 'si si-trash',
                        close: 'si si-close',
                        // format: 'DD/MM/YYYY'
                    }
                });
            }
        };
    });

    //get all organizations
    function getAllOrganizations() {
        return $http.get(urls.BASE_API + 'organizations').then(handleSuccess, handleError('Error getting all organizations'));
    }

    //get all organizations
    DataanalyticsService.getAllOrganizations().then(function (response) {

        // initialize dates with today's date
        $("#fromDate").datepicker().datepicker('setDate', new Date());
        $("#toDate").datepicker().datepicker('setDate', new Date());
        $scope.organizations = response.organizations;
        initTreeViews();
    });

    //get all spaces
    function getSpaces(project, nodeType){

        if(nodeType == 'project') {

            DataanalyticsService.getSpacesNodes(project.id).then(function (response) {

            var res = response.spaces;
            if(res.length == 0) {
                $scope.nodeSpaces = [];
                $scope.spacesId = null;
                $scope.projectId = null;
            }
            for(var i = 0; i < res.length; i++) {


                    var spacesId = '';
                    var sapcesAvail = false;
                    for(var i = 0; i < res.length; i++) {

                        $scope.nodeSpaces.push(res[i]);
                    }
                    if(res.length > 0) {
                        $scope.projectId = $scope.nodeSpaces[0].project_id; 
                        spacesId = $scope.nodeSpaces[0].id; 
                    } 
                    if(res.length == 0) {
                        sapcesAvail= true;
                        spacesId = 'available';
                        $scope.nodeSpaces = [];
                    }
                    $scope.spaceId = spacesId;
                    $scope.isNodeSpaces = sapcesAvail;
                }
                nodeSpacesLength = $scope.nodeSpaces.length;
                // for(var j=0; j< nodeSpacesLength; j++) {

                //     var nodeSpaceDatasources = $scope.nodeSpaces[j].datasources;
                //     nodeSpaceDatasourcesLength = nodeSpaceDatasources.length;
                //     for(var count=0; count< nodeSpaceDatasourcesLength; count++) {
                //     }
                // }
            })
         
        }else if(nodeType == null) {

            var projectsLength = $scope.allProjects.length;

            for(var i = 0; i < projectsLength; i++) {
                DataanalyticsService.getSpacesNodes($scope.allProjects[i].id).then(function (response) {
                    var res = response.spaces;

                    $scope.allSpaces.push(res[i]);

                    var tempLength = $scope.allSpaces.length;

                    if(tempLength > 0) {

                        for(var count = 0;count< tempLength; count++){
                            if($scope.allSpaces[count] != undefined ) {
                                if($scope.allSpaces[count].datasources != undefined) {

                                    if($scope.allSpaces[count].datasources.length > 0) {

                                        var tempDatasources = $scope.allSpaces[count].datasources;
                                        var tempDatasourcesLength = tempDatasources.length;

                                        if($scope.datasources1.length > 0) {
                                            for(var j=0; j< $scope.datasources1.length; j++) {

                                                for(var tempCount = 0; tempCount < tempDatasourcesLength; tempCount++) {
                                                    if($scope.datasources1[j].id != tempDatasources[tempCount].id) {

                                                        $scope.datasources1.push(tempDatasources[tempCount]);
                                                        var ind = $scope.datasources1.indexOf(tempDatasources[tempCount]);
                                                        DataanalyticsService.dataSourcesValues(ind.id, null).then(function (response) {
                                                        });
                                                    }
                                                }
                                            }

                                            DataanalyticsService.dataSourcesValues($scope.datasources1[tempVal].id, null).then(function (response) {
                                            });
                                        }else {
                                            for(var tempCount = 0; tempCount < tempDatasourcesLength; tempCount++) {

                                                $scope.datasources1.push(tempDatasources[tempCount]);

                                                var ind = $scope.datasources1.indexOf(tempDatasources[tempCount]);
                                                DataanalyticsService.dataSourcesValues(ind.id, null).then(function (response) {
                                                });
                                            }
                                        }
                                    }
                                }
    
                                if($scope.datasources1.length > 0) {

                                    var lengthDatasources = $scope.datasources1.length;

                                    for(var tempVal=0; tempVal<lengthDatasources; tempVal++) {

                                        if($scope.datasources1[tempVal] != undefined) {
                                            if($scope.datasources1[tempVal].length > 0) {

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    }

    //get all datasources
    function datasources(datasourceId) {
    
        DataanalyticsService.dataSourcesValues(datasourceId, null).then(function (response) {
            resLength = response.length;
            res = response;
            for(var i=0; i< resLength; i++) {
                $scope.datasourcesValues.push(res[i].data); 
            } 
        });
    }

    //get all projects
    function getProjects(organization, nodeType){

        if(nodeType == null) {


            //if projects needed to load initially
            var organizationsLength = $scope.organizations.length;
            for(var i=0; i< organizationsLength; i++) {
                DataanalyticsService.getProjectsNodes($scope.organizations[i].id).then(function (response) {
                    var res = response.projects;
                    for(var i = 0; i < res.length; i++) {

                        $scope.allProjects.push(res[i]);
                    }
                    // var projectsLength = $scope.allProjects.length;
                    // getSpaces(null, null);
                });
            }

        }else {
            //load projects opening tree of an organization
            DataanalyticsService.getProjectsNodes(organization.id).then(function (response) {
    
                var res = response.projects;
                if(res.length == 0) {
                    $scope.projectId = null;
                    $scope.nodeProjects = [];
                }
                for(var i = 0; i < res.length; i++) {
    
    
                    if(nodeType == 'organization') {
    
                        $scope.nodeProjects.push(res[i]);
                        if($scope.nodeProjects.length > 0) {
                            $scope.organizationId = $scope.nodeProjects[0].organization_id;
                            $scope.projectId = $scope.nodeProjects[0].id;
                        }
                    } 
                }
                var projectsLength = $scope.allProjects.length;
                // if(projectsLength > 0) {
                //     for(var tempVar = 0; tempVar <  projectsLength; tempVar++) {
                //         // getSpaces($scope.allProjects[tempVar], null);
                //     }
                // }
            });
        }
    }

    //expand any organization or projecttree from the UI-tree view
    $scope.expandNode = function(nodeToExpand, nodeType) {

        if(nodeType == 'organization') {

            $scope.nodeProjects = [];
            $scope.allProjects = [];
            $scope.nodeSpaces = [];
            $scope.organizationId == '';
            $scope.isNodeSpaces = false;
            getProjects(nodeToExpand, nodeType );
        }

        if(nodeType == 'project') {
            
            $scope.projectId = '';
            $scope.nodeSpaces = [];
            $scope.isNodeSpaces = false;
            $scope.spaceId = '';
            getSpaces(nodeToExpand, nodeType);
        }
    }

    // clear spaces of any project on clicking new one
    $scope.clearProjectsSpaces = function(node) {

        if(node == 'projectsSpaces') {
            $scope.nodeProjects = []; 
            $scope.nodeSpaces = [];
            $scope.isNodeSpaces = false;
            $scope.organizationId = '';
            $scope.projectId = '';
        }else if(node == 'spaces') {
            $scope.nodeSpaces = [];
            $scope.isNodeSpaces = false;
            $scope.spaceId = '';
        }
    }

    // get children data sources on clicking any datasource in organization hierarchy
    $scope.dataSourcesAvg = function() {

        var dataValues = {
            "from_date": $scope.fromDateEpoch,
            "to_date": $scope.toDateEpoch 
        }
        DataanalyticsService.dataSourcesAvg($scope.datasourceCheckedId, dataValues).then(function (response) {
            $scope.average = response['average'];
        });
    }

    //get max value of clicked datasource by it's Id
    $scope.dataSourcesMax = function() {

        var dataValues = {
            "from_date": $scope.fromDateEpoch,
            "to_date": $scope.toDateEpoch 
        }
        DataanalyticsService.dataSourcesMax($scope.datasourceCheckedId, dataValues).then(function (response) {

            $scope.maximum = response['max_value'];
        });
    }

    //get min value of clicked datasource by it's Id
    $scope.datasourcesMin = function(){

        var dataValues = {
            "from_date": $scope.fromDateEpoch,
            "to_date": $scope.toDateEpoch 
        }

        DataanalyticsService.dataSourcesMin($scope.datasourceCheckedId, dataValues).then(function (response) {
            $scope.minimum = response['min_value'];
        });
    }

    //get average value of datasources clicking project by it's Id
    $scope.dataSourcesAvgByProject = function(){
        DataanalyticsService.dataSourcesAvgByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {
            $scope.average = response['average'];
        });
    } 

    //get average max of datasources clicking project by it's Id
    $scope.dataSourcesMaxByProject = function(){
        DataanalyticsService.dataSourcesMaxByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {
            $scope.maximum = response['max_value'];
        });
    } 
    
    //get average min of datasources clicking project by it's Id
    $scope.dataSourcesMinByProject = function(){
        DataanalyticsService.dataSourcesMinByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {
            $scope.minimum = response['min_value'];
        });
    } 

    // ****************************************//
    //assign organization Id on clicking any organization
    $scope.assignOrganizationId = function(organization, nodeSelected, event) {
        
        $scope.displayRequest = false;
        $scope.organizationCheckedId = organization.id;
        $scope.nodeType = nodeSelected;
        $scope.selectedOrg = organization.name;
        $scope.checkedLabel(event);
    }

    //assign project Id on clicking any project
    $scope.assignProjectId = function(project, nodeSelected, event) {
       
        $scope.spaceCheckedId = null;  
        $scope.datasourceCheckedId = null;
        $scope.displayRequest = false;
        $scope.projectCheckedId = project.id;
        $scope.nodeType = nodeSelected;
        $scope.selectedProject = project.name;
        $scope.checkedLabel(event);
    } 

    //add or remove spaces clicked or deselected to spacesSelected array toggling for fetching data purpose
    $scope.toggleSelection = function(space, event) {
        $scope.projectIdOfSpace = space.project_id;
        $scope.datasourceCheckedId = null;

        if(event.target.checked == true) {

            var tempVar = false;
            var spacesLen = $scope.spacesSelected.length;
            if(spacesLen > 0) {
                for(var i=0; i< spacesLen; i++) {

                    if($scope.spacesSelected[i].id == space.id) {
                        tempVar = true;
                    }
                }
                // var ind = $scope.spacesSelected.search(space.id);
                // if(ind > -1) {
                    if(tempVar == false) {
                        $scope.spacesSelected.push(space.id);
                    }
                // }
            }else {
                $scope.spacesSelected.push(space.id);
            }
            $scope.projectDataValues.spaces = $scope.spacesSelected;

            //make projectIdOfSpace and spaceCheckedId null when all spaces deselected and nodeType is space
            if($scope.spacesSelected.length == 0 && $scope.datasourceCheckedId == null &&  $scope.nodeType == 'space') {
                $scope.projectIdOfSpace = null;
                $scope.spaceCheckedId = null;
                $scope.nodeType = null;
            } 
            $scope.GetDatasourcesNodes(space.id);

        }else if(event.target.checked == false) {
            var ind = $scope.spacesSelected.indexOf(space.id);
            $scope.spacesSelected.splice(ind, 1);
            //make projectIdOfSpace and spaceCheckedId null when all spaces deselected and nodeType is space
            if($scope.spacesSelected.length == 0 && $scope.datasourceCheckedId == null && $scope.nodeType == 'space') {
                $scope.projectIdOfSpace = null;
                $scope.spaceCheckedId = null;
            } 
        }
    };

    //assign space Id on clicking any space
    $scope.assignSpaceId = function(space, nodeSelected, event) {

        $scope.displayRequest = false;
        $scope.spaceCheckedId = space.id;

        $scope.selectedProject = space.project_name;
        $scope.selectedSpace = space.name;
        $scope.nodeType = nodeSelected;
        // $scope.checkedLabel(event);

        // if($scope.spacesSelected.length> 0) {
        //    var length = $scope.spacesSelected.length;
        // }
    }

    //fetch data values for selected data-points, chart-type and dates
    $scope.chartData = function(resolution) {

        //if project ids not checked and space is checked, assign its project id to projectCheckedId
        if((!$scope.projectCheckedId || $scope.projectCheckedId == '' || $scope.projectCheckedId == null) &&  $scope.projectIdOfSpace) {
            $scope.projectCheckedId = $scope.projectIdOfSpace;
        } 

        //on deselction of any data-node assign node type to data-point selected previous than current
        if(!$scope.nodeType || $scope.nodeType == null || !$scope.nodeType == undefined) {

            if($scope.datasourceCheckedId){
                $scope.nodeType = 'datasource';
            } 
             if($scope.spacesSelected.length > 0 && !$scope.datasourceCheckedId) {
                $scope.nodeType = 'space';
            } 
             if($scope.projectCheckedId &&  !$scope.datasourceCheckedId && $scope.spacesSelected.length == 0) {
                $scope.nodeType = 'project';
            } 

             if($scope.organizationCheckedId  && $scope.projectIdOfSpace == null && $scope.projectCheckedId == null  &&  $scope.datasourceCheckedId== null && $scope.spacesSelected.length == 0) {
                $scope.nodeType = 'organization';  
            }
        }

        $scope.loader = true;

        //if chart is Piechart selected, and any datasource is selected, make nodeType as space, as selection of datasource is not possible for pieChart
        if($scope.chart.type == 'pieChart' && $scope.nodeType == 'datasource') {
            $scope.nodeType = 'space';
        }

        //validations for dates
        if($scope.fromDate == '' && $scope.toDate == '') {
                $.notify({
                    message: 'Please Select From Date And To Date'
                },{     
                    type: 'danger'
                }); 
        }else if( $scope.fromDate == '' ) {
            $.notify({
                message: 'Please Select From Date'
            },{     
                type: 'danger'
            }); 
        }else if($scope.toDate == '') {
            if($scope.toDateEpoch < $scope.fromDateEpoch) {
                $.notify({
                    message: 'Please Select  To Date'
                },{     
                    type: 'danger'
                }); 
            }
        } else if( $scope.toDateEpoch < $scope.fromDateEpoch) {
            
            $.notify({
                message: 'From Date can not be greater than To Date'
            },{     
                type: 'danger'
            }); 

        }else if($scope.fromDate != '' && $scope.toDate != '') {

            //make time resolutions according to time-period durations
            if((($scope.toDateEpoch - $scope.fromDateEpoch) <= 86400) && ($scope.resolution.type != "minute") && ($scope.resolution.type == "day" || $scope.resolution.type == "month")) {

                $scope.resolution.type = 'hour';

            } else  if(($scope.toDateEpoch - $scope.fromDateEpoch) > 2629743) {

                $scope.resolution.type = 'month';

            }  else  if((($scope.toDateEpoch - $scope.fromDateEpoch) < 2629743 && ($scope.toDateEpoch - $scope.fromDateEpoch) > 86400)) {

                $scope.resolution.type = 'day';
            } 

            $scope.displayRequest = true;

            //assign datasource type values to parameters to be sent in request as datasource selected
            if($scope.dataSources.type != null && $scope.dataSources.type == 'voltage') {

                $scope.orgDataValues['datasource_type'] = "Monitor: Voltage (V)";
                $scope.projectDataValues['datasource_type'] = "Monitor: Voltage (V)";
                $scope.spacesByProjectDataValues['datasource_type'] = "Monitor: Voltage (V)";

            }else if($scope.dataSources.type != null && $scope.dataSources.type == 'energy') {

                $scope.orgDataValues['datasource_type'] = "Monitor: Apparent power (KVA)";
                $scope.projectDataValues['datasource_type'] = "Monitor: Apparent power (KVA)";
                $scope.spacesByProjectDataValues['datasource_type'] = "Monitor: Apparent power (KVA)";

            }else if($scope.dataSources.type != null && $scope.dataSources.type == 'temperature') {

                $scope.orgDataValues['datasource_type'] = "Monitor: Temperature Sensor (Celsius)";
                $scope.projectDataValues['datasource_type'] = "Monitor: Temperature Sensor (Celsius)";
                $scope.spacesByProjectDataValues['datasource_type'] = "Monitor: Temperature Sensor (Celsius)";
            }

            //get average, max value and min value for selected organization, project, spaces and datasource 
            if($scope.nodeType == 'organization') { 

                $scope.avgByOrganization();
                $scope.minByOrganization();
                $scope.maxByOrganization();
            } else if($scope.nodeType == 'project') {

                $scope.avgByProject();
                $scope.minByProject();
                $scope.maxByProject();
            } else if($scope.nodeType == 'space') {

                $scope.dataSourcesAvgByProject();
                $scope.dataSourcesMaxByProject();
                $scope.dataSourcesMinByProject();
            } else if($scope.nodeType == 'datasource') {

                $scope.dataSourcesAvg();
                $scope.dataSourcesMax();
                $scope.datasourcesMin();
            }

            //fetch values of selected datasource type and time resolution for organization, project, spaces and datasource depending on nodeType and chart type: 

            // if($scope.resolution.type != null && $scope.resolution.type == 'auto') {
            // }else
            if($scope.resolution.type != null && $scope.resolution.type == 'month') {

                if($scope.nodeType == 'organization') {

                    $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.orgDataValues['to_date'] =  $scope.toDateEpoch;
                    
                    if($scope.chart.type == 'pieChart') {
                        $scope.monthValuesProjectsByOrgId();
                    }else {
                        monthValuesByOrganization();                    
                    }

                }else if($scope.nodeType == 'project') {

                    $scope.projectDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.projectDataValues['to_date'] =  $scope.toDateEpoch;
                    
                    if($scope.chart.type == 'pieChart') {
                        $scope.monthSpacesAvgByProjectId();
                    }else {
                        $scope.monthAvgValuesByProject();                    
                    }
                }else if($scope.nodeType == 'space') {

                    $scope.projectDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.projectDataValues['to_date'] =  $scope.toDateEpoch;
                    
                    if($scope.chart.type == 'pieChart') {
                        $scope.avgDataourcesBySpaceId();
                        // $scope.monthAvgDataourcesBySpaceId();
                    }else {
                        $scope.monthAvgValuesByProject();
                    }
                }else if($scope.nodeType == 'datasource') {
                    if($scope.chart.type != 'pieChart') {
                        $scope.monthAvgValuesByDatasource();
                    }
                }
            }else if($scope.resolution.type != null && $scope.resolution.type == 'day') {
                if($scope.nodeType == 'organization') {
                    
                    $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.orgDataValues['to_date'] =  $scope.toDateEpoch;
                    
                    if($scope.chart.type == 'pieChart') {
                        $scope.dayValuesProjectsByOrgId();
                    }else {
                        dayValuesByOrganization();                    
                    }
                }else if($scope.nodeType == 'project') {

                    $scope.projectDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.projectDataValues['to_date'] =  $scope.toDateEpoch;
                    
                    if($scope.chart.type == 'pieChart') {
                        $scope.daySpacesAvgByProjectId();
                    }else {
                        $scope.dayAvgValuesByProject();                    
                    }

                }else if($scope.nodeType == 'space') {

                    $scope.projectDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.projectDataValues['to_date'] =  $scope.toDateEpoch;

                    if($scope.chart.type == 'pieChart') {
                        // $scope.dayAvgDataourcesBySpaceId();
                        $scope.avgDataourcesBySpaceId();
                    }else {
                        $scope.dayAvgValuesByProject();                    
                    }
                }else if($scope.nodeType == 'datasource') {

                    $scope.projectDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.projectDataValues['to_date'] =  $scope.toDateEpoch;
                    
                    if($scope.chart.type != 'pieChart') {
                        $scope.dayAvgValuesByDatasource();
                    }
                }
            }else if($scope.resolution.type != null && $scope.resolution.type == 'hour') {
                if($scope.nodeType == 'organization') {
                    
                    $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.orgDataValues['to_date'] =  $scope.toDateEpoch;
                    
                    if($scope.chart.type == 'pieChart') {
                        $scope.hourValuesProjectsByOrgId();
                    }else {
                        hourValuesByOrganization();                    
                    }
                }else if($scope.nodeType == 'project') {

                    $scope.projectDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.projectDataValues['to_date'] =  $scope.toDateEpoch;
                    if($scope.chart.type == 'pieChart') {
                        $scope.hourSpacesAvgByProjectId();
                    }else {
                        $scope.hourAvgValuesByProject();
                    }

                }else if($scope.nodeType == 'space') {

                    $scope.projectDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.projectDataValues['to_date'] =  $scope.toDateEpoch;

                    if($scope.chart.type == 'pieChart') {
                        // $scope.hourAvgDataourcesBySpaceId();  
                        $scope.avgDataourcesBySpaceId();
                    }else {
                        $scope.hourAvgValuesByProject();
                    }
                }else if($scope.nodeType == 'datasource') {

                    if($scope.chart.type != 'pieChart') {
                        $scope.hourAvgValuesByDatasource();
                    }
                }
            }else if($scope.resolution.type != null && $scope.resolution.type == 'minute') {

                if($scope.nodeType == 'organization') {
                    
                    $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.orgDataValues['to_date'] =  $scope.toDateEpoch;
                    if($scope.chart.type == 'pieChart') {
                        $scope.minuteValuesProjectsByOrgId();
                    }else {
                        minuteValuesByOrganization();
                    }
                }else if($scope.nodeType == 'project') {

                    $scope.projectDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.projectDataValues['to_date'] =  $scope.toDateEpoch;
                    
                    if($scope.chart.type == 'pieChart') {
                        $scope.minuteSpacesAvgByProjectId();
                    }else {
                        $scope.minuteAvgValuesByProject();
                    }

                }else if($scope.nodeType == 'space') {
        
                    $scope.projectDataValues['from_date'] = $scope.fromDateEpoch;
                    $scope.projectDataValues['to_date'] =  $scope.toDateEpoch;
                    
                    if($scope.chart.type == 'pieChart') {
                        // $scope.minuteAvgDataourcesBySpaceId();
                        $scope.avgDataourcesBySpaceId();
                    }else {
                        $scope.minuteAvgValuesByProject();
                    }
                    minuteAvgValuesByProject();
                }else if($scope.nodeType == 'datasource') {

                    if($scope.chart.type != 'pieChart') {
                        $scope.minuteAvgValuesByDatasource();
                    }
                }      
            }
        }
    } 

    //on deselection of any data-node in tree, make assigned checked values of organization, project, spaces and datasource null
    $scope.checkedLabel = function(event) {

        $(document).ready(function(){

            //if value was checked, earlier, now make it null
              if($("#"+event.toElement.id).attr("chkVal") == 1){
                  $("#"+event.toElement.id).prop("checked", false);
                  $(".radioinstant").attr("chkVal",0);
                  if($scope.nodeType == 'organization') {
                    $scope.organizationCheckedId = null;
                  } 
                  if($scope.nodeType == 'project') {
                    $scope.projectCheckedId = null;
                  } 

                  if($scope.nodeType == 'space') {
                    if($scope.spacesSelected.length == 0 &&  $scope.nodeType == 'space') {
                        // $scope.nodeType = 'project';
                        $scope.projectIdOfSpace = null;
                        $scope.spaceCheckedId = null;
                    }
                  } 
                  if($scope.nodeType == 'datasource') {
                    $scope.datasourceCheckedId = null;
                  }
                    $scope.nodeType = null;

              }else{
                  $(".radioinstant").attr("chkVal",0);
                  $("#"+event.toElement.id).attr("chkVal",1);

                  if($scope.nodeType == 'space') {
                    if($scope.spacesSelected.length == 0 &&  $scope.nodeType == 'space') {
                        // $scope.nodeType = 'project';
                        $scope.projectIdOfSpace = null;
                        $scope.spaceCheckedId = null;
                    }
                  } 
              }
            //});
        });
    }

    var previousPoint = null, previousLabel = null;
 
    //tooltip function for hovering display in line chartwith date month year labels
    $.fn.UseTooltip = function () {
        $(this).bind("plothover", function (event, pos, item) {
            if (item) {
                if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                    previousPoint = item.dataIndex;
                    previousLabel = item.series.label;
                    $("#tooltip").remove();
     
                    var x = item.datapoint[0];
                    var y = item.datapoint[1];
     
                    var color = item.series.color;
                    var date =  new Date($scope.durations[x-1][1]);
                     
                    var unit = "";
     
                    
                    var templabel = date.getDate() + ' ' + $scope.monthsName[date.getMonth()] + ' ' + (date.getYear() + 1900);
                    showTooltip(item.pageX, item.pageY, color,
                        "<div style='font-size:13px;'>" + "<strong>" + templabel + "</strong>"  + " : <strong>" + y + "</strong> " + "</div>");
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    };

    //display tooltip
    function showTooltip(x, y, color, contents) {
        $('<div id="tooltip">' + contents + '</div>').css({
            position: 'absolute',
            display: 'none',
            top: y - 40,
            left: x - 120,
            border: '2px solid ' + color,
            padding: '3px',
            'font-size': '9px',
            'border-radius': '5px',
            'background-color': '#fff',
            'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
            opacity: 0.9
        }).appendTo("body").fadeIn(200);
    }
   
    //on clicking legend
    $scope.legendClicker = function (info) {
        alert("legend click / " + info);
      }

      //show tooltip
    $scope.showTooltips = function() {

        $(document).ready(function () {
            $(".js-flot-lines").UseTooltip();
        });
    }

    //display chart
    $scope.chartDisplay = function(durationData, duration) {

        $scope.durationValues = [];
        $scope.dataPieDataChart = [];
        durationDataLength = durationData.length;
        $scope.durations = [];
        var durationValuesLength = durationData.length;
        if($scope.chart != undefined) {
            if($scope.chart.type != "pieChart") {

                //format data array of response for chart type other than pieChart
                if(durationValuesLength > 0) { 
                for(var i=0; i<= durationValuesLength; i++) {

                    if(durationData[i] != undefined) {
                            $scope.durationValues.push([i+1, durationData[i].value]);
                            $scope.durations.push([i+1, durationData[i][duration]]);
                        }
                    }
                }

                //if chart type is line chart , initialize chart with settings
                if($scope.chart.type == 'lineChart') {
                    // if(durationValuesLength > 0) { 

                    var flotLines = jQuery('.js-flot-lines');
                    jQuery.plot(flotLines,
                        [
                            {
                                label: ($scope.dataSources.type).toUpperCase(),
                                data: $scope.durationValues, 
                                lines: {
                                    show: true,
                                    color: "#5c90d2",
                                    radius: 1,
                                    tilt: 0.5,
                                    clickable: true,
                                    label:{                        
                                        radius: 3/4,
                                        clickable: true,
                                        formatter: function (label, series) {
                                        return '<div ng-click="legendClicker(' + series.percent + ');" style="border:1px solid gray;font-size:8pt;text-align:center;padding:5px;color:white;">' + label + '<br/>' +   
                                        Math.round(series.percent) + '%</div>';
                                    }
                                },
                                    fillColor: {
                                        colors: [{opacity: .7}, {opacity: .7}]
                                    },
                                    color: "#5c90d2"
                                },
                                // yaxis: 2,
                                // color: "#5c90d2",
                                // xaxis: { 
                                //     color: "#5c90d2"
                                // } ,
                                // yaxis: { 
                                //     color: "#5c90d2"
                                // } ,
                                // points: { symbol: "triangle", fillColor: "#0062FF", show: true },
                                // lines: {show:true},
                                points: {
                                    show: true,
                                    radius: 6,
                                },
                                yaxis: {
                                    tickColor: '#ffffff',
                                    ticks: 3,
                                    color: "#a4c0e3",
                                },
                                xaxis: {
                                    ticks: $scope.durations, 
                                    tickColor: '#f5f5f5',
                                    color: "#a4c0e3",
                                }
                            },
                        ],
                        {
                            // colors: ['#abe37d', '#333333'],
                            legend: {
                                show: true,
                                position: 'nw',
                                backgroundOpacity: 0,
                            },
                            grid: {
                                backgroundColor: { colors: [ "#fff", "#eee" ] },
                                borderWidth: 0,
                                hoverable: true,
                                clickable: true
                            },
                            yaxis: {
                                tickColor: '#ffffff',
                                ticks: 3,
                                color: "#a4c0e3",
                            },
                            xaxis: {
                                ticks: $scope.durations, 
                                tickColor: '#f5f5f5',
                                color: "#a4c0e3",
                            }, 
                            xaxes:
                                [{
                                    color: "#a4c0e3"
                                }],
                                yaxes:
                                [{
                                    color: "#a4c0e3"
                                }
                            ],
                            colors: ["#5c90d2", "#5c90d2"]
                        });
                    // }
                    $scope.showTooltips();
                    $scope.loader = false;
                }
                    
                //if chart type is bar chart , initialize chart with settings
                if($scope.chart.type == 'barChart') {
                    // if(durationValuesLength > 0) { 
                    var flotBars = jQuery('.js-flot-bars');

                    jQuery.plot(flotBars,
                        [
                            {
                                label: $scope.dataSources.type.toUpperCase(),
                                data: $scope.durationValues, 
                                bars: {
                                    show: true,
                                    lineWidth: 0,
                                    barWidth: 0.35,
                                    fillColor: {
                                        colors: [{opacity: 1}, {opacity: 1}]
                                    }
                                }
                            },
                        ],
                        {
                            colors: ['rgb(47, 84, 132)', '#fadb7d'],
                            legend: {
                                show: true,
                                color: "#5c90d2",
                                position: 'nw',
                                backgroundOpacity: 0
                            },
                            grid: {
                                borderWidth: 0
                            },
                            yaxis: {
                                ticks: 3,
                                tickColor: '#f5f5f5',
                                color: "#5c90d2",
                            },
                            xaxis: {
                                ticks: $scope.durations,
                                tickColor: '#f5f5f5',
                                color: "#5c90d2",
                            },
                            xaxes:
                                [{
                                    color: "#a4c0e3"
                                }],
                                yaxes:
                                [{
                                    color: "#a4c0e3"
                                }
                            ],
                        });
                    // }
                    $scope.showTooltips();
                    $scope.loader = false;
                }
            }
            $scope.loader = false;

            //format data array of response for chart type pieChart and 
            if($scope.chart.type == 'pieChart') {
                $scope.dataPieDataChart = [];
                $scope.noPieData = true;

                if(durationValuesLength > 0) { 

                    for(var i=0; i<= durationValuesLength; i++) { 
                        if(durationData[i] != undefined) {
                            var obj = {label: "", data: ""};
                            if($scope.nodeType == 'space')  {
                                var obj1 = {label: "", data: ""};

                                if(durationData[i].average != null || durationData[i].average != undefined) {
                                    obj1.data = durationData[i].average;
                                } else {
                                    obj1.data = 0;
                                }
                                obj1.label = durationData[i].datasource_name;
                                $scope.dataPieDataChart.push(obj1);
                            }

                            if(durationData[i][0] != undefined && ($scope.nodeType == 'organization' || $scope.nodeType == 'project')) {

                                if($scope.nodeType == 'organization') {
                                    obj.data = durationData[i][0].value;
                                    obj.label = durationData[i].project_name;
                                } else if($scope.nodeType == 'project') {
                                    obj.data = durationData[i][0].value;
                                    obj.label = durationData[i].space_name;
                                } else if($scope.nodeType == 'space') {
                                    // obj.data = durationData[i].value;
                                    // obj.label = durationData[i][duration];
                                    // obj.data = durationData[i].average;
                                    // obj.label = durationData[i].datasource_name;
                                }  else if($scope.nodeType == 'datasource') {
                                    // obj.data = durationData[0].value;
                                    // obj.label = durationData[0][duration];
                                }  
                                // obj.data = durationData[i][0].value;
                                
                                $scope.dataPieDataChart.push(obj);
                            }
                            if($scope.nodeType == 'datasource') {
                                // obj.data = durationData[i].value;
                                // obj.label = durationData[i][duration];

                                // $scope.dataPieDataChart.push(obj);

                            }  
                            if(!durationData[i][0]  && ($scope.nodeType == 'organization' || $scope.nodeType == 'project')) {

                                if($scope.nodeType == 'organization') {
                                    obj.label = durationData[i].project_name;
                                } else if($scope.nodeType == 'project') {
                                    obj.label = durationData[i].space_name;
                                } else if($scope.nodeType == 'space') {

                                    // obj.data = durationData[i].average;
                                    obj.label = durationData[i].datasource_name;
                                    // obj.label = durationData[i][duration];
                                }                          
                                obj.data = 0;  //durationData[i][0].value
                                $scope.dataPieDataChart.push(obj);
                            }
                            var dataPieDataChartLength = $scope.dataPieDataChart.length
                            for(var i=0; i<dataPieDataChartLength; i++) {
                                if($scope.dataPieDataChart[i].data != 0) {
                                    $scope.noPieData = false;
                                }
                            }
                        } 
                    }
                }

                // initialize pie chart with settings
                var flotPie = jQuery('.js-flot-pie');
                // if($scope.dataPieDataChart.length > 0 ) {

                    jQuery.plot(flotPie,
                        $scope.dataPieDataChart,
                        {
                        colors: ['#fadb7d', '#75b0eb', '#abe37d'],
                        legend: {show: true},
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
                    });
                // }
                $scope.loader = false;
            }
        }
        $scope.loader = false;
    }
  
    $scope.avgByOrganization = function(){

        DataanalyticsService.avgByOrganization($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            $scope.average = response['average'];
        });
    } 

    $scope.minByOrganization = function(){

        DataanalyticsService.minByOrganization($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            $scope.minimum = response['min_value'];
        });
    } 
 
    $scope.maxByOrganization = function(){

        DataanalyticsService.maxByOrganization($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            $scope.maximum = response['max_value'];
        });
    } 
 
    $scope.countByOrganization = function(){

        DataanalyticsService.countByOrganization($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

        });
    } 
 
    function valuesByOrganization(organization){

        DataanalyticsService.valuesByOrganization($scope.organizationCheckedId, $scope.orgDataValues).then(function (response) {

            $scope.chartDisplay(response, null);

            // if($scope.chart.type == 'lineChart') {
            //     $scope.timelineChart(response, null);
            // } else if($scope.chart.type == 'chartDisplay') {

            // } else if($scope.chart.type == 'pieChart') {
                
            // }
        });
    } 
 
    function monthValuesByOrganization(organization){

        DataanalyticsService.monthValuesByOrganization($scope.organizationCheckedId, $scope.orgDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_month');
        });
    } 
 
    function dayValuesByOrganization(){

        DataanalyticsService.dayValuesByOrganization($scope.organizationCheckedId, $scope.orgDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_day');

        });
    } 
 
    function minuteValuesByOrganization(organization){

        DataanalyticsService.minuteValuesByOrganization($scope.organizationCheckedId, $scope.orgDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_minute');
        });
    } 
 
    function hourValuesByOrganization(){

        DataanalyticsService.hourValuesByOrganization($scope.organizationCheckedId, $scope.orgDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_hour');
        });
    } 

    $scope.avgBySpaceId = function(){

        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.avgBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            $scope.average = response['average'];
        });
    } 

    $scope.maxBySpaceId = function(){

        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.maxBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            $scope.maximum = response['max_value'];
        });
    } 

    $scope.minBySpaceId = function(){

        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.minBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            $scope.minimum = response['min_value'];
        });
    } 

    //convert selected date lo seconds epoch
    $scope.dateToEpoch = function(dateType) {

        if(dateType == 'fromDate') {
            $scope.fromDateEpoch = null;
        } else if(dateType == 'toDate') {
            $scope.toDateEpoch = null;
        }
        if($scope.fromDate && dateType == 'fromDate') {
            var epoch = moment($scope.fromDate).unix();
            $scope.fromDateEpoch = epoch;
        } 
        if($scope.toDate && dateType == 'toDate') {
            var epoch = moment($scope.toDate).unix();

            $scope.toDateEpoch = epoch;
        }
    }


    //get datasources for clicked space
    $scope.GetDatasourcesNodes = function(spaceId) {

        DataanalyticsService.GetDatasourcesNodes($scope.projectIdOfSpace).then(function (response) {

            $scope.dataSourcesValuesByProject = response['datasources'];
            var spacesLength = $scope.dataSourcesValuesByProject.length; // $scope.datasourcesValuesByProject.length;
            if(spacesLength == 0) {
                // $scope.dataSourcesOfSpace = [];
                $scope.spaceId = null;
            }
            if($scope.dataSourcesValuesByProject.length > 0) {
                $scope.dataSourcesOfSpace = [];

                for(i = 0; i< spacesLength; i++) {

                    if($scope.dataSourcesValuesByProject[i] != undefined) {

                        if(spaceId == $scope.dataSourcesValuesByProject[i].space_id) {
                            $scope.dataSourcesOfSpace.push($scope.dataSourcesValuesByProject[i]); 
                        }
                        $scope.loader = false;
                    }
                }
            }
        });
    }

    // assign datasource Id to clicked datasource
    $scope.DatasourceValues = function(datasource, nodeSelected, event) {

        $scope.displayRequest = false;
        $scope.datasourceCheckedId = datasource.id;
        $scope.nodeType = nodeSelected;
        $scope.selectedDatasource = datasource.name;
        $scope.checkedLabel(event);
    }

    $scope.avgByProject = function(){

        DataanalyticsService.avgByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {

            $scope.average = response['average'];
        });
    } 
 
    $scope.maxByProject = function(){

        DataanalyticsService.maxByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {

            $scope.maximum = response['max_value'];
        });
    } 
 
    $scope.minByProject = function(){

        DataanalyticsService.minByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {

            $scope.minimum = response['min_value'];
        });
    } 
 
    $scope.countByProject = function(project){

        DataanalyticsService.countByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {

        });
    } 
 
    $scope.monthAvgValuesByProject = function(){
        
        DataanalyticsService.monthAvgValuesByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_month');

        });
    } 
 
    $scope.dayAvgValuesByProject =  function (){
        
        DataanalyticsService.dayAvgValuesByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_day');

        });
    } 
 
    $scope.minuteAvgValuesByProject =  function (){
        
        DataanalyticsService.minuteAvgValuesByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_minute');

        });
    } 
 
   $scope.hourAvgValuesByProject =  function (){

        DataanalyticsService.hourAvgValuesByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_hour');
        });
    } 
 
    $scope.dayAvgValuesByDatasource = function(){

        var dataValues = {
            "from_date": $scope.fromDateEpoch,
            "to_date": $scope.toDateEpoch 
        }

        DataanalyticsService.dayAvgValuesByDatasource($scope.datasourceCheckedId, dataValues).then(function (response) {

            $scope.chartDisplay(response, 'date');
        });
    } 
 
     $scope.monthAvgValuesByDatasource = function(){

        var dataValues = {
            "from_date": $scope.fromDateEpoch,
            "to_date": $scope.toDateEpoch 
        }

        DataanalyticsService.monthAvgValuesByDatasource($scope.datasourceCheckedId, dataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_month');
        });
    } 
 
    $scope.minuteAvgValuesByDatasource = function (){

        var dataValues = {
            "from_date": $scope.fromDateEpoch,
            "to_date": $scope.toDateEpoch 
        }

        DataanalyticsService.minuteAvgValuesByDatasource($scope.datasourceCheckedId, dataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_minute');
        });
    } 
 
    $scope.hourAvgValuesByDatasource = function (){

        var dataValues = {
            "from_date": $scope.fromDateEpoch,
            "to_date": $scope.toDateEpoch 
        }

        DataanalyticsService.hourAvgValuesByDatasource($scope.datasourceCheckedId, dataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_hour');
        });
    } 
 
   $scope.projectsAvgByOrganizationId = function (){
        
        DataanalyticsService.projectsAvgByOrganizationId($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            // $scope.chartDisplay(response, null);
        });
    } 
 
   $scope.monthValuesProjectsByOrgId = function (){
        
        $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.orgDataValues['from_date'] = $scope.toDateEpoch;
        DataanalyticsService.monthValuesProjectsByOrgId($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_month');
        });
    } 
 
   $scope.dayValuesProjectsByOrgId = function (){
        
        $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.orgDataValues['from_date'] = $scope.toDateEpoch;
        DataanalyticsService.dayValuesProjectsByOrgId($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_day');
        });
    } 
 
   $scope.hourValuesProjectsByOrgId = function (){
        
        $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.orgDataValues['from_date'] = $scope.toDateEpoch;
        DataanalyticsService.hourValuesProjectsByOrgId($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_hour');
        });
    } 
    
   $scope.minuteValuesProjectsByOrgId = function (){
        
        $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.orgDataValues['from_date'] = $scope.toDateEpoch;
        DataanalyticsService.minuteValuesProjectsByOrgId($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_minute');
        });
    } 
 
   $scope.spacesAvgByProjectId = function (){
        
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.spacesAvgByProjectId($scope.projectCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            $scope.chartDisplay(response, null);
        });
    } 
 
   $scope.minuteSpacesAvgByProjectId = function (){
        
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.minuteSpacesAvgByProjectId($scope.projectCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_minute');
        });
    } 
 
   $scope.hourSpacesAvgByProjectId = function (){
        
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.hourSpacesAvgByProjectId($scope.projectCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_hour');
        });
    } 
 
   $scope.daySpacesAvgByProjectId = function (){
        

        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;

        DataanalyticsService.daySpacesAvgByProjectId($scope.projectCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_day');
        });
    } 

   $scope.monthSpacesAvgByProjectId = function (){
        
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.monthSpacesAvgByProjectId($scope.projectCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_month');
        });
    } 

   $scope.dayAvgDataourcesBySpaceId = function (){
        
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.dayAvgDataourcesBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_day');
        });
    }

    $scope.monthAvgDataourcesBySpaceId = function (){
         
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.monthAvgDataourcesBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {
    
            $scope.chartDisplay(response, 'date_month');
        });
    }

    $scope.hourAvgDataourcesBySpaceId = function (){
          
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.hourAvgDataourcesBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {
    
            $scope.chartDisplay(response, 'date_hour');
        });
    }

    $scope.minuteAvgDataourcesBySpaceId = function (){
           
       $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
       $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
       DataanalyticsService.minuteAvgDataourcesBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {
   
           $scope.chartDisplay(response, 'date_minute');
       });
    }

    $scope.avgDataourcesBySpaceId = function (){
           
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.avgDataourcesBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {
    
            //display chart according to time resolution type
            if($scope.resolution.type == 'month') {
                $scope.chartDisplay(response, 'date_month');

            } else if($scope.resolution.type == 'day') {
                $scope.chartDisplay(response, 'date_day');

            } else if($scope.resolution.type == 'minute') {
                $scope.chartDisplay(response, 'date_minute');

            } else if($scope.resolution.type == 'hour') {
                $scope.chartDisplay(response, 'date_hour');

            }
        });
    }
}]);

