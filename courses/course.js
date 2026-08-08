document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("courseSearch");
    const courseCards = document.querySelectorAll(".course-card");
    const courseButtons = document.querySelectorAll(".course-link");

    const noResults = document.getElementById("noResults");

    const resultsSection = document.getElementById("course-results");
    const resultsTitle = document.getElementById("resultsTitle");
    const resultsMessage = document.getElementById("resultsMessage");
    const programmeResults = document.getElementById("programmeResults");


    /* =====================================================
       SEARCH FUNCTION
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchTerm =
                searchInput.value
                    .toLowerCase()
                    .trim();

            let visibleCount = 0;

            courseCards.forEach(function (card) {

                const searchableText =
                    (
                        (card.dataset.course || "") +
                        " " +
                        card.textContent
                    ).toLowerCase();

                const isMatch =
                    searchableText.includes(searchTerm);

                if (isMatch) {

                    card.classList.remove("hidden");

                    visibleCount++;

                } else {

                    card.classList.add("hidden");

                }

            });


            if (noResults) {

                noResults.style.display =
                    visibleCount === 0
                        ? "block"
                        : "none";

            }

        });

    }


    /* =====================================================
       COURSE BUTTON CLICK
       ===================================================== */

    courseButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const category =
                button.getAttribute("data-category");

            if (!category) {

                console.error(
                    "Course category missing on button."
                );

                return;

            }

            showCourseResults(category);

        });

    });


    /* =====================================================
       SHOW RESULTS PLACEHOLDER
       ===================================================== */

    function showCourseResults(category) {

        if (!resultsTitle) {

            console.error(
                "resultsTitle element not found."
            );

            return;

        }

        if (!resultsMessage) {

            console.error(
                "resultsMessage element not found."
            );

            return;

        }

        if (!programmeResults) {

            console.error(
                "programmeResults element not found."
            );

            return;

        }


        resultsTitle.textContent =
            category + " in Ireland";


        resultsMessage.textContent =
            "University and programme options for " +
            category +
            " will appear here once the CaraVista course database is connected.";


        programmeResults.innerHTML = `
            <div class="data-coming-soon">

                <div class="data-coming-soon-icon">
                    <i class="fa-solid fa-database"></i>
                </div>

                <h3>
                    Programme Data Integration in Progress
                </h3>

                <p>
                    We are preparing programme and university
                    options for
                    <strong>${escapeHtml(category)}</strong>.
                </p>

                <p class="data-note">
                    This section will shortly be connected to
                    the Excel-derived CaraVista course database.
                </p>

            </div>
        `;


        if (resultsSection) {

            setTimeout(function () {

                resultsSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 100);

        }

    }


    /* =====================================================
       SAFE TEXT
       ===================================================== */

    function escapeHtml(text) {

        const temp =
            document.createElement("div");

        temp.textContent = text;

        return temp.innerHTML;

    }


    console.log(
        "CaraVista Course Finder JavaScript loaded successfully."
    );

});
