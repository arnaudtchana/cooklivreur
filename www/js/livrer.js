App.
controller('LivrerCtrl', function($scope,$state,$ionicLoading,$sessionStorage,Restangular,$auth,$ionicPopup) {
  /*le code de notre popover*/
  $scope.$on('$ionicView.enter', function(e) {

    /*on recupere la liste des commandes dun utilisateur*/
    $ionicLoading.show({
      templateUrl : 'templates/loading.html'
    });
    var Liste_commande = Restangular.one('delivery-man/command');
    Liste_commande.get().then(function (response) {
      $scope.liste_commande = response.commands;
      $scope.taille_tableau = response.commands.length;
      $ionicLoading.hide();
    },function (error) {
      $ionicLoading.hide();
      console.log('error')
    })

  });
  $scope.detail_commande = function(index){
    /*on recupere lindex dune commande et on renvoie la liste des details sur la commande en question*/
    $scope.cart = $scope.liste_commande[index].command_lines;
    var Detail = $ionicPopup.show({
      cssClass: 'popup_produit_detail',
      templateUrl: 'templates/popup-detail-commande.html',
      scope: $scope,
      buttons: [
        {
          text: '<b>Ok</b>',
          type: 'button-positive',
        }
      ]
    });
  }
  $scope.logout = function () {
    var Logout = Restangular.one('logout');
    $ionicLoading.show({
      templateUrl : 'templates/loading.html'
    });
    Logout.post().then(function (response) {
      console.log(response);
      $auth.logout().then(function (response) {
        $ionicLoading.hide();
        delete $sessionStorage.token;
        $state.go('connexion');
      },function (error) {
        $ionicLoading.hide();
      })
    },function (error) {
      $ionicLoading.hide();
      delete $sessionStorage.token;
      $state.go('connexion');
    })


  };
})
