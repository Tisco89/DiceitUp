/*Function for email validation with regexp */
function validateEmail(email) {
    var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (filter.test(email)){
    	return true;
    }
    else{
    	return false;
    }
} 
/*function for first and lastname validation with regex */
function validateName(name){
	var filter = /^[A-Za-z]+$/;
	return filter.test(name);
}
/*function for username validation with regex*/
function validateUserName(userName){
	var filter = /^[A-Za-z0-9_]+$/;
	return filter.test(userName);
}
/*function to validate the length of the password*/
function validatePassword(password){
	if ($.trim(password).length < 3){
		return false
	}
	else{
		return true
	}
}
$(document).ready(function(e) {

/* Email realtime check on loginpage*/
	$('#emailTxt').on('input', function() {
	var input=$(this);
	var is_email= validateEmail(input.val());
	if(is_email){
		input.removeClass("invalid").addClass("valid");
	}
	else{
		input.removeClass("valid").addClass("invalid");
	}
	});
	/*password realtimecheck on loginpage*/
	$('#passwordLog').on('input', function() {
	var input=$(this);
	var is_passwordLog = validatePassword(input.val());
	if(is_passwordLog){
		input.removeClass("invalid").addClass("valid");
	}
	else{
		input.removeClass("valid").addClass("invalid");
	}
	});
	/*firstname realtime check on registerpage*/
	$('#firstname').on('input', function() {
	var input=$(this);
	var is_firstName = validateName(input.val());
	if(is_firstName){
		input.removeClass("invalid").addClass("valid");
	}
	else{
		input.removeClass("valid").addClass("invalid");
	}
	});
	/*Lastname realtime check on registerpage*/
	$('#lastname').on('input', function() {
	var input=$(this);
	var is_lastName = validateName(input.val());
	
	if(is_lastName){
		input.removeClass("invalid").addClass("valid");
	}
	else{
		input.removeClass("valid").addClass("invalid");
	}
	});
	/*emailadress realtime check on register page*/
	$('#emailAdress').on('input', function() {
	var input=$(this);
	var is_emailAdress = validateEmail(input.val());
	if(is_emailAdress){
		input.removeClass("invalid").addClass("valid");
	}
	else{
		input.removeClass("valid").addClass("invalid");
	}
	});
	/*Username realtime check on registerpage*/
	$('#username').on('input', function() {
	var input=$(this);
	var is_userName = validateUserName(input.val());
	if(is_userName){
		input.removeClass("invalid").addClass("valid");
	}
	else{
		input.removeClass("valid").addClass("invalid");
	}
	});
	/*password realtime check on registerpage*/
	$('#passwordReg').on('input', function() {
	var input=$(this);
	var is_password = validatePassword(input.val());
	if(is_password){
		input.removeClass("invalid").addClass("valid");
	}
	else{
		input.removeClass("valid").addClass("invalid");
	}
	});

	/*things to do when "loginSubmit" button is clicked*/
	
	$('#login_form').submit(function(e) { 
		e.preventDefault();
		var alertBox = "";

		var isEmail = $('#emailTxt').val();//email
		if ($.trim(isEmail).length == 0) {
			alertBox += "Please enter email adress <br>"
			
		}
		else if(!validateEmail(isEmail)) {
			alertBox += "Invalid email adress <br>"
		}
		var isPassword = $('#passwordLog').val();//password
		if (!validatePassword(isPassword)) {
			alertBox += "Password must be atleast 3 characters <br>"
			
		}
		if(!alertBox == "") {
		 $('#dangerBox').addClass("alert alert-error");
		 $('#dangerBox').html(alertBox);
		}
		/*if the validation phase passes, the user gets logged in.*/
		else{
		var userLog = {}; 
		userLog.email = isEmail;
		userLog.password = isPassword;

			var request = new XMLHttpRequest();
			request.open("POST", "http://193.10.30.163/users/login");
			request.setRequestHeader("Content-Type", "application/json");
			
			request.addEventListener("load", function(){
				if(request.status == 200){
					var data = JSON.parse(request.responseText);
					session = data.session; // sets the current "logged in"session
					usernameGlobal = data.username; // sets current username
					loggedIn = true;
					fetchUserScore(); // calls function for user highscore
					fetchGlobalScore(); // calls function for global highscore
					hideShow("startPage");

					


				}
				/*if there are any errors*/
				if(request.status == 401) {
					alertBox += "Error 401; Email doesnt exist or wrong password <br>"
				}
				if(request.status != 200 && request.status != 401){
				 	alertBox += "Unknown error <br>"
				}
				if(!alertBox == "") {
		 			$('#dangerBox').addClass("alert alert-error");
		 			$('#dangerBox').html(alertBox);
				}
				
			})
			request.send(JSON.stringify(userLog));
		}
		
	});
	/*things to control when "register" button is clicked*/
	$('#register_form').submit(function(e){
		e.preventDefault();
		var alertBoxReg = "";
		
		var fname = $('#firstname').val();//firstname
		if ($.trim(fname).length == 0) {
			alertBoxReg += 'Please enter firstname <br>'; // add error message to an alert square
		}
		 else if(!validateName(fname)) {
		 	alertBoxReg += 'Invalid firstname, can only contain letters <br>';
		}
		var lname = $('#lastname').val();//lastname
		if ($.trim(lname).length == 0) {
			alertBoxReg += 'Please enter lastname <br>';
		}
		else if(!validateName(lname)) {
			alertBoxReg += 'Lastname is invalid, can only contain letters <br>'
		}
		var isEmail2 = $('#emailAdress').val();//email
		if ($.trim(isEmail2).length == 0) {
			alertBoxReg += 'Please enter email adress <br>';
		}
		else if(!validateEmail(isEmail2)) {
			alertBoxReg += 'Invalid email adress <br>';
		}
		var userName = $('#username').val();//username
		if ($.trim(userName).length == 0) {
			alertBoxReg += 'Please enter username <br>';
		}
		 else if(!validateUserName(userName)) {
		 	alertBoxReg += 'Invalid username, can only contain letters, numbers and _ <br>';
		}
		var isPasswordReg = $('#passwordReg').val();
		if (!validatePassword(isPasswordReg)) {
			alertBoxReg += 'Password must be atleast 3 characters <br>';
		}
		if(!alertBoxReg == "") {
		 $('#dangerBoxReg').addClass("alert alert-error");
		 $('#dangerBoxReg').html(alertBoxReg);
		}

		/*if the validation phases are passed*/
		else{
		var user = {}; 
		user.email = isEmail2;
		user.username = userName;
		user.password = isPasswordReg;
		user.firstName = fname;
		user.lastName = lname;

			var request = new XMLHttpRequest();
			request.open("POST", "http://193.10.30.163/users");
			request.setRequestHeader("Content-Type", "application/json");
			request.addEventListener("load", function(){
				if(request.status == 200){
					$('#dangerBoxReg').addClass("alert alert-success"); // if no errors are detected
					$('#dangerBoxReg').html("Success");
					setTimeout(function() {hideShow("startPage"); clearFields();}, 1000); // delay so you have time to see that your registraition passed.
					//clearFields --> to clear the form
				}
				if(request.status == 422) {
					alertBoxReg += 'Error 422; Username or email is already taken <br>';
				}
				if(request.status != 200 && request.status != 422){
				 	alertBoxReg += "Unknown error"
				}
				if(!alertBoxReg == "") {
		 			$('#dangerBoxReg').addClass("alert alert-error");
		 			$('#dangerBoxReg').html(alertBoxReg);
		 		}
			})
			request.send(JSON.stringify(user));	// turn the object to a string and send the request
		}
		
	});	

});