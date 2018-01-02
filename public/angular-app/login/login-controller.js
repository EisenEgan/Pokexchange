angular.module('pokexchange').controller('LoginCtrl', LoginCtrl);

// Note: Use $window instead of $location when routing outside app.
function LoginCtrl(UserService, $location, $window) {

  var vm = this;
  vm.login = true;
  vm.project = {
    email: '',
    password1: '',
    password2: ''
  };
  vm.submit = function(form) {
    console.log('submitted')
    console.log(form.$valid)
    console.log(vm.project)
    if (form.$valid) {
      var authType = vm.login ? 'login' : 'register'
      vm.project.username = vm.project.email
      vm.project.password = vm.project.password1
      UserService.attemptAuth(authType, vm.project).then(
        (res) => {
          // console.log(res)
          // console.log(res.data.user)
          $location.path('/profile')
          // $location.path('/herp')
        },
        (err) => {
          console.log(err)
        }
      )
    }
  }

  vm.changeTab = function(changeTo) {
    if (vm.login == false && changeTo == 'login') {
      vm.project = {
        email: '',
        password1: '',
        password2: ''
      }
      // vm.projectForm.$setPristine()
      // vm.projectForm.$setUntouched()
      vm.login = true;
    }
    else if (vm.login == true && changeTo == 'register') {
      vm.project = {
        email: '',
        password1: '',
        password2: ''
      }
      vm.projectForm.$setPristine()
      vm.projectForm.$setUntouched()
      console.log(vm.project)
      vm.login = false
    }
  }

  vm.socialSignIn = function(site) {
    // console.log(site)
    // $location.path('/api/oauth/twitter')
    $window.location.href = `api/oauth/${site}`
  }
}
