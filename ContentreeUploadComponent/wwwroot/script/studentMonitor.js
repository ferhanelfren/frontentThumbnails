
var app = angular.module("app-student-monitor", ['ngSanitize', 'ngAnimate', 'ngTouch', 'ngFileUpload', 'jkuri.datepicker', 'angularUtils.directives.dirPagination']);

app.controller("studentMonitorController", function ($scope, $http, $timeout, $window, $filter, dateFilter)
{
    var vm = this;

    vm.searchStudent;
    vm.searchLocation;

    //$filter('record', function () {
    //    return function (array, property, target) {
    //        if (target && property) {
    //            target[property] = array;
    //        }
    //        return array;
    //    }

    //});


    vm.selecteduserLog;

    vm.CloseFlashMessage = true;

    ///////////////////////
    /// Settings/branch
    vm.showSettings = false;

    vm.isScannerMode = false;

    vm.showImport = false;
    vm.showImportTable = false;


    vm.locations = [];
    vm.location = {};


    vm.claims;
    vm.isAdmin = false;

    vm.users = [];
    vm.users2 = [];
    /*vm.user = {};*/
    vm.user = {};

    vm.qrc;


    ////////ALERT MESSAGES//////////

    vm.messageSuccess = false;


    //SUCCESSFULLY DELETE
    vm.messageDelete = false;
    vm.messageDelete1 = false;
    vm.messageDelete2 = false;


    //ERROR IN TABLE
    vm.errorShowTable = false;
    vm.errorShowTable1 = false;
    vm.errorShowTabl2 = false;

    //ERROR IN DELETE
    vm.errorDelete = false;
    vm.errorDelete1 = false;
    vm.errorDelete2 = false;

    //ERROR IN SAVE/EDIT
    vm.errorShow1 = false;
    vm.errorShow2 = false;
    vm.errorShow3 = false;


    vm.closeMessage = function () {
        vm.messageSuccess = false;


        vm.messageDelete = false;
        vm.messageDelete1 = false;
        vm.messageDelete2 = false;

        vm.errorShow = false;
        vm.errorShow1 = false;
        vm.errorShow2 = false;
        vm.errorShow3 = false;

        vm.errorDelete = false;
        vm.errorDelete1 = false;
        vm.errorDelete2 = false;

        vm.errorShowTable = false;
        vm.errorShowTable1 = false;
        vm.errorShowTabl2 = false;
    }












    //////////////MODIFIED NAVIGATION TAB///////////////////

    vm.showDasboardPanel = true;
    vm.showStudentPanel = false;
    vm.showLocationPanel = false;
    vm.showUserPanel = false;

    vm.activeDasboardPanel = true;
    vm.activeTabStudentPanel = false;
    vm.activeTabLocationPanel = false;
    vm.activeUserPanel = false;

    vm.ToggleDashboardPanel;
    vm.ToggleStudentPanel;
    vm.ToggleLocationPanel;
    vm.ToggleUserPanel;


    vm.ToggleDashboardPanel = function () {
        vm.showDasboardPanel = true;
        vm.showStudentPanel = false;
        vm.showLocationPanel = false;
        vm.showUserPanel = false;

        vm.activeDasboardPanel = true;
        vm.activeTabStudentPanel = false;
        vm.activeTabLocationPanel = false;
        vm.activeUserPanel = false;
    }


    vm.ToggleStudentPanel = function () {
        vm.showDasboardPanel = false;
        vm.showStudentPanel = true;
        vm.showLocationPanel = false;
        vm.showUserPanel = false;

        vm.activeDasboardPanel = false;
        vm.activeTabStudentPanel = true;
        vm.activeTabLocationPanel = false;
        vm.activeUserPanel = false;
    }

    vm.ToggleLocationPanel = function () {
        vm.showDasboardPanel = false;
        vm.showStudentPanel = false;
        vm.showLocationPanel = true;
        vm.showUserPanel = false;

        vm.activeDasboardPanel = false;
        vm.activeTabStudentPanel = false;
        vm.activeTabLocationPanel = true;
        vm.activeUserPanel = false;
    }

    vm.ToggleUserPanel = function () {
        vm.showDasboardPanel = false;
        vm.showStudentPanel = false;
        vm.showLocationPanel = false;
        vm.showUserPanel = true;

        vm.activeDasboardPanel = false;
        vm.activeTabStudentPanel = false;
        vm.activeTabLocationPanel = false;
        vm.activeUserPanel = true;
    }

    /////////////ENDS HERE////////////////////////////////
    vm.showUserPanel = false;
    vm.showUsersPanel = false;
    vm.showUserSettingsPanel = false;


    vm.lastuserLogName = "";
    vm.initialRun = true;


    //////////////////////////
    // Student
    vm.students = [];
    vm.student = {};
    vm.selectedStudent = {};
    vm.isStudentClick = false;

    vm.studentModal;

    vm.studentsForUpload = [];

    vm.logStudentEntries = [];



    vm.resultData = "";

    // vm.selecteduserLogData;
    vm.dateNow = new Date();

    vm.sortResult = '-lastName';
    vm.reverse = false;

    vm.isBusy = false;


    //Contact Tracing

    vm.covidResponse = {};
    vm.covidResponses = [];



    $scope.SelectFile = function (file) {
        $scope.SelectedFile = file;
    };

    $scope.Upload = function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (regex.test($scope.SelectedFile.name.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var studentsData = new Array();
                    var rows = e.target.result.split("\r\n");
                    for (var i = 0; i < rows.length; i++) {
                        var cells = rows[i].split(",");
                        if (cells.length > 1) {
                            var studentData = {};
                            studentData.id = cells[0];
                            studentData.guid = cells[1];
                            studentData.firstName = cells[2];
                            studentData.lastName = cells[3];
                            studentData.middleName = cells[4];
                            studentData.fathersName = cells[5];
                            studentData.mothersName = cells[6];
                            studentData.sex = cells[7];
                            studentData.address = cells[8];
                            studentData.city = cells[9];
                            studentData.province = cells[10];
                            studentData.birthDate = cells[11];
                            studentData.course = cells[12];
                            studentData.email = cells[13];
                            studentData.emailNotification = cells[14];
                            studentData.mobileNumber = cells[15];
                            studentData.smsNotification = cells[16];


                            studentsData.push(studentData);
                            $scope.$apply(function () {
                                $scope.studentsForUpload = studentsData;
                                vm.studentsForUpload = studentsData;
                                $scope.IsVisible = true;
                            });
                        }
                    }

                }
                reader.readAsText($scope.SelectedFile);
            } else {
                $window.alert("This browser does not support HTML5.");
            }
        } else {
            $window.alert("Please upload a valid CSV file.");
        }
    }




    //this is used to parse base64

    vm.decodeJWTTokenClaims = function (str) {
        if (str) {
            var tokensEncoded = str.split(".");

            if (tokensEncoded && tokensEncoded.length > 1) {

                var decodedValueAsObject = JSON.parse(atob(tokensEncoded[1]));
                return decodedValueAsObject;
            }
        }
        return null;

    }

    vm.redirectToLogin = function () {
        window.location.href = "/app/Login";
    }

    vm.getTokenIfAuthorized = function () {
        var currentToken = localStorage.getItem('auth');
        var tokenExpiry = localStorage.getItem('expiry');

        var tokenExpiryAsDate = new Date(tokenExpiry);
        var currentDate = new Date();
        if (currentToken && tokenExpiry) {
            if (currentDate < tokenExpiryAsDate) {
                return currentToken;
            }
        }

        vm.redirectToLogin();

    }

    vm.getQueryStringValue = function (key) {
        return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }



    ////////////////////////////////////////////////////////
    /// LOCATION
    ////////////////////////////////////////////////////////

    vm.addlocationClick = function () {
        vm.location = {};
    }

    vm.getLocations = function () {
        vm.isBusy = false;
        var apiUrl = "/Api/Data/GetLocations";

        $http({
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl

        }).then(function successCallback(response) {

            vm.locations = response.data;


        }, function errorCallback(response) {

            // alert("Error. Try Again!");
            console.log("Error on Load Locations", response);
            vm.errorShowTable1 = true;

        });
    }

    vm.getLocation = function (id) {
        vm.isBusy = true;
        var apiUrl = "/Api/Data/GetLocation?id=" + id;


        $http({
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl
        })

            .then(function (response) {
                if (response.data) {
                    vm.location = response.data;
                }

            }, function (err) {
                //failure
                console.log(err);
                // alert("fail");
                vm.errorMessage = "Failed to get location";
                vm.errorShowTable1 = true;
                vm.successMessage = null;
            }).finally(function () {
                vm.isBusy = false;
            });
    }

    vm.saveLocation = function (location) {

        console.log(location);
        var apiUrl = "/api/Data/AddLocation";
        vm.isBusy = true;
        $http({
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl,
            data: location
        })
            .then(function (response) {

                if (response) {
                    //    console.log("Response", response);
                    vm.getLocations();

                    if (response.data) {
                        //        console.log("response data", response.data);
                        /*vm.showResultData(response.data);*/
                        vm.messageSuccess = true;
                        vm.showUserPanel = false;
                        vm.showUserSettingsPanel = false;
                    }
                }

            }, function (err) {
                console.log(err);
                //alert("fail");
                //failure
                vm.errorMessage = "Failed to add/edit Location";
                vm.errorShow2 = true;
                vm.successMessage = null;
            }).finally(function () {
                vm.isBusy = false;
            });

    }

    vm.deleteLocation = function (locationId) {

        var apiUrl = "Api/Data/deleteLocation/?id=" + locationId;
        vm.isBusy = true;
        $http({
            method: 'delete',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl,
        })
            .then(function (response) {

                if (response) {
                    console.log("response", response);
                    if (response.data) {

                        /*vm.resultData = "Succesfully Deleted";*/
                        vm.messageDelete = true;
                        vm.getLocations();
                    }
                }

            }, function (err) {
                console.log(err);

                vm.errorMessage = "Failed to delete Location";
                vm.errorDelete1 = true;

            }).finally(function () {
                vm.isBusy = false;
            });
    }



    ////////////////////////////////////////////////////
    // END OF LOCATION
    /////////////////////////////////////////////////////




    ///////////////////////////////////////
    /// USER LOGS HERE

    vm.logClick = function (entry) {
        console.log(entry);
        var url = "https://" + $window.location.host + "/app/trace?id=" + entry.id;
        console.log(url);
        $window.location.href = url;
    }



    ///////////////////////////////////////////////////
    // END OF USERS LOG



    ///////////////////////////////////////////////////
    //// USERS HERE

    vm.getUsers = function () {
        vm.isBusy = true;
        var apiUrl = "/api/Account/GetUsers";

        $http({
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl
        }).then(function successCallback(response)
            {
            vm.users = response.data;
            console.log("users", vm.users);
            }, function errorCallback(response)
            {

                // alert("Error. Try Again!");
                console.log("Error on Load Users", response);
                vm.errorShowTable2 = true;
            });
    }

    vm.saveUser = function (user) {

        var apiUrl = "/api/Account/AddOrEditUser";
        vm.isBusy = true;
        $http({
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl,
            data: vm.user
        })
            .then(function (response) {

                if (response) {


                    if (response.data) {

                        /*vm.showResultData(response.data);*/
                        vm.messageSuccess = true;
                        vm.getUsers();
                        //vm.showUserPanel = false;
                        //vm.showUserSettingsPanel = false;
                    }
                }

            }, function (err) {
                console.log(err);
                alert("fail");
                //failure
                vm.errorMessage = "Failed to add/edit user";
                vm.errorShow3 = true;
                vm.successMessage = null;
            }).finally(function () {
                vm.isBusy = false;
            });
    }

    vm.saveNewUser = function () {
        var apiUrl = "/api/Account/AddOrEditUser";
        vm.isBusy = true;
        $http({
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl,
            data: vm.user
        })
            .then(function (response) {

                if (response) {
                    //    console.log("Response", response);

                    if (response.data) {
                        //        console.log("response data", response.data);
                        /*vm.showResultData(response.data);*/
                        vm.getUsers();
                        vm.messageSuccess = true;
                        vm.showUserPanel = false;
                    }
                }

            }, function (err) {
                console.log(err);
                alert("fail");
                //failure
                vm.errorMessage = "Failed to add/edit user";
                vm.errorShow3 = true;
                vm.successMessage = null;
            }).finally(function () {
                vm.isBusy = false;
            });
    }

    vm.saveForOrdinaryUser = function (user) {
        var apiUrl = "/api/Account/AddOrEditUser";
        vm.isBusy = true;
        $http({
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl,
            data: vm.user
        })
            .then(function (response) {

                if (response) {
                    //    console.log("Response", response);

                    if (response.data) {
                        //        console.log("response data", response.data);
                        /*vm.showResultData(response.data);*/
                        vm.messageSuccess = true;
                        vm.getUsers();
                        vm.showUserPanel = false;
                        vm.showUserSettingsPanel = false;
                    }
                }

            }, function (err) {
                console.log(err);
                alert("fail");
                //failure
                vm.errorMessage = "Failed to add/edit user";
                vm.errorShow3 = true;
                vm.successMessage = null;
            }).finally(function () {
                vm.isBusy = false;
            });
    }


    vm.deleteUser = function (user) {

        var apiUrl = "/api/Account/DeleteUser?user=" + user.userName;
        vm.isBusy = true;
        $http({
            method: 'delete',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl,
            data: vm.user
        })
            .then(function (response) {

                if (response) {
                    //            console.log("response", response);
                    if (response.data) {

                        //vm.resultData = "Succesfully Deleted";
                        //var x = document.getElementById("snackbarinfo");
                        //x.className = "show";
                        //setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
                        vm.messageDelete = true;
                        vm.getUsers();
                        vm.showUserPanel = false;
                    }
                }

            }, function (err) {
                console.log(err);
                alert("fail");
                //failure
                vm.errorMessage = "Failed to add/edit user";
                vm.errorDelete2 = true;
                vm.successMessage = null;
            }).finally(function () {
                vm.isBusy = false;
            });
    }


    vm.checkIfScannerAndLocation = function (guid) {
        vm.isBusy = false;
        var apiUrl = "/api/Account/CheckIfScannerAndLocation?id=" + id;

        $http({
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl

        }).then(function successCallback(response) {

            var data = response.data;
            if (data.isScanner) {
                localStorage.removeItem('locId');
                localStorage.setItem('locId', data.locationId);
                window.location.href = "/RfScan";
            }


        }, function errorCallback(response) {

            // alert("Error. Try Again!");
            console.log("Error on Load Locations", response);

        });
    }

    ///////////////////////////////////////////////////////////////
    ///// END OF USERS HERE



    ////////////////////////////////////////////////////////////////
    // STUDENTS HERE

    vm.newStudentClick = function () {
        vm.student = {};
    }

    vm.saveStudent = function (student) {
        console.log(student);

        //var d = new Date(student.birthDate);
        //d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
        //student.birthDate = d;

        //console.log(d);

        var apiUrl = "/api/Data/AddStudent";
        vm.isBusy = true;
        $http({
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl,
            data: student
        })
            .then(function (response) {

                if (response) {
                    //    console.log("Response", response);

                    if (response.data) {
                        //        console.log("response data", response.data);
                        /*vm.showResultData(response.data);*/
                        vm.showUserPanel = false;
                        vm.showUserSettingsPanel = false
                        vm.getStudents();
                        vm.messageSuccess = true;
                    }
                }

            }, function (err) {
                console.log(err);
                alert("fail");
                //failure
                vm.errorMessage = "Failed to add/edit Student";
                vm.errorShow1 = true;
                vm.successMessage = null;
            }).finally(function () {
                vm.isBusy = false;
            });
    }

    vm.getStudents = function () {
        vm.isBusy = true;
        var apiUrl = "/Api/Data/GetStudents";

        $http({
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl
        })

            .then(function (response) {
                vm.errorMessage = null;
                vm.successMessage = "Success";

                vm.students = response.data;

            }, function (err) {
                //failure
                console.log(err);
                vm.LoadingErro = function () {

                    console.log(err);
                    
                }

                //  alert("fail");
                vm.errorMessage = "Failed to get students";
                vm.errorShowTable = true;
                vm.errorShowTabl1 = true;
                if (err) {
                    vm.errorShow = true;
                    vm.LoadingErro = function () {

                        console.log(err);
                        
                    }
                }
                vm.successMessage = null;
            }).finally(function () {
                vm.isBusy = false;
            });
    }

    vm.studentSelectClick = function (student) {
      
        vm.selectedStudent = student;
        console.log(student);
        vm.getStudentLogs(student.lrn);
        vm.editStudentClick();

        //for contact tracing
        vm.getStudentPositiveEntries(student.id);
    }

    vm.editStudentClick = function () {   
        vm.student = vm.selectedStudent;
        vm.qrc = {};
        document.getElementById('qrcode').innerHTML = '';
        vm.qrc = new QRCode(document.getElementById("qrcode"), vm.student.lrn);
        console.log("vm.qrc", vm.qrc);
        vm.student.birthdate = new Date(vm.selectedStudent.birthdate);
        vm.isStudentClick = true;
    }

    vm.deleteStudents = function (studentId) {

        var apiUrl = "Api/Data/DeleteStudent/?id=" + studentId;
        vm.isBusy = true;
        $http({
            method: 'delete',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl,
        })
            .then(function (response) {

                if (response) {
                    console.log("response", response);
                    if (response.data) {

                        /*vm.resultData = "Succesfully Deleted";*/
                        vm.messageDelete = true;
                        vm.getStudents();
                    }
                }

            }, function (err) {
                console.log(err);
                vm.errorDelete = true;
                vm.errorMessage = "Failed to delete Student";


            }).finally(function () {
                vm.isBusy = false;
            });
    }



    //vm.deleteStudents = function (studentsId) {

    //    var apiUrl = "Api/Data/deleteStudents/?id=" + studentsId;
    //    vm.isBusy = true;
    //    $http({
    //        method: 'delete',
    //        headers: {
    //            "Content-Type": "application/json",
    //            "Authorization": "Bearer " + vm.getTokenIfAuthorized()
    //        },
    //        url: apiUrl,
    //    })
    //        .then(function (response) {

    //            if (response) {
    //                console.log("response", response);
    //                if (response.data) {

    //                    vm.resultData = "Succesfully Deleted";
    //                    vm.getLocations();
    //                }
    //            }

    //        }, function (err) {
    //            console.log(err);

    //            vm.errorMessage = "Failed to delete Location";

    //        }).finally(function () {
    //            vm.isBusy = false;
    //        });
    //}


   // END OF STUDENTS
    ////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////
    // LOG ENTRIES

    vm.getStudentLogs = function (student) {

        var lrn = student.lrn;
        vm.isBusy = true;
        var apiUrl = "/Api/Data/GetLogEntriesByStudentLrn?lrn=" + lrn;


        $http({
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl
        })

            .then(function (response) {
                if (response.data) {
                    vm.logStudentEntries = response.data;
                    console.log("log entries", vm.logStudentEntries);
                    
                }

            }, function (err) {
                //failure
                console.log(err);
                // alert("fail");
                vm.errorMessage = "Failed to get Logs";
                vm.successMessage = null;
            }).finally(function () {
                vm.isBusy = false;
            });
    }
    // END OF LOG ENTRIES
    ////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////
    // CONTACT TRACING

    vm.contactTracingClick = function () {
        console.log(vm.selectedStudent);
        if (vm.selectedStudent.id > 0) {
            vm.covidResponse = {};
            vm.covidResponse.studentId = vm.selectedStudent.id;
            vm.covidResponse.studentGuid = vm.selectedStudent.guid;
            vm.covidResponse.isPositive = true;

        } else {
            alert("Error! No Student Selected")
        }
    }

    vm.covidResponseClear = function () {
        vm.covidResponse = {};
    }

    vm.addCovidPositiveEntry = function (entry) {

        console.log(entry);
        entry.isActive = true;
        var apiUrl = "/api/Data/AddContactTracing";
        vm.isBusy = true;
        $http({
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized(entry.id)
            },
            url: apiUrl,
            data: entry
        })
            .then(function (response) {

                if (response) {

                    if (response.data) {
                        vm.getStudentPositiveEntries();
                        vm.showResultData(response.data);
                        vm.showUserPanel = false;
                        vm.showUserSettingsPanel = false;
                    }
                }

            }, function (err) {
                console.log(err);

                vm.errorMessage = "Failed to add entry";
                vm.successMessage = null;
            }).finally(function () {
                vm.isBusy = false;
            });
    }

    vm.getStudentPositiveEntries = function (id) {

        vm.covidResponses = [];
        vm.isBusy = true;
        var apiUrl = "/Api/Data/GetContactTracingByStudentId?id=" + id;

        $http({
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + vm.getTokenIfAuthorized()
            },
            url: apiUrl
        })

            .then(function (response) {
                vm.errorMessage = null;
                vm.successMessage = "Success";

                vm.covidResponses = response.data;

            }, function (err) {
                //failure
                console.log(err);
                //  alert("fail");
                vm.errorMessage = "Failed to get entries";
                vm.successMessage = null;
            }).finally(function () {
                vm.isBusy = false;
            });
    }

    vm.trace = function (data) {
        window.open("/app/trace", "_blank");
    }
    // END OF CONTACT TRACING
    ///////////////////////////////////////////////////////////////





    //////////////////////////////////////////////////////////
    /// SORTING AND CHECKING

    vm.isSelected = function (lastName) {

        if (vm.selecteduserLog && vm.selecteduserLog.lastName == lastName) {

            return true;
        } else {
            return false;
        }
    }

    vm.sortBy = function (dataSort) {

        if (vm.sortResult === dataSort) {
            vm.sortResult = '-' + dataSort;
        } else {
            vm.sortResult = dataSort;
        }

    }



    vm.formatDate = function (jsonDate) {
        var milli = jsonDate.replace(/\/ Date\((-?\d +)\)\//, '$1');
        var date = new Date(parseInt(milli));
        return date;
    }



    vm.logout = function () {
        localStorage.removeItem('auth');
        localStorage.removeItem('expiry');

        vm.redirectToLogin();
    }

    vm.listUsersToggle = function () {

        vm.getUsers();

        if (vm.showUsersPanel)
            vm.showUsersPanel = false;
        else
            vm.showUsersPanel = true;

        if (vm.showSettings)
            vm.showSettings = false;
        if (vm.showUserSettingsPanel)
            vm.showUserSettingsPanel = false;
    }







    vm.listSettingsToggle = function () {
        if (vm.showSettings)
            vm.showSettings = false;
        else
            vm.showSettings = true;

        if (vm.showUsersPanel)
            vm.showUsersPanel = false;
        if (vm.showUserSettingsPanel)
            vm.showUserSettingsPanel = false;
    }

    vm.listUsersSettingsToggle = function () {
        vm.getCurrentUser();

        //console.log("User Branch", vm.user);

        if (vm.showUserSettingsPanel)
            vm.showUserSettingsPanel = false;
        else
            vm.showUserSettingsPanel = true;

        if (vm.showUsersPanel)
            vm.showUsersPanel = false;
        if (vm.showSettings)
            vm.showSettings = false;
    }

    ///////////////////////////////////////////////
    //get the current logged user
    /////////////////////////////////////////////

    vm.getCurrentUser = function () {
        vm.getUsers();
        //console.log("List of users", vm.users);
        //console.log("Claims", vm.claims);

        for (var i = 0; i < vm.users.length; i++) {
            if (vm.users[i].userName == vm.claims.user_name) {
                vm.user = vm.users[i];
            }
        }
    }

    ////////////////////////////end/////////////////





    vm.addUserClick = function () {
        vm.user = {};

        vm.showUserPanel = true;

    }

    vm.editUserClick = function (user) {
        vm.user = user;

    }

    vm.isValidString = function (input) {

        if (input) {
            if (input.length > 0) {
                return true;
            }
        }
        return false;

    }

    vm.canSaveUser = function () {
        if (vm.user) {
            var isEdit = false;
            if (vm.user.id) {
                isEdit = true;
            }

            if (vm.isValidString(vm.user.userName) && vm.isValidString(vm.user.displayName)) {

                if (isEdit) {
                    return true;
                } else {
                    //adding a new one
                    if (vm.isValidString(vm.user.password)) {
                        return true;
                    }
                }

            }
        }

        return false;
    }












    vm.showResultData = function (data) {

        var d = "show";
        //   console.log(data);


        if (data.succeeded) {
            vm.resultData = "Successfully Saved";
            d = "show";
        }
        if (data) {
            vm.resultData = "Successfully Saved";
            d = "show";
        }
        else {
            //str.replace(/[^a-zA-Z ]/g, "")
            //var x = data.errors;
            //vm.resultData = x.replace(/[^a-zA-Z ]/g, "");
            var x = "";
            for (i = 0; i < data.errors.length; i++) {
                x = x + data.errors;
            }
            d = "error"
            vm.resultData = x;
        }
        //vm.resultData = data;
        var x = document.getElementById("snackbarinfo");
        x.className = d;
        setTimeout(function () { x.className = x.className.replace(d, ""); }, 3000);
    }

    vm.getAge = function (dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    vm.getFormattedDate = function (CalDate) {
        var re = /-?\d+/;
        var WDate = CalDate.toString();
        var m = re.exec(WDate);
        var lastDate = new Date(parseInt(m[0]));
        var mm = lastDate.getMonth() + 1;
        var dd = lastDate.getDate();
        var yyyy = lastDate.getFullYear();
        var formattedDate = mm + '/' + dd + '/' + yyyy;

        return formattedDate;
    }

    vm.getYear = function () {
        var dateNow = new Date();
        var yr = dateNow.getFullYear();
        if (yr > 2024) {
            alert("Expired");
        }
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////

    $http.get('/Api/Data/GetDataCountStudents')
        .then(function (response) {
            $scope.GetDataCountStudents = response.data;
        });

    $http.get('/Api/Data/GetDataCountFemale')
        .then(function (response) {
            $scope.GetDataCountFemale = response.data;
        });

    $http.get('/Api/Data/GetDataCountMale')
        .then(function (response) {
            $scope.GetDataCountMale = response.data;
        });

    $http.get('/Api/Data/GetDataCountSeven')
        .then(function (response) {
            $scope.GetDataCountSeven = response.data;
        });

    $http.get('/Api/Data/GetDataCountEight')
        .then(function (response) {
            $scope.GetDataCountEight = response.data;
        });

    $http.get('/Api/Data/GetDataCountNine')
        .then(function (response) {
            $scope.GetDataCountNine = response.data;
        });

    $http.get('/Api/Data/GetDataCountTen')
        .then(function (response) {
            $scope.GetDataCountTen = response.data;
        });

    $http.get('/Api/Data/GetDataCountEleven')
        .then(function (response) {
            $scope.GetDataCountEleven = response.data;
        });

    $http.get('/Api/Data/GetDataCountTwelve')
        .then(function (response) {
            $scope.GetDataCountTwelve = response.data;
        });

    

    
    $scope.updateTime = function () {
        $timeout(function () {
            $scope.theclock = (dateFilter(new Date(), 'hh:mm:ss a'));
            $scope.updateTime();
        }, 1000);
    };

    $scope.formatDate = function (date) {
        //var dateOut = new Date(date);
        $timeout(function () {
            $scope.thedate = (dateFilter(new Date(), 'EEEE, MMMM dd,yyyy'));
            $scope.formatDate();
        }, 1000);
    };

    $scope.formatDate();
    $scope.updateTime();








    //@*////initial code to run
    //        var qsToken = vm.getQueryStringValue("token");
    //// var qsExpiry = vm.getQueryStringValue("tokenExpiry");
    //if (qsToken) {
    //    var tempExpiry = new Date();
    //    tempExpiry.setHours(tempExpiry.getHours() + 6);

    //    localStorage.setItem('auth', qsToken);
    //    localStorage.setItem('expiry', tempExpiry);
    //}*@

    vm.getStudents();
    vm.getLocations();
    vm.getYear();
    vm.getUsers();



    vm.sex = [{
        id: 'Male',
        label: 'Male'
    }, {
        id: 'Female',
        label: 'Female'
    }];

    vm.modalities = [{
        id: 'Modal (Print)',
        label: 'Modal(Print)'
        },{
        id: 'Online',
        label: 'Online'
        }, {
        id: 'Radio-Based Instruction',
        label: 'Radio-Based Instruction'
        }, {
        id: 'Blended',
        label: 'Blended'
        }, {
        id: 'Modal (Digital)',
        label: 'Modal(Digital)'
        }, {
        id: 'Educational Television',
        label: 'Educational Television'
        }, {
        id: 'Homeschooling',
        label: 'Homeschooling'
        }, {
        id: 'Face to Face',
        label: 'Face to Face'
        }
    ];


    //$http.get("/Api/Data/GetModelData")
    //    .then(function (response) {
    //        $scope.s = response.data;
    //        console.log($scope.s.StudentFullName);
    //        console.log($scope.s.Lrn);
    //});
    //$http.get('/Api/Data/GetQrCode').then(function (response) {
    //    $scope.qrCodeUrl = URL.createObjectURL(response.data);
    //});

    vm.NONE = function () {
        $http.post('/AppController/Search', { fileName: $scope.fileName }).then(function (response) {
            $scope.imageUrl = response.data.imageUrl;
        });
    }

    
});