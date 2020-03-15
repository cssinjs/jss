import jss from 'jss'
import angular from 'angular'

// Styles
const styles = {
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
const sheet = jss.createStyleSheet(styles).attach()

angular.module('myApp', []).controller('myController', $scope => {
  $scope.classes = sheet.classes
})
