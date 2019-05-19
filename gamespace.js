
var loggedIn = false;
var session;
var usernameGlobal;
var numberOfDices = 3;


	

function hideShow(page) {
	playSound();
	/*hide all the pages */
	document.getElementById("startPage").style.display = "none";
	document.getElementById("loginPage").style.display = "none";
	document.getElementById("registerPage").style.display = "none";
	document.getElementById("highscorePage").style.display = "none";
	document.getElementById("gamePage").style.display = "none";
	document.getElementById("signedOutPage").style.display = "none";
	
	/*decide which buttons to display on start page*/
	document.getElementById("highscoreBtn").style.display = "none";//hide highscore button
	document.getElementById("logoutBtn").style.display = "none";// hide logout button
	document.getElementById("loginBtn").style.display = "block"; // show login button
	document.getElementById("createAccountBtn").style.display = "block"; // show create account button
	
	/*if logged in, display logout and highscore button, and hide loginButton and account button*/
	if (loggedIn) {
		document.getElementById("highscoreBtn").style.display = "block";
		document.getElementById("logoutBtn").style.display = "block";
		document.getElementById("loginBtn").style.display = "none";
		document.getElementById("createAccountBtn").style.display = "none";

	}
	/*show the page with the fetched id*/
	switch(page){
		case "startPage":
		document.getElementById("startPage").style.display = "block";
		break;
		case "loginPage":
		document.getElementById("loginPage").style.display = "block";
		break;
		case "registerPage":
		document.getElementById("registerPage").style.display = "block";
		break;
		case "highscorePage":
		document.getElementById("highscorePage").style.display = "block";
		break;
		case "gamePage":
		document.getElementById("gamePage").style.display = "block";
		break;
		case "signedOutPage":
		document.getElementById("signedOutPage").style.display = "block";
		break;
	}

	
	
}
function randomRoll(){
	 var dice = Math.floor(Math.random()* 6) +1;
	 return dice;
}

function rollDice() {
		//fetches the dices from the html file
		var die1 = document.getElementById("die1"); 
		var die2 = document.getElementById("die2");
		var die3 = document.getElementById("die3");
		var die4 = document.getElementById("die4");
		var status = document.getElementById("status");
		var diceArray = [];
		

		//Gets guessed value from id
		var inpObj = document.getElementById("guessedValue");
		//turns guessed value into an integer
		var inputValue = parseInt(guessedValue.value);
		//Validates user input
		if (inpObj.checkValidity() == false) {
			status.innerHTML= 'Invalid number, please enter a number between 3-18.';
		}
		else{
			// randomize each dice
			for(i = 0; i <= numberOfDices; i++){
				diceArray[i] = randomRoll();
			}
			
		// adds your three first dices
		var totalRolled = diceArray[0] + diceArray[1] + diceArray[2];
		var roundScore = 0;
		//control if you won or lost by checking if your guessed number is smaller than what you rolled
		if (inputValue <= totalRolled){
		roundScore = inputValue * diceArray[3];
		status.innerHTML =  "You rolled: " + totalRolled + ". <br> Round score: " + roundScore +".";
		}
		else{
			status.innerHTML =  "You rolled: " + totalRolled + ". <br> " + 'You lost suckah!';
		}
		//Put in the randomized numbers from the array in the html file
		die1.innerHTML = diceArray[0];
		die2.innerHTML = diceArray[1];
		die3.innerHTML = diceArray[2];
		die4.innerHTML = diceArray[3];
		//Gets the values from "round and totalscore" id:s
		var totalScore = document.getElementById("totalscore");
		var roundNumber = document.getElementById("round");
		/* add 1 each round*/
		roundNumber.innerHTML = parseInt(roundNumber.innerHTML) + 1;
		/*take each roundscore and add it to totalscore annd let it happend 10 times*/
		totalScore.innerHTML = parseInt(totalScore.innerHTML) + roundScore;
		/*After ten rolls, get a totalscore*/
		if(parseInt(roundNumber.innerHTML)==10){
		status.innerHTML = "Last rounds score: " +parseInt(totalScore.innerHTML)+".";
		
		/*checks if you are logged in or not, if true, sends your score to the highscorelist.*/
		if(loggedIn){
		/*calls highscore function with your score*/
		sendHighscore(parseInt(totalScore.innerHTML));
		}	
		/*reset the round and score variable to zero*/
		roundNumber.innerHTML = 0;
		totalScore.innerHTML = 0;

		}

		}

}
/*adds your score to the server*/
function sendHighscore(totalScore) {
	var userHs = '<?xml version="1.0"?><data><session>' + session + '</session><score>' + totalScore + '</score></data>';

		var request = new XMLHttpRequest();
		var server = "http://193.10.30.163/scores/" + usernameGlobal;
		request.open("POST", server);
		request.setRequestHeader("Content-Type", "application/XML");
		request.addEventListener("load", function(){
				if(request.status == 200){
					document.getElementById('status').innerHTML += "<br> Score uploaded!";
					fetchUserScore();
					fetchGlobalScore();
				}
				else {
					document.getElementById("status").innerHTML = "Something went wrong, score not uploaded" + request.status;
					alert("Unknown error");
				}
		})
	request.send(userHs);
}
/*gets the users top10 scores*/
function fetchUserScore(){
	var script = document.createElement("script");
	script.src = "http://193.10.30.163/scores/" + usernameGlobal + "?callback=writeOwnHs&session=" + session;
	document.head.appendChild(script);
}
/*gets the global higscorelist*/
function fetchGlobalScore(){ 
	var script = document.createElement("script");
	script.src = "http://193.10.30.163/scores?callback=writeGlobalHs&session=" + session;
	document.head.appendChild(script);
}
/*callback function who types out the loggedin users top10 highscores in my table*/
function writeOwnHs(response){
	var ownHsTable = document.getElementById('ownHs');
	ownHsTable.innerHTML = "";

	/*Sorting array*/
	response.data.scores.sort(function(a , b){
		return b.score - a.score
	});
	// loops all rows and controls the values
	for(i = 0; i < response.data.scores.length; i++){
		//Controls if your score places on the top 10 list 
		if(i < 10){
			ownHsTable.innerHTML += "<tr><td>" + usernameGlobal + "</td><td>" + response.data.scores[i].score + "</td></tr>";
		}
	}
}
/*callback function who writes out the global top 10 highscorelist in my table*/
function writeGlobalHs(response){ 
	
	var hsTable = document.getElementById('globalHs');
	hsTable.innerHTML = '';

	for(i = 0; i < 10; i++){
	hsTable.innerHTML += "<tr><td>" + response.data.scores[i].username + "</td><td>" + response.data.scores[i].score + "</td></tr>";
	}
}					 


/*stupid clicksound */
function playSound() {
	var clickSound = document.getElementById("clickSound");
	clickSound.play();
}
/*clears everything*/
function clearFields(){
	/*clear everything in the login form*/
	document.getElementById('login_form').reset();
	$('#login_form input').removeClass("valid");
	
	/*clear everything in the register form*/
	document.getElementById('register_form').reset();
	$('#register_form input').removeClass("valid");

	/*clear the error and sucess class boxes*/
	$('.alert').html("").removeClass("alert-success").removeClass("alert-error").removeClass("alert") ;
}


/*-------jquery------ */
$(document).ready(function(e) {
/*-------Things to do when different buttons are clicked, (instead of onclick)------ */	
	/*what to do when home button is clicked*/
	$('#homeBtn').click(function(e){
		hideShow("startPage");
	});
	/*what to do when login button in navbar are clicked*/
	$('#loginBtn').click(function(e){
		hideShow("loginPage");
	});
	/*what to do when createaccount button in navbar are clicked*/
	$('#createAccountBtn').click(function(e){
		hideShow("registerPage");
	});
	/*what to do when highscorebutton in navbar is clicked*/
	$('#highscoreBtn').click(function(e){
		hideShow("highscorePage");
	});
	/*what to do when playbutton is clicked*/
	$('#playBtn').click(function(e){
		hideShow("gamePage");
	});
	/*what to do when "roll the dice" button is clicked*/
	$('#rollBtn').click(function(e){
		rollDice();
	});
	/*what to do when "play again" button is clicked*/
	$('#playAgainBtn').click(function(e){
		hideShow("startPage");
	});

	/*things to do when logoutbtn is clicked*/
	$('#logoutBtn').click(function(e){
		var userLogOut = '<?xml version="1.0"?><data><session>' + session + '</session></data>';

		var request = new XMLHttpRequest();
		request.open("POST", "http://193.10.30.163/users/logout");
		request.setRequestHeader("Content-Type", "application/XML");
		request.addEventListener("load", function(){
			if(request.status != 200){
			 alert("Unknown error");
			}
			
			clearFields();// clears all the forms and removes classes
			/* Reset the global variables*/
			loggedIn = false;
			session = "";
			hideShow("signedOutPage");
		})
		
		request.send(userLogOut);
	});		
});

