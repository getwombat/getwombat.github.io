var wombatEmcon = angular.module('wombatEmcon', 
  ['ngResource', 
  'ngRoute',
  'ngMaterial',
  'ngSanitize',
  'angular-inview']);
wombatEmcon.config(function($mdIconProvider) {
  $mdIconProvider
    .defaultIconSet('MaterialIcons/mdi.svg')
});
wombatEmcon.config(function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
    rewriteLinks: false
  });
})
wombatEmcon.config(function($mdThemingProvider) 
{
  var wombatYellowMap = $mdThemingProvider.extendPalette('yellow', {
    '500': '#fbb811',
    'A100': '#f6ca52',
    'contrastDefaultColor': 'dark'
  });
  $mdThemingProvider.definePalette('wombatYellow', wombatYellowMap);

  var wombatBlueMap = $mdThemingProvider.extendPalette('blue', {
    '100': '#b2ebf2',
    '200': '#80deea',
    '500': '#00acc1',
    '600': '#80deea',
    'A100': "#80deea",
    'contrastDefaultColor': 'light'
  });
  $mdThemingProvider.definePalette('wombatBlue', wombatBlueMap);

  $mdThemingProvider.theme('default')
    .primaryPalette('wombatYellow', {
      'default': '500', 
      'hue-1': '100',
      'hue-2': '200',
      'hue-3': 'A100'
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('wombatBlue', {
    });
    $mdThemingProvider.theme('wombatBlue')
      .primaryPalette('wombatBlue', {
      'default': '500', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })

});
wombatEmcon.controller('LandingPageCtrl', 
  function($scope, $location, $window, $resource, $timeout,
    $mdDialog, $mdMenu) 
  {
    $scope.preloaderHidden = false;

    $scope.initLandingPage = function()
    {
      $scope.preloaderHidden = false;
      $timeout(function(){
        $scope.preloaderHidden = true;
      },500);
    }
  });