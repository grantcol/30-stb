//app.js
/*
	CONTAINER
		LINKS
			POSTER
			URL
			UP
			DOWN
*/

var fb = new Firebase('https://flickering-fire-2691.firebaseio.com/');
var links = fb.child('links');
var num_links = null;
console.log("Links: "+links);
//listen for updates and assign the correct id.
links.on('value', function(snapshot) {
   var count = 0;
   snapshot.forEach(function() {
       count++;
   });
   num_links = count;
   console.log(num_links);
});

switchLink();
$('#submit-link-btn').click(function(){
	var newId = num_links+1;
	var newLink = links.child(newId);
	var username = $('#username-input').val();
	var link = $('#url-input').val();
	console.log(link+" "+username);
	newLink.set({'poster' : username, 'id' : num_links+1, 'link' : link, 'up' : '0', 'down' : '0'});
});

//upvote a link
$('#up-vote').click(function(){
	var id = this.id;
	var linkRef = new Firebase('https://flickering-fire-2691.firebaseio.com/'+id+'/up');
	linkRef.transaction(function(currentScore){
		return currentScore+1;
	});

});

//down vote a link
$('#down-vote').click(function(){
	var id = this.id;
	var linkRef = new Firebase('https://flickering-fire-2691.firebaseio.com/'+id+'/down');
	linkRef.transaction(function(currentScore){
		return currentScore+1;
	});
});

function switchLink() {
	var s = setInterval(function() {
			getNextLink();
		}, 3000);
}

function getNextLink(){
	var idToPull = Math.floor((Math.random()*num_links)+1);
	var newLink = new Firebase('https://flickering-fire-2691.firebaseio.com/links/'+idToPull);
	newLink.once('value', function(dataSnapshot){
		var contentContainer = document.getElementById('content-container');
		var image = document.createElement('img');
		console.log(dataSnapshot.child('link').val());
		image.src = dataSnapshot.child('link').val();
		contentContainer.setAttribute('class', 'content-class');
		contentContainer.appendChild(image);
	});
}
