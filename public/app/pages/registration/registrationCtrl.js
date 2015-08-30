var app = angular.module('main');

app.controller('registrationCtrl', registrationCtrl);
registrationCtrl.$inject = ['registrationRepo', 'usersRepo', 'starRepo', '$scope', '$http', '$timeout', '$q'];

function registrationCtrl(registrationRepo, usersRepo, starRepo, $scope, $http, $timeout, $q) {

    var userCreationData;
    $scope.init = function() {
        $scope.progressBar = false;
        $scope.newSsn = '';
        $scope.creationOutput = '';
        $scope.newUsername = '';
        $scope.offerId = '14f6f7a7e5054975ba192e1721486032';
        $scope.domain = 'dev';
        $scope.showForm = true;
        $scope.oow = [];

        $scope.createNewUser = createNewUser;
        $scope.submitAnswers = submitAnswers;
        $scope.customOffer = customOffer;
        $scope.colorCodeAnswer = colorCodeAnswer;
    };

    function customOffer() {
        bootbox.prompt({
            title: $scope.offerId,
            value: '',
            callback: function(result) {
                if (result === null) {
                    return;
                } else {
                    $timeout(function() {
                        $scope.offerId = result;
                    });
                }
            }
        });
    }

    function colorCodeAnswer(answer, question) {
        var response = '';
        if (answer == question) {
            response = 'correct-answer';
        }
        return response;
    }

    function createNewUser() {
        NProgress.inc();
        $scope.progressBarText = '';
        $scope.failReason = null;
        $scope.success = false;
        $scope.progressBar = 0;
        $scope.creationOutput = '';
        generateUsername($scope.newSsn).then(function(user) {
            $scope.progressBar = 5;
            $scope.creationOutput = 'Creating user: ' + user.username;
            userCreationData = {
                ssn: $scope.newSsn,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                domain: $scope.domain,
                offerId: $scope.offerId
            };

            $scope.wait = true;
            $scope.success = false;
            $scope.fail = false;
            $scope.showForm = false;

            $scope.creationOutput += '\nOffer Id:' + $scope.offerId;
            $scope.creationOutput += '\nCreating token';
            registrationRepo.token(userCreationData).then(
                function(token) {
                    if (!token) {
                        failedRegistration(token);
                        return;
                    }
                    $scope.progressBar = 12;
                    userCreationData.token = token;
                    $scope.creationOutput += '\n\nOP1\n';
                    $scope.progressBarText = 'OP1';
                    $scope.creationOutput += '\n/api/account/customerprofile ';
                    registrationRepo.steps(userCreationData, 1).then(function(val) {
                        if (val !== '') {
                            failedRegistration(val);
                            return;
                        }
                        $scope.progressBar = 18;
                        $scope.creationOutput += '\n/api/fulfillment/subscription ';
                        registrationRepo.steps(userCreationData, 2).then(function(val) {
                            if (!val.id) {
                                failedRegistration(val);
                                return;
                            }
                            $scope.creationOutput += '\nSubscription Type: ' + val.name;
                            $scope.progressBar = 29;
                            userCreationData.id = val.id;
                            $scope.creationOutput += '\n\nOP2';
                            $scope.progressBarText = 'OP2';
                            $scope.creationOutput += '\n\n/api/registration/customerWithCard ';
                            registrationRepo.steps(userCreationData, 3).then(function(val) {
                                if (val !== '') {
                                    failedRegistration(val);
                                    return;
                                }
                                $scope.progressBar = 35;
                                $scope.creationOutput += '\n\nOP3\n';
                                $scope.progressBarText = 'OP3';
                                $scope.creationOutput += '\n/api/idverify ';
                                registrationRepo.steps(userCreationData, 4).then(function(val) {
                                    if (val.code !== 'success') {
                                        failedRegistration(val);
                                        return;
                                    }
                                    userCreationData.questionSetId = val.questionSetId;
                                    $scope.progressBar = false;
                                    $scope.wait = false;
                                    $scope.fail = false;
                                    $scope.answerQuestions = val.questions;
                                    $scope.answerQuestions.ans = {
                                        '1': '5',
                                        '2': '5',
                                        '3': '5',
                                        '4': '5',
                                    };
                                    $scope.showQuestions = true;
                                    $scope.showForm = false;
                                    starRepo.getAnswers(userCreationData.ssn).then(function(answers) {
                                        NProgress.done();
                                        if (answers.oowAnswers) {
                                            $scope.answerQuestions.ans = getAnswers($scope.answerQuestions, answers.oowAnswers);
                                            $scope.oow = filterAnswers(answers.oowAnswers);
                                        } else {
                                            $scope.oow = [];
                                            $scope.oow.push('Not Found');
                                        }
                                    });
                                });
                            });
                        });
                    });

                },
                function onError(err) {
                    if (angular.isArray(err)) {
                        err = err[err.length - 1];
                    }
                    $scope.failReason = JSON.stringify(err, null, 4);
                    $scope.wait = false;
                    $scope.fail = true;
                    $scope.success = false;
                    $scope.showForm = true;
                });
        }, function(err) {
            failedRegistration('User not found');
        });
    }

    function filterAnswers(answers) {
        var response = [];
        answers.forEach(function(val) {
            if (!parseInt(val) && val.length > 3) {
                response.push(val);
            }
        });
        return response;
    }

    function generateUsername(ssn) {
        var deferred = $q.defer();
        if ($scope.newUsername !== '') {
            deferred.resolve({
                username: $scope.newUsername
            });
        } else {
            var rand = new Date().getTime().toString();
            rand = rand.substr(rand.length - 4);
            starRepo.getAnswers($scope.newSsn).then(function(user) {
                deferred.resolve({
                    username: user.firstName.charAt(0).toLowerCase() + user.lastName.toLowerCase() + rand,
                    firstName: user.firstName,
                    lastName: user.lastName
                });
            }, function() {
                deferred.reject();
            });
        }
        return deferred.promise;
    }

    function failedRegistration(data) {
        $scope.creationOutput += '\n' + JSON.stringify(data, null, 4);
        $scope.progressBar = false;
        $scope.wait = false;
        $scope.showForm = true;
        $scope.fail = true;
        NProgress.done();
    }

    function submitAnswers() {

        NProgress.inc();
        $scope.failReason = null;
        $scope.wait = true;
        $scope.success = false;
        $scope.fail = false;
        $scope.showQuestions = false;
        $scope.creationOutput += '\nSubmitting Answers';
        $scope.creationOutput += '\n/api/idverify';
        userCreationData.answers = $scope.answerQuestions.ans;

        $scope.progressBar = 52;
        registrationRepo.steps(userCreationData, 5).then(function(val) {
            if (val.code !== 'success') {
                failedRegistration(val);
                return;
            }
            $scope.progressBar = 67;
            $scope.creationOutput += '\n\nOP4\n';
            $scope.progressBarText = 'OP4';
            $scope.creationOutput += '\n/api/account/customerprofile ';
            registrationRepo.steps(userCreationData, 6).then(function(val) {
                if (val !== '') {
                    failedRegistration(val);
                    return;
                }
                $scope.progressBar = 73;
                $scope.creationOutput += '\n/api/fulfillment/activate ';
                registrationRepo.steps(userCreationData, 7).then(function(val) {
                    if (!val.id) {
                        failedRegistration(val);
                        return;
                    }
                    $scope.progressBar = 87;
                    $scope.creationOutput += '\n\nLogging in to dashboard\n';
                    $scope.creationOutput += '\n/api/reportbenefit/forcereload';
                    $scope.progressBarText = 'Loggin in';
                    registrationRepo.steps(userCreationData, 8).then(function(val) {
                        if (!val.reportInfo) {
                            failedRegistration(val);
                            return;
                        }
                        $scope.creationOutput += '\n\nUser created!';
                        $scope.progressBar = 100;
                        $scope.progressBar = false;
                        $scope.wait = false;
                        $scope.success = true;
                        $scope.showForm = true;
                        $scope.fail = false;
                        addNewUser(userCreationData);
                        NProgress.done();
                    });
                });
            });
        });
        //},
        //function onError(err) {
        //$scope.failReason = JSON.stringify(err, null, 4);
        //$scope.wait = false;
        //$scope.showForm = true;
        //$scope.fail = true;
        //$scope.success = false;
        //});
    }

    function addNewUser(user) {
        var input = {
            username: user.username,
            ssn: user.ssn,
            domain: $scope.domain
        };
        usersRepo.addUser(input);
    }

    function getAnswers(questions, answers) {
        var response = {
            answer1: '5',
            answer2: '5',
            answer3: '5',
            answer4: '5',
        };
        if (Array.isArray(questions)) {
            questions.forEach(function(question, questionIndex) {
                question.options.forEach(function(answer, answerIndex) {
                    answers.forEach(function(list) {
                        if (answer.toLowerCase().indexOf(list.toLowerCase()) >= 0 && answerIndex !== 4 && list.length > 2 && list !== 'DEGREE') {
                            response[question.name] = (answerIndex + 1).toString();
                        }
                    });

                });
            });
        }

        response = {
            '1': response.answer1,
            '2': response.answer2,
            '3': response.answer3,
            '4': response.answer4
        };
        return response;
    }
}
