  const urlBase = 'https://cop4331iscool.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = [];

//Leinecker
function doLogin(){
        userId = 0;
        firstName = "";
        lastName = "";

        //login + password input
        let login = document.getElementById("loginName").value;
        let password = document.getElementById("loginPassword").value;
        var hash = md5( password );

        //direct by  valid or invalid
        if (!validLoginForm(login, password)) {
                document.getElementById("loginResult").innerHTML = "invalid username or password";
                return;
        }
        document.getElementById("loginResult").innerHTML = "";

        let tmp = {login: login, password: hash};

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/Login.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                let jsonObject = JSON.parse(xhr.responseText );
                                console.log("Login response:", jsonObject);
                                //userId = parseInt(jsonObject.ID);
                                //userId = jsonObject.id;
                                userId = parseInt(jsonObject.ID);

                                if(userId < 1)
                                {
                                        document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                                        return;
                                }

                                firstName = jsonObject.firstName;
                                lastName = jsonObject.lastName;

                                saveCookie();
                                //success, go to contacts
                                window.location.href = "contacts.html";
                        }
                };
                xhr.send(jsonPayload);
        }
        catch(err)
        {
                document.getElementById("loginResult").innerHTML = err.message;
        }

}

//Leinecker doLogin boilerplate signUp edition
function doSignup()
{
        firstName = document.getElementById("firstName").value;
        lastName = document.getElementById("lastName").value;

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        if (!validSignUpForm(firstName, lastName, username, password))
        {
                document.getElementById("signupResult").innerHTML = "invalid signup";
                return;
        }

        var hash = md5(password);
        document.getElementById("signupResult").innerHTML = "";

        let tmp =
        {
                firstName: firstName, lastName: lastName,
                login: username, password: hash
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/Register.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try
        {
                xhr.onreadystatechange = function ()
                {
                        if (this.readyState != 4){ return; }
                        if (this.status == 409)
                        {
                                document.getElementById("signupResult").innerHTML = "User already exists";
                                return;
                        }
                        if (this.status == 200)
                        {
                                let jsonObject = JSON.parse(xhr.responseText);

                                //userId = parseInt(jsonObject.ID);
                                //userId = jsonObject.id;
                                userId = parseInt(jsonObject.results[0].ID);
                                document.getElementById("signupResult").innerHTML = "User added!";
                                firstName = jsonObject.firstName;
                                lastName = jsonObject.lastName;
                                saveCookie();
                        }
                };

                xhr.send(jsonPayload);
        }       catch (err) {
                        document.getElementById("signupResult").innerHTML = err.message;
                }
}


//Leinecker
//save new info
/*function saveCookie()
{
        let minutes = 20;
        let date = new Date();
        date.setTime(date.getTime()+(minutes*60*1000));
        document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
        console.log("Saving cookie with userId", userId);
}


//Leinecker
function readCookie()
{
        userId = -1;
        let data = document.cookie;
        let splits = data.split(",");
        for(var i = 0; i < splits.length; i++)
        {
                let thisOne = splits[i].trim();
                let tokens = thisOne.split("=");

                if(tokens.length < 2) continue;

                if(tokens[0] == "firstName" )
                {
                        firstName = tokens[1];
                }
                else if(tokens[0] == "lastName" )
                {
                        lastName = tokens[1];
                }
                else if(tokens[0] == "userId" )
                {
                        userId = parseInt(tokens[1].trim() );
                }
        }

        console.log("Parsed userId:", userId);
        if( userId < 0 )
        {
                window.location.href = "index.html";
        }
        else
        {
                 document.getElementById("userName").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
        }
}*/

// Function to save user session data into a cookie
function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000)); // Set cookie expiry time

    // Create a session object with user data and a timestamp
    let sessionData = {
        firstName: firstName,
        lastName: lastName,
        userId: userId,
        timestamp: date.getTime() // Add a timestamp for session validation
    };

    // Base64 encode the JSON string to safely store complex data in a cookie
    let encodedData = btoa(JSON.stringify(sessionData));

    // Set a single cookie named 'userSession' with the encoded data
    document.cookie = `userSession=${encodedData};expires=${date.toGMTString()};path=/`;
    console.log("Saving cookie with userId:", userId);
}

// Function to read user session data from the cookie
function readCookie() {
    userId = -1; // Initialize userId to an invalid value
    let cookies = document.cookie.split(';'); // Split all cookies by semicolon

    // Iterate through each cookie
    for (let cookie of cookies) {
        let [name, value] = cookie.trim().split('='); // Split cookie into name and value

        // Check if the current cookie is 'userSession'
        if (name === 'userSession') {
            try {
                // Decode the base64 string and parse the JSON to get session data
                let sessionData = JSON.parse(atob(value));

                // Validate if the session data exists and is still valid based on timestamp
                if (sessionData && sessionData.timestamp > new Date().getTime()) {
                    firstName = sessionData.firstName;
                    lastName = sessionData.lastName;
                    userId = sessionData.userId;
                }
            } catch (e) {
                console.error("Error parsing session cookie:", e); // Log any parsing errors
            }
            break; // Exit loop once userSession cookie is found
        }
    }

    console.log("Parsed userId:", userId);
    if (userId < 0) {
        // If userId is invalid, redirect to the login page
        window.location.href = "index.html";
    } else {
        // If userId is valid, display the welcome message
        let userNameElement = document.getElementById("userName");
        if (userNameElement) {
            userNameElement.innerHTML = "Welcome, " + firstName + " " + lastName + "!";
        }
    }
}



//Leinecker
function doLogout()
{
        userId = 0;
        firstName = "";
        lastName = "";
        document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "index.html";
}

//table of contacts
function showTable() {
        var x = document.getElementById("addMe");
        var contacts = document.getElementById("contactsTable")
        if (x.style.display === "none") {
                x.style.display = "block";
                contacts.style.display = "none";
        }
        else {
                x.style.display = "none";
                contacts.style.display = "block";
        }
}

//Leincker add function
function addContact()
{
        let firstName = document.getElementById("contactTextFirst").value;
        let lastName = document.getElementById("contactTextLast").value;
        let phonenumber = document.getElementById("contactTextNumber").value;
        let emailaddress = document.getElementById("contactTextEmail").value;

        if (!validAddContact(firstName, lastName, phonenumber, emailaddress))
        {
                console.log("Invalid Input Submitted!");
                return;
        }

        let tmp =
        {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phonenumber,
                emailAddress: emailaddress,
                userId: userId
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/AddContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                console.log("Contact Added");
                                document.getElementById("addMe").reset();
                                loadContacts();
                                showTable();
                        }
                };
                xhr.send(jsonPayload);
        }
        catch(err)
        {
                console.log(err.message);
                //ERROR
                document.getElementById("contactAddResult").innerHTML = err.message;
        }

}

//load existing and edited contacts
function loadContacts()
{
        let tmp = {
            search: "", 
            userId: userId
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/SearchContact.' + extension;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try
        {
                xhr.onreadystatechange = function ()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                let jsonObject = JSON.parse(xhr.responseText);
                                if (jsonObject.error)
                                {
                                        console.log(jsonObject.error);
                                        return;
                                }

                                let text = "<table border='1'>"
                                for (let i = 0; i < jsonObject.results.length; i++)
                                {
                                        ids[i] = jsonObject.results[i].ID
                                        text += "<tr id='row" + i + "'>"
                                        text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                                        text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                                        //text += "<td id='email" + i + "'><span>" + jsonObject.results[i].EmailAddress + "</span></td>";
                                        //text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].PhoneNumber + "</span></td>";
                                        text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
                                        text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
                                        text += "<td>" +
                        "<button type='button' id='edit_button" + i + "' class='w3-button w3-circle w3-lime' onclick='edit_row(" + i + ")'>" + "<span class='gly                                                                             phicon glyphicon-edit'></span>" + "</button>" +
                        "<button type='button' id='save_button" + i + "' value='Save' class='w3-button w3-circle w3-lime' onclick='save_row(" + i + ")' style='d                                                                             isplay: none'>" + "<span class='glyphicon glyphicon-saved'></span>" + "</button>                                                                             " +
                        "<button type='button' onclick='delete_row(" + i + ")' class='w3-button w3-circle w3-amber'>" + "<span class='glyphicon glyphicon-trash'                                                                             ></span> " + "</button>" + "</td>";
                                        text += "<tr/>"
                                }
                                text += "</table>"
                                document.getElementById("tbody").innerHTML = text;
                        }
                };
                xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

//update contacts
function edit_row(id) {
    document.getElementById("edit_button" + id).style.display = "none";
    document.getElementById("save_button" + id).style.display = "inline-block";

    var firstNameI = document.getElementById("first_Name" + id);
    var lastNameI = document.getElementById("last_Name" + id);
    var email = document.getElementById("email" + id);
    var phone = document.getElementById("phone" + id);

    var namef_data = firstNameI.innerText;
    var namel_data = lastNameI.innerText;
    var email_data = email.innerText;
    var phone_data = phone.innerText;

    firstNameI.innerHTML = "<input type='text' id='namef_text" + id + "' value='" + namef_data + "'>";
    lastNameI.innerHTML = "<input type='text' id='namel_text" + id + "' value='" + namel_data + "'>";
    email.innerHTML = "<input type='text' id='email_text" + id + "' value='" + email_data + "'>";
    phone.innerHTML = "<input type='text' id='phone_text" + id + "' value='" + phone_data + "'>"
}

//save changes
function save_row(no) {
    var namef_val = document.getElementById("namef_text" + no).value;
    var namel_val = document.getElementById("namel_text" + no).value;
    var email_val = document.getElementById("email_text" + no).value;
    var phone_val = document.getElementById("phone_text" + no).value;
    var id_val = ids[no]

    document.getElementById("first_Name" + no).innerHTML = namef_val;
    document.getElementById("last_Name" + no).innerHTML = namel_val;
    document.getElementById("email" + no).innerHTML = email_val;
    document.getElementById("phone" + no).innerHTML = phone_val;

    document.getElementById("edit_button" + no).style.display = "inline-block";
    document.getElementById("save_button" + no).style.display = "none";

    let tmp = {
        phoneNumber: phone_val,
        emailAddress: email_val,
        newFirstName: namef_val,
        newLastName: namel_val,
        id: id_val
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

//delete function
function delete_row(no) {
    var namef_val = document.getElementById("first_Name" + no).innerText;
    var namel_val = document.getElementById("last_Name" + no).innerText;
    nameOne = namef_val.substring(0, namef_val.length);
    nameTwo = namel_val.substring(0, namel_val.length);
    let check = confirm('Confirm deletion of contact: ' + nameOne + ' ' + nameTwo);
    if (check === true) {
        document.getElementById("row" + no + "").outerHTML = "";
        let tmp = {
            firstName: nameOne,
            lastName: nameTwo,
            userId: userId
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    console.log("Contact has been deleted");
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }

    };

}

//Leincker search function
function searchContacts()
{
        const content = document.getElementById("searchText");
        const selections = content.value.toUpperCase().split(' ');
        const table = document.getElementById("contacts");
        const tr = table.getElementsByTagName("tr");

        for (let i = 0; i < tr.length; i++)
        {
                //table: first name data
                const td_fn = tr[i].getElementsByTagName("td")[0];
                //table: last name data
                const td_ln = tr[i].getElementsByTagName("td")[1];

                if (td_fn && td_ln)
                {
                        const txtValue_fn = td_fn.textContent || td_fn.innerText;
                        const txtValue_ln = td_ln.textContent || td_ln.innerText;
                        tr[i].style.display = "none";

                        for (selection of selections)
                        {
                                if (txtValue_fn.toUpperCase().indexOf(selection) > -1)
                                {
                                        tr[i].style.display = "";
                                }
                                if (txtValue_ln.toUpperCase().indexOf(selection) > -1)
                                {
                                        tr[i].style.display = "";
                                }
                        }
                }
        }
}

function clickLogin()
{
    var log = document.getElementById("login");
    var reg = document.getElementById("signup");
    var but = document.getElementById("btn");

    log.style.left = "-400px";
    reg.style.left = "0px";
    but.style.left = "130px";
}

function clickRegister()
{
    var log = document.getElementById("login");
    var reg = document.getElementById("signup");
    var but = document.getElementById("btn");

    reg.style.left = "-400px";
    log.style.left = "0px";
    but.style.left = "0px";
}

function validLoginForm(logName, logPass)
{
        var logNameErr = logPassErr = true;

        //username
        if (logName == "")
                {console.log("USERNAME IS BLANK");}
        else
        {
                var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;

                if (regex.test(logName) == false)
                        {console.log("USERNAME IS NOT VALID");}
                else
                {
                        console.log("USERNAME IS VALID");
                        logNameErr = false;
                }
        }

        //password
        if (logPass == "")
                {console.log("PASSWORD IS BLANK");
                logPassErr = true;}
        else
        {
                var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

                if (regex.test(logPass) == false)
                        {console.log("PASSWORD IS NOT VALID");}
                else
                {
                        console.log("PASSWORD IS VALID");
                        logPassErr = false;
                }
        }

        //error
        if ((logNameErr || logPassErr) == true)
                {return false;}

        return true;
}

function validSignUpForm(fName, lName, user, pass)
{
        var fNameErr = lNameErr = userErr = passErr = true;

        if (fName == "")
                {console.log("FIRST NAME IS BLANK");}
        else
        {
                console.log("first name IS VALID");
                fNameErr = false;
        }

        if (lName == "")
                {console.log("LAST NAME IS BLANK");}
        else
        {
                console.log("LAST name IS VALID");
                lNameErr = false;
        }

        if (user == "")
                {console.log("USERNAME IS BLANK");}
        else
        {
                var regex = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{3,18}$/;

                if (regex.test(user) == false)
                {console.log("USERNAME IS NOT VALID");}

                else
                {
                        console.log("USERNAME IS VALID");
                        userErr = false;
                }
        }

        if (pass == "")
                {console.log("PASSWORD IS BLANK");}
        else
        {
                var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

                if (regex.test(pass) == false)
                        {console.log("PASSWORD IS NOT VALID");}

                else
                {
                        console.log("PASSWORD IS VALID");
                        passErr = false;
                }
        }

        if ((fNameErr || lNameErr || userErr || passErr) == true)
                {return false;}

        return true;
}

function validAddContact(firstName, lastName, phone, email)
{
        var fNameErr = lNameErr = phoneErr = emailErr = true;

        if (firstName == "")
                {console.log("FIRST NAME IS BLANK");}
        else
        {
                console.log("first name IS VALID");
                fNameErr = false;
        }

        if (lastName == "")
                {console.log("LAST NAME IS BLANK");}
        else
        {
                console.log("LAST name IS VALID");
                lNameErr = false;
        }

        if (phone == "")
                {console.log("PHONE IS BLANK");}
        else
        {
                var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

                if (regex.test(phone) == false)
                        {console.log("PHONE IS NOT VALID");}

                else
                {
                        console.log("PHONE IS VALID");
                        phoneErr = false;
                }
        }

        if (email == "")
                {console.log("EMAIL IS BLANK");}
        else
        {
                var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

                if (regex.test(email) == false)
                        {console.log("EMAIL IS NOT VALID");}

                else
                {
                        console.log("EMAIL IS VALID");
                        emailErr = false;
                }
        }

        if ((phoneErr || emailErr || fNameErr || lNameErr) == true)
                {return false;}

        return true;
}
