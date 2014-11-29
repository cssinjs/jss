angular.module('myApp', [])
    .controller('myController', function MyController($scope) {
        var ss = jss.createStyleSheet(window.styles, true).attach()
        $scope.classes = ss.classes
    })
