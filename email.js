document.addEventListener("DOMContentLoaded", function () {

    const contactForm =
        document.getElementById("contactForm");

    const phoneInput =
        document.getElementById("phone");

    const formStatus =
        document.getElementById("form-status");

    const EMAILJS_PUBLIC_KEY =
        "V02rEeRqQ4n_f7IHq";

    const EMAILJS_SERVICE_ID =
        "service_1t2sejo";

    const EMAILJS_TEMPLATE_ID =
        "template_uwpy087";

    if (!contactForm) {

        console.error(
            "Contact form with id contactForm was not found."
        );

        return;

    }

    if (typeof emailjs === "undefined") {

        console.error(
            "EmailJS library is not loaded."
        );

        showStatus(
            "The enquiry service is temporarily unavailable. Please try again later.",
            "error"
        );

        return;

    }

    emailjs.init({

        publicKey:EMAILJS_PUBLIC_KEY

    });

    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            function () {

                phoneInput.value =
                    phoneInput.value
                    .replace(/[^0-9]/g, "")
                    .slice(0,10);

            }
        );

    }

    contactForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const submitButton =
                contactForm.querySelector(
                    'button[type="submit"]'
                );

            const phone =
                phoneInput
                ? phoneInput.value.trim()
                : "";

            if (!/^[0-9]{10}$/.test(phone)) {

                showStatus(
                    "Please enter a valid 10-digit phone number.",
                    "error"
                );

                if (phoneInput) {

                    phoneInput.focus();

                }

                return;

            }

            if (!contactForm.checkValidity()) {

                contactForm.reportValidity();

                return;

            }

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Sending...";

            }

            showStatus(
                "Sending your enquiry...",
                ""
            );

            try {

                const response =
                    await emailjs.sendForm(

                        EMAILJS_SERVICE_ID,

                        EMAILJS_TEMPLATE_ID,

                        contactForm

                    );

                console.log(
                    "EmailJS success:",
                    response.status,
                    response.text
                );

                showStatus(
                    "Thank you! Your enquiry has been sent successfully.",
                    "success"
                );

                contactForm.reset();

            } catch (error) {

                console.error(
                    "EmailJS error:",
                    error
                );

                showStatus(
                    "Sorry, your enquiry could not be sent. Please try again.",
                    "error"
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "Send Enquiry";

                }

            }

        }
    );

    function showStatus(message,type) {

        if (!formStatus) {

            alert(message);

            return;

        }

        formStatus.textContent = message;

        formStatus.className =
            "form-status";

        if (type) {

            formStatus.classList.add(type);

        }

    }

});
