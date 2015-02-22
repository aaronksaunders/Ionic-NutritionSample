// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngResource'])
.value('nutritionixConst', {
  'appId' :'8abbcd8e',
  'appKey' : '36e8d264537037ee7e832a41902ffe57'
})
/**
* sample using collection repeat and data is provided using $htp and $resource 
* 
* additional documentation on collection-repeat
* - http://ionicframework.com/docs/api/directive/collectionRepeat/
*/
.controller('HomeCtrl', function($scope, DataService,DataServiceHTTP, Weather) {

  $scope.data = {searchKey:''};

  $scope.getItemHeight = function(item, index) {
    //Make evenly indexed items be 10px taller, for the sake of example
    return 80;
  };

  /**
  *
  */
  $scope.doSearch = function() {
    console.debug("Searching for: " +  $scope.data.searchKey);

    if ( true ) {

      // use the $resource based service
      var promise = DataService.getAll( { 
        'term' : $scope.data.searchKey, 
        'results':'0:50',      // <-- variable substitution
        //'fields':'item_name'    <-- you can specify field params
      }).$promise;
      promise.then(function(_response) {
        console.debug(" The data " + JSON.stringify(_response));
        $scope.items = _response.hits;
      });

    } else {
      // use the $http based service
      var promise = DataServiceHTTP.getAll($scope.data.searchKey);
      promise.then(function(_response) {
        console.debug(" The data " + JSON.stringify(_response.data));
        $scope.items = _response.data.hits;
      });
    }
  };
})
/**
*
*/
.factory('DataService', function( $resource, nutritionixConst){
  var aSearchObject = $resource('https://api.nutritionix.com/v1_1/search/:term',{term: '@term'},{
    getAll : {
      method : 'get',
      //isArray : true,
      params : {
        results  : ':results',
        appId : nutritionixConst.appId,
        appKey  :nutritionixConst.appKey,
        // brand_id:'513fbc1283aa2dc80c00001f',
        fields : ':fields',
      }
    }
  });
  return {
    /**
    * we can specify the params, the query string and the default fields
    * to turn in the query along with the result size
    */
    getAll : function(_params) {
      var defaultFields = 'brand_id,item_name,item_id,brand_name,nf_calories,nf_total_fat';

      if (!_params.fields) {
        _params.fields = defaultFields;
      }
      return aSearchObject.getAll(_params);             
    }
  }

})
/**
*
*/
.factory('DataServiceHTTP', function( $http, nutritionixConst){
  return {
    getAll : function(_key) {

      return $http.get('https://api.nutritionix.com/v1_1/search/' + _key,{
        'params' : {
          results  : '0:50',
          appId : nutritionixConst.appId,
          appKey  :nutritionixConst.appKey,
          // brand_id:'513fbc1283aa2dc80c00001f',
          fields : 'brand_id,item_name,item_id,brand_name,nf_calories,nf_total_fat'
        }
      });
    }
  }
})

.factory('Weather', function($resource) {

  var API_PATH = 'http://api.openweathermap.org/data/2.5/weather';

  var Weather = $resource(API_PATH);

  return {
    getWeather: function(weatherParams) {
      return Weather.get(weatherParams, function(successResult) {
        return successResult;
      }, function(errorResult) {
        console.log(errorResult);
      });             
    }
  }
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'home.html',
    controller : 'HomeCtrl'
  });

  $urlRouterProvider.otherwise("/");
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  if(window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if(window.StatusBar) {
    StatusBar.styleDefault();
  }
});
});
