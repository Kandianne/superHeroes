//Linkage to firebase database
var firebase = "https://superdupers.firebaseio.com/";

//To hide search input and create input on initial visit to site
$(".search").hide();
$("#createNew").hide();

//To show search input and create input, and hide again w double click
$("#searchBtn").click(function(){$(".search").show()});
$("#searchBtn").dblclick(function(){$(".search").hide()});
$("#createBtn").click(function(){$("#createNew").show()});
$("#createBtn").dblclick(function(){$("#createNew").hide()});


//Creating blank string for object

var heroesDB = [];

//Creating constructor to make objects

function hero( picture, realName, heroName, powers) {
	this.picture= picture;
	this.realName= realName;
	this.heroName= heroName;
	this.powers= powers;
	this._id= null;
}


//Creating hero objects and putting(POSTing) them on database
function createHero() {
	var picture = document.getElementById("picture");
	var realName = document.getElementById("realName");
	var heroName = document.getElementById("heroName");
	var powers = document.getElementById("powers");
	var newHero = new hero(picture.value, realName.value, heroName.value, powers.value);
	postHero(newHero);
	picture.value = ""; realName.value = ""; heroName.value = ""; powers.value = ""; 
};

//Getting the created hero objects from the DB and serving them to browser

function getHero() {
	var req = new XMLHttpRequest();
	req.open('GET', firebase + '.json');
	req.send();
	req.onload = function () {
		if(this.status >=200 && this.status < 400) {
			var res = JSON.parse(this.response);
			for(var prop in res) {
				res[prop]._id = prop;
				heroesDB.push(res[prop]);
			}
			displayHero();
		}
	}
}



function postHero(newHero) {
	var req = new XMLHttpRequest();
	req.open('POST', firebase + '.json');
	req.onload = function() {
		if(this.status >= 200 && this.status < 400) {
			var res = JSON.parse(this.response);
			newHero._id= res.name;
			heroesDB.push(newHero);
			displayHero();
		}
	}
	req.send(JSON.stringify(newHero));
}


//Function to show heroes calling property creators in createHero
var displayHero = function() {
	
	var stringToDisplay = "";

	for(var i = 0; i < heroesDB.length; i++) {
		stringToDisplay +=
		'<div id="heroes" class="col-md-3 col-sm-4">'
		+ '<p><img class="img img-rounded" src="' + heroesDB[i].picture + '" height="179px" width="130"></p>'
		+ '<h6><span style="color: #000066;">' + heroesDB[i].realName + '</span></h6>'
		+ '<h4><span style="text-transform: uppercase; color: blue;">' + heroesDB[i].heroName + '</span></h4>'
		+ '<p>' + heroesDB[i].powers + '</p>'
		+ '<button class="btn btn-xs btn-danger" onclick="deleteHero(' + i +')">DELETE</button>'
		+ '&nbsp;<button class="btn btn-xs btn-warning" onclick="updateHero(' + i +')">EDIT</button>'
		+ '</div>'
	}
	document.getElementById("displayHeroes").innerHTML = stringToDisplay;
}

function deleteHero(i) {
	var req = new XMLHttpRequest();
	req.open("DELETE", firebase + heroesDB[i]._id + "/.json");
	req.onload = function() {
		if(this.status >= 200 && this.status < 400) {
			heroesDB.splice(i,1);
			console.log("Successfully Deleted!")
			displayHero();
		}
		else{ 
			console.log(this.response)
		}
	}
	req.send();
}

function updateHero(i) {
	document.getElementById('inputEdits').innerHTML =
	'<input id="editPicture" value="'+ heroesDB[i].picture +'" placeholder="Picture...">'
	+ '<input id="editRealName" value="'+ heroesDB[i].realName +'" placeholder="Real Name...">'
	+ '<input id="editHeroName" value="'+ heroesDB[i].heroName +'" placeholder="Hero Name...">'
	+ '<input id="editPowers" value="'+ heroesDB[i].powers + '" placeholder="Powers...">'
	+ '<button class="btn btn-success btn-xs" onclick="sendUpdate(' + i + ')">SUBMIT CHANGES</button>'
}

function sendUpdate(i) {
	var req = new XMLHttpRequest();
	req.open("PUT", firebase + heroesDB[i]._id + "/.json");
	req.onload = function(){
		if(this.status >= 200 && this.status < 400) {
			document.getElementById("inputEdits").innerHTML = "";
			document.getElementById("displayHeroes").innerHTML = "";
			heroesDB.length = 0;
			displayHero();
			getHero();
		}
	}
	var updatedHero = {
		picture: document.getElementById("editPicture").value,
		realName: document.getElementById("editRealName").value,
		heroName: document.getElementById("editHeroName").value,
		powers: document.getElementById("editPowers").value	
	};
	req.send(JSON.stringify(updatedHero));
}

getHero();

