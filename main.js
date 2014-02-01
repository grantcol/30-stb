//main.js
/*
	CONTAINER
		LINKS
			POSTER
			URL
			UP
			DOWN
*/

var userName = "Grant";
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

$('#stats-btn').click(function(){
	var data = {
					labels: ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], 
					datasets: [
						{
							fillColor : "rgba(220,220,220,0.5)",
							strokeColor : "rgba(220,220,220,1)",
							pointColor : "rgba(220,220,220,1)",
							pointStrokeColor : "#fff",
							data : [65,59,90,81,56,55,40]
						},
						{
							fillColor : "rgba(151,187,205,0.5)",
							strokeColor : "rgba(151,187,205,1)",
							pointColor : "rgba(151,187,205,1)",
							pointStrokeColor : "#fff",
							data : [28,48,40,19,96,27,100]
						}
					]
				}
	showStats(data);
});

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
		}, 30000);
}

function getNextLink() {
	var idToPull = Math.floor((Math.random()*num_links)+1);
	var newLink = new Firebase('https://flickering-fire-2691.firebaseio.com/links/'+idToPull);
	newLink.once('value', function(dataSnapshot){
		var contentContainer = document.getElementById('content');
		contentContainer.innerHTML = " ";
		var image = document.createElement('img');
		image.src = dataSnapshot.child('link').val();
		contentContainer.setAttribute('class', 'content-inner');
		contentContainer.appendChild(image);
	});
}


function updateStats(id, score) {
	id = "badge_of"+id;
	var badge = document.getElementById(id);
	badge.innerHTML = score;
}

function showStats(data) {
	/*var ctx = document.getElementById("stats-chart").getContext("2d");
	var myNewChart = new Chart(ctx).Line(data);*/
}

function buildAndAddNode(id) {

	var list = document.getElementById('stats-tracker');
	var newLi = document.createElement('li');
	var link = document.createElement('a');
	var badge = document.createElement('span');

	newLi.id = id;
	newLi.setAttribute('class', 'list-group-item');
	link.herf="#";
	badge.setAttribute('class', 'badge');
	badge.id = "badge_of"+id;

	newLi.appendChild(link);
	newLi.appendChild(badge);
	list.appendChild(newLi);
}