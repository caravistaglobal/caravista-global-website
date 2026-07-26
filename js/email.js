document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const phoneInput = document.getElementById("phone");
    const formStatus = document.getElementById("form-status");
    const submitButton = contactForm?.querySelector('button[type="submit"]');

    const EMAILJS_PUBLIC_KEY = "V02rEeRqQ4n_f7IHq";
    const EMAILJS_SERVICE_ID = "service_1t2sejo";
    const EMAILJS_TEMPLATE_ID = "template_uwpy087";

    if (!contactForm || !formStatus) {
        console.error("Contact form or form-status element was not found.");
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

    if (phoneInput) {
        phoneInput.addEventListener("input", () => {
            phoneInput.value = phoneInput.value
                .replace(/\D/g, "")
                .slice(0, 10);
        });
    }

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        formStatus.textContent = "";
        formStatus.className = "form-status";

        const formData = new FormData(contactForm);

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const phone = String(formData.get("phone") || "").trim();
        const course = String(formData.get("course") || "").trim();
        const message = String(formData.get("message") || "").trim();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            showStatus(
                "Please enter a valid 10-digit phone number.",
                "error"
            );
            phoneInput?.focus();
            return;
        }

        setSendingState(true);
        showStatus("Sending your enquiry…", "sending");

        const templateParams = {
            name: name,
            email: email,
            phone: phone,
            course: course || "Not specified",
            message: message || "No additional message provided",
            reply_to: email,
            to_email: "info@caravistaglobal.com",
            submitted_at: new Date().toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short"
            })
        };

        try {
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                {
                    publicKey: EMAILJS_PUBLIC_KEY
                }
            );

            console.log("EmailJS success:", response);

            showStatus(
                "Thank you! Your enquiry has been sent successfully. Our team will contact you shortly.",
                "success"
            );

            contactForm.reset();
        } catch (error) {
            console.error("EmailJS sending failed:", error);

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

    function setSendingState(isSending) {
        if (!submitButton) return;

        submitButton.disabled = isSending;
        submitButton.textContent = isSending
            ? "Sending…"
            : "Send Enquiry";
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
