var wombatLandingPage = angular.module('wombatLandingPage', 
  ['ngResource', 
  'ngRoute',
  'ngMaterial',
  'ngSanitize',
  'angular-inview']);
wombatLandingPage.config(function($mdIconProvider) {
  $mdIconProvider
    .defaultIconSet('MaterialIcons/mdi.svg')
});
wombatLandingPage.config(function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
    rewriteLinks: false
  });
})
wombatLandingPage.config(function($mdThemingProvider) 
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
wombatLandingPage.controller('LandingPageCtrl', 
  function($scope, $location, $window, $resource, $timeout,
    $mdDialog, $mdMenu) 
  {
    var betaSignupResource = $resource('https://dash.getwombat.com/api/v1/beta/signup');
    $scope.user = {
      appName:null,
      email:null,
      promoCode:null
    };
    $scope.signupError = null;
    $scope.signupFormError = null;

    $scope.preloaderHidden = false;


    var timeToItems = [
    {
      text:"make your app succeed.",
      color:"#00000"
    },
    {
      text:"enjoy your coffee.",
      color:"#c19d67"
    },
    {
      text:"smell the flowers.",
      color:"#ff9f95"
    },
    {
      text:"promote your app.",
      color:"#b2ebf2"
    },
    {
      text:"design new features.",
      color:"#458B00"
    },
    {
      text:"improve your customer experience.",
      color:"#FF7F50"
    },
    {
      text:"meditate.",
      color:"#eceff1"
    }
    ]
    var appSucceedItem = timeToItems[0];
    $scope.selectedTimeItem = appSucceedItem;

    this.openMenu = function($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };
    this.menuClicked = function()
    {
      $mdMenu.hide();
    }

    
    var testimonialCount=0;
    $scope.testimonials = [
    {
      text:'"I wanted to reach out and let you personally know the Prattle team and users really like Wombat."<br/><span class="referrer">-Brayson Ware, <a href="http://letsprattle.com">Prattle COO</a></span>',
      image:'prattle.png',
      index:testimonialCount++
    },
    {
      text:'"Whoa, that really was easier than I expected!"<br/><span class="referrer">- Daniel Reidler, <a href="https://www.wemealapp.com/">WeMeal</a></span>',
      image:'wemeal.png',
      index:testimonialCount++
    }
    ];
    $scope.testimonialIndex = 0;
    $scope.selectTestimonial = function(t)
    {
      $scope.testimonialIndex = t.index;
    }

    var requestAccess = function(signupForm)
    {
      $scope.signupError = null;
      if(!$scope.user.appName || $scope.user.appName.length == 0)
      {
        $scope.signupError = "App name is required.";
        return;
      }

      if($scope.user.appName.length < 2 || $scope.user.appName.length > 20)
      {
        $scope.signupError = "Invalid app name.";
        return;
      }

      if(signupForm.$error.appName)
      {
        $scope.signupError = "Invalid app name.";
        return;
      }

      if(signupForm.$error.email)
      {
        $scope.signupError = "Invalid email address.";
        return;
      }

      if(!$scope.user.email || $scope.user.email.length == 0)
      {
        $scope.signupError = "Email is required.";
        return;
      }

      $scope.saving = true;

      var body = {
        email: $scope.user.email,
        appname: $scope.user.appName,
        promocode: $scope.user.promoCode
      }
      var c = new betaSignupResource(body);
      c.$save(function(u, putResponseHeaders) {
        console.log("success saving");
        $scope.saving = false;
        $scope.signupError = null;

        fbq('track', 'Lead', {
          content_name: 'Beta_Signup'
        });

        $window.location.href = "/thanks.html";
      }, 
      function(errResult){
        console.log("error saving betauser");
        console.log(errResult);

        $scope.saving = false;

        var data = errResult.data;

        if(data.name)
        {
          fbq('track', 'Beta_Signup_Error', {
            errorName:data.name
          });

          if(data.name == "UserAlreadyRegistered")
          {
            $window.top.location.href = "https://dash.getwombat.com/login";
            return;
          }
          else if(data.name == "BetaAlreadyRegistered")
          {
            $window.top.location.href = "https://dash.getwombat.com/patience";
            return;
          }
        }
        else if(data.description)
        {
          fbq('track', 'Beta_Signup_Error', {
            errorName:data.description
          });
        }
        else
        {
          fbq('track', 'Beta_Signup_Error', {
            errorName:data
          });
        }

        var errorMessage = data.description;
        $scope.signupFormError = errorMessage;
      });
    }
    $scope.requestAccess = requestAccess;

    $scope.initLandingPage = function()
    {
      $scope.preloaderHidden = false;
      $timeout(function(){
        $scope.preloaderHidden = true;
      },500);
    }

    var textChangeTimes = 0;
    var updateTimeToItem = function()
    {
      textChangeTimes++;
      var nextChange = 2000;
      $timeout(function(){

        var currentIndex = timeToItems.indexOf($scope.selectedTimeItem);
        timeToItems.splice(currentIndex, 1);

        var length = timeToItems.length;

        if(length == 0)
        {
          $scope.selectedTimeItem = appSucceedItem;
          return;
        }
        var randomIndex = Math.floor((Math.random() * length));

        $scope.selectedTimeItem = timeToItems[randomIndex];

        updateTimeToItem();
      },nextChange);
    }

    var updateTestimonialTab = function()
    {
      var nextChange = 3000;
      $timeout(function(){

        $scope.testimonialIndex++;
        if($scope.testimonialIndex >= $scope.testimonials.length)
        {
          return;
        }
        updateTestimonialTab();
      },nextChange);
    }
    this.shouldUpdateTestimonial = function(isInView)
    {
      if(!isInView) return;
      updateTestimonialTab();
    }

    this.shouldUpdateTimeTo = function(isInView)
    {
      if(!isInView) return;
      updateTimeToItem();
    }
  });