(function () {
    var ss = jss.createStyleSheet(window.styles).attach()

    angular
        .module('myApp', [])
        .controller('myController', function MyController($scope) {
            $scope.classes = ss.classes
            $scope.showSource = function () {
              location.href = 'http://github.com/jsstyles/jss/tree/master/examples/angular'
            }
        })
}())
