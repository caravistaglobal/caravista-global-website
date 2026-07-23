const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        emailjs.sendForm(
            "service_1t2sejo",
            "template_uwpy087",
            this
        )
        .then(function () {

            alert("Thank you! Your enquiry has been sent successfully.");

            contactForm.reset();

        })
        .catch(function (error) {

            console.error(error);

            alert("Sorry, your enquiry could not be sent.");

        });

    });

}
const phone = document.getElementById("phone").value;

if (!/^[0-9]{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
}