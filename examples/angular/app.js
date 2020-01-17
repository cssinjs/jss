import jss from 'jss'
import angular from 'angular'

// Styles
var styles = {
  button1: {
    padding: '20px',
    background: 'blue',
    color: '#fff'
  },
  button2: {
    padding: '10px',
    background: 'red'
  }
}

// Application logic.
var sheet = jss.createStyleSheet(styles).attach()

angular.module('myApp', []).controller('myController', function MyController($scope) {
  $scope.classes = sheet.classes
  $scope.showSource = function() {
    location.href = 'https://github.com/cssinjs/examples/tree/master/angular'
  }
})
