var rhymesServices = angular.module('rhymesServices', ['ngResource']);

rhymesServices.factory('Surah', ['$resource',
  function($resource){
    return $resource('resources/Quran/:surahId.json', {}, {
      query: {method:'GET', params:{surahId:'surahs'}, isArray:true}
    });
  }]);


rhymesServices.service('AuthenticationService', ['$firebaseAuth', function($firebaseAuth)
{

  this.getAuthService = function(){
    var ref = new Firebase("https://schoolofislam.firebaseio.com");   
    return ref;
  };
}]);
