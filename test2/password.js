const E_Mail = document.getElementById("E-Mail");
const password = document.getElementById("Password");

const E_Mail1 = localStorage.getItem("E-Mail Adresse:");
const password1 = localStorage.getItem("Password:");








const button = document.getElementById("anmelden");


const trys = document.getElementById("trys")




let attempts = 1; 
let round   = 3;
trys.textContent = 3;
const maxAttempts = 3; 
let success = false;
password.addEventListener("click", function(){
    password.value=""
})
button.addEventListener("click", function() {
    // Wenn die maximale Anzahl an Versuchen erreicht ist, beende das Script
    if (attempts >= maxAttempts) {
        alert("Zu viele Fehlversuche. Das Fenster wird geschlossen.");
        E_Mail.value = "";
        password.value = "";
        trys.textContent = 0;
        return;
    }

    // Hash der Eingabewerte bei jedem Klick berechnen
    const enteredEmailHash = CryptoJS.SHA256(E_Mail.value).toString(CryptoJS.enc.Base64);
    const enteredPasswordHash = CryptoJS.SHA256(password.value).toString(CryptoJS.enc.Base64);

    // Vergleich der gehashten Werte
    if (enteredEmailHash === E_Mail1 && enteredPasswordHash === password1) {
        window.location.href = "test2.html";
        E_Mail.value = "";
        password.value = "";
        success = true;
        console.log("Login erfolgreich!");
    } else {
        password.value = "Dies war nicht korrekt";
        E_Mail.value = "";
        attempts++; 
        round--;
        trys.textContent = round; // Aktualisiere die verbleibenden Versuche
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.getElementById("menu-button");
    const sidebar = document.getElementById("sidebar");
    const closeButton = document.getElementById("close-button");

    // Sidebar beim Hovern über den Button öffnen
    menuButton.addEventListener("mouseenter", () => {
        sidebar.classList.add("show");
    });

    // Sidebar bleibt offen, bis man sie mit dem Schließen-Button schließt
    closeButton.addEventListener("click", () => {
        sidebar.classList.remove("show");
    });

    sidebar.addEventListener("mouseleave", () => {
        sidebar.classList.remove("show")
    })
});


const switch1 = document.getElementById("switch");

switch1.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.removeItem("darkMode"); // Entfernt den Eintrag
    }
});




const switchDarlMode = localStorage.getItem("darkMode")
if  (switchDarlMode) {
    document.body.classList.toggle("dark-mode");
}