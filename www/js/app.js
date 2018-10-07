// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var ApiUrl = "https://cook-cooning.quickdeveloppement.com/api/";
var App=angular.module('starter', ['ionic','satellizer','ngStorage','restangular','ionic-toast','ngCordova'])

.run(function($ionicPlatform,$state,$localStorage,$ionicPopup,$ionicHistory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    /*on teste sil y a la connection*/
    if(window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        /*on fait uen alert ici*/
        $ionicPopup.confirm({
          title: 'Erreur !',
          content: "Vous n\'êtes pas connecté à internet "
        })
          .then(function (result) {
            if (!result) {
              ionic.Platform.exitApp();
            }
          });
      }
    }
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
    if($localStorage.token){
      $localStorage.new_connection = false;
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      })
      $state.go('tab.livraison')
    }
    /*consentement du user*/
    //window.plugins.OneSignal.provideUserConsent(true);
    window.plugins.OneSignal.setSubscription(false);
    var notificationOpenedCallback = function(data) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(data));
      //alert("je recoit la notification")
      if(data.notification.payload.additionalData.channel == 2){
        /*on vient de vous attribuer une nouvelle commande on le redirige vers la page qui liste les commandes*/
        //alert("on vient de vous attribuer une commande")
        if($state.current.name == 'tab.livraison') {
          /*on reload la page*/
          location.reload();
        }else{
          /*on le redirige vers la page qui liste les commandes a livrer*/
          $state.go('tab.livraison')
        }
      }
      if(data.notification.payload.additionalData.channel == 3){
        /*on vient de relever une erreur sur une de vos commandes on le redirige vers la paage de gestion des erreurs*/
        //alert("Erreur relevée sur une commande")
        if($state.current.name == 'tab.erreurs') {
          /*on reload la page*/
          location.reload();
        }else{
          /*on le redirige vers la page qui liste les commandes a livrer*/
          /*ici on doit egalement gerer est ce que lutilisateur est connecter ou pas*/
          $state.go('tab.erreurs')
        }
      }
    };

    window.plugins.OneSignal
      .startInit("c5937f15-80f0-4eec-b535-84b5db486f58")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();

    window.plugins.OneSignal.setSubscription(true);
  });
})

.config(function($stateProvider, $urlRouterProvider,$authProvider,$httpProvider,RestangularProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $authProvider.loginUrl = ApiUrl+'auth2';
  $authProvider.signupUrl = ApiUrl+'register';
  $httpProvider.interceptors.push('InterceptorFactory');
  var newBaseUrl = ApiUrl;
  RestangularProvider.setBaseUrl(newBaseUrl);
  $stateProvider
    .state('connexion',{
      url:'/connexion',
      templateUrl:'templates/connexion.html',
      controller: 'ConnexionCtrl'
    })
    .state('bar',{
      url:'/bar',
      abstract: true,
      templateUrl:'templates/bar_compte.html',

    })
    .state('bar.email_reset',{
      url:'/email_reset',
      views: {
        'bar_content' :{
          templateUrl:'templates/email_reset.html'
        }
      },
      controller: 'ResetPasswordCtrl'
    })
  $stateProvider.state('bar.envoie_code',{
    url:'/envoie_code',
    views: {
      'bar_content' :{
        templateUrl:'templates/code_verification_email.html'
      }
    },
    controller: 'CodeVerificationCtrl'
  })
  $stateProvider.state('bar.enregistre_password',{
    url:'/enregistre_password',
    views: {
      'bar_content' :{
        templateUrl:'templates/new_password.html'
      }
    },
    controller: 'EnregistrePasswordCtrl'
  })
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.livraison', {
    url: '/livraison',
    views: {
      'tab-livraison': {
        templateUrl: 'templates/tab-livraison.html',
        controller: 'LivraisonCtrl'
      }
    }
  })

  .state('tab.liver', {
      url: '/livrer',
      views: {
        'tab-livrer': {
          templateUrl: 'templates/tab-livrer.html',
          controller: 'LivrerCtrl'
        }
      }
    })

  .state('tab.erreurs', {
    url: '/erreurs',
    views: {
      'tab-erreurs': {
        templateUrl: 'templates/tab-erreurs.html',
        controller: 'ErreurCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/connexion');

})

  .factory('InterceptorFactory',['$sessionStorage','$q','$rootScope','$localStorage','$injector', function($sessionStorage,$q,$rootScope,$localStorage,$injector,$ionicLoading){
    return {
      //lorsquon envoi une requette on met le token dans lentete
      request : function(config) {
        console.log("je suis ici dans la requete de sortie");
        config.headers.Authorization= "bearer "+$localStorage.token;
        /*config.headers=["Access-Control-Allow-Origin", '*'];
        config.headers=['Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE'];
        config.headers=['Access-Control-Allow-Headers', 'Content-Type,Accept'];*/
        config.url = config.url+"?token="+$localStorage.token;
        // console.log(config);
        /*en envoi la requette*/
        return config;
      },
      /*dans le cas ou la requete passe avec succes on regarde si le token est present dans lentete
       * auquel cas on le met dans la variable de session*/
      response : function(response){
        /*on affiche la reponse de la requete pour voir comment recuperer le token*/
        if(token = response.headers('Authorization')){
          /*on enregistre le token dans la varible de session*/
          /*on regarde sil y a le bearer dans le token de base et on le supprime*/
          console.log("ici on enregistre le token suivant "+token);
          $sessionStorage.token = token;
        }
        /*on retourne la reponse*/
        return response;
      },
      /*ici on teste le code alternatif du cas ou on a une mauvaise reponse*/
      responseError: function(rejection) {

        // Need to use $injector.get to bring in $state or else we get
        // a circular dependency error
        var $state = $injector.get('$state');

        // Instead of checking for a status code of 400 which might be used
        // for other reasons in Laravel, we check for the specific rejection
        // reasons to tell us if we need to redirect to the login state
        var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

        // Loop through each rejection reason and redirect to the login
        // state if one is encountered
        angular.forEach(rejectionReasons, function(value, key) {

          if(rejection.data.error === value) {

            // If we get a rejection corresponding to one of the reasons
            // in our array, we know we need to authenticate the user so
            // we can remove the current user from local storage
            //localStorage.removeItem('user');
            delete $sessionStorage.token;
            $localStorage.token = undefined;

            // Send the user to the auth state so they can login
            //$ionicLoading.hide();
            $state.go('connexion');
          }
        });

        return $q.reject(rejection);
      }
      /*fin du test de notre code*/
    };

  }])
;
