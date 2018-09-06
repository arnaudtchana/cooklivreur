App.
controller('LivrerCtrl', function($scope,$state,$ionicLoading,$sessionStorage,Restangular,$auth) {
  /*le code de notre popover*/

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
