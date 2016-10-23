(function() {

    window.Scoreboard = {
        add: function(score) {
            var scores = this.get();
            
            scores.push(score);

            localStorage.setItem('scores', scores);
        },
        
        get: function() {
            var scores = localStorage.getItem('scores');

            return scores === null ? [] : scores.split(',');
        }
    };

})();