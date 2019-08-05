// Write your JavaScript code.


var userApp = angular.module("rynly.userweb", ['ui.bootstrap']);

// userApp.directive('ngEnter', function () { //a directive to 'enter key press' in elements with the "ng-enter" attribute

//     return function (scope, element, attrs) {

//         element.bind("keydown keypress", function (event) {
//             if (event.which === 13) {
//                 scope.$apply(function () {
//                     scope.$eval(attrs.ngEnter);
//                 });

//                 event.preventDefault();
//             }
//         });
//     };
// })

// userApp.filter('range', function () {
//     return function (input, total) {
//         total = parseInt(total);
//         for (var i = 1; i <= total; i++)
//             input.push(i);
//         return input;
//     };
// });

// userApp.directive('onlyNumbers', function () {
//     return {
//         restrict: 'A',
//         link: function (scope, elm, attrs, ctrl) {
//             elm.on('keydown', function (event) {
//                 if (event.shiftKey) { event.preventDefault(); return false; }

//                 if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
//                     // backspace, enter, escape, arrows
//                     return true;
//                 } else if (event.which >= 48 && event.which <= 57) {
//                     // numbers 0 to 9
//                     return true;
//                 } else if (event.which >= 96 && event.which <= 105) {
//                     // numpad number
//                     return true;
//                 }
//                 else {
//                     event.preventDefault();
//                     return false;
//                 }
//             });
//         }
//     }
// // });

// userApp.directive('googleplace', function () {

//     var componentForm = {
//         premise: 'long_name',
//         street_number: 'short_name',
//         route: 'long_name',
//         sublocality_level_1: 'long_name',
//         locality: 'long_name',
//         administrative_area_level_1: 'short_name',
//         country: 'long_name',
//         postal_code: 'short_name'
//     };
//     var mapping = {
//         premise: 'BuildingName',
//         street_number: 'Unit',
//         route: 'Street',
//         sublocality_level_1: 'Suburb',
//         locality: 'City',
//         administrative_area_level_1: 'State',
//         country: 'Country',
//         postal_code: 'PostCode'
//         //Region, District, Level
//     }
//     return {
//         require: 'ngModel',
//         scope: {
//             ngModel: '=',
//             details: '=?'
//         },
//         link: function (scope, element, attrs, model) {
//             var options = {
//                 types: [],
//                 componentRestrictions: {}
//             };
//             // scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
//             // google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
//             //     var place = scope.gPlace.getPlace();
//             //     var location = place.geometry && place.geometry.location ? {
//             //         Latitude: place.geometry.location.lat(),
//             //         Longitude: place.geometry.location.lng()
//             //     } : {};
//             //     // Get each component of the address from the place location
//             //     // and fill the corresponding field on the form.
//             //     for (var i = 0; i < place.address_components.length; i++) {
//             //         var addressType = place.address_components[i].types[0];
//             //         if (componentForm[addressType]) {
//             //             var val = place.address_components[i][componentForm[addressType]];
//             //             location[mapping[addressType]] = val;
//             //         }
//             //     }

//             //     location.FormattedAddress = place.formatted_address;
//             //     location.PlaceId = place.place_id;

//             //     scope.$apply(function () {
//             //         scope.details = {
//             //             city: location.City,
//             //             line1: place.name,
//             //             line2: "",
//             //             state: location.State,
//             //             zip: location.PostCode,
//             //             location: { latitude: location.Latitude, longitude: location.Longitude }
//             //         };
//             //         model.$setViewValue(element.val());
//             //     });
//             // });
//         }
//     };
// });

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

// // register controller
// angular.module("rynly.userweb").controller("RegisterController", function ($scope, $http) {
//     $scope.model = {
//         address: {}
//     };
//     $scope.response = {};
//     $scope.registrationDone = false;



//     $scope.register = function () {
//         $http.post('/user/home/register', $scope.model).then(function (response) {
//             $scope.response = response.data;
//             if (response.data.success) {
//                 $scope.registrationDone = true
//             }
//         });
//     }
// });

// // Accept Terms and Condition Controller
// angular.module("rynly.userweb").controller("AcceptTnCController", function ($scope, $http) {
//     $scope.AccepTnC = function () {
//         $http.post('/user/home/AcceptTnCPost', $scope.model).then(function (res) {
//             if (res.data.success) {
//                 window.location.href = '/user';
//             }
//         });
//     }
// });

// //update profile controller
// angular.module("rynly.userweb").controller("ProfileUpdateController", function ($scope, $http) {
//     $scope.model = {};
//     $scope.response = {};
//     $scope.registrationDone = false;

//     // $scope.getProfile = function () {
//     //     $http.post('/api/user/profile').then(function (response) {
//     //         $scope.response = response.data;
//     //         if (response.data.success) {
//     //             $scope.model = response.data.data;
//     //             if ($scope.model.notifications == null)
//     //                 $scope.model.notifications = [];
//     //         }
//     //     });
//     // }

//     // $scope.getProfile();

//     $scope.toggleNotificaitons = function toggleNotificaitons(notificaitontype) {
//         var idx = $scope.model.notifications.indexOf(notificaitontype);

//         // Is currently selected
//         if (idx > -1) {
//             $scope.model.notifications.splice(idx, 1);
//         }

//         // Is newly selected
//         else {
//             $scope.model.notifications.push(notificaitontype);
//         }
//     };

//     function setToastrOptions() {
//         toastr.options = {
//             "positionClass": "toast-top-center"
//         }
//     }

//     $scope.updateAddress = function () {
//         $("#spinner").show();


//         $http.post('/api/user/address', $scope.model.personalInformation.address).then(function (response) {
//             $scope.response = response.data;
//             if (response.data.success) {
//                 $scope.addressUpdateDone = true;
//                 setToastrOptions();
//                 toastr.success("Address saved successfully");
//             }

//             $("#spinner").hide();
//         });
//     }

//     $scope.updatePickupNotes = function () {
//         $("#spinner").show();

//         $http.post('/api/user/pickupNote?pickupNote='+$scope.model.pickupNote).then(function (response) {
//             $scope.response = response.data;
//             if (response.data.success) {
//                 setToastrOptions();
//                 toastr.success("Pickup notes saved successfully");
//             }
//             $("#spinner").hide();
//         });
//     }

//     $scope.updateNotifications = function () {
//         var notificaitonModel = {
//             "notifications": $scope.model.notifications
//         };
//         $("#spinner").show();


//         $http.post('/api/user/notification', notificaitonModel).then(function (response) {
//             $scope.response = response.data;
//             if (response.data.success) {
//                 $scope.notificaitonUpdateDone = true;
//                 setToastrOptions();
//                 toastr.success("Notification preference saved successfully");
//                 $("#spinner").hide();
//             }
//         });
//     }
// });



//forgot password controller
// angular.module("rynly.userweb").controller("ForgotPasswordController", function ($scope, $http) {
//     $scope.model = {};
//     $scope.forgotpasswordresponse;
//     $scope.response;

//     $scope.forgotPassword = function () {
//         $http.post('/user/home/ForgotPassword', $scope.model).then(function (response) {
//             $scope.forgotpasswordresponse = response.data;
//         });
//     }

//     $scope.resetPassword = function (token) {
//         $scope.model.VerificationToken = token;
//         $http.post('/user/home/ResetPassword', $scope.model).then(function (response) {
//             $scope.response = response.data;
//         });
//     }
// });

// angular.module("rynly.userweb").controller("LocationController", function ($scope, $http) {
//     $scope.zipcodeModel = {};
//     $scope.response = {};
//     $scope.hublist = null;
//     var map = null;

//     $scope.findhubs = function () {
//         $http.post('/user/home/FindHubs', $scope.zipcodeModel).then(function (response) {
//             $scope.response = response.data;
//             if (response.data.success) {
//                 $scope.hublist = response.data.data;
//                 var hublist = $scope.hublist;
//                 var Address = hublist.hubs[0];
//                 var Location = Address.address.location;
//                 var Longitude = Location.longitude;
//                 var Latitude = Location.latitude;
//                 document.getElementById('map').classList.add("active");
//                 document.getElementById('searchHub').classList.remove('active');
//                 if (map != null) {
//                     map.remove();
//                 }
//                 map = L.map('map');
//                 map.setView([Latitude, Longitude], 10);
//                 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 }).addTo(map);
//                 for (var i = 0; i < hublist.hubs.length; i++) {
//                     hublist = $scope.hublist;
//                     Address = hublist.hubs[i];
//                     Location = Address.address.location;
//                     Longitude = Location.longitude;
//                     Latitude = Location.latitude;
//                     L.marker([Latitude, Longitude]).addTo(map)
//                         .bindPopup(Address.address.line1 + '<br>' + Address.address.city + ' ' + Address.address.state + ' ' + Address.address.country)
//                         .openPopup();
//                 }
//             }
//         });
//     }
// });

// angular.module("rynly.userweb").controller("TrackController", function ($scope, $http, $compile) {
//     $scope.trackingNumber = "";
//     $scope.errorMessage = "";
//     $scope.track = function () {
//         $("#trackResult").html("");
//         if ($scope.trackingNumber.trim() == "") {
//             $scope.errorMessage = "Enter a valid tracking number";
//         }
//         if ($scope.trackingNumber) {
//             $scope.errorMessage = "";
//             $("#trackResult").load("/user/home/trackview?trackingNumber=" + $scope.trackingNumber);
//         }
//     }
// });

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
        $scope.destinationHub = {};
    $scope.inProgress = false;
    $scope.promoText = "";
    $scope.editFrom = false;

    $scope.printLabel = function () {
        window.print();
    };

    });
    // $scope.sizeValidation = function () {

    //     if ($scope.envelope.count != null && $scope.envelope.count > $scope.envelopelimit && $scope.envelope.count != "" && $scope.envelope.count != 0) {
    //         $scope.errors.push("Please enter valid package dimensions");
    //         $scope.sizeError = true;
    //         return;
    //     }
    //     if ($scope.packageType == "boxPackage") {
    //         for (var i = 0; i < $scope.boxPackage.length; i++) {
    //             var x = $scope.boxPackage[i];
    //             var validHeight = ($scope.size.exec(x.height) != null);
    //             var validWidth = ($scope.size.exec(x.width) != null);
    //             var validDepth = ($scope.size.exec(x.depth) != null);

    //             var allEmpty = ((x.height == null || x.height == "") && (x.width == null || x.width == "") && (x.depth == null || x.depth == ""));
    //             if ((!validHeight || !validWidth || !validDepth || x.priceCategory == null) && (!allEmpty)) {
    //                 $scope.errors.push("Please enter valid package dimensions");
    //                 return;
    //             }
    //         }
    //     }
    // }

    // $scope.recieptSignature = function (val) {
    //     $scope.packageModel.recipient.isSignatureRequired = val;
    //     $scope.isSignatureRequired = val;
    //     $scope.calculatePrice();
    // }

    // $scope.calculatePrice = function () {
    //     $scope.totalAmount = 0;
    //     $scope.totalSpecial = 0;
    //     var specialDiscountRate = 0;
    //     $scope.signatureRequiredAmount = 1;
    //     $scope.errors = [];
    //     var packagePriceList = $scope.packagePrizeList;
    //     if ($scope.packageType != "boxPackage") {
    //         packagePrice = packagePriceList.filter(function (p) { return $scope.packageType == p.name });
    //         $scope.totalAmount = $scope.totalAmount + packagePrice[0].amount;
    //         $scope.totalSpecial = $scope.totalSpecial + packagePrice[0].totalAmount;
    //     }
    //     else {
    //         $scope.boxPackage.forEach(function (x) {
    //             var validHeight = ($scope.size.exec(x.height) != null);
    //             var validWidth = ($scope.size.exec(x.width) != null);
    //             var validDepth = ($scope.size.exec(x.depth) != null);
    //             var allEmpty = ((x.height == null || x.height == "") && (x.width == null || x.width == "") && (x.depth == null || x.depth == ""))
    //             if ((validHeight && validWidth && validDepth) && (!allEmpty)) {
    //                 if (x.height > 0 && x.width > 0 && x.depth > 0) {
    //                     var area = x.height * x.width * x.depth;
    //                     var validPackage = packagePriceList.filter(function (p) { return area >= p.areaStart && area <= p.areaEnd });
    //                     if (validPackage && validPackage.length > 0) {
    //                         $scope.totalAmount = $scope.totalAmount + validPackage[0].amount;
    //                         $scope.totalSpecial = $scope.totalSpecial + validPackage[0].totalAmount;
    //                         x.priceCategory = validPackage[0].name;
    //                     }
    //                     else {
    //                         $scope.errors.push("Please enter valid package dimensions");
    //                         x.priceCategory = null;
    //                         return;
    //                     }
    //                 }
    //             }
    //             else {
    //                 x.priceCategory = null;
    //             }
    //         });
    //     }
    //     if ($scope.packageModel.isExpedited) {
    //         $scope.totalAmount = $scope.totalAmount * 2;
    //         $scope.totalSpecial = $scope.totalSpecial * 2;
    //     }
    //     if ($scope.packageModel.recipient.isSignatureRequired) {
    //         $scope.totalSpecial = $scope.totalSpecial + $scope.signatureRequiredAmount;
    //     }
    //     if ($scope.packageModel.discount) {
    //         specialDiscountRate = ($scope.totalSpecial * $scope.packageModel.discount) / 100;
    //         $scope.discSpl = $scope.totalSpecial - specialDiscountRate;
    //     }
    // }

    // $scope.selectPackage = function (package) {
    //     $scope.packageModel.promoCode = '';
    //     $scope.packageType = package;
    //     if (package == "RYNLY ENVELOPE") {
    //         $scope.envelope.count = "1";
    //         $scope.boxPackage = [{
    //             "type": 0
    //         }]
    //     }
    //     else if (package != "boxPackage") {
    //         var boxPackageList = $scope.packagePrizeList.filter(function (i) {
    //             return i.type == 1;
    //         });
    //         var defaultDimension = boxPackageList.filter(function (i) {
    //             return i.name == package;
    //         })[0].defaultDimension;
    //          $scope.envelope.count = "";
    //          $scope.boxPackage = [{
    //             "type": 1,
    //             "envelopeCount": 0,
    //             "height": defaultDimension.height,
    //             "width": defaultDimension.width,
    //             "depth": defaultDimension.depth
    //         }]
    //     }
    //     if (package == "boxPackage") {
    //         $scope.envelope.count = "";
    //         $scope.boxPackage = [{
    //             "type": 1
    //         }]
    //     }
    //     $scope.calculatePrice();
    // }
    // $scope.deletePackage = function (index) {
    //     $scope.boxPackage.splice(index, 1);
    //     $scope.calculatePrice()
    // }

    // $scope.trackPackage = function () {
    //     $http.get('/api/package/track?trackingNumber=' + $scope.trackModel.trackingNumber).then(function (trackResponse) {
    //         $scope.trackResponse = trackResponse.data;
    //         if (trackResponse.data.success && trackResponse.data.data) {
    //             $scope.changes = trackResponse.data.data.changes;
    //         }
    //     });
    //     $scope.$apply();
    // }

    // // $scope.loadSettings = function () {
    // //     $http.get("/api/settings").then(function (apiresponse) {
    // //         $scope.settings = apiresponse.data.data;
    // //         $scope.deliveryMethods = $scope.settings.deliveryMethods;
    // //         $scope.packagePrizeList = $scope.settings.packagePrizeList;
    // //         $scope.deliveryTimeList = $scope.settings.dropDownData.filter(function (i) {
    // //             return i.key === 'DeliveryTime';
    // //         })[0].dropDownItems;
    // //         $scope.packageModel.deliveryTimeId = $scope.deliveryTimeList[0].key;
    // //     });
    // // }

    // $scope.toggleNewCard = function () {
    //     if ($scope.newCard && !$scope.profile.paymentInfoAdded)
    //         return;

    //     $scope.newCard = !$scope.newCard
    // }

    // $scope.loadProfile = function () {
    //     try {
    //         $("#spinner").show();
    //         // $http.post('/api/user/profile').then(function (response) {
    //         //     if (response.data.success && response.data.data) {
    //         //         $scope.profile = response.data.data;
    //         //         var profileAddress = $scope.profile.personalInformation.address;
    //         //         $scope.packageModel.fromAddress = {};
    //         //         $scope.packageModel.fromAddress.line1 = profileAddress.line1;
    //         //         $scope.packageModel.fromAddress.line2 = profileAddress.line2;
    //         //         $scope.packageModel.fromAddress.state = profileAddress.state;
    //         //         $scope.packageModel.fromAddress.city = profileAddress.city;
    //         //         $scope.packageModel.fromAddress.zip = profileAddress.zip;
    //         //         if (profileAddress.location && profileAddress.location.latitude) {
    //         //             $scope.packageModel.fromAddress.location = profileAddress.location;
    //         //         }
    //         //         $scope.packageModel.fromAddress.company = $scope.profile.businessName;
    //         //         $scope.packageModel.fromAddress.contactName = $scope.profile.personalInformation.firstName + " " + $scope.profile.personalInformation.lastName;
    //         //         $scope.packageModel.fromAddress.phone = $scope.profile.phone;
    //         //         $scope.packageModel.pickupNote = $scope.profile.pickupNote;
    //         //         $scope.setCardDetails();
    //         //         setPromoText();
    //         //     }
    //         // });

    //         // $scope.getAddressList();
    //         $("#spinner").hide();
    //     } catch (e) {
    //         $("#spinner").hide();
    //     }
    // }
    // // $scope.loadSettings();
    // // $scope.loadProfile();

    // $scope.updateProfileAddress = function () {
    //     $("#spinner").show();
    //     $http.post('/api/user/address', $scope.packageModel.fromAddress).then(function (response) {
    //         $scope.response = response.data;
    //         if (response.data.success) {
    //             $scope.addressUpdateDone = true;
    //             setToastrOptions();
    //             toastr.success("Profile address updated successfully");
    //         }

    //         $("#spinner").hide();
    //     });
    // }

    // $scope.EditFromAddress = function (val) {
    //     $scope.editFrom = val;
    //     if (val == true) {
    //         $("#pkgFrom").removeClass("disabledSection");
    //     }
    //     else {
    //         $scope.packageModel.fromAddress = jQuery.extend(true, {}, $scope.profile.personalInformation.address);
    //         $scope.packageModel.fromAddress.company = $scope.profile.businessName;
    //         $scope.packageModel.fromAddress.contactName = $scope.profile.personalInformation.firstName + " " + $scope.profile.personalInformation.lastName;
    //         $scope.packageModel.fromAddress.phone = $scope.profile.phone;
    //         $("#pkgFrom").addClass("disabledSection");
    //     }
    // }


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

