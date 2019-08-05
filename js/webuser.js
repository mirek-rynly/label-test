// Write your JavaScript code.


var userApp = angular.module("rynly.userweb", ['ui.bootstrap']);

userApp.directive('ngEnter', function () { //a directive to 'enter key press' in elements with the "ng-enter" attribute

    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

userApp.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 1; i <= total; i++)
            input.push(i);
        return input;
    };
});

userApp.directive('onlyNumbers', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {
                if (event.shiftKey) { event.preventDefault(); return false; }

                if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
                    // backspace, enter, escape, arrows
                    return true;
                } else if (event.which >= 48 && event.which <= 57) {
                    // numbers 0 to 9
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    // numpad number
                    return true;
                }
                else {
                    event.preventDefault();
                    return false;
                }
            });
        }
    }
});

userApp.directive('googleplace', function () {

    var componentForm = {
        premise: 'long_name',
        street_number: 'short_name',
        route: 'long_name',
        sublocality_level_1: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };
    var mapping = {
        premise: 'BuildingName',
        street_number: 'Unit',
        route: 'Street',
        sublocality_level_1: 'Suburb',
        locality: 'City',
        administrative_area_level_1: 'State',
        country: 'Country',
        postal_code: 'PostCode'
        //Region, District, Level
    }
    return {
        require: 'ngModel',
        scope: {
            ngModel: '=',
            details: '=?'
        },
        link: function (scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
            google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                var place = scope.gPlace.getPlace();
                var location = place.geometry && place.geometry.location ? {
                    Latitude: place.geometry.location.lat(),
                    Longitude: place.geometry.location.lng()
                } : {};
                // Get each component of the address from the place location
                // and fill the corresponding field on the form.
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    if (componentForm[addressType]) {
                        var val = place.address_components[i][componentForm[addressType]];
                        location[mapping[addressType]] = val;
                    }
                }

                location.FormattedAddress = place.formatted_address;
                location.PlaceId = place.place_id;

                scope.$apply(function () {
                    scope.details = {
                        city: location.City,
                        line1: place.name,
                        line2: "",
                        state: location.State,
                        zip: location.PostCode,
                        location: { latitude: location.Latitude, longitude: location.Longitude }
                    };
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});

// root controller
angular.module("rynly.userweb").controller("RootController", function ($scope, $http) {
    $scope.loginModel = {};
    $scope.response = {};
    $scope.profile = null;


    $scope.login = function () {
        $http.post('/user/home/login', $scope.loginModel).then(function (res) {
            $scope.response = res.data;
            if (res.data.success) {
                window.location.href = res.data.data.user.isTnCExpired ? '/user/home/accepttnc' : '/user';
            }
        });
        $("#signinLink").hide();
    }

    $scope.logout = function () {
        $http.post('/user/home/logout').then(function (response) {
            $scope.loginModel = {};
            $scope.response = {};
            $scope.profile = null;
            window.location.href = '/user';
        });
    }


    $scope.loadProfile = function () {};
    //     try {
    //         $http.post('/api/user/profile').then(function (response) {
    //             if (response.data.success && response.data.data) {
    //                 $scope.profile = response.data.data
    //             }
    //         });
    //     } catch (e) {

    //     }
    // }

    // $scope.loadProfile();
});

// register controller
angular.module("rynly.userweb").controller("RegisterController", function ($scope, $http) {
    $scope.model = {
        address: {}
    };
    $scope.response = {};
    $scope.registrationDone = false;



    $scope.register = function () {
        $http.post('/user/home/register', $scope.model).then(function (response) {
            $scope.response = response.data;
            if (response.data.success) {
                $scope.registrationDone = true
            }
        });
    }
});

// Accept Terms and Condition Controller
angular.module("rynly.userweb").controller("AcceptTnCController", function ($scope, $http) {
    $scope.AccepTnC = function () {
        $http.post('/user/home/AcceptTnCPost', $scope.model).then(function (res) {
            if (res.data.success) {
                window.location.href = '/user';
            }
        });
    }
});

//update profile controller
angular.module("rynly.userweb").controller("ProfileUpdateController", function ($scope, $http) {
    $scope.model = {};
    $scope.response = {};
    $scope.registrationDone = false;

    // $scope.getProfile = function () {
    //     $http.post('/api/user/profile').then(function (response) {
    //         $scope.response = response.data;
    //         if (response.data.success) {
    //             $scope.model = response.data.data;
    //             if ($scope.model.notifications == null)
    //                 $scope.model.notifications = [];
    //         }
    //     });
    // }

    // $scope.getProfile();

    $scope.toggleNotificaitons = function toggleNotificaitons(notificaitontype) {
        var idx = $scope.model.notifications.indexOf(notificaitontype);

        // Is currently selected
        if (idx > -1) {
            $scope.model.notifications.splice(idx, 1);
        }

        // Is newly selected
        else {
            $scope.model.notifications.push(notificaitontype);
        }
    };

    function setToastrOptions() {
        toastr.options = {
            "positionClass": "toast-top-center"
        }
    }

    $scope.updateAddress = function () {
        $("#spinner").show();


        $http.post('/api/user/address', $scope.model.personalInformation.address).then(function (response) {
            $scope.response = response.data;
            if (response.data.success) {
                $scope.addressUpdateDone = true;
                setToastrOptions();
                toastr.success("Address saved successfully");
            }

            $("#spinner").hide();
        });
    }

    $scope.updatePickupNotes = function () {
        $("#spinner").show();

        $http.post('/api/user/pickupNote?pickupNote='+$scope.model.pickupNote).then(function (response) {
            $scope.response = response.data;
            if (response.data.success) {
                setToastrOptions();
                toastr.success("Pickup notes saved successfully");
            }
            $("#spinner").hide();
        });
    }

    $scope.updateNotifications = function () {
        var notificaitonModel = {
            "notifications": $scope.model.notifications
        };
        $("#spinner").show();


        $http.post('/api/user/notification', notificaitonModel).then(function (response) {
            $scope.response = response.data;
            if (response.data.success) {
                $scope.notificaitonUpdateDone = true;
                setToastrOptions();
                toastr.success("Notification preference saved successfully");
                $("#spinner").hide();
            }
        });
    }
});



//forgot password controller
angular.module("rynly.userweb").controller("ForgotPasswordController", function ($scope, $http) {
    $scope.model = {};
    $scope.forgotpasswordresponse;
    $scope.response;

    $scope.forgotPassword = function () {
        $http.post('/user/home/ForgotPassword', $scope.model).then(function (response) {
            $scope.forgotpasswordresponse = response.data;
        });
    }

    $scope.resetPassword = function (token) {
        $scope.model.VerificationToken = token;
        $http.post('/user/home/ResetPassword', $scope.model).then(function (response) {
            $scope.response = response.data;
        });
    }
});

angular.module("rynly.userweb").controller("LocationController", function ($scope, $http) {
    $scope.zipcodeModel = {};
    $scope.response = {};
    $scope.hublist = null;
    var map = null;

    $scope.findhubs = function () {
        $http.post('/user/home/FindHubs', $scope.zipcodeModel).then(function (response) {
            $scope.response = response.data;
            if (response.data.success) {
                $scope.hublist = response.data.data;
                var hublist = $scope.hublist;
                var Address = hublist.hubs[0];
                var Location = Address.address.location;
                var Longitude = Location.longitude;
                var Latitude = Location.latitude;
                document.getElementById('map').classList.add("active");
                document.getElementById('searchHub').classList.remove('active');
                if (map != null) {
                    map.remove();
                }
                map = L.map('map');
                map.setView([Latitude, Longitude], 10);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                for (var i = 0; i < hublist.hubs.length; i++) {
                    hublist = $scope.hublist;
                    Address = hublist.hubs[i];
                    Location = Address.address.location;
                    Longitude = Location.longitude;
                    Latitude = Location.latitude;
                    L.marker([Latitude, Longitude]).addTo(map)
                        .bindPopup(Address.address.line1 + '<br>' + Address.address.city + ' ' + Address.address.state + ' ' + Address.address.country)
                        .openPopup();
                }
            }
        });
    }
});

angular.module("rynly.userweb").controller("TrackController", function ($scope, $http, $compile) {
    $scope.trackingNumber = "";
    $scope.errorMessage = "";
    $scope.track = function () {
        $("#trackResult").html("");
        if ($scope.trackingNumber.trim() == "") {
            $scope.errorMessage = "Enter a valid tracking number";
        }
        if ($scope.trackingNumber) {
            $scope.errorMessage = "";
            $("#trackResult").load("/user/home/trackview?trackingNumber=" + $scope.trackingNumber);
        }
    }
});

angular.module("rynly.userweb").controller("PackageController", function ($scope, $http, $compile, $uibModal,$sce) {
    $scope.gPlace;
    $scope.settings;
    $scope.profile;
    $scope.fromAddress;
    $scope.toAddress;
    $scope.envelope = {};
    $scope.packageType = "";
    $scope.step = 1;
    $scope.stripeKey = "";
    var paymentNumber = "";
    $scope.updateFromAddress = true;
    $scope.updateToAddress = true;
    $scope.paymentResponse = {};
    $scope.packageResponse = {};
    $scope.paymentModel = {};
    $scope.errors = [];
    $scope.fromRecommendedAddress = {};
    $scope.toRecommendedAddress = {};
    $scope.labelUrl = '';
    $scope.packagePrizeList = [];
    $scope.deliveryMethods = [];
    $scope.deliveryTimeList = [];
    $scope.totalAmount = 0;
    $scope.totalDiscount = 0;
    $scope.size = /^0[1-9]$|^1[0-8]$|^0$|^[1-9]$/;
    $scope.sizeofdepth = /^0[1-9]$|^1[0-2]$|^0$|^[1-9]$/;
    $scope.envelopelimit = 50;
    $scope.boxpackageCount = 0;
    $scope.totalSpecial = 0;
    $scope.trackModel = { "trackingNumber": null };
    $scope.trackResponse;
    $scope.changes = [];
    $scope.disablebutton = false;
    $scope.signatureCost = 0;
    $scope.isSignatureRequired = "";
    var hiddenDigit = "XXXX-XXXX-XXXX-";
    $scope.packageCreated = false;
    $scope.packageModel = {
        recipient: {},
        fromAddress: {},
        toAddress: {},
        isExpedited: false,
        promoCode: "",
        sourceHub: {},
        deliveryMethodId: 2,
        promoCodeDisplayText:""
    };
    $scope.modalInstance = "";
    $scope.selectedAddress = "";
    $scope.userAddress = [];
    $scope.hubLists = [];
    $scope.noteMaxLength = 90;
    $scope.newCard = true;
    $scope.existingCard = '';
    $scope.selectedHub = { hubId : ""};
    $scope.deliverybyLabelText = '2-3 BUSINESS DAYS';
    $scope.signatureLabelText = "Recipient must be present for delivery during the business day";
    $scope.deliveryDateMessage = 'ESTIMATED DELIVERY DATE';
    $scope.sourceHub = {},
        $scope.destinationHub = {}
    $scope.inProgress = false;
    $scope.promoText = "";
    $scope.editFrom = false;

    function setPromoText() {
        if ($scope.profile.expeditedDelivery) {
            var expediteText = "Thank you for being one of our first customers."
            if ($scope.profile.expeditedDeliveryMessage != null) {
                expediteText = $scope.profile.expeditedDeliveryMessage;
            }
            var text = "<p style='color:green'>" + expediteText + "</p>";
            text += "<p style='color:green'>As our appreciation, all your packages will be delivered expedited at standard pricing.</p>";
            $scope.promoText = $sce.trustAsHtml(text);
        }
        else if ($scope.profile.discount != null) {
            var text = "<p style='color:green'>Thanks for being a " + $scope.profile.discount.discountType + ".</p>";
            text += "<p style='color:green'>You will receive a " + $scope.profile.discount.discountPercent + "% discount for all your Rynly transactions.</p>";
            $scope.promoText = $sce.trustAsHtml(text);
        }
    }

    function isBusinessDay() {
        var day = new Date().getDay();
        if (day == 0 || day == 6) {
            return false;
        }
        return true;
    }

    $scope.dropOf = function () {
        $scope.selectedHub.hubId = "";
        if ($scope.packageModel.isDropOf) {
            $("#spinner").show();
            $scope.packageModel.DeliveryMethodId = "1";
            var obj =
                {
                    location: $scope.packageModel.fromAddress.location,
                    zipCode: $scope.packageModel.fromAddress.zip
                }
            $http.post('/api/hub/nearestHubList', obj).then(function (response) {
                var hubs = response.data.data.nearestHubList;
                $scope.hublist = hubs;
                $scope.modalInstance = $uibModal.open({
                    templateUrl: 'hubModal.html',
                    scope: $scope,
                    backdrop: 'static',
                    keyboard: false
                });

                $("#spinner").hide();
                return;
            });
        }
        else {
            $scope.packageModel.DeliveryMethodId = "2";
            $scope.packageModel.sourceHub = {};
            return;
        }
    }

    $scope.formatHour = function (hour) {
        if (hour < 12) {
            return hour + ':00 AM';
        } else {
            return (hour - 12) + ':00 PM';
        }
    };

    $scope.selectHub = function () {
        var selectedHub = $scope.hublist.find(function (i) { return i.hub.id === $scope.selectedHub.hubId });
        if (selectedHub != null) {
            $scope.packageModel.sourceHub = selectedHub;
        }
        else {
            $scope.packageModel.isDropOf = false;
            $scope.packageModel.DeliveryMethodId = "2";
        }
        $scope.modalInstance.close();

    }
    $scope.expeditePackage = function ()
    {
        $scope.setExpediteText();
        $scope.calculatePrice();
    }

        $scope.setExpediteText = function () {
        $scope.packageModel.promoCode = '';
        $scope.packageModel.promoCodeDisplayText = '';
        $scope.deliverybyLabelText = '2-3 BUSINESS DAYS';
        $scope.deliveryDateMessage = 'ESTIMATED DELIVERY DATE';

    //     if ($scope.packageModel.isExpedited || $scope.profile.expeditedDelivery) {
    //         $http.get('/api/settings/TimeZoneDateTime').then(function (response) {
    //             if (response.data.success && response.data.data) {
    //                 var dateTime = new Date(response.data.data.dateTime);
    //                 $scope.deliveryDateMessage = "GUARANTEED EXPEDITED DELIVERY DATE";
    //                 var hours = dateTime.getHours();
    //                 var sourceCity = $scope.sourceHub.address.city;
    //                 var destinationCity = $scope.destinationHub.address.city;
    //                 $scope.deliverybyLabelText = 'GUARANTEED SAME DAY'
    //                 if (!isBusinessDay()) {
    //                     $scope.deliverybyLabelText = 'GUARANTEED NEXT BUSINESS DAY'
    //                 }
    //                 else if (sourceCity.toLowerCase() != destinationCity.toLowerCase() ||
    //                     hours >= 11) {
    //                     $scope.deliverybyLabelText = 'GUARANTEED NEXT BUSINESS DAY';
    //                 }
    //             }
    //         });
    //     }
    }

    $scope.getAddressList = function () {
        $http.get('/api/user/addresslist', null).then(function (response) {
            if (response.data.success) {
                $scope.userAddress = response.data.data.addressList;
            }
        });
    };

    $scope.setAddress = function (selectedAddress) {
        var list = $scope.userAddress.filter(function (i) { return i.id == selectedAddress });
        if (list.length <= 0)
            return;

        var address = list[0].address;
        $scope.selectedAddress = list[0];
        $scope.packageModel.toAddress = address;
        $scope.packageModel.toAddress.line1 = address.line1;
        $scope.packageModel.toAddress.line2 = address.line2;
        $scope.packageModel.toAddress.city = address.city;
        $scope.packageModel.toAddress.state = address.state;
        $scope.packageModel.toAddress.zip = address.zip;
        $scope.packageModel.toAddress.company = address.company;
        $scope.packageModel.toAddress.contactName = address.contactName;
        $scope.packageModel.toAddress.phone = address.phone;
        $scope.packageModel.toAddress.location = address.location;
    }

    function setToastrOptions() {
        toastr.options = {
            "positionClass": "toast-top-center"
        }
    }

    function initialize() {
        $(document).ready(function () {
            $('.addresslist').select2();
        });
    }

    initialize();

    $scope.boxPackage = [{
        "type": 1
    }]

    $scope.addBox = function () {
        $scope.boxPackage.push({
            "type": 1
        });
    }

    $scope.Back = function () {
        $scope.inProgress = false;
        $scope.modalInstance.close();
    }

    $scope.useRecommendedAddress = function (type) {
        if (type === "From") {
            $scope.packageModel.fromAddress.line1 = $scope.fromRecommendedAddress.line1;
            $scope.packageModel.fromAddress.line2 = $scope.fromRecommendedAddress.line2;
            $scope.packageModel.fromAddress.city = $scope.fromRecommendedAddress.city;
            $scope.packageModel.fromAddress.state = $scope.fromRecommendedAddress.state;
            $scope.packageModel.fromAddress.zip = $scope.fromRecommendedAddress.zip;
            $scope.packageModel.fromAddress.location = $scope.fromRecommendedAddress.location;
            $scope.packageModel.fromAddress.location = $scope.fromRecommendedAddress.location;
            if (!$scope.editFrom || $scope.profile.updateProfile) {
                $scope.updateProfileAddress();
            }
        }
        if (type == "To") {
            $scope.packageModel.toAddress.line1 = $scope.toRecommendedAddress.line1;
            $scope.packageModel.toAddress.line2 = $scope.toRecommendedAddress.line2;
            $scope.packageModel.toAddress.city = $scope.toRecommendedAddress.city;
            $scope.packageModel.toAddress.state = $scope.toRecommendedAddress.state;
            $scope.packageModel.toAddress.zip = $scope.toRecommendedAddress.zip;
            $scope.packageModel.toAddress.location = $scope.toRecommendedAddress.location;

            if ($scope.selectedAddress != "") {
                $scope.selectedAddress.address = $scope.packageModel.toAddress;
                $scope.saveAddress();
            }
        }


        var a = $scope.selectedAddress;
        if ($scope.packageModel.fromAddress.location && $scope.packageModel.toAddress.location) {
            $scope.modalInstance.close();
            $scope.inProgress = false;
        }
        $scope.editFrom = false;
        $("#pkgFrom").addClass("disabledSection");
    }

    $scope.saveAddress = function () {
        $scope.errors = [];

        $scope.validateAddress($scope.packageModel.toAddress, "Recipient's ", $scope.errors);
        if ($scope.errors.length > 0)
            return;

        if ($scope.selectedAddress == "") {
            var selAddress = {
                address : $scope.packageModel.toAddress
            };
            $scope.selectedAddress = selAddress;
        };
        $http.post('/api/user/saveAddress', $scope.selectedAddress).then(function (response) {
            $scope.response = response.data;
            if (response.data.success) {
                toastr.options.showMethod = 'slideDown';
                setToastrOptions();
                toastr.success("Address saved successfully");
                $scope.selectedAddress == "";
                $scope.getAddressList();
            }
            else {
                toastr.errors("Address not saved");
            }
        });
    }

    $scope.validateCreditCardNumber = function () {
        var cardnumber = $scope.paymentModel.number;
        if (cardnumber.length > 4) {
            cardnumber = cardnumber.split("-").join("");
            var cardnums = new Array();
            for (var i = 0; i < 4; i++) {
                var cardnum = cardnumber.slice(0 + (4 * i), 4 + (4 * i));
                cardnums.push(cardnum);
            }

            if (cardnums.length > 0) {
                cardnumber = "";
                for (var i = 0; i < cardnums.length; i++) {
                    if (cardnums[i].length == 4 && i != 3 && cardnums[i + 1] != "") {
                        cardnumber = cardnumber + cardnums[i] + "-";
                    }
                    else {
                        cardnumber = cardnumber + cardnums[i];
                    }
                }
            }

        }
        $scope.paymentModel.number = cardnumber;
    }

    $scope.range = function (min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };

    $scope.previous = function () {
        if ($scope.inProgress) { return;}
        $scope.step = $scope.step - 1;
        $scope.errors = [];
    }

    $scope.validateAddress = function (address, prefix, errors) {
        if (!address.contactName)
            errors.push(prefix + "contact name is required")

        if (!address.line1)
            errors.push(prefix + "address 1 is required")


        if (!address.city)
            errors.push(prefix + "city is required")

        if (!address.state)
            errors.push(prefix + "state is required")

        if (!address.zip)
            errors.push(prefix + "zip is required")

        if (!address.phone)
            errors.push(prefix + "phone is required")
    }

    $scope.setCardDetails = function () {
        if ($scope.profile.paymentInfoAdded) {
            $scope.newCard = false;
            var cardLastFourDigits = $scope.profile.paymentNumber;
            $scope.existingCard = hiddenDigit.concat(cardLastFourDigits);
            return;
        }
    }

    $scope.setDueDate = function () {
        var currentDate = new Date();
        var getDay = currentDate.getDay();
        var sunMonTue = 3;
        var wedThuFri = 5;
        var sat = 4;
        if (!$scope.packageModel.isExpedited) {
            if (getDay == 0 || getDay == 1 || getDay == 2) {
                $scope.dueDate = currentDate.setDate(currentDate.getDate() + sunMonTue);
            }

            if (getDay == 3 || getDay == 4 || getDay == 5) {
                $scope.dueDate = currentDate.setDate(currentDate.getDate() + wedThuFri);
            }

            if (getDay == 6) {
                $scope.dueDate = currentDate.setDate(currentDate.getDate() + sat);
            }
        }
        else {
            $scope.dueDate = currentDate;
            if ($scope.deliverybyLabelText == "GUARANTEED NEXT BUSINESS DAY")
            {
                //if package created on friday
                if (getDay == 5) {
                    $scope.dueDate = currentDate.setDate(currentDate.getDate() + 3);
                    return;
                }
                // if package is created on saturday
                if (getDay == 6) {
                    $scope.dueDate = currentDate.setDate(currentDate.getDate() + 2);
                    return;
                }
                $scope.dueDate = currentDate.setDate(currentDate.getDate() + 1);
                return;
              }
        }
    }

    $scope.next = function () {
        $scope.errors = [];

        // validate basic information
        if ($scope.step == 1) {
            if ($scope.inProgress) { return; }
            $scope.inProgress = true;
            $scope.packageModel.deliveryTimeId = 1;

            $scope.validateAddress($scope.packageModel.fromAddress, "Sender's ", $scope.errors);
            $scope.validateAddress($scope.packageModel.toAddress, "Recipient's ", $scope.errors);

            if ($scope.errors.length > 0) {
                $scope.inProgress = false;
                return;
            }


            $("#spinner").show();
            $scope.disablebutton = true;

            // validate phone
            $http.get('/api/user/validatePhone?phone=' + $scope.packageModel.fromAddress.phone).then(function (fromPhoneResponse) {
                $http.get('/api/user/validatePhone?phone=' + $scope.packageModel.toAddress.phone).then(function (toPhoneResponse) {

                    $("#spinner").hide();
                    $scope.disablebutton = false;

                    if (fromPhoneResponse.data.success) {
                        $scope.packageModel.fromAddress.phone = fromPhoneResponse.data.data.phone;
                    }
                    if (!fromPhoneResponse.data.success) {
                        $scope.errors = fromPhoneResponse.data.errors;
                    }

                    if (toPhoneResponse.data.success) {
                        $scope.packageModel.toAddress.phone = toPhoneResponse.data.data.phone;
                    }
                    if (!toPhoneResponse.data.success) {
                        $scope.errors.concat(toPhoneResponse.data.errors);
                    }

                    if ($scope.errors.length > 0) {
                        $scope.inProgress = false;
                        return;
                    }

                    $("#spinner").show();
                    $scope.disablebutton = true;

                    $http.post('/api/hub/validateAddress', $scope.packageModel.fromAddress).then(function (fromAddressResponse) {
                        $http.post('/api/hub/validateAddress', $scope.packageModel.toAddress).then(function (toAddressResponse) {

                            $("#spinner").hide();
                            $scope.disablebutton = false;

                            if (!fromAddressResponse.data.success) {
                                $scope.errors.push("Specified source address is invalid");
                            }
                            if (!toAddressResponse.data.success) {
                                $scope.errors.push("Specified destination address is invalid");
                            }

                            if ($scope.errors.length > 0) {
                                $scope.inProgress = false;
                                return;
                            }

                            if (!fromAddressResponse.data.data.rynlyServiceAvailable) {
                                $scope.errors.push("Specified source address is currently not serviced by Rynly");
                            }
                            if (!toAddressResponse.data.data.rynlyServiceAvailable) {
                                $scope.errors.push("Specified destination address is currently not serviced by Rynly");
                            }

                            if ($scope.errors.length > 0) {
                                $scope.inProgress = false;
                                return;
                            }

                            $scope.showRecommendation = false;
                            if (fromAddressResponse.data.data.recommendedAddress != null && fromAddressResponse.data.data.rynlyServiceAvailable) {
                                $scope.fromRecommendedAddress.line1 = fromAddressResponse.data.data.recommendedAddress.line1;
                                $scope.fromRecommendedAddress.line2 = fromAddressResponse.data.data.recommendedAddress.line2;
                                $scope.fromRecommendedAddress.city = fromAddressResponse.data.data.recommendedAddress.city;
                                $scope.fromRecommendedAddress.state = fromAddressResponse.data.data.recommendedAddress.state;
                                $scope.fromRecommendedAddress.zip = fromAddressResponse.data.data.recommendedAddress.zip;
                                $scope.fromRecommendedAddress.location = fromAddressResponse.data.data.recommendedAddress.location;
                                $scope.packageModel.fromAddress.location = null;
                                $scope.showRecommendation = true;
                                $scope.updateFromAddress = true;
                            }
                            else
                            {
                                $scope.packageModel.fromAddress.location = fromAddressResponse.data.data.validatedAddress.location;
                            }

                            if (toAddressResponse.data.data.recommendedAddress != null && toAddressResponse.data.data.rynlyServiceAvailable) {

                                $scope.toRecommendedAddress.line1 = toAddressResponse.data.data.recommendedAddress.line1;
                                $scope.toRecommendedAddress.line2 = toAddressResponse.data.data.recommendedAddress.line2;
                                $scope.toRecommendedAddress.city = toAddressResponse.data.data.recommendedAddress.city;
                                $scope.toRecommendedAddress.state = toAddressResponse.data.data.recommendedAddress.state;
                                $scope.toRecommendedAddress.zip = toAddressResponse.data.data.recommendedAddress.zip;
                                $scope.toRecommendedAddress.location = toAddressResponse.data.data.recommendedAddress.location;
                                $scope.packageModel.toAddress.location = null;
                                $scope.showRecommendation = true;
                                $scope.updateToAddress = true;
                            }
                            else
                            {
                                $scope.packageModel.toAddress.location = toAddressResponse.data.data.validatedAddress.location;
                            }

                            $scope.sourceHub = fromAddressResponse.data.data.nearestHub;
                            $scope.destinationHub = toAddressResponse.data.data.nearestHub;

                            if ($scope.showRecommendation) {
                                $scope.modalInstance = $uibModal.open({
                                    templateUrl: 'modal.html',
                                    scope: $scope,
                                    backdrop: 'static',
                                    keyboard: false
                                });
                                return;
                            }

                            if ($scope.profile.updateProfile) {
                                $scope.updateProfileAddress();
                            }

                            if ($scope.profile.expeditedDelivery) {
                                $scope.setExpediteText();
                            }
                            $scope.inProgress = false;
                            $scope.step += 1;
                            $scope.editFrom = false;
                            $scope.profile.updateProfile = false;
                            return;
                        });
                    });
                });
            });
        }

        if ($scope.step == 2) {
            if ($scope.inProgress) { return; }
            $scope.inProgress = true;
            $scope.boxpackageCount = 0;

            if (!$scope.packageModel.deliveryMethodId)
                $scope.errors.push("Please select service type option");


            var packageItems = getPackageItems();
            if (packageItems.length <= 0) {
                $scope.errors.push("Please provide valid Flat Shipper / Box package details");
            }

            if ($scope.errors.length > 0) {
                $scope.inProgress = false;
                return;
            }

            $scope.sizeValidation();

            if ($scope.errors == null || $scope.errors.length != 0) {
                $scope.inProgress = false;
                return;
            }

            if ($scope.errors.length > 0) {
                $scope.inProgress = false;
                $scope.$apply();
                return;
            }
            if ($scope.packageModel.recipient.isSignatureRequired) {
                $scope.signatureCost = 1;
            }
            $scope.packageModel.items = packageItems;

                $scope.inProgress = false;
                $scope.step = $scope.step + 1;
                return;
            }

        if ($scope.step == 3) {
            if ($scope.inProgress) { return; }
            $scope.inProgress = true;
            $scope.packageModel.discount = 0;
            $scope.packageModel.promoCodeDisplayText = '';
            if ($scope.packageModel.promoCode) {
                $http.get('/api/user/validatePromoUser?promoCode=' + $scope.packageModel.promoCode).then(function (promoCodeResponse) {
                    if (promoCodeResponse.data.errors) {
                        promoCodeResponse.data.errors.forEach(function (x) {
                            $scope.errors.push(x);
                        })
                        $scope.inProgress = false;
                        return;
                    }

                    if (promoCodeResponse.data.success) {
                        $scope.packageModel.promoCodeId = promoCodeResponse.data.data.id;
                        $scope.packageModel.discount = promoCodeResponse.data.data.discount;
                        if ($scope.packageModel.promoCode.toLowerCase().trim() == "timbersfc") {
                            $scope.packageModel.promoCodeDisplayText = "";
                            var text = "<p style='color:green'>Thank you for supporting Rynly and  the Timbers FC, someone from our team will contact you soon to confirm your ticket giveaway entry.</p>";
                            $scope.packageModel.promoCodeDisplayText = $sce.trustAsHtml(text);
                        }
                        $scope.calculatePrice();
                        paymentInfo();
                        return;
                    }
                });
            }
            else if ($scope.profile.discount)
            {
                $scope.packageModel.discount = $scope.profile.discount.discountPercent;
                $scope.calculatePrice();
                paymentInfo();
                return;
            }
            else {
                $scope.calculatePrice();
                paymentInfo();
                return;
            }

        }

        // validate pay information
        if ($scope.step == 4) {
            if ($scope.inProgress) { return; }
            $scope.inProgress = true;
            $("#spinner").show();
            $scope.disablebutton = true;
            $http.post('/api/package/createpackage', $scope.packageModel).then(function (response) {
                $("#spinner").hide();
                $scope.disablebutton = false;

                if (response.data.success) {
                    $scope.packageCreated = true;
                    packageId = response.data.data.package.id;
                    $scope.dueDate = response.data.data.package.dueDate;
                    $scope.step = $scope.step + 1;
                    setTimeout(function (x) {
                        $("#packageLabel").load('/package/label/' + packageId);
                    }, 200);
                    $scope.inProgress = false;
                }
                if (!response.data.success && response.data.errors.length > 0) {
                    response.data.errors.forEach(function (x) {
                        $scope.errors.push(x);
                    });
                    $scope.inProgress = false;
                    return;
                }
            });



        }

    }

    paymentInfo = function () {
        if (!$scope.newCard) {
            $scope.setDueDate();
            $scope.step += 1;
            $scope.inProgress = false;
            return;
        }
        updatePaymentInfo();
        return;
    }

    updatePaymentInfo = function()
    {

        var paymentInfoEntered = ($scope.paymentModel.number && $scope.paymentModel.expirationMonth && $scope.paymentModel.expirationYear && $scope.paymentModel.cvc && $scope.paymentModel.name && $scope.paymentModel.address && $scope.paymentModel.zip);
        if (!paymentInfoEntered && $scope.newCard) {
            $scope.errors.push("Card number, expiry date, cvc, name, address, zip is required");
            $scope.inProgress = false;
            return;
        }

        $("#spinner").show();
        $scope.disablebutton = true;


        Stripe.setPublishableKey($scope.stripeKey);

        Stripe.card.createToken(
            {
                number: $scope.paymentModel.number,
                cvc: $scope.paymentModel.cvc,
                exp_month: $scope.paymentModel.expirationMonth,
                exp_year: $scope.paymentModel.expirationYear,
                address_zip: $scope.paymentModel.zip
            },
            function (status, response) {
                if (response.error) {
                    $scope.errors.push(response.error.message);
                    $scope.inProgress = false;
                    $("#spinner").hide();
                    $scope.$apply();
                    return;
                }
                $scope.profile.paymentNumber = response.card.last4;
                var requestObject = {
                    number: $scope.profile.paymentNumber,
                    cardToken: response.id
                }
                $http.post('/api/user/payment', requestObject).then(function (response) {

                    $("#spinner").hide();
                    $scope.disablebutton = false;

                    if (response.data.errors.length > 0) {
                        response.data.errors.forEach(function (x) {
                            $scope.errors.push(x);
                        })
                        $scope.inProgress = false;
                        return;
                    }

                    $scope.setDueDate();
                    $scope.step += 1;
                    $scope.inProgress = false;
                    return;
                });
            });
    }

    $scope.skipeNext = function () {
        $scope.step = $scope.step + 1;
    }

    getPackageItems = function () {
        var packageItems = [];
        if ($scope.envelope && $scope.envelope.count > 0) {
            packageItems.push({
                "type": 0,
                "envelopeCount": $scope.envelope.count,
                "height": 0,
                "width": 0,
                "depth": 0
            });
        }
        else {
            $scope.boxPackage.forEach(function (x) {
                    if (x.height > 0 && x.width > 0 && x.depth > 0) {
                        $scope.boxpackageCount = $scope.boxpackageCount + 1;
                        packageItems.push({
                            "type": 1,
                            "envelopeCount": 0,
                            "height": x.height,
                            "width": x.width,
                            "depth": x.depth
                        });
                    }
                });
            }
        return packageItems;
    }

    $scope.printLabel = function () {
        window.print();
    }
    $scope.sizeValidation = function () {

        if ($scope.envelope.count != null && $scope.envelope.count > $scope.envelopelimit && $scope.envelope.count != "" && $scope.envelope.count != 0) {
            $scope.errors.push("Please enter valid package dimensions");
            $scope.sizeError = true;
            return;
        }
        if ($scope.packageType == "boxPackage") {
            for (var i = 0; i < $scope.boxPackage.length; i++) {
                var x = $scope.boxPackage[i];
                var validHeight = ($scope.size.exec(x.height) != null);
                var validWidth = ($scope.size.exec(x.width) != null);
                var validDepth = ($scope.size.exec(x.depth) != null);

                var allEmpty = ((x.height == null || x.height == "") && (x.width == null || x.width == "") && (x.depth == null || x.depth == ""));
                if ((!validHeight || !validWidth || !validDepth || x.priceCategory == null) && (!allEmpty)) {
                    $scope.errors.push("Please enter valid package dimensions");
                    return;
                }
            }
        }
    }

    $scope.recieptSignature = function (val) {
        $scope.packageModel.recipient.isSignatureRequired = val;
        $scope.isSignatureRequired = val;
        $scope.calculatePrice();
    }

    $scope.calculatePrice = function () {
        $scope.totalAmount = 0;
        $scope.totalSpecial = 0;
        var specialDiscountRate = 0;
        $scope.signatureRequiredAmount = 1;
        $scope.errors = [];
        var packagePriceList = $scope.packagePrizeList;
        if ($scope.packageType != "boxPackage") {
            packagePrice = packagePriceList.filter(function (p) { return $scope.packageType == p.name });
            $scope.totalAmount = $scope.totalAmount + packagePrice[0].amount;
            $scope.totalSpecial = $scope.totalSpecial + packagePrice[0].totalAmount;
        }
        else {
            $scope.boxPackage.forEach(function (x) {
                var validHeight = ($scope.size.exec(x.height) != null);
                var validWidth = ($scope.size.exec(x.width) != null);
                var validDepth = ($scope.size.exec(x.depth) != null);
                var allEmpty = ((x.height == null || x.height == "") && (x.width == null || x.width == "") && (x.depth == null || x.depth == ""))
                if ((validHeight && validWidth && validDepth) && (!allEmpty)) {
                    if (x.height > 0 && x.width > 0 && x.depth > 0) {
                        var area = x.height * x.width * x.depth;
                        var validPackage = packagePriceList.filter(function (p) { return area >= p.areaStart && area <= p.areaEnd });
                        if (validPackage && validPackage.length > 0) {
                            $scope.totalAmount = $scope.totalAmount + validPackage[0].amount;
                            $scope.totalSpecial = $scope.totalSpecial + validPackage[0].totalAmount;
                            x.priceCategory = validPackage[0].name;
                        }
                        else {
                            $scope.errors.push("Please enter valid package dimensions");
                            x.priceCategory = null;
                            return;
                        }
                    }
                }
                else {
                    x.priceCategory = null;
                }
            });
        }
        if ($scope.packageModel.isExpedited) {
            $scope.totalAmount = $scope.totalAmount * 2;
            $scope.totalSpecial = $scope.totalSpecial * 2;
        }
        if ($scope.packageModel.recipient.isSignatureRequired) {
            $scope.totalSpecial = $scope.totalSpecial + $scope.signatureRequiredAmount;
        }
        if ($scope.packageModel.discount) {
            specialDiscountRate = ($scope.totalSpecial * $scope.packageModel.discount) / 100;
            $scope.discSpl = $scope.totalSpecial - specialDiscountRate;
        }
    }

    $scope.selectPackage = function (package) {
        $scope.packageModel.promoCode = '';
        $scope.packageType = package;
        if (package == "RYNLY ENVELOPE") {
            $scope.envelope.count = "1";
            $scope.boxPackage = [{
                "type": 0
            }]
        }
        else if (package != "boxPackage") {
            var boxPackageList = $scope.packagePrizeList.filter(function (i) {
                return i.type == 1;
            });
            var defaultDimension = boxPackageList.filter(function (i) {
                return i.name == package;
            })[0].defaultDimension;
             $scope.envelope.count = "";
             $scope.boxPackage = [{
                "type": 1,
                "envelopeCount": 0,
                "height": defaultDimension.height,
                "width": defaultDimension.width,
                "depth": defaultDimension.depth
            }]
        }
        if (package == "boxPackage") {
            $scope.envelope.count = "";
            $scope.boxPackage = [{
                "type": 1
            }]
        }
        $scope.calculatePrice();
    }
    $scope.deletePackage = function (index) {
        $scope.boxPackage.splice(index, 1);
        $scope.calculatePrice()
    }

    $scope.trackPackage = function () {
        $http.get('/api/package/track?trackingNumber=' + $scope.trackModel.trackingNumber).then(function (trackResponse) {
            $scope.trackResponse = trackResponse.data;
            if (trackResponse.data.success && trackResponse.data.data) {
                $scope.changes = trackResponse.data.data.changes;
            }
        });
        $scope.$apply();
    }

    // $scope.loadSettings = function () {
    //     $http.get("/api/settings").then(function (apiresponse) {
    //         $scope.settings = apiresponse.data.data;
    //         $scope.deliveryMethods = $scope.settings.deliveryMethods;
    //         $scope.packagePrizeList = $scope.settings.packagePrizeList;
    //         $scope.deliveryTimeList = $scope.settings.dropDownData.filter(function (i) {
    //             return i.key === 'DeliveryTime';
    //         })[0].dropDownItems;
    //         $scope.packageModel.deliveryTimeId = $scope.deliveryTimeList[0].key;
    //     });
    // }

    $scope.toggleNewCard = function () {
        if ($scope.newCard && !$scope.profile.paymentInfoAdded)
            return;

        $scope.newCard = !$scope.newCard
    }

    $scope.loadProfile = function () {
        try {
            $("#spinner").show();
            // $http.post('/api/user/profile').then(function (response) {
            //     if (response.data.success && response.data.data) {
            //         $scope.profile = response.data.data;
            //         var profileAddress = $scope.profile.personalInformation.address;
            //         $scope.packageModel.fromAddress = {};
            //         $scope.packageModel.fromAddress.line1 = profileAddress.line1;
            //         $scope.packageModel.fromAddress.line2 = profileAddress.line2;
            //         $scope.packageModel.fromAddress.state = profileAddress.state;
            //         $scope.packageModel.fromAddress.city = profileAddress.city;
            //         $scope.packageModel.fromAddress.zip = profileAddress.zip;
            //         if (profileAddress.location && profileAddress.location.latitude) {
            //             $scope.packageModel.fromAddress.location = profileAddress.location;
            //         }
            //         $scope.packageModel.fromAddress.company = $scope.profile.businessName;
            //         $scope.packageModel.fromAddress.contactName = $scope.profile.personalInformation.firstName + " " + $scope.profile.personalInformation.lastName;
            //         $scope.packageModel.fromAddress.phone = $scope.profile.phone;
            //         $scope.packageModel.pickupNote = $scope.profile.pickupNote;
            //         $scope.setCardDetails();
            //         setPromoText();
            //     }
            // });

            // $scope.getAddressList();
            $("#spinner").hide();
        } catch (e) {
            $("#spinner").hide();
        }
    }
    $scope.loadSettings();
    $scope.loadProfile();

    $scope.updateProfileAddress = function () {
        $("#spinner").show();
        $http.post('/api/user/address', $scope.packageModel.fromAddress).then(function (response) {
            $scope.response = response.data;
            if (response.data.success) {
                $scope.addressUpdateDone = true;
                setToastrOptions();
                toastr.success("Profile address updated successfully");
            }

            $("#spinner").hide();
        });
    }

    $scope.EditFromAddress = function (val) {
        $scope.editFrom = val;
        if (val == true) {
            $("#pkgFrom").removeClass("disabledSection");
        }
        else {
            $scope.packageModel.fromAddress = jQuery.extend(true, {}, $scope.profile.personalInformation.address);
            $scope.packageModel.fromAddress.company = $scope.profile.businessName;
            $scope.packageModel.fromAddress.contactName = $scope.profile.personalInformation.firstName + " " + $scope.profile.personalInformation.lastName;
            $scope.packageModel.fromAddress.phone = $scope.profile.phone;
            $("#pkgFrom").addClass("disabledSection");
        }
    }
});

$("document").ready(function () {
    $(".tab-header").click(function () {
        $('.active').removeClass('active');
        $(this).closest("li").addClass('active');
        $(this).closest("li").find(".tab-header").addClass("active");
        $(this).closest("li").find(".tab-content-custom").addClass("active");
        $("#map").removeClass('active');
        $("#zip").val('');
        $(".sidenav").hide();

    });


    var opts = {
        lines: 10, // The number of lines to draw
        length: 20, // The length of each line
        width: 6, // The line thickness
        radius: 30, // The radius of the inner circle
        scale: 1, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#5c5d5c', // CSS color or array of colors
        fadeColor: 'transparent', // CSS color or array of colors
        speed: 1, // Rounds per second
        rotate: 0, // The rotation offset
        animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
        direction: 1, // 1: clockwise, -1: counterclockwise
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: '0 0 1px transparent', // Box-shadow for the lines
        position: 'absolute' // Element positioning
    };

    var target = document.getElementById('spinner');
    var spinner = new Spinner(opts).spin(target);

    $(".hamburger").click(function () {
        $(".sidenav").toggle();

    })
})

function ToggleTrackPackage() {
    $("#track-package-tab").click();
    window.scrollTo(0, 0);
}

function ToggleAccordian(cls) {
    $("." + cls).toggle();
    $("." + cls + "-fa").toggleClass("fa-plus fa-minus");
}

