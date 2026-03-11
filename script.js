/* AUTHENTICATION */

function checkUserLogin(){
const currentUser = localStorage.getItem("currentUser");
if(currentUser){
showMainApp();
}else{
showLoginPage();
}
}

function showLoginPage(){
    const loginSection = document.getElementById("login-section");
    loginSection.style.display = "flex";
    loginSection.classList.add("visible");

    const containerEl = document.getElementById("container");
    if (containerEl) containerEl.classList.remove("visible");

    const profileWrap = document.querySelector(".user-profile-wrap");
    if (profileWrap) profileWrap.style.display = "none";
}

function showMainApp(){
    const loginSection = document.getElementById("login-section");
    loginSection.style.display = "none";
    loginSection.classList.remove("visible");

    const containerEl = document.getElementById("container");
    if (containerEl) containerEl.classList.add("visible");

    const profileWrap = document.querySelector(".user-profile-wrap");
    if (profileWrap) profileWrap.style.display = "flex";

    updateUserProfile();
    showPage("dashboard");
}

function toggleForm(event){
    // if called from an anchor, prevent it from navigating
    if(event && event.preventDefault) event.preventDefault();
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    // use computed style because initial display is set by CSS, not inline
    const loginIsVisible = window.getComputedStyle(loginForm).display !== "none";
    if(loginIsVisible){
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    } else {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    }
}

function handleLogin(event){
    console.log('handleLogin invoked');
    event.preventDefault();
    const username = document.getElementById("login-username").value;
const phone = document.getElementById("login-phone").value;
const password = document.getElementById("login-password").value;
const errorDiv = document.getElementById("login-error");
errorDiv.textContent = "";

if(phone.length !== 10 || isNaN(phone)){
errorDiv.textContent = "Phone number must be exactly 10 digits";
return;
}

let users = JSON.parse(localStorage.getItem("users")) || [];
const user = users.find(u => u.username === username && u.phone === phone && u.password === password);

if(user){
localStorage.setItem("currentUser", JSON.stringify(user));
document.getElementById("loginFormElement").reset();
showMainApp();
}else{
errorDiv.textContent = "Invalid username, phone number, or password";
}
}

function handleRegister(event){
    console.log('handleRegister invoked');
    event.preventDefault();
    const username = document.getElementById("reg-username").value;
const phone = document.getElementById("reg-phone").value;
const password = document.getElementById("reg-password").value;
const errorDiv = document.getElementById("register-error");
errorDiv.textContent = "";

if(phone.length !== 10 || isNaN(phone)){
errorDiv.textContent = "Phone number must be exactly 10 digits";
return;
}

let users = JSON.parse(localStorage.getItem("users")) || [];
const userExists = users.find(u => u.username === username);

if(userExists){
errorDiv.textContent = "Username already exists. Please choose a different username.";
return;
}

const newUser = {
username: username,
phone: phone,
password: password,
role: "",
address: "",
email: "",
dateOfBirth: "",
profilePhoto: ""
};

users.push(newUser);
localStorage.setItem("users", JSON.stringify(users));
localStorage.setItem("currentUser", JSON.stringify(newUser));

document.getElementById("registerFormElement").reset();
toggleForm();
showCompleteProfileModal();
}

function showCompleteProfileModal(){
    document.getElementById("completeProfileModal").classList.add("open");
    document.getElementById("completeProfilePicInput").value = "";
    document.getElementById("completeProfilePicPreview").style.display = "none";
    document.getElementById("completeProfilePicPlaceholder").style.display = "block";
    document.getElementById("complete-role").value = "";
    document.getElementById("complete-email").value = "";
    document.getElementById("complete-dob").value = "";
    document.getElementById("complete-address").value = "";
}

function handleCompleteProfile(event){
    event.preventDefault();
    const role = document.getElementById("complete-role").value.trim();
    const email = document.getElementById("complete-email").value.trim();
    const dateOfBirth = document.getElementById("complete-dob").value;
    const address = document.getElementById("complete-address").value.trim();
    const picInput = document.getElementById("completeProfilePicInput");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    currentUser.role = role;
    currentUser.email = email;
    currentUser.dateOfBirth = dateOfBirth;
    currentUser.address = address;

    if (picInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.profilePhoto = e.target.result;
            saveUserAndCloseCompleteProfile(currentUser);
        };
        reader.readAsDataURL(picInput.files[0]);
    } else {
        saveUserAndCloseCompleteProfile(currentUser);
    }
}

function saveUserAndCloseCompleteProfile(updatedUser){
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const idx = users.findIndex(u => u.username === updatedUser.username && u.phone === updatedUser.phone);
    if (idx >= 0) users[idx] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    document.getElementById("completeProfileModal").classList.remove("open");
    showMainApp();
    alert("Profile completed! Welcome " + updatedUser.username);
}

function openEditProfileModal(){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    document.getElementById("edit-username").value = currentUser.username || "";
    document.getElementById("edit-phone").value = currentUser.phone || "";
    document.getElementById("edit-role").value = currentUser.role || "";
    document.getElementById("edit-email").value = currentUser.email || "";
    document.getElementById("edit-dob").value = currentUser.dateOfBirth || "";
    document.getElementById("edit-address").value = currentUser.address || "";

    const preview = document.getElementById("editProfilePicPreview");
    const placeholder = document.getElementById("editProfilePicPlaceholder");
    if (currentUser.profilePhoto) {
        preview.src = currentUser.profilePhoto;
        preview.style.display = "block";
        placeholder.style.display = "none";
    } else {
        preview.style.display = "none";
        placeholder.style.display = "block";
    }
    document.getElementById("editProfilePicInput").value = "";
    document.getElementById("editProfileModal").classList.add("open");
}

function closeEditProfileModal(){
    document.getElementById("editProfileModal").classList.remove("open");
}

function openChangePasswordModal(){
    document.getElementById("changePasswordModal").classList.add("open");
    resetChangePasswordModal();
}

function closeChangePasswordModal(){
    document.getElementById("changePasswordModal").classList.remove("open");
}

function resetChangePasswordModal(){
    document.getElementById("changePasswordVerifyStep").style.display = "block";
    document.getElementById("changePasswordNewStep").style.display = "none";
    document.getElementById("changePwUsername").value = "";
    document.getElementById("changePwPhone").value = "";
    document.getElementById("changePasswordError").textContent = "";
    document.getElementById("changePwNew").value = "";
    document.getElementById("changePwConfirm").value = "";
    document.getElementById("changePasswordMatchError").textContent = "";
}

function verifyAndShowPasswordFields(){
    const username = document.getElementById("changePwUsername").value.trim();
    const phone = document.getElementById("changePwPhone").value.trim();
    const errorDiv = document.getElementById("changePasswordError");

    if (!username || !phone) {
        errorDiv.textContent = "Please enter both username and phone number.";
        return;
    }
    if (phone.length !== 10 || isNaN(phone)) {
        errorDiv.textContent = "Phone number must be exactly 10 digits.";
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    if (currentUser.username === username && currentUser.phone === phone) {
        errorDiv.textContent = "";
        document.getElementById("changePasswordVerifyStep").style.display = "none";
        document.getElementById("changePasswordNewStep").style.display = "block";
    } else {
        errorDiv.textContent = "Incorrect username or phone number.";
    }
}

function handleChangePassword(event){
    event.preventDefault();
    const newPassword = document.getElementById("changePwNew").value;
    const confirmPassword = document.getElementById("changePwConfirm").value;
    const matchError = document.getElementById("changePasswordMatchError");

    if (newPassword !== confirmPassword) {
        matchError.textContent = "Passwords do not match.";
        return;
    }
    matchError.textContent = "";

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    currentUser.password = newPassword;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const idx = users.findIndex(u => u.username === currentUser.username && u.phone === currentUser.phone);
    if (idx >= 0) users[idx] = currentUser;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    closeChangePasswordModal();
    updateUserProfile();
    alert("Password changed successfully!");
}

function openDeleteAccountModal(){
    document.getElementById("deleteAccountModal").classList.add("open");
    document.getElementById("deleteAccountUsername").value = "";
    document.getElementById("deleteAccountPhone").value = "";
    document.getElementById("deleteAccountPassword").value = "";
    document.getElementById("deleteAccountError").textContent = "";
}

function closeDeleteAccountModal(){
    document.getElementById("deleteAccountModal").classList.remove("open");
}

function handleDeleteAccount(event){
    event.preventDefault();
    const username = document.getElementById("deleteAccountUsername").value.trim();
    const phone = document.getElementById("deleteAccountPhone").value.trim();
    const password = document.getElementById("deleteAccountPassword").value;
    const errorDiv = document.getElementById("deleteAccountError");

    if (!username || !phone || !password) {
        errorDiv.textContent = "Please fill all fields.";
        return;
    }
    if (phone.length !== 10 || isNaN(phone)) {
        errorDiv.textContent = "Phone number must be exactly 10 digits.";
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    if (currentUser.username === username && currentUser.phone === phone && currentUser.password === password) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users = users.filter(u => !(u.username === username && u.phone === phone));
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.removeItem("currentUser");
        localStorage.removeItem("certificates_" + username);

        closeDeleteAccountModal();
        document.getElementById("deleteAccountForm").reset();
        alert("Account deleted successfully.");
        showLoginPage();
    } else {
        errorDiv.textContent = "Incorrect username, phone number, or password.";
    }
}

function handleEditProfile(event){
    event.preventDefault();
    const username = document.getElementById("edit-username").value.trim();
    const phone = document.getElementById("edit-phone").value.trim();
    const role = document.getElementById("edit-role").value.trim();
    const email = document.getElementById("edit-email").value.trim();
    const dateOfBirth = document.getElementById("edit-dob").value;
    const address = document.getElementById("edit-address").value.trim();
    const picInput = document.getElementById("editProfilePicInput");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    if (phone.length !== 10 || isNaN(phone)) {
        alert("Phone number must be exactly 10 digits.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const usernameTaken = users.find(u => u.username === username && !(u.username === currentUser.username && u.phone === currentUser.phone));
    if (usernameTaken) {
        alert("Username already exists. Please choose a different username.");
        return;
    }

    const oldUsername = currentUser.username;
    const oldPhone = currentUser.phone;
    currentUser.username = username;
    currentUser.phone = phone;
    currentUser.role = role;
    currentUser.email = email;
    currentUser.dateOfBirth = dateOfBirth;
    currentUser.address = address;

    if (picInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.profilePhoto = e.target.result;
            saveUserProfile(currentUser, oldUsername, oldPhone);
        };
        reader.readAsDataURL(picInput.files[0]);
    } else {
        saveUserProfile(currentUser, oldUsername, oldPhone);
    }
}

function saveUserProfile(updatedUser, oldUsername, oldPhone){
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const idx = users.findIndex(u => u.username === oldUsername && u.phone === oldPhone);
    if (idx >= 0) users[idx] = updatedUser;

    if (oldUsername && oldUsername !== updatedUser.username) {
        const oldKey = "certificates_" + oldUsername;
        const newKey = "certificates_" + updatedUser.username;
        const certs = JSON.parse(localStorage.getItem(oldKey)) || [];
        localStorage.setItem(newKey, JSON.stringify(certs));
        localStorage.removeItem(oldKey);
    }

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    closeEditProfileModal();
    updateUserProfile();
    alert("Profile updated successfully!");
}

function logout(){
localStorage.removeItem("currentUser");
document.getElementById("loginFormElement").reset();
document.getElementById("registerFormElement").reset();
document.getElementById("login-error").textContent = "";
document.getElementById("register-error").textContent = "";
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
loginForm.style.display = "block";
registerForm.style.display = "none";
closeMobileMenu();
showLoginPage();
}

/* USER PROFILE */
function updateUserProfile(){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const initial = (currentUser.username || "?").charAt(0).toUpperCase();
    const phoneDisplay = currentUser.phone ? "+91 " + currentUser.phone : "—";

    const headerInitial = document.getElementById("headerAvatarInitial");
    const headerImg = document.getElementById("headerAvatarImg");
    const dropdownInitial = document.getElementById("dropdownAvatarInitial");
    const dropdownImg = document.getElementById("dropdownAvatarImg");
    const dropdownName = document.getElementById("dropdownUserName");
    const dropdownPhone = document.getElementById("dropdownUserPhone");

    if (currentUser.profilePhoto) {
        if (headerImg) { headerImg.src = currentUser.profilePhoto; headerImg.style.display = "block"; }
        if (headerInitial) headerInitial.style.display = "none";
        if (dropdownImg) { dropdownImg.src = currentUser.profilePhoto; dropdownImg.style.display = "block"; }
        if (dropdownInitial) dropdownInitial.style.display = "none";
    } else {
        if (headerInitial) { headerInitial.textContent = initial; headerInitial.style.display = "flex"; }
        if (headerImg) headerImg.style.display = "none";
        if (dropdownInitial) { dropdownInitial.textContent = initial; dropdownInitial.style.display = "flex"; }
        if (dropdownImg) dropdownImg.style.display = "none";
    }

    if (dropdownName) dropdownName.textContent = currentUser.username || "User";
    if (dropdownPhone) dropdownPhone.textContent = phoneDisplay;

    const emailEl = document.getElementById("dropdownUserEmail");
    const emailVal = document.getElementById("dropdownUserEmailVal");
    const roleEl = document.getElementById("dropdownUserRole");
    const roleVal = document.getElementById("dropdownUserRoleVal");
    const dobEl = document.getElementById("dropdownUserDob");
    const dobVal = document.getElementById("dropdownUserDobVal");
    const addrEl = document.getElementById("dropdownUserAddress");
    const addrVal = document.getElementById("dropdownUserAddressVal");
    if (currentUser.email) {
        if (emailEl) emailEl.style.display = "block";
        if (emailVal) emailVal.textContent = currentUser.email;
    } else if (emailEl) emailEl.style.display = "none";
    if (currentUser.role) {
        if (roleEl) roleEl.style.display = "block";
        if (roleVal) roleVal.textContent = currentUser.role;
    } else if (roleEl) roleEl.style.display = "none";
    if (currentUser.dateOfBirth) {
        if (dobEl) dobEl.style.display = "block";
        if (dobVal) dobVal.textContent = currentUser.dateOfBirth;
    } else if (dobEl) dobEl.style.display = "none";
    if (currentUser.address) {
        if (addrEl) addrEl.style.display = "block";
        if (addrVal) addrVal.textContent = currentUser.address.length > 40 ? currentUser.address.substring(0, 40) + "..." : currentUser.address;
    } else if (addrEl) addrEl.style.display = "none";

    const passwordVal = document.getElementById("dropdownPasswordVal");
    const toggleLink = document.getElementById("passwordToggleLink");
    if (passwordVal) {
        passwordVal.textContent = "••••••";
        passwordVal.dataset.actualPassword = currentUser.password || "";
        passwordVal.dataset.visible = "false";
    }
    if (toggleLink) toggleLink.textContent = "Show";
}

function togglePasswordVisibility(event){
    event.preventDefault();
    event.stopPropagation();
    const passwordVal = document.getElementById("dropdownPasswordVal");
    const toggleLink = document.getElementById("passwordToggleLink");
    if (!passwordVal || !toggleLink) return;
    const isVisible = passwordVal.dataset.visible === "true";
    if (isVisible) {
        passwordVal.textContent = "••••••";
        passwordVal.dataset.visible = "false";
        toggleLink.textContent = "Show";
    } else {
        passwordVal.textContent = passwordVal.dataset.actualPassword || "";
        passwordVal.dataset.visible = "true";
        toggleLink.textContent = "Hide";
    }
}

function toggleProfileDropdown(event){
    event.stopPropagation();
    const dropdown = document.getElementById("userProfileDropdown");
    dropdown.classList.toggle("open");
}

function closeProfileDropdown(){
    const dropdown = document.getElementById("userProfileDropdown");
    dropdown.classList.remove("open");
}

document.addEventListener("click", function(e){
    const dropdown = document.getElementById("userProfileDropdown");
    if (dropdown && dropdown.classList.contains("open") && !dropdown.contains(e.target) && !e.target.closest(".user-profile-btn")) {
        dropdown.classList.remove("open");
    }
    const editModal = document.getElementById("editProfileModal");
    if (editModal && editModal.classList.contains("open") && e.target === editModal) {
        closeEditProfileModal();
    }
    const changePwModal = document.getElementById("changePasswordModal");
    if (changePwModal && changePwModal.classList.contains("open") && e.target === changePwModal) {
        closeChangePasswordModal();
    }
    const deleteModal = document.getElementById("deleteAccountModal");
    if (deleteModal && deleteModal.classList.contains("open") && e.target === deleteModal) {
        closeDeleteAccountModal();
    }
});

/* PAGE NAVIGATION */

function toggleMenu(){
const navMenu = document.getElementById("navMenu");
navMenu.classList.toggle("active");
}

function closeMobileMenu(){
const navMenu = document.getElementById("navMenu");
navMenu.classList.remove("active");
}

function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active");
});

document.getElementById(page).classList.add("active");

if(page === "view"){
loadCertificates();
}

closeMobileMenu();

}

const form = document.getElementById("certificateForm");

if(form){

form.addEventListener("submit", function(e){

e.preventDefault();

const name=document.getElementById("name").value;
const issuer=document.getElementById("issuer").value;
const date=document.getElementById("date").value;
const link=document.getElementById("link").value;

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userCertificatesKey = "certificates_" + currentUser.username;
let certificates=JSON.parse(localStorage.getItem(userCertificatesKey)) || [];

certificates.push({
name:name,
issuer:issuer,
date:date,
link:link
});

localStorage.setItem(userCertificatesKey,JSON.stringify(certificates));

alert("Certificate Saved Successfully");

document.getElementById("certificateForm").reset();

});

}

function loadCertificates(){

let table=document.getElementById("certificateTable");

if(!table) return;

table.innerHTML="";

const searchInput = document.getElementById("searchInput");
if(searchInput){
searchInput.value = "";
}

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userCertificatesKey = "certificates_" + currentUser.username;
let certificates=JSON.parse(localStorage.getItem(userCertificatesKey)) || [];

certificates.forEach((cert, index)=>{

let row=document.createElement("tr");

let actionButtons = "";
if(cert.photo){
actionButtons = `<button onclick="viewCertificatePhoto('${cert.name}', '${cert.photo}')" style="background:#3498db;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;margin-right:5px;">View</button> <button onclick="editCertificate(${index})" style="background:#f39c12;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;margin-right:5px;">Edit</button> <button onclick="deleteCertificate(${index})" style="background:#e74c3c;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">Delete</button>`;
}else if(cert.link){
actionButtons = `<a href="${cert.link}" target="_blank" style="background:#3498db;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;text-decoration:none;display:inline-block;margin-right:5px;">View</a> <button onclick="editCertificate(${index})" style="background:#f39c12;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;margin-right:5px;">Edit</button> <button onclick="deleteCertificate(${index})" style="background:#e74c3c;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">Delete</button>`;
}else{
actionButtons = `<button onclick="editCertificate(${index})" style="background:#f39c12;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;margin-right:5px;">Edit</button> <button onclick="deleteCertificate(${index})" style="background:#e74c3c;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">Delete</button>`;
}

row.innerHTML=`
<td>${cert.name}</td>
<td>${cert.issuer}</td>
<td>${cert.date}</td>
<td>${actionButtons}</td>
`;

table.appendChild(row);

});

}

function searchCertificates(){
const searchInput = document.getElementById("searchInput").value.toLowerCase();
const table = document.getElementById("certificateTable");

if(!table) return;

table.innerHTML = "";

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userCertificatesKey = "certificates_" + currentUser.username;
let certificates = JSON.parse(localStorage.getItem(userCertificatesKey)) || [];

const filteredCertificates = certificates.filter(cert => 
cert.name.toLowerCase().includes(searchInput) ||
cert.issuer.toLowerCase().includes(searchInput) ||
cert.date.includes(searchInput)
);

filteredCertificates.forEach((cert, index) => {
let row = document.createElement("tr");
const actualIndex = certificates.indexOf(cert);

let actionButtons = "";
if(cert.photo){
actionButtons = `<button onclick="viewCertificatePhoto('${cert.name}', '${cert.photo}')" style="background:#3498db;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;margin-right:5px;">View</button> <button onclick="editCertificate(${actualIndex})" style="background:#f39c12;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;margin-right:5px;">Edit</button> <button onclick="deleteCertificate(${actualIndex})" style="background:#e74c3c;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">Delete</button>`;
}else if(cert.link){
actionButtons = `<a href="${cert.link}" target="_blank" style="background:#3498db;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;text-decoration:none;display:inline-block;margin-right:5px;">View</a> <button onclick="editCertificate(${actualIndex})" style="background:#f39c12;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;margin-right:5px;">Edit</button> <button onclick="deleteCertificate(${actualIndex})" style="background:#e74c3c;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">Delete</button>`;
}else{
actionButtons = `<button onclick="editCertificate(${actualIndex})" style="background:#f39c12;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;margin-right:5px;">Edit</button> <button onclick="deleteCertificate(${actualIndex})" style="background:#e74c3c;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">Delete</button>`;
}

row.innerHTML = `
<td>${cert.name}</td>
<td>${cert.issuer}</td>
<td>${cert.date}</td>
<td>${actionButtons}</td>
`;
table.appendChild(row);
});

if(filteredCertificates.length === 0 && searchInput){
let row = document.createElement("tr");
row.innerHTML = "<td colspan='4'>No certificates found</td>";
table.appendChild(row);
}
}

/* PHOTO UPLOAD */

function initializePhotoUpload(){
const photoInput = document.getElementById("certificatePhoto");
if(photoInput){
photoInput.addEventListener("change", function(e){
const file = e.target.files[0];
if(file){
const reader = new FileReader();
reader.onload = function(event){
const preview = document.getElementById("photoPreview");
preview.src = event.target.result;
preview.style.display = "block";
document.getElementById("photoUploadForm").style.display = "block";
};
reader.readAsDataURL(file);
}
});
}
}

function cancelPhotoUpload(){
document.getElementById("photoUploadForm").style.display = "none";
document.getElementById("photoUploadForm").reset();
document.getElementById("photoPreview").style.display = "none";
document.getElementById("certificatePhoto").value = "";
}

function handlePhotoUpload(event){
event.preventDefault();
const photoInput = document.getElementById("certificatePhoto");
const name = document.getElementById("photoCertName").value;
const issuer = document.getElementById("photoCertIssuer").value;
const date = document.getElementById("photoCertDate").value;

if(photoInput.files.length === 0){
alert("Please select a photo");
return;
}

const file = photoInput.files[0];
const reader = new FileReader();

reader.onload = function(event){
const photoData = event.target.result;

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userCertificatesKey = "certificates_" + currentUser.username;
let certificates = JSON.parse(localStorage.getItem(userCertificatesKey)) || [];

certificates.push({
name: name,
issuer: issuer,
date: date,
link: "",
photo: photoData
});

localStorage.setItem(userCertificatesKey, JSON.stringify(certificates));

alert("Certificate Saved Successfully");

document.getElementById("photoUploadForm").reset();
document.getElementById("photoPreview").style.display = "none";
};

reader.readAsDataURL(file);
}

function viewCertificatePhoto(certName, photoData){
const modal = document.createElement("div");
modal.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;justify-content:center;align-items:center;z-index:1000;";

const content = document.createElement("div");
content.style.cssText = "background:white;padding:20px;border-radius:8px;max-width:600px;max-height:80vh;overflow:auto;";

const title = document.createElement("h3");
title.textContent = certName;
title.style.marginTop = "0";

const img = document.createElement("img");
img.src = photoData;
img.style.cssText = "max-width:100%;height:auto;border-radius:5px;margin:15px 0;";

const closeBtn = document.createElement("button");
closeBtn.textContent = "Close";
closeBtn.style.cssText = "background:#e74c3c;color:white;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;";
closeBtn.onclick = function(){
document.body.removeChild(modal);
};

content.appendChild(title);
content.appendChild(img);
content.appendChild(closeBtn);
modal.appendChild(content);

document.body.appendChild(modal);
}

/* CAMERA FUNCTIONS */

let cameraStream = null;
let capturedPhotoData = null;

function openCamera(){
const modal = document.getElementById("cameraModal");
modal.classList.add("active");

const video = document.getElementById("videoStream");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

navigator.mediaDevices.getUserMedia({ 
video: { facingMode: "environment" },
audio: false
})
.then(function(stream){
cameraStream = stream;
video.srcObject = stream;
video.play();
})
.catch(function(error){
alert("Unable to access camera. Please check permissions. Error: " + error.message);
closeCamera();
});
}

function closeCamera(){
const modal = document.getElementById("cameraModal");
modal.classList.remove("active");

if(cameraStream){
cameraStream.getTracks().forEach(track => track.stop());
cameraStream = null;
}

const video = document.getElementById("videoStream");
video.srcObject = null;

const photo = document.getElementById("capturedPhoto");
photo.style.display = "none";

const captureBtn = document.getElementById("captureBtn");
const retakeBtn = document.getElementById("retakeBtn");
const form = document.getElementById("cameraCertificateForm");

captureBtn.style.display = "block";
retakeBtn.style.display = "none";
form.style.display = "none";

capturedPhotoData = null;
}

function capturePhoto(){
const video = document.getElementById("videoStream");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

context.drawImage(video, 0, 0, canvas.width, canvas.height);

capturedPhotoData = canvas.toDataURL("image/jpeg");

const photo = document.getElementById("capturedPhoto");
photo.src = capturedPhotoData;
photo.style.display = "block";

video.style.display = "none";  // hide video stream, show the captured photo

const captureBtn = document.getElementById("captureBtn");
const retakeBtn = document.getElementById("retakeBtn");
const form = document.getElementById("cameraCertificateForm");

captureBtn.style.display = "none";
retakeBtn.style.display = "block";
form.style.display = "block";
}

function retakePhoto(){
const video = document.getElementById("videoStream");
const photo = document.getElementById("capturedPhoto");
const captureBtn = document.getElementById("captureBtn");
const retakeBtn = document.getElementById("retakeBtn");
const form = document.getElementById("cameraCertificateForm");

video.style.display = "block";
photo.style.display = "none";

captureBtn.style.display = "block";
retakeBtn.style.display = "none";
form.style.display = "none";

capturedPhotoData = null;
}

function saveCameraPhoto(event){
event.preventDefault();

const name = document.getElementById("cameraCertName").value;
const issuer = document.getElementById("cameraCertIssuer").value;
const date = document.getElementById("cameraCertDate").value;

if(!capturedPhotoData){
alert("Please capture a photo first");
return;
}

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userCertificatesKey = "certificates_" + currentUser.username;
let certificates = JSON.parse(localStorage.getItem(userCertificatesKey)) || [];

certificates.push({
name: name,
issuer: issuer,
date: date,
link: "",
photo: capturedPhotoData
});

localStorage.setItem(userCertificatesKey, JSON.stringify(certificates));

alert("Certificate Saved Successfully");

document.getElementById("cameraCertificateForm").reset();
closeCamera();
}

/* DELETE AND EDIT FUNCTIONS */

function deleteCertificate(index){
if(!confirm("Are you sure you want to delete this certificate?")){
return;
}

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userCertificatesKey = "certificates_" + currentUser.username;
let certificates = JSON.parse(localStorage.getItem(userCertificatesKey)) || [];

certificates.splice(index, 1);
localStorage.setItem(userCertificatesKey, JSON.stringify(certificates));

alert("Certificate Deleted Successfully");
loadCertificates();
}

function editCertificate(index){
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userCertificatesKey = "certificates_" + currentUser.username;
let certificates = JSON.parse(localStorage.getItem(userCertificatesKey)) || [];

if(index < 0 || index >= certificates.length){
alert("Invalid certificate");
return;
}

const cert = certificates[index];

const modal = document.createElement("div");
modal.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;justify-content:center;align-items:center;z-index:1000;";
modal.id = "editModal";

const content = document.createElement("div");
content.style.cssText = "background:white;padding:30px;border-radius:8px;max-width:400px;width:90%;";

const title = document.createElement("h3");
title.textContent = "Edit Certificate";
title.style.marginTop = "0";

const form = document.createElement("form");
form.innerHTML = `
<div style="margin-bottom:15px;">
<label style="display:block;margin-bottom:5px;font-weight:600;">Certificate Name</label>
<input type="text" id="editCertName" value="${cert.name}" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:5px;box-sizing:border-box;" required>
</div>
<div style="margin-bottom:15px;">
<label style="display:block;margin-bottom:5px;font-weight:600;">Issued By</label>
<input type="text" id="editCertIssuer" value="${cert.issuer}" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:5px;box-sizing:border-box;" required>
</div>
<div style="margin-bottom:15px;">
<label style="display:block;margin-bottom:5px;font-weight:600;">Date</label>
<input type="date" id="editCertDate" value="${cert.date}" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:5px;box-sizing:border-box;" required>
</div>
<div style="margin-bottom:15px;">
<label style="display:block;margin-bottom:5px;font-weight:600;">Certificate Link</label>
<input type="url" id="editCertLink" value="${cert.link || ''}" placeholder="Optional" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:5px;box-sizing:border-box;">
</div>
<div style="display:flex;gap:10px;">
<button type="button" onclick="saveEditCertificate(${index})" style="flex:1;padding:10px;background:#27ae60;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:600;">Save</button>
<button type="button" onclick="cancelEditCertificate()" style="flex:1;padding:10px;background:#95a5a6;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:600;">Cancel</button>
</div>
`;

form.onsubmit = function(e){ e.preventDefault(); };

content.appendChild(title);
content.appendChild(form);
modal.appendChild(content);
document.body.appendChild(modal);
}

function saveEditCertificate(index){
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userCertificatesKey = "certificates_" + currentUser.username;
let certificates = JSON.parse(localStorage.getItem(userCertificatesKey)) || [];

const name = document.getElementById("editCertName").value;
const issuer = document.getElementById("editCertIssuer").value;
const date = document.getElementById("editCertDate").value;
const link = document.getElementById("editCertLink").value;

if(!name || !issuer || !date){
alert("Please fill all required fields");
return;
}

certificates[index].name = name;
certificates[index].issuer = issuer;
certificates[index].date = date;
certificates[index].link = link;

localStorage.setItem(userCertificatesKey, JSON.stringify(certificates));

const modal = document.getElementById("editModal");
if(modal){
document.body.removeChild(modal);
}

alert("Certificate Updated Successfully");
loadCertificates();
}

function cancelEditCertificate(){
const modal = document.getElementById("editModal");
if(modal){
document.body.removeChild(modal);
}
}

/* PROFILE PIC PREVIEW */
function initProfilePicPreviews(){
    const completeInput = document.getElementById("completeProfilePicInput");
    const editInput = document.getElementById("editProfilePicInput");
    if (completeInput) {
        completeInput.addEventListener("change", function(){
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e){
                    const preview = document.getElementById("completeProfilePicPreview");
                    const placeholder = document.getElementById("completeProfilePicPlaceholder");
                    preview.src = e.target.result;
                    preview.style.display = "block";
                    placeholder.style.display = "none";
                };
                reader.readAsDataURL(file);
            }
        });
    }
    if (editInput) {
        editInput.addEventListener("change", function(){
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e){
                    const preview = document.getElementById("editProfilePicPreview");
                    const placeholder = document.getElementById("editProfilePicPlaceholder");
                    preview.src = e.target.result;
                    preview.style.display = "block";
                    placeholder.style.display = "none";
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

/* INITIALIZE APP */
document.addEventListener("DOMContentLoaded", function(){
initializePhotoUpload();
initProfilePicPreviews();
checkUserLogin();
});