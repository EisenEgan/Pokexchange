angular.module('pokexchange').directive('pokeNavigation', pokeNavigation)

function pokeNavigation($location, UserService) {
  return {
    restrict: 'E',
    templateUrl: 'angular-app/navigation-directive/navigation-directive.html',
    link: function(scope, element, attrs) {
      scope.logout = function() {
        UserService.logout().then(
          (res) => {
            $location.path('/')
          }
        )
      }
    }
  }
}
