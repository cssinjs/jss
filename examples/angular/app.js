angular.module('myApp', [])
    .controller('myController', function MyController($scope) {
        var ss = jss.createStylesheet(window.styles, true).attach()
        $scope.classes = ss.classes
    })
