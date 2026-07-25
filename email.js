document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.getElementById("contactForm");
    const phoneInput = document.getElementById("phone");
    const formStatus = document.getElementById("form-status");

    if (!contactForm) {
        console.error("Contact form with id 'contactForm' was not found.");
        return;
    }

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const submitButton =
            contactForm.querySelector('button[type="submit"]');

        const phone =
            phoneInput ? phoneInput.value.trim() : "";

        /* Validate phone number before sending */

        if (!/^[0-9]{10}$/.test(phone)) {

            const message =
                "Please enter a valid 10-digit phone number.";

            if (formStatus) {

                formStatus.textContent = message;
                formStatus.className = "form-status error";

            } else {

                alert(message);

            }

            if (phoneInput) {
                phoneInput.focus();
            }

            return;
        }

        /* Confirm EmailJS loaded correctly */

        if (typeof emailjs === "undefined") {

            console.error("EmailJS library is not loaded.");

            const message =
                "The enquiry service is temporarily unavailable. Please try again.";

            if (formStatus) {

                formStatus.textContent = message;
                formStatus.className = "form-status error";

            } else {

                alert(message);

            }

            return;
        }

        /* Disable button while sending */

        if (submitButton) {

            submitButton.disabled = true;
            submitButton.textContent = "Sending...";

        }

        if (formStatus) {

            formStatus.textContent = "Sending your enquiry...";
            formStatus.className = "form-status";

        }

        /* Send form through EmailJS */

        emailjs.sendForm(
            "service_1t2sejo",
            "template_uwpy087",
            contactForm
        )

        .then(function () {

            const message =
                "Thank you! Your enquiry has been sent successfully.";

            if (formStatus) {

                formStatus.textContent = message;
                formStatus.className = "form-status success";

            } else {

                alert(message);

            }

            contactForm.reset();

        })

        .catch(function (error) {

            console.error("EmailJS error:", error);

            const message =
                "Sorry, your enquiry could not be sent. Please try again.";

            if (formStatus) {

                formStatus.textContent = message;
                formStatus.className = "form-status error";

            } else {

                alert(message);

            }

        })

        .finally(function () {

            if (submitButton) {

                submitButton.disabled = false;
                submitButton.textContent = "Send Enquiry";

            }

        });

    });

});
