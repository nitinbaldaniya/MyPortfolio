
 // 1. Theme Toggle
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle?.querySelector("i");
const themeText = themeToggle?.querySelector("span");

function setTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle("light-theme", isLight);
    localStorage.setItem("portfolio-theme", theme);

    if (themeIcon) {
        themeIcon.className = isLight
            ? "fa-solid fa-moon"
            : "fa-solid fa-sun";
    }

    if (themeText) {
        themeText.textContent = isLight ? "Dark Mode" : "Light Mode";
    }

    if (themeToggle) {
        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark theme" : "Switch to light theme"
        );
        themeToggle.setAttribute("aria-pressed", String(isLight));
    }
}

// Load saved theme
const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light" || savedTheme === "dark") {
    setTheme(savedTheme);
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isCurrentlyLight =
            document.body.classList.contains("light-theme");

        setTheme(isCurrentlyLight ? "dark" : "light");
    });
}

// 2. Automatic Copyright Year
const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// 3. Smooth Scrolling
document.documentElement.style.scrollBehavior =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";

// 4. Contact Form - Web3Forms
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    const submitButton = contactForm.querySelector(
        'button[type="submit"]'
    );
    const formNote = contactForm.querySelector(".contact-form-note");

    if (formNote) {
        formNote.setAttribute("role", "status");
        formNote.setAttribute("aria-live", "polite");
    }

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const originalButtonHTML = submitButton?.innerHTML;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        if (formNote) {
            formNote.textContent = "Sending your message...";
        }

        try {
            const response = await fetch(
                "https://api.web3forms.com/submit",
                {
                    method: "POST",
                    body: new FormData(contactForm)
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to send your message."
                );
            }

            contactForm.reset();

            if (formNote) {
                formNote.textContent =
                    "Message sent successfully! Thank you for contacting me.";
            }
        } catch (error) {
            console.error("Contact form error:", error);

            if (formNote) {
                formNote.textContent =
                    "Message could not be sent. Please check your internet connection and try again.";
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            }
        }
    });
}
