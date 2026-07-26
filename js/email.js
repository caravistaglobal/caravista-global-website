document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const phoneInput = document.getElementById("phone");
    const formStatus = document.getElementById("form-status");
    const submitButton = contactForm?.querySelector('button[type="submit"]');

    const EMAILJS_PUBLIC_KEY = "V02rEeRqQ4n_f7IHq";
    const EMAILJS_SERVICE_ID = "service_1t2sejo";

    // Contact Us template: sends enquiry to CaraVista
    const INTERNAL_TEMPLATE_ID = "template_uwpy087";

    // Auto-Reply template: sends acknowledgement to the student
    const AUTO_REPLY_TEMPLATE_ID = "template_3hu1rd4";

    if (!contactForm || !formStatus) {
        console.error("Contact form or status element was not found.");
        return;
    }

    if (typeof emailjs === "undefined") {
        showStatus(
            "The enquiry service could not be loaded. Please refresh the page and try again.",
            "error"
        );

        console.error("EmailJS browser library is not loaded.");
        return;
    }

    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
    });

    // Allow numbers only and limit phone number to 10 digits
    if (phoneInput) {
        phoneInput.addEventListener("input", () => {
            phoneInput.value = phoneInput.value
                .replace(/\D/g, "")
                .slice(0, 10);
        });
    }

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearStatus();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const formData = new FormData(contactForm);

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const phone = String(formData.get("phone") || "").trim();
        const course = String(formData.get("course") || "").trim();
        const message = String(formData.get("message") || "").trim();

        if (!/^\d{10}$/.test(phone)) {
            showStatus(
                "Please enter a valid 10-digit phone number.",
                "error"
            );

            phoneInput?.focus();
            return;
        }

        const templateParams = {
            name: name,
            email: email,
            phone: phone,
            course: course || "Not specified",
            message: message || "No additional message provided",
            reply_to: email,
            student_email: email,
            to_email: "info@caravistaglobal.com",
            submitted_at: new Date().toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short"
            })
        };

        setSendingState(true);
        showStatus("Sending your enquiry…", "sending");

        try {
            // First email: enquiry sent to CaraVista
            const internalResponse = await emailjs.send(
                EMAILJS_SERVICE_ID,
                INTERNAL_TEMPLATE_ID,
                templateParams
            );

            console.log(
                "CaraVista enquiry email sent successfully:",
                internalResponse
            );

            /*
             * EmailJS limits requests to approximately one request per second.
             * Wait before sending the acknowledgement email.
             */
            await delay(1200);

            let acknowledgementSent = false;

            try {
                // Second email: acknowledgement sent to the student
                const acknowledgementResponse = await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    AUTO_REPLY_TEMPLATE_ID,
                    templateParams
                );

                acknowledgementSent = true;

                console.log(
                    "Student acknowledgement email sent successfully:",
                    acknowledgementResponse
                );
            } catch (acknowledgementError) {
                console.error(
                    "Student acknowledgement email failed:",
                    acknowledgementError
                );
            }

            contactForm.reset();

            if (acknowledgementSent) {
                showStatus(
`✅ Thank you!

Your enquiry has been received successfully.

A confirmation email has been sent to your registered email address.

Our admissions team will contact you shortly.`,
                    "success"
                );
            } else {
                showStatus(
`✅ Thank you!

Your enquiry has been received successfully.

Our admissions team will contact you shortly.`,
                    "success"
                );
            }
        } catch (error) {
            console.error("CaraVista enquiry email failed:", error);

            const errorDetails =
                error?.text ||
                error?.message ||
                "Unknown EmailJS error";

            showStatus(
                `Your enquiry could not be sent. Error: ${errorDetails}`,
                "error"
            );
        } finally {
            setSendingState(false);
        }
    });

    function delay(milliseconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }

    function setSendingState(isSending) {
        if (!submitButton) {
            return;
        }

        submitButton.disabled = isSending;
        submitButton.textContent = isSending
            ? "Sending…"
            : "Send Enquiry";
    }

    function clearStatus() {
        formStatus.textContent = "";
        formStatus.className = "form-status";
        formStatus.removeAttribute("role");
    }

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = "form-status";

        if (type) {
            formStatus.classList.add(type);
        }

        formStatus.setAttribute(
            "role",
            type === "error" ? "alert" : "status"
        );
    }
});
