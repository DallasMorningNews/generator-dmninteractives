$(document).ready(function() {
	
	//custom scripting goes here


	/*
	------------------------------------------------------------------------------------------
	CODE FOR SLIDESHOWS, UN-COMMENT THE TWO LINES ABOVE AND BELOW THE CODE AS INSTRUCTED TO USE
	------------------------------------------------------------------------------------------
	*/

	/* DELETE THIS ENTIRE LINE

	//setting up variables for the slideshow

	var slideCounter = 0,
		$nextButton = $('.nextButton'),
		$previousButton = $('.previousButton'),
		$slideButton = $('.slideButton');
		$slideCutline = $('.slide .cutline'),
		totalSlides = $('.slide').length,
		$slideshow = $('.slideshow'),
		slideHeight = $('.slide img').height();

	// checks which image we're on in the slideshow
	// if it's the first, hide the previous button
	// if it's the last, hide the next button
	// else show the previous and last buttons 

	function slidePosition() {
		if (slideCounter === 0) {
			$previousButton.hide();
		} else if ( slideCounter === (totalSlides - 1) ) {
			$nextButton.hide();
		} else {
			$previousButton.show();
			$nextButton.show();
		}
	}

	// advancing the slideshow by moving the current slide to the right
	// then moving the next slide in from the left
	// afterward, grab the file path and assign it to the next image's src attribute
	// then check where we are in the slideshow

	function advanceSlide() {
		slideCounter ++;
		$(this).siblings('.current').addClass('postSlide').removeClass('current');
		$(this).siblings('.slide').eq(slideCounter).addClass('current').removeClass('preSlide');
		var defaultImage = $(this).siblings('.slide').eq(slideCounter + 1).data('default');
		var srcset = $(this).siblings('.slide').eq(slideCounter + 1).data('srcset');
		$(this).siblings('.slide').eq(slideCounter + 1).children('img').attr('src', defaultImage).attr('srcset', srcset);;
		slidePosition();
	}

	function swipeAdvance() {

		if (slideCounter < totalSlides -1 ) {
			slideCounter ++;
			$(this).children('.current').addClass('postSlide').removeClass('current');
			$(this).children('.slide').eq(slideCounter).addClass('current').removeClass('preSlide');
			var defaultImage = $(this).children('.slide').eq(slideCounter + 1).data('default');
			var srcset = $(this).children('.slide').eq(slideCounter + 1).data('srcset');
			$(this).children('.slide').eq(slideCounter + 1).children('img').attr('src', defaultImage).attr('srcset', srcset);;
			slidePosition();
		}

	}

	// rewind the slideshow by moving the current slide to the left
	// then move the previous slide back into view from the left
	// then check where we are in the slideshow 

	function rewindSlide() {
		slideCounter --;
		$(this).siblings('.current').addClass('preSlide').removeClass('current');
		$(this).siblings('.slide').eq(slideCounter).addClass('current').removeClass('postSlide');
		slidePosition();
	}

	function swipeRewind() {
		if (slideCounter > 0 ) {
			slideCounter --;
			$(this).children('.current').addClass('preSlide').removeClass('current');
			$(this).children('.slide').eq(slideCounter).addClass('current').removeClass('postSlide');
			slidePosition();
		}
	}

	// append a number and total length of slideshow to each cutline 

	$slideCutline.each(function(k,v) {
		var cutlinePrefix = "<strong> Slideshow — " + (k + 1) + " of " + totalSlides + ":</strong> ";
		$(this).prepend(cutlinePrefix);
	})

	//running the slidePosition initially to hide previous button
	slidePosition();

	//setting the slideshow button position to be halfway down the slideshow
	console.log (slideHeight);
	$slideButton.css('top', ( (slideHeight / 2) - ($slideButton.height() / 2) ) )

	//binding click and swipe events to the next and previous button

	$nextButton.on('click', advanceSlide);
	$previousButton.on('click', rewindSlide);

	// if you want to be able to swipe the slideshow on touch devices, un-note the following two lines
	// and make sure you call jquery.swipe.min.js in the index file

	$slideshow.on("swipeleft", swipeAdvance);
	$slideshow.on("swiperight", swipeRewind);

	DELETE THIS ENTIRE LINE */






	/*
	------------------------------------------------------------------------------------------
	CODE FOR DROP BULLETS, UN-COMMENT THE TWO LINES ABOVE AND BELOW THE CODE AS INSTRUCTED TO USE
	------------------------------------------------------------------------------------------
	*/

	/* DELETE THIS ENTIRE LINE	

	var $dropHead = $('.dropList .dropHed'),
		$dropTweet = $('.dropList .fa-twitter');

	$dropHead.on('click', function(){
		$(this).next(".dropText").slideToggle(200); 
		$(this).find(".fa").toggleClass('fa-plus').toggleClass('fa-minus');
	});

	$dropTweet.on("click", function(){
		var shareID = $(this).closest(".dropList").attr("id"),
			shareURL = "&url="+encodeURIComponent(window.location.href + "#" + shareID),
			shareText = encodeURIComponent($(this).closest(".dropList").find("h4").text()),
			shareLink = "https://twitter.com/intent/tweet?text="+ shareText + shareURL + "&via=dallasnews";
		window.open(shareLink, '_blank');
	});

	DELETE THIS ENTIRE LINE */




	/*
	------------------------------------------------------------------------------------------
	CODE FOR SYNOPSIS BLOCK, UN-COMMENT THE TWO LINES ABOVE AND BELOW THE CODE AS INSTRUCTED TO USE
	------------------------------------------------------------------------------------------
	*/

	/* DELETE THIS ENTIRE LINE	

	$(".synopsis p").on("click", function() {
		var shareURL = "&url=" + encodeURIComponent(window.location.href),
			shareText = $(this).text(),
			twitterTag = "dallasnews";
			
		var maxLength = 97 // maximum number of characters to extract

		var trimmedText = shareText.substr(0, maxLength);

		trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")))

		trimmedText = trimmedText.slice(1);

		trimmedText += " ... "

		trimmedText = encodeURIComponent(trimmedText); 
		
		var shareLink = "http://twitter.com/intent/tweet?text=" + trimmedText + shareURL + "&via=" + twitterTag;
		window.open(shareLink, "_blank");
	})

	DELETE THIS ENTIRE LINE */




	/*
	------------------------------------------------------------------------------------------
	NDN VIDEO ASPECT RESIZER, UN-COMMENT THE TWO LINES ABOVE AND BELOW THE CODE AS INSTRUCTED TO USE
	------------------------------------------------------------------------------------------
	*/

	/* DELETE THIS ENTIRE LINE	  

	//caching a pointer to the jquery element

	var $videoWrapper = ''

	if ($('.ndn_embed')) {
		$videoWrapper = $('.ndn_embed');
		scaleVideo();
	}

		function scaleVideo() {

			videoWidth = $videoWrapper.width(); //grabs the width of the video player
			videoHeight = videoWidth * .5625; //sets a variable equal to 56.25% of the width (the correct aspect ratio for the videos)

			$videoWrapper.css('height', videoHeight); //assings that height variable as the player's height in the css
		}


	$(window).resize(function() {
		scaleVideo(); //runs the video aspect resizer when the width of the browser is changed
	})

	DELETE THIS ENTIRE LINE */


});

