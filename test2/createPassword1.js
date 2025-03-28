






const button1 = document.getElementById("anmelden1");

button1.addEventListener("click", function(){
    const E_Mail1 = document.getElementById("E-Mail1").value.trim();
    const hashEmail = CryptoJS.SHA256(E_Mail1).toString(CryptoJS.enc.Base64);
    localStorage.setItem("E-Mail Adresse:", hashEmail);

    const Password1 = document.getElementById("Password1").value.trim();
    const hashPassword = CryptoJS.SHA256(Password1).toString(CryptoJS.enc.Base64);
    localStorage.setItem("Password:", hashPassword);

    if (E_Mail1 && Password1){
        window.location.href = "felix.html";
   }
})


document.addEventListener("DOMContentLoaded", function () {
   const menuButton = document.getElementById("menu-button");
   const sidebar = document.getElementById("sidebar");
   const closeButton = document.getElementById("close-button");
    
        
   menuButton.addEventListener("mouseenter", () => {
      sidebar.classList.add("show");
    });
    

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









   





