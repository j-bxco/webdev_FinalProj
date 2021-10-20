setInterval(function(){
    const clock = document.querySelector(".display");
    let time = new Date();
    let sec = time.getSeconds();
    let min = time.getMinutes();
    let hr = time.getHours();
    let day = 'AM';
    if(hr > 12){
      day = 'PM';
      hr = hr - 12;
    }
    if(hr == 0){
      hr = 12;
    }
    if(sec < 10){
      sec = '0' + sec;
    }
    if(min < 10){
      min = '0' + min;
    }
    if(hr < 10){
      hr = '0' + hr;
    }
    clock.textContent = hr + ':' + min + ':' + sec + " " + day;
});

function updateClock(){
    var now = new Date();
    var dname = now.getDay(),
        mo = now.getMonth(),
        dnum = now.getDate(),
        yr = now.getFullYear();
    
    Number.prototype.pad = function(digits){
        for(var n = this.toString(); n.length < digits; n = 0 + n);
        return n;
    }

    var months = ["January", "February", "March", "April", "May", "June", "July", "Augest", "September", "October", "November", "December"];
    var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ids = ["dayname", "month", "daynum", "year"];
    var values = [week[dname], months[mo], dnum.pad(2), yr];
    for(var i = 0; i < ids.length; i++)
    document.getElementById(ids[i]).firstChild.nodeValue = values[i];
}

function initClock(){
    updateClock();
    window.setInterval("updateClock()", 1);
}

$(function(){
    var clock = $('#clock'),
    alarm = clock.find('.alarm-button'),
    ampm = clock.find('.ampm'),
    dialog = $('#alarm-dialog').parent(),
    alarm_set = $('#alarm-set'),
    alarm_clear = $('#alarm-clear'),
    time_is_up = $('#time-is-up').parent();


// This will hold the number of seconds left
// until the alarm should go off
var alarm_counter = -1;

(function update_time(){
    if(alarm_counter > 0){
        
        // Decrement the counter with one second
        alarm_counter--;

        // Activate the alarm icon
        alarm.addClass('active');
    }
    else if(alarm_counter == 0){

        time_is_up.fadeIn();

        // Play the alarm sound. This will fail
        // in browsers which don't support HTML5 audio

        try{
            $('#alarm-ring')[0].play();
        }
        catch(e){}
        
        alarm_counter--;
        alarm.removeClass('active');
    }
    else{
        // The alarm has been cleared
        alarm.removeClass('active');
    }

    // Schedule this function to be run again in 1 sec
    setTimeout(update_time, 1000);

})();

	// Handle setting and clearing alamrs

	$('.alarm-button').click(function(){
		
		// Show the dialog
		dialog.trigger('show');

	});

	dialog.find('.close').click(function(){
		dialog.trigger('hide')
	});

	dialog.click(function(e){

		// When the overlay is clicked, 
		// hide the dialog.

		if($(e.target).is('.overlay')){
			// This check is need to prevent
			// bubbled up events from hiding the dialog
			dialog.trigger('hide');
		}
	});


	alarm_set.click(function(){

		var valid = true, after = 0,
			to_seconds = [3600, 60, 1];

		dialog.find('input').each(function(i){

			// Using the validity property in HTML5-enabled browsers:

			if(this.validity && !this.validity.valid){

				// The input field contains something other than a digit,
				// or a number less than the min value

				valid = false;
				this.focus();

				return false;
			}

			after += to_seconds[i] * parseInt(parseInt(this.value));
		});

		if(!valid){
			alert('Please enter a valid number!');
			return;
		}

		if(after < 1){
			alert('Please choose a time in the future!');
			return;	
		}

		alarm_counter = after;
		dialog.trigger('hide');
	});

	alarm_clear.click(function(){
		alarm_counter = -1;

		dialog.trigger('hide');
	});

	// Custom events to keep the code clean
	dialog.on('hide',function(){

		dialog.fadeOut();

	}).on('show',function(){

		// Calculate how much time is left for the alarm to go off.

		var hours = 0, minutes = 0, seconds = 0, tmp = 0;

		if(alarm_counter > 0){
			
			// There is an alarm set, calculate the remaining time

			tmp = alarm_counter;

			hours = Math.floor(tmp/3600);
			tmp = tmp%3600;

			minutes = Math.floor(tmp/60);
			tmp = tmp%60;

			seconds = tmp;
		}

		// Update the input fields
		dialog.find('input').eq(0).val(hours).end().eq(1).val(minutes).end().eq(2).val(seconds);

		dialog.fadeIn();

	});

	time_is_up.click(function(){
		time_is_up.fadeOut();
	});
});