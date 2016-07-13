var rhymesApp = angular.module('rhymesApp', ['ngRoute', 'firebase', 'rhymesServices', 'rhymesController']);


rhymesApp.config(['$routeProvider','$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/points', {
        templateUrl: 'partials/rhymes-gateway.html',
        controller: 'feedController'
      }).
      when('/books', {
        templateUrl: 'partials/books.html',
        controller: 'feedController'
      }).
      when('/surahs', {
        templateUrl: 'partials/surahs-gateway.html',
        controller: 'surahsListController'
      }).
      when('/surahs/:surahIndex', {
        templateUrl: 'partials/surahs-detail.html',
        controller: 'surahsDetailController'
      }).
      when('/global', {
        templateUrl: 'partials/globalfeed.html',
        controller: 'globalFeedController'
      }).
      when('/welcome', {
        templateUrl: 'partials/login.html',
        controller: 'indexController'
      }).
      otherwise({
        redirectTo: '/welcome'
      });

      // use the HTML5 History API
       $locationProvider.html5Mode(true);

  }]);
