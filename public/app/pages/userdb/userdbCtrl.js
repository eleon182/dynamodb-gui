var app = angular.module('main');

app.controller('userdbCtrl', userdbCtrl);
userdbCtrl.$inject = ['$window', 'usersRepo', 'starRepo', '$scope', '$http', '$timeout', '$q'];

function userdbCtrl($window, usersRepo, starRepo, $scope, $http, $timeout, $q) {

    var masterUserList = [];

    $scope.init = function() {
        NProgress.inc();
        $scope.newUsername = '';
        $scope.env = 'dev';
        $scope.userList = [];
        $scope.addNewUser = addNewUser;
        $scope.updateUser = updateUser;
        $scope.removeUser = removeUser;
        $scope.showCustomerId = showCustomerId;
        $scope.updateAll = updateAll;
        $scope.showErrors = showErrors;
        $scope.addNotes = addNotes;
        $scope.loadEnv = loadEnv;
        $scope.login = login;
        $scope.fail = false;
        $scope.success = false;
        $scope.showFeatures = true;
        loadUserList($scope.env);
    };

    function showCustomerId(id) {
        bootbox.alert(id, function() {
            return;
        });
    }

    function showErrors(status) {
        status = status.replace(/ /g, '<br>');
        bootbox.alert(status);
    }

    function login(user) {
        //copy(user.username);
        var url;
        switch ($scope.env) {
            case 'int':
                url = 'https://integration.projectcorvette.us/devauth';
                break;
            case 'qa':
                url = 'https://qa.projectcorvette.us/devauth';
                break;
            case 'stg':
                url = 'https://stage.experiancs.com';
                break;
            default:
                url = 'https://develop.projectcorvette.us/devauth';
                break;
        }
        $window.open(url);
    }

    function updateAll() {
        $scope.wait = true;
        usersRepo.updateAll().then(function() {
            $timeout(function() {
                loadUserList($scope.env);
            }, 3000);
        });
    }

    function updateUser(username, domain) {

        NProgress.inc();
        var params = {
            username: username,
            env: domain
        };
        $scope.wait = true;
        usersRepo.updateUser(params).then(function(val) {
            $timeout(function() {
                loadUserList(domain);
            }, 3000);
        }, function(val) {
            //TODO: handle error
            loadUserList(domain);
            NProgress.done();
        });
    }

    function addNotes(user) {
        bootbox.prompt({
            title: user.notes === ' ' ? 'Enter new note' : user.notes,
            value: user.notes,
            callback: function(result) {
                if (result === null) {
                    return;
                }
                if (result === '') {
                    result = ' ';
                }
                var params = {
                    username: user.username,
                    env: user.env,
                    notes: result
                };

                NProgress.inc();
                usersRepo.addNotes(params).then(function(data) {
                    NProgress.done();
                    user.notes = result;
                });
            }
        });
    }

    function loadEnv(env) {
        $scope.userList = [];

        masterUserList.forEach(function(val) {
            if (val.env === env) {
                $scope.userList.push(val);
            }
        });
        $scope.userList = sortUserList($scope.userList);
    }

    function loadUserList(env) {
        usersRepo.getUsers().then(function(data) {
            masterUserList = loadNotes(data);
            loadEnv(env);
            $scope.wait = false;
            NProgress.done();
        }, function(err) {
            loadEnv(env);
            $scope.wait = false;
            NProgress.done();
        });
    }

    //TODO: temporary code until new notes field is added
    function loadNotes(data) {
        data.forEach(function(val) {
            if (!val.notes) {
                val.notes = ' ';
            }
        });
        return data;
    }

    function sortUserList(data) {

        return data.sort(function(a, b) {
            //Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.updateDate) - new Date(a.updateDate);
        });

    }

    function addNewUser(username) {
        var input = {
            username: username,
            env: $scope.env
        };
        $scope.fail = false;
        $scope.success = false;
        if (input.username !== '') {
            usersRepo.addUser(input).then(
                function() {
                    $scope.success = true;
                    $scope.newUsername = '';
                    loadUserList($scope.env);
                },
                function() {
                    $scope.fail = 'Database entry failed';

                });
        } else {
            $scope.fail = 'Enter proper username';
        }
    }

    function removeUser(username, env) {

        NProgress.inc();
        bootbox.confirm("Confirm delete", function(result) {
            if (result) {
                var params = {
                    username: username,
                    env: env
                };

                usersRepo.deleteUser(params).then(function() {
                    loadUserList(env);
                    NProgress.done();
                });
            }
        });
    }

}
