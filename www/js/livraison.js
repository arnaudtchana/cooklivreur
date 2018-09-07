App.
controller('LivraisonCtrl', function($scope,$state,$ionicLoading,$sessionStorage,Restangular,$auth,$ionicPopup) {
  /*le code de notre popover*/
  $scope.$on('$ionicView.enter', function(e) {

    /*on recupere la liste des commandes dun utilisateur*/
    $scope.liste_commande = $sessionStorage.commands;
    console.log($sessionStorage.commands)
    $scope.taille_tableau = $sessionStorage.commands.length;
  });

  $scope.commande_livrer = function(index){
    /*ici l'index de la commande qui a ete livrer*/
    console.log('voici lide de la commande',$scope.liste_commande[index].id)
    console.log('voici la commande',$scope.liste_commande[index])
    $ionicLoading.show({
      templateUrl : 'templates/loading.html'
    });
    var Confirmation_commande = Restangular.one('command/'+$scope.liste_commande[index].id+'/confirm-delivery');
    Confirmation_commande.post().then(function (response) {
      $ionicLoading.hide();
      console.log(response);
      //$scope.liste_commande.splice(index);
      var popupResult = $ionicPopup.alert({
        cssClass: 'popup_commande',
        title: 'Information',
        template: response.message
      });

      popupResult.then(function (response) {
        /*lorskil ferme le popup, on recharge la liste des produits kil doit livrer*/

      })
    },function (error) {
      $ionicLoading.hide();
      console.log(error)
    })
  }

  /*liste des details sur une commande donnee*/
  $scope.detail_commande = function(index){
    /*on recupere lindex dune commande et on renvoie la liste des details sur la commande en question*/
  }
    /*fonction permettant de decoonecter un utilisateur*/
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
