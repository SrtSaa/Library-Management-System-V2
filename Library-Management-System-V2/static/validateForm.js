function clearErrors() {
    errors = document.getElementsByClassName('formerror');
    for (let item of errors) {
        item.innerHTML = "";
    }
}

function seterror(id, errormsg) {
    element = document.getElementById(id);
    element.getElementsByClassName('formerror')[0].innerHTML = errormsg;
}





function validateUsernameOrEmail(){
    var username = document.getElementById("fue").value.trim();
    if (username.length == 0) {
        seterror("usernameoremail", "*Please enter username / email!<br>");
        return false;
    }
    if (username.length < 4) {
        seterror("usernameoremail", "*Usernane / Email is too short!<br>");
        return false;
    }
    if (username.length > 30) {
        seterror("usernameoremail", "*Usernane / Email is too long!<br>");
        return false;
    }
    return true;
}

function validateFirstName(){
    var fname = document.getElementById("ffname").value.trim();
    if (fname.length == 0) {
        seterror("fname", "*Enter Valid First name!<br>");
        return false;
    }
    if (!fname.match(/^[a-zA-Z]+$/)) {
        seterror("fname", "*Should be Alphabetic!<br>");
        return false;
    }
    return true;
}

function validateLastName(){
    var lname = document.getElementById("flname").value.trim();
    if (lname.length>0 && !lname.match(/^[a-zA-Z]+$/)) {
        seterror("lname", "*Should be Alphabetic!<br>");
        return false;
    }
    return true;
}

function validateUsername(){
    var username = document.getElementById("funame").value.trim();
    if (username.length == 0) {
        seterror("username", "*Please enter username!<br>");
        return false;
    }
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
        seterror("username", "*Should be AlphaNumeric!<br>");
        return false;
    }
    if (username.length < 4) {
        seterror("username", "*Usernane is too short!<br>");
        return false;
    }
    if (username.length > 15) {
        seterror("username", "*Usernane is too long!<br>");
        return false;
    }
    return true;
}

function validateEmail() {
    var email = document.getElementById("femail").value.trim();
    if (email.length == 0) {
        seterror("email", "*Please enter email!<br>");
        return false;
    }
    if (!email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        seterror("email", "*Please give valid email address!<br>");
        return false;
    }
    if (email.length > 30) {
        seterror("email", "*Email length is too long!<br>");
        return false;
    }
    return true;
}

function validatePassword() {
    var password = document.getElementById("fpass").value;
    if (password.length == 0) {
        seterror("pass", "*Please enter password!<br>");
        return false;
    } 
    if (password.length < 6) {
        seterror("pass", "*Password should be atleast 6 characters long!<br>");
        return false;
    }
    if (password.length > 15) {
        seterror("pass", "*Password should be atmost 15 characters long!<br>");
        return false;
    }
    if (!password.match(/[a-z]/g) || !password.match(/[A-Z]/g) || !password.match(/[0-9]/g) || !password.match(/[^a-zA-Z\d]/g)) {
        seterror("pass", "*Passsword must contain atleast 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character!<br>");
        return false;
    }

    return true;
}

function validateCPassword() {
    var password = document.getElementById("fpass").value;
    var cpassword = document.getElementById("fcpass").value;
    if (password !== cpassword){
        seterror("cpass", "*Should matched with password!<br>");
        return false;
    } 
    return true;
}

function validatePhone() {
    var phone = document.getElementById("fphone").value;
    if (phone.length != 10){
        seterror("phone", "*Should be 10 digit long!<br>");
        return false
    }
    if (!phone.match(/^([1-9]{1})([0-9]{9})$/)) {
        seterror("phone", "*Should be valid!<br>");
        return false;
    }
    return true;
}

function validateDOB() {
    var dob = new Date(document.getElementById("fdob").value);
    var today = new Date(); 
    var ms = today.getTime() - dob.getTime(); 
    var y = Math.abs(Math.round(ms/1000/60/60/24/365.25));

    if (y < 5){
        seterror("dob", "*Should be 5 year old!<br>");
        return false;
    }

    return true;
}



function validateLoginDetails(){
    clearErrors();
    if (validateUsernameOrEmail() == false)   return false;
    if (validatePassword() == false)   return false;
    return true;
}


function valildateRegisterDetails(){
    clearErrors();
    if (validateFirstName() == false)   return false;
    if (validateLastName() == false)   return false;
    if (validateUsername() == false)   return false;
    if (validateEmail() == false)   return false;
    if (validatePassword() == false)   return false;
    if (validateCPassword() == false)   return false;
    if (validatePhone() == false)   return false;
    if (validateDOB() == false)   return false;
    return true;
}





function validateSectionTitle() {
    clearErrors();
    var title = document.getElementById("ftitle").value.trim();
    if (title.length == 0) {
        seterror("title", "*Enter Valid Title!<br>");
        return false;
    }
    if (!title.match(/^[a-zA-Z]+$/)) {
        seterror("title", "*Should be Alphabetic!<br>");
        return false;
    }
    return true;
}

function validateBookTitle() {
    var title = document.getElementById("ftitle").value.trim();
    if (title.length == 0) {
        seterror("title", "*Enter Valid Title!<br>");
        return false;
    }
    if (!title.match(/^[a-zA-Z]+(([ \+\#\-\:\.0-9a-zA-Z])?)*$/)) {
        seterror("title", "*Should be Alphabetic!<br>");
        return false;
    }
    return true;
}

function validateAuthors(){
    var authors = document.getElementById("fauthors").value.trim();
    if (authors.length == 0) {
        seterror("authors", "*Enter Valid Authors!<br>");
        return false;
    }
    if (!authors.match(/^[a-zA-Z]+(([\,\. a-zA-Z ])?)*$/)) {
        seterror("authors", "*Alphabates, ',', '.', 'space' are allowed!<br>");
        return false;
    }
    return true;
}



function validateeBookDetails(){
    clearErrors();
    if (!validateBookTitle())   return false;
    if (!validateAuthors())   return false;
    return true;
}





function validatePurchaseDetails(){
    clearErrors();
    var upiid = document.getElementById("upiid").value.trim();
    if (upiid.length < 12 || !upiid.match(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/)) {
        seterror("invalidDetails", "*Enter Valid UPI ID!<br>");
        return false;
    }
    var otp = document.getElementById("otp").value.trim();
    if (otp.length != 6 || !otp.match(/^([0-9]{6})$/) ){
        seterror("invalidDetails", "*Enter Valid OTP!<br>");
        return false;
    }
    return true;
}


