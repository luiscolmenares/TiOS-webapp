// Components Treeview Controller
    
App.controller('CompAnalyticsTreeCtrl', ['$rootScope', '$scope', '$localStorage', '$window', '$http', 'urls', 'DataanalyticsService', function ($rootScope, $scope, $localStorage, $window, $http, urls, DataanalyticsService ) {

    $scope.fromDate = null;
    $scope.toDate = null;
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
    $scope.datasourceCheckedId;
    $scope.resolutions = '';
    $scope.organizationCheckedId = '';
    $scope.resolutionSelected = '';
    $scope.chart = {type: "lineChart"};
    $scope.dataSourcesType = '';
    $scope.expandedNode;
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
    $scope.spacesSelected = [];
    $scope.loader = false;
    $scope.noPieData = true;

    var initTreeViews = function () {

        var organizationsCount = ($scope.organizations).length;
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
                        format: 'DD/MM/YYYY'
                    }
                });
            }
        };
    });

    //get all organizations
    function getAllOrganizations() {
        return $http.get(urls.BASE_API + 'organizations').then(handleSuccess, handleError('Error getting all organizations'));
    }

    DataanalyticsService.getAllOrganizations().then(function (response) {
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

                                    if( $scope.allSpaces[count].datasources.length > 0) {

                                        var tempDatasources = $scope.allSpaces[count].datasources;
                                        var tempDatasourcesLength = tempDatasources.length;

                                        if($scope.datasources1.length > 0) {
                                            for(var j=0; j< $scope.datasources1.length; j++) {

                                                for(var tempCount = 0; tempCount < tempDatasourcesLength; tempCount++) {
                                                    if($scope.datasources1[j].id != tempDatasources[tempCount].id) {

                                                        $scope.datasources1.push(tempDatasources[tempCount]);
                                                        var ind = $scope.datasources1.indexOf(tempDatasources[tempCount]);
                                                        DataanalyticsService.dataSourcesValues(ind.id, null).then(function (response) {
                                                            // console.log("dtaasources data-----------", response)
                                                        });
                                                    }
                                                }
                                            }

                                            DataanalyticsService.dataSourcesValues($scope.datasources1[tempVal].id, null).then(function (response) {
                                                // console.log("dtaasources data-----------", response)
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

    function dataSourcesAvg(dataSourceId, dataValues) {

        DataanalyticsService.dataSourcesAvg(dataSourceId, dataValues).then(function (response) {
            // console.log(response);
        });
    }

    // function dataSourcesAvgByProject(){
    //     DataanalyticsService.dataSourcesAvgByProject(null, null).then(function (response) {

    //     });
    // } 

    // ****************************************//
    $scope.assignOrganizationId = function(organization, nodeSelected) {
        
        $scope.organizationCheckedId = organization.id;
        $scope.nodeType = nodeSelected;
    }

    $scope.assignProjectId = function(project, nodeSelected) {
       
        $scope.projectCheckedId = project.id;
        $scope.nodeType = nodeSelected;
    } 

    $scope.toggleSelection = function(space, event) {

        if(event.target.checked == true) {
            $scope.GetDatasourcesNodes(space.id);
            $scope.spacesSelected.push(space.id);
            $scope.projectDataValues.spaces = $scope.spacesSelected;
        }else if(event.target.checked == false) {
            var ind = $scope.spacesSelected.indexOf(space.id);
            $scope.spacesSelected.splice(ind, 1);
        }
    };

    $scope.assignSpaceId = function(space, nodeSelected) {

        $scope.spaceCheckedId = space.id;
        $scope.projectCheckedId = space.project_id;

        $scope.nodeType = nodeSelected;
        // if($scope.spacesSelected.length> 0) {
        //    var length = $scope.spacesSelected.length;
        // }
    }

    $scope.chartData = function(dataSourcesType, resolution) {
        $scope.loader = true;
        if($scope.chart.type == 'pieChart' && $scope.nodeType == 'datasource') {
            $scope.nodeType = 'space';
        }

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

        if((($scope.toDateEpoch - $scope.fromDateEpoch) <= 86400) && ($scope.resolution.type != "minute") && ($scope.resolution.type == "day" || $scope.resolution.type == "month")) {
            $scope.resolution.type = 'hour';
        } else  if(($scope.toDateEpoch - $scope.fromDateEpoch) > 2629743) {
            $scope.resolution.type = 'month';
        }  else  if((($scope.toDateEpoch - $scope.fromDateEpoch) < 2629743 && ($scope.toDateEpoch - $scope.fromDateEpoch) > 86400)) {
            $scope.resolution.type = 'day';
        } 

        $scope.displayRequest = true;

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
        if($scope.resolution.type != null && $scope.resolution.type == 'auto') {
        }else if($scope.resolution.type != null && $scope.resolution.type == 'month') {

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
        // else if($scope.resolution.type != null && $scope.resolution.type == 'fifteenMin') {

        //     // dayValuesByOrganization();
        // }else if($scope.resolution.type != null && $scope.resolution.type == 'thirtyMin') {
         
        // }
    }
    } 
 
    $scope.chartDisplay = function(durationData, duration) {

        $scope.durationValues = [];
        $scope.dataPieDataChart = [];
        durationDataLength = durationData.length;
        var durations = [];
        var durationValuesLength = durationData.length;
        if($scope.chart != undefined) {
            if($scope.chart.type != "pieChart") {
                if(durationValuesLength > 0) { 
                for(var i=0; i<= durationValuesLength; i++) {

                    if(durationData[i] != undefined) {
                            $scope.durationValues.push([i+1, durationData[i].value]);
                            durations.push([i+1, durationData[i][duration]]);
                        }
                    }
                }

                    if($scope.chart.type == 'lineChart') {
                        // if(durationValuesLength > 0) { 

                        var flotLines = jQuery('.js-flot-lines');
                        jQuery.plot(flotLines,
                            [
                                {
                                    label: 'Values',
                                    data: $scope.durationValues, 
                                    lines: {
                                        show: true,
                                        // fill: true,
                                        // fillColor: {
                                        //     colors: [{opacity: .7}, {opacity: .7}]
                                        // }
                                    },
                                    points: {
                                        show: true,
                                        radius: 6
                                    }
                                }
                            ],
                            {
                                colors: ['#abe37d', '#333333'],
                                legend: {
                                    show: true,
                                    position: 'nw',
                                    backgroundOpacity: 0
                                },
                                grid: {
                                    borderWidth: 0,
                                    hoverable: true,
                                    clickable: true
                                },
                                yaxis: {
                                    tickColor: '#ffffff',
                                    ticks: 3
                                },
                                xaxis: {
                                    ticks: durations, 
                                    tickColor: '#f5f5f5'
                                }
                            });
                        // }
                        $scope.loader = false;
                    }
                    
                    //bar chart
                    if($scope.chart.type == 'barChart') {
                        // if(durationValuesLength > 0) { 
                        var flotBars = jQuery('.js-flot-bars');

                        jQuery.plot(flotBars,
                            [
                                {
                                    label: 'Values',
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
                                    position: 'nw',
                                    backgroundOpacity: 0
                                },
                                grid: {
                                    borderWidth: 0
                                },
                                yaxis: {
                                    ticks: 3,
                                    tickColor: '#f5f5f5'
                                },
                                xaxis: {
                                    ticks: durations,
                                    tickColor: '#f5f5f5'
                                }
                            });
                        // }
                        $scope.loader = false;
                    }
                }
                $scope.loader = false;

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

                    var flotPie = jQuery('.js-flot-pie');
                    // if($scope.dataPieDataChart.length > 0 ) {

                        jQuery.plot(flotPie,
                            $scope.dataPieDataChart,
                            {
                            colors: ['#fadb7d', '#75b0eb', '#abe37d'],
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
                        });
                    // }
                $scope.loader = false;
            }
        }
        $scope.loader = false;
    }
  
    function minByOrganization(organization){

        var dataValues = {
            "datasource_type": "Monitor: Apparent power (KVA)",
            "from_date": "1573698405",
            "to_date": "1576778605"
        }

        DataanalyticsService.minByOrganization(organization.id, dataValues).then(function (response) {

            // console.log("-----------minByOrganization---------------", response);
        });
    } 
 
    function maxByOrganization(organization){

        var dataValues = {
            "datasource_type": "Monitor: Apparent power (KVA)",
            "from_date": "1573698405",
            "to_date": "1576778605"
        }

        DataanalyticsService.maxByOrganization(organization.id, dataValues).then(function (response) {

            // console.log("-----------maxByOrganization---------------", response);
        });
    } 
 
    function countByOrganization(organization){

        // var dataValues = {
        //     "datasource_type": "Monitor: Apparent power (KVA)",
        //     "from_date": "1573698405",
        //     "to_date": "1576778605"
        // }

        DataanalyticsService.countByOrganization(organization.id, dataValues).then(function (response) {

            // console.log("-----------countByOrganization---------------", response);
        });
    } 
 
    function valuesByOrganization(organization){

        // var dataValues = {
        //     "datasource_type": "Monitor: Apparent power (KVA)",
        //     "from_date": "1573698405",
        //     "to_date": "1576778605"
        // }

        DataanalyticsService.valuesByOrganization($scope.organizationCheckedId, $scope.orgDataValues).then(function (response) {

            // console.log("-----------valuesByOrganization---------------", response);
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

            // console.log("-----------monthValuesByOrganization---------------", response);
            $scope.chartDisplay(response, 'date_month');
        });
    } 
 
    function dayValuesByOrganization(){

        DataanalyticsService.dayValuesByOrganization($scope.organizationCheckedId, $scope.orgDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_day');

        });
    } 
 
    function minuteValuesByOrganization(organization){

        var dataValues = {
            "datasource_type": "Monitor: Apparent power (KVA)",
            "from_date": $scope.fromDateEpoch,
            "to_date": $scope.toDateEpoch 
        }

        DataanalyticsService.minuteValuesByOrganization($scope.organizationCheckedId, $scope.orgDataValues).then(function (response) {

            // console.log("-----------minuteValuesByOrganization---------------", response);
            $scope.chartDisplay(response, 'date_minute');
        });
    } 
 
    function hourValuesByOrganization(){

        DataanalyticsService.hourValuesByOrganization($scope.organizationCheckedId, $scope.orgDataValues).then(function (response) {

            $scope.chartDisplay(response, 'date_hour');
        });
    } 

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

    $scope.GetDatasourcesNodes = function(spaceId) {
        DataanalyticsService.GetDatasourcesNodes($scope.projectCheckedId).then(function (response) {

            $scope.dataSourcesValuesByProject = response['datasources'];
            var spacesLength = $scope.dataSourcesValuesByProject.length; // $scope.datasourcesValuesByProject.length;
            $scope.dataSourcesOfSpace = [];
            if(spacesLength == 0) {
                $scope.dataSourcesOfSpace = [];
                $scope.spaceId = null;
            }
            if($scope.dataSourcesValuesByProject.length > 0) {

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

    $scope.DatasourceValues = function(datasource, nodeSelected) {

        $scope.datasourceCheckedId = datasource.id;
        $scope.nodeType = nodeSelected;
    }

    function avgByProject(project){

        var dataValues = {
            "datasource_type": "Monitor: Apparent power (KVA)",
            "from_date": "1573698405", 
            "to_date": "1576778605", 
            "spaces": [25] 
        }

        DataanalyticsService.avgByProject(project.id, dataValues).then(function (response) {

            // console.log("-----------avgByProject---------------", response);
        });
    } 
 
    function maxByProject(project){

        var dataValues = {
            "datasource_type": "Monitor: Apparent power (KVA)",
            "from_date": "1573698405", 
            "to_date": "1576778605", 
            "spaces": [25] 
        }
        
        DataanalyticsService.maxByProject(project.id, dataValues).then(function (response) {

            // console.log("-----------maxByProject---------------", response);
        });
    } 
 
    function minByProject(project){

        var dataValues = {
            "datasource_type": "Monitor: Apparent power (KVA)",
            "from_date": "1573698405", 
            "to_date": "1576778605", 
            "spaces": [25] 
        }
        
        DataanalyticsService.minByProject(project.id, dataValues).then(function (response) {

            // console.log("-----------minByProject---------------", response);
        });
    } 
 
    function countByProject(project){

        var dataValues = {
            "datasource_type": "Monitor: Apparent power (KVA)",
            "from_date": "1573698405", 
            "to_date": "1576778605", 
            "spaces": [25] 
        }
        
        DataanalyticsService.countByProject(project.id, dataValues).then(function (response) {

            // console.log("-----------countByProject---------------", response);
        });
    } 
 
    $scope.monthAvgValuesByProject = function(){
        
        DataanalyticsService.monthAvgValuesByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {

            // console.log("-----------monthAvgValuesByProject---------------", response);
            $scope.chartDisplay(response, 'date_month');

        });
    } 
 
    $scope.dayAvgValuesByProject =  function (){
        
        DataanalyticsService.dayAvgValuesByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {

            // console.log("-----------dayAvgValuesByProject---------------", response);
            $scope.chartDisplay(response, 'date_day');

        });
    } 
 
    $scope.minuteAvgValuesByProject =  function (){
        
        DataanalyticsService.minuteAvgValuesByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {

            // console.log("-----------minuteAvgValuesByProject---------------", response);
            $scope.chartDisplay(response, 'date_minute');

        });
    } 
 
   $scope.hourAvgValuesByProject =  function (){

        DataanalyticsService.hourAvgValuesByProject($scope.projectCheckedId, $scope.projectDataValues).then(function (response) {

            // console.log("-----------hourAvgValuesByProject---------------", response);
            $scope.chartDisplay(response, 'date_hour');
        });
    } 
 
    $scope.dayAvgValuesByDatasource = function(){

        var dataValues = {
            "from_date": $scope.fromDateEpoch,
            "to_date": $scope.toDateEpoch 
        }

        DataanalyticsService.dayAvgValuesByDatasource($scope.datasourceCheckedId, dataValues).then(function (response) {

            // console.log("-----------dayAvgValuesByDatasource---------------", response);
            $scope.chartDisplay(response, 'date');
        });
    } 
 
     $scope.monthAvgValuesByDatasource = function(){

        var dataValues = {
            "from_date": $scope.fromDateEpoch,
            "to_date": $scope.toDateEpoch 
        }

        DataanalyticsService.monthAvgValuesByDatasource($scope.datasourceCheckedId, dataValues).then(function (response) {

            // console.log("-----------monthAvgValuesByDatasource---------------", response);
            $scope.chartDisplay(response, 'date_month');
        });
    } 
 
    $scope.minuteAvgValuesByDatasource = function (){

        var dataValues = {
            "from_date": $scope.fromDateEpoch,
            "to_date": $scope.toDateEpoch 
        }

        DataanalyticsService.minuteAvgValuesByDatasource($scope.datasourceCheckedId, dataValues).then(function (response) {

            // console.log("-----------minuteAvgValuesByDatasource---------------", response);
            $scope.chartDisplay(response, 'date_minute');
        });
    } 
 
    $scope.hourAvgValuesByDatasource = function (){

        var dataValues = {
            "from_date": $scope.fromDateEpoch,
            "to_date": $scope.toDateEpoch 
        }

        DataanalyticsService.hourAvgValuesByDatasource($scope.datasourceCheckedId, dataValues).then(function (response) {

            // console.log("-----------hourAvgValuesByDatasource---------------", response);
            $scope.chartDisplay(response, 'date_hour');
        });
    } 
 
   $scope.projectsAvgByOrganizationId = function (){
        
        $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.orgDataValues['from_date'] = $scope.toDateEpoch;
        DataanalyticsService.projectsAvgByOrganizationId($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            // console.log("-----------response---------------", response);
            $scope.chartDisplay(response, null);
        });
    } 
 
   $scope.monthValuesProjectsByOrgId = function (){
        
        $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.orgDataValues['from_date'] = $scope.toDateEpoch;
        DataanalyticsService.monthValuesProjectsByOrgId($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            // console.log("-----------response---------------", response);
            $scope.chartDisplay(response, 'date_month');
        });
    } 
 
   $scope.dayValuesProjectsByOrgId = function (){
        
        $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.orgDataValues['from_date'] = $scope.toDateEpoch;
        DataanalyticsService.dayValuesProjectsByOrgId($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            // console.log("-----------response---------------", response);
            $scope.chartDisplay(response, 'date_day');
        });
    } 
 
   $scope.hourValuesProjectsByOrgId = function (){
        
        $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.orgDataValues['from_date'] = $scope.toDateEpoch;
        DataanalyticsService.hourValuesProjectsByOrgId($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            // console.log("-----------response---------------", response);
            $scope.chartDisplay(response, 'date_hour');
        });
    } 
    
   $scope.minuteValuesProjectsByOrgId = function (){
        
        $scope.orgDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.orgDataValues['from_date'] = $scope.toDateEpoch;
        DataanalyticsService.minuteValuesProjectsByOrgId($scope.organizationCheckedId,  $scope.orgDataValues).then(function (response) {

            // console.log("-----------response---------------", response);
            $scope.chartDisplay(response, 'date_minute');
        });
    } 
 
   $scope.spacesAvgByProjectId = function (){
        
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.spacesAvgByProjectId($scope.projectCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            // console.log("-----------response---------------", response);
            $scope.chartDisplay(response, null);
        });
    } 
 
   $scope.minuteSpacesAvgByProjectId = function (){
        
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.minuteSpacesAvgByProjectId($scope.projectCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            // console.log("-----------response---------------", response);
            $scope.chartDisplay(response, 'date_minute');
        });
    } 
 
   $scope.hourSpacesAvgByProjectId = function (){
        
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.hourSpacesAvgByProjectId($scope.projectCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            // console.log("-----------response---------------", response);
            $scope.chartDisplay(response, 'date_hour');
        });
    } 
 
   $scope.daySpacesAvgByProjectId = function (){
        
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.daySpacesAvgByProjectId($scope.projectCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            // console.log("-----------response---------------", response);
            $scope.chartDisplay(response, 'date_day');
        });
    } 

   $scope.monthSpacesAvgByProjectId = function (){
        
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.monthSpacesAvgByProjectId($scope.projectCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            // console.log("-----------response---------------", response);
            $scope.chartDisplay(response, 'date_month');
        });
    } 

   $scope.dayAvgDataourcesBySpaceId = function (){
        
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.dayAvgDataourcesBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {

            // console.log("-----------response---------------", response);
            $scope.chartDisplay(response, 'date_day');
        });
    }

    $scope.monthAvgDataourcesBySpaceId = function (){
         
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.monthAvgDataourcesBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {
    
            //  console.log("-----------response---------------", response);
            $scope.chartDisplay(response, 'date_month');
        });
    }

    $scope.hourAvgDataourcesBySpaceId = function (){
          
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.hourAvgDataourcesBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {
    
            //   console.log("-----------response---------------", response);
            $scope.chartDisplay(response, 'date_hour');
        });
    }

    $scope.minuteAvgDataourcesBySpaceId = function (){
           
       $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
       $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
       DataanalyticsService.minuteAvgDataourcesBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {
   
        //    console.log("-----------response---------------", response);
           $scope.chartDisplay(response, 'date_minute');
       });
    }

    $scope.avgDataourcesBySpaceId = function (){
           
        $scope.spacesByProjectDataValues['from_date'] = $scope.fromDateEpoch;
        $scope.spacesByProjectDataValues['to_date'] = $scope.toDateEpoch;
        DataanalyticsService.avgDataourcesBySpaceId($scope.spaceCheckedId,  $scope.spacesByProjectDataValues).then(function (response) {
    
            // console.log("-----------response---------------", response);
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

