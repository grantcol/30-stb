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
var userPosts = new Array();
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

links.on('child_changed', function(dataSnapshot) {
	for(var i = 0; i < num_links; i++)
	{
		if(dataSnapshot.child(i+1).child('poster').toString() === "grant ")
		{
			buildAndAddNode(i+1);
			userPosts.push(dataSnapshot.child(i+1));
		}
	}
});

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
		//var image = document.createElement('img');
		//image.src = dataSnapshot.child('link').val();
		choosePreview("content", dataSnapshot.child('link').val());
		contentContainer.setAttribute('class', 'content-inner');
		//contentContainer.appendChild(image);
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

//MEDIA HELPERS

function choosePreview(destination, src) {
	if(src != null){
		if(src.indexOf('youtube') !== -1) {
			//previewYT(destination, src);
		} else if(src.indexOf('soundcloud') !== -1){
			previewSC(destination, src);
		} else if(src.indexOf('vimeo') !== -1) {
			previewVimeo(destination, src);
		} else {
			previewImage(destination, src);
		}
	}
}

function previewYT(destination, src) {

	console.log(destination);
	var destDiv = document.getElementById(destination);
	var YTplayer = document.createElement('iframe');
	//var hiddenId = document.getElementById('hidden-url');
	var temp = src.split('=');
	var embedCode = temp[1];

	//construct the YTplayer
	YTplayer.setAttribute('frameborder', '0');
	YTplayer.setAttribute('allowfullscreen', 'true');
	YTplayer.setAttribute('width', '100%');
	YTplayer.setAttribute('height', '100%');
	YTplayer.src = "https://www.youtube.com/embed/"+embedCode;
	destDiv.appendChild(YTplayer);
	//put the html text in the value so we can send it out.
	//hiddenId.value = destDiv.innerHTML;
}

function previewSC(destination, src) {

	console.log(src);
	var hiddenId = document.getElementById(destination);
	//REMINDER THIS IS VERY INSECURE PLEASE DO SOMETHING
	//ABOUT THIS BEFORE DEPLOYING PUBLICALLY
	SC.initialize({
  		client_id: 'aea5c6bdd2e60daed3a83bc19d269cc3'
	});

	var track_url = src;
	SC.oEmbed(track_url, { auto_play: false, iframe: true }, document.getElementById(destination));
	//hiddenId.value = document.getElementById(destination).innerHTML;
}

function previewVimeo(destination, src) {

	console.log(src);
	var destDiv = document.getElementById(destination);
	var Vplayer = document.createElement('iframe');
	//var hiddenId = document.getElementById('hidden-url');
	var temp = src.split('/');
	var embedCode = temp[3];

	//construct the Vplayer
	Vplayer.setAttribute('frameborder', '0');
	Vplayer.setAttribute('allowfullscreen', 'true');
	Vplayer.setAttribute('width', '100%');
	Vplayer.setAttribute('height', '100%');
	Vplayer.src = "https://player.vimeo.com/video/"+embedCode;
	destDiv.appendChild(Vplayer);

	//hiddenId.value = destDiv.innerHTML;
}

function previewImage(destination, src) {

	console.log(src);
	var destDiv = document.getElementById(destination);
	var image = document.createElement('img');
	//var hiddenId = document.getElementById('hidden-url');

	/*image.setAttribute('width', '100%');
	image.setAttribute('height', '100%');*/
	image.setAttribute('class', 'content-inner');
	image.src = src;
	//hiddenId.value = src;

	destDiv.appendChild(image);
}

/*var linkObj = new Firebase('url'+links)
for(num_links){ 
	var thislink = linkObj.child(i).child('poster');
	if(thisLink.indexOf('grant') !== -1){
		arrayOfPosts.push(thisLink);
	}
}*/
