App
  .controller('ConnexionCtrl', function($scope, $ionicModal, $timeout,$state,$auth,$ionicLoading,$sessionStorage,$rootScope) {
    $scope.error = "";
    // Form data for the login modal
    $scope.loginData = {};
    $rootScope.userData = {};
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      $ionicLoading.show({
        templateUrl : 'templates/loading.html'
      });

      $auth.login($scope.loginData).then(function (response) {
        $ionicLoading.hide();
        if(response.data.success==true){
          /*on enregistre le token et on passe a la page suivante il faudra egalement verifier
          * que l'intercepteur ne fonctionne pas normalement*/
          $sessionStorage.token = response.data.token;
          $sessionStorage.data = response.data;
          $rootScope.userData = response.data.client;
          console.log("voici les donnees du user",$rootScope.userData)
          console.log($sessionStorage.data);
          $state.go('tab.livraison');
        }else{
          /*on affiche le message d'erreur*/
          $scope.error = response.data.error;
        }

      },function (error) {
        $ionicLoading.hide();
      })
      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system

    };
  })
