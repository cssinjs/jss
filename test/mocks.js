(function() {
    var counter = 0

    jss.uid.get = function() {
        return counter++
    }

    jss.uid.reset = function() {
        counter = 0
    }
}())
