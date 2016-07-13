var rhymesController = angular.module('rhymesController', []);
rhymesController.controller('indexController', ['$rootScope', 'Surah', '$firebaseAuth' ,'$location', function($rootScope, Surah, $firebaseAuth , $location)
{

  $rootScope.login = function(){
        var ref = new Firebase("https://schoolofislam.firebaseio.com");
        var auth = $firebaseAuth(ref);
        $rootScope.auth = auth;
        var loginEmail = $('#loginEmail').val();
        var loginPassword = $('#loginPassword').val();
        ref.authWithPassword({
          email    : loginEmail,
          password : loginPassword
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {

            console.log("Authenticated successfully with payload:", authData);

        };
      });
      // any time auth status updates, add the user data to scope
      auth.$onAuth(function(authData) {
        var userName;
        var pointsUrl = "https://schoolofislam.firebaseio.com/points/" + authData.uid;
        var pointsRef = new Firebase(pointsUrl);
        pointsRef.on("value", function(snapshot) {
        userName = snapshot.val().user;
        $rootScope.userName = userName;

      });
      $rootScope.authData = authData;
      $('#loginModal').modal('hide');
      $location.path("/welcome");
    });

    }
    $rootScope.register = function (){
          var ref = new Firebase("https://schoolofislam.firebaseio.com");
          var registerEmail = $('#registerEmail').val();
          var registerPassword = $('#registerPassword').val();
          var registerName =  $('#registerName').val();
          ref.createUser({
            email    : registerEmail,
            password : registerPassword
          }, function(error, userData) {
            if (error) {
              console.log("Error creating user:", error);
            } else {
          console.log("Successfully created user account with uid:", userData.uid);
            $rootScope.authData = userData;
          var pointsRef = "https://schoolofislam.firebaseio.com/points/" + userData.uid;
          var pointsFirebaseRef = new Firebase(pointsRef);
          pointsFirebaseRef.set({
            totalPoints: 0,
            user: registerName
          });
          $('#registerModal').modal('hide');
        }
          });

      };

      $rootScope.facebookLogin = function(){
        // create an instance of the authentication service
        var ref = new Firebase("https://schoolofislam.firebaseio.com");
        var auth = $firebaseAuth(ref);
        $rootScope.auth = auth;

        // login with Facebook
        auth.$authWithOAuthPopup("facebook").then(function(authData) {
          console.log("Logged in!");
        }).catch(function(error) {
          console.log("Authentication failed:", error);
        });
        // any time auth status updates, add the user data to scope
        auth.$onAuth(function(authData) {
        $rootScope.authData = authData;
        $rootScope.userName = authData.facebook.displayName;
        $('#loginFacebook').modal('hide');
        $location.path("/welcome");
      });
      }
}]);

rhymesController.controller('surahsListController' , ['$scope', 'Surah',
function($scope, Surah){
  $scope.surahs = Surah.query();
  $scope.orderProp = 'index';
}]);

rhymesController.controller('surahsDetailController', ['$scope', 'Surah','$routeParams' ,'$firebaseObject',function($scope, Surah, $routeParams,$firebaseObject)
{

  var points = 0;
  Surah.query(function(data){
    $scope.surahs = data;
    var surah = $scope.surahs[$routeParams.surahIndex];
    $scope.position = $routeParams.surahIndex;
    $scope.surah = surah;
    var surahName = surah.name;
    var surahName = surahName.replace("." , " ");
    // create an instance of the authentication service
    var surahUrl = "https://schoolofislam.firebaseio.com/surahs/" + $scope.authData.uid + "/" + $routeParams.surahIndex;
    var pointsUrl = "https://schoolofislam.firebaseio.com/points/" + $scope.authData.uid;
    $scope.surahUrl = surahUrl;
    var ref = new Firebase(surahUrl);
    var pointsRef = new Firebase(pointsUrl);
    var obj = $firebaseObject(ref);
    var userName = $scope.userName;

    // to take an action after the data loads, use the $loaded() promise
     obj.$loaded().then(function(){
        ref.once('value', function(snapshot) {
          if (!(snapshot.hasChild("points"))) {
            pointsRef.once('value', function(snapshot) {
              if (!(snapshot.hasChild("totalPoints"))) {
                pointsRef.set({
                  totalPoints: 0,
                  user: userName
                });
              }
            });
            ref.set({
              points: 0,
              timestamp: Firebase.ServerValue.TIMESTAMP,
              surah: surahName
            });
          }
        });

        points += obj.points;
        $scope.points = points;
       // To iterate the key/value pairs of the object, use angular.forEach()

     });

     // To make the data available in the DOM, assign it to $scope
     $scope.surahsDetailsData = obj;
     // For three-way data bindings, bind it to the scope instead
     obj.$bindTo($scope, "surahsDetailsData");
   });
}]);

  rhymesController.controller('feedController', ['$rootScope', '$scope', '$firebaseObject' ,function($rootScope, $scope, $firebaseObject){

    if($scope.userName){
      // create an instance of the authentication service
      var userUrl ="https://schoolofislam.firebaseio.com/surahs/" + $scope.authData.uid;
      $scope.userUrl = userUrl;
      var pointsUrl = "https://schoolofislam.firebaseio.com/points/" + $scope.authData.uid;
      $scope.pointsUrl = pointsUrl;

      var ref = new Firebase(userUrl);
      var pointsRef = new Firebase(pointsUrl);
      var obj = $firebaseObject(ref);

      var totalPoints = 0;

      // to take an action after the data loads, use the $loaded() promise
       obj.$loaded().then(function() {
         var userName = "";

         pointsRef.on("value", function(snapshot) {
           userName = snapshot.val().user;
           if(!userName){
             userName = $scope.authData.facebook.displayName;
           }
           $scope.userName = userName;
         }, function (errorObject) {
           console.log("The read failed: " + errorObject.code);
         });

         // To iterate the key/value pairs of the object, use angular.forEach()
         angular.forEach(obj, function(value, key) {
            totalPoints += value.points;
            $rootScope.totalPoints = totalPoints;

         });
       });

       // To make the data available in the DOM, assign it to $scope
       $scope.feedData = obj;


       // For three-way data bindings, bind it to the scope instead
       obj.$bindTo($scope, "feedData");
    }

   }]);

    rhymesController.controller("globalFeedController", ['$scope', '$firebaseObject', function($scope, $firebaseObject){
          // create an instance of the authentication service
          var pointsUrl ="https://schoolofislam.firebaseio.com/points/"
          var ref = new Firebase(pointsUrl);
          var obj = $firebaseObject(ref);


          // to take an action after the data loads, use the $loaded() promise
           obj.$loaded().then(function() {

           });

           // To make the data available in the DOM, assign it to $scope
           $scope.globalFeedData = obj;

           // For three-way data bindings, bind it to the scope instead
           obj.$bindTo($scope, "globalFeedData");


     }]);

rhymesController.filter('orderObjectBy', function() {
  return function(globalFeedData, field, reverse) {
    var filtered = [];
    angular.forEach(globalFeedData, function(item) {
      if(item){
          filtered.push(item);
      }
      console.log("filterd:" + item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});
