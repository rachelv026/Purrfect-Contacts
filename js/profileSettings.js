document.addEventListener('DOMContentLoaded', function () {
    updateUserDetails();
});

function updateUserDetails()
{
    readCookie();

    // populate profile settings fields
    const fName = document.getElementById("displayFirstName");
    const lName = document.getElementById("displayLastName");
    const eDisplay = document.getElementById("displayEmail");
	const imgDisplay = document.getElementById("displayPicture");

    imgDisplay.src = profileImage;
    fName.value = firstName;
    lName.value = lastName;
    eDisplay.value = email;
}

function doUploadPhoto()
{
    // Did not get the time to figure out how to allow a user to 
    // upload a file (photo) onto the digital cloud droplet.
    window.alert("Pay me $40 to upload a photo.")
}

function doUpdateUser() {

    let password = document.getElementById("userPassword").value;
    let changesResult = document.getElementById("changeResult");

    if (!validChanges(firstName, lastName, email, password)) {
        changesResult.innerHTML = "Invalid signup!";
        return;
    }
    var hash = md5(password);
    let tmp = {
        id: userId,
        firstName: document.getElementById("displayFirstName").value,
        lastName: document.getElementById("displayLastName").value,
        email: document.getElementById("displayEmail").value,
        password: hash,
        profilePicPath: profileImage
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/EditUser.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                email = jsonObject.email;
                profileImage = jsonObject.profilePicPath;

				saveCookie();
                changesResult.innerHTML = "Changes successful!";
                updateUserDetails();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		changesResult.innerHTML = err.message;
	}
}

function doDeleteUser() {
    if (!window.confirm("Are you sure you want to delete your account?"))
    {
        return;
    }
    
    let tmp = {
        id: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteUser.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
                    document.cookie = "firstName= ,lastName= ,userId= ,email= ,img= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
                    window.location.href="index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("deleteInfo").innerHTML = err.message;
	}
}

// just redirects user to contacts page
function doCancel()
{
    window.location.href = "contacts.html";
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
        else if ( tokens[0] == "img" )
        {
            profileImage = tokens[1];
        }
        else if (tokens[0] == "email")
        {
            email = tokens[1];
        }
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html"; // force redirect to index if logged out
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",email=" + email + ",img=" + profileImage + ";expires=" + date.toGMTString();
}

function togglePasswordVisibility() {
    var input = document.getElementById("userPassword") ;

    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

function validChanges(fName, lName, email, pass) {

    var fNameErr = lNameErr = emailErr = passErr = true;

    if (fName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (email == "")
    {
        console.log("EMAIL IS BLANK");
    }
    else
    {
        var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!regex.test(email)) 
        {
            console.log("EMAIL IS NOT VALID");
        }
        else
        {
            console.log("EMAIL IS VALID");
            emailErr = false;
        }
    }

    if (pass == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

        if (regex.test(pass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            passErr = false;
        }
    }

    if ((fNameErr || lNameErr || emailErr || passErr) == true) {
        return false;

    }

    return true;
}