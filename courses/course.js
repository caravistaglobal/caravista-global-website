document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("courseSearch");
    const courseCards = document.querySelectorAll(".course-card");
    const courseButtons = document.querySelectorAll(".course-link");

    const noResults = document.getElementById("noResults");

    const resultsSection = document.getElementById("course-results");
    const resultsTitle = document.getElementById("resultsTitle");
    const resultsMessage = document.getElementById("resultsMessage");
    const programmeResults = document.getElementById("programmeResults");

    let courseDatabase = null;


    /* =====================================================
       LOAD COURSE DATABASE
       ===================================================== */

    async function loadCourseDatabase() {

        try {

            const response = await fetch("data/courses.json");

            if (!response.ok) {
                throw new Error(
                    "Unable to load courses.json. HTTP status: " +
                    response.status
                );
            }

            courseDatabase = await response.json();

            console.log(
                "CaraVista Course Database loaded successfully:",
                courseDatabase
            );

        } catch (error) {

            console.error(
                "Course database loading failed:",
                error
            );

        }

    }


    loadCourseDatabase();


    /* =====================================================
       COURSE SEARCH
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
       COURSE BUTTONS
       ===================================================== */

    courseButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const categoryName =
                button.getAttribute("data-category");

            if (!categoryName) {
                return;
            }

            showCourseResults(categoryName);

        });

    });


    /* =====================================================
       SHOW COURSE RESULTS
       ===================================================== */

    function showCourseResults(categoryName) {

        if (!courseDatabase) {

            showLoadingMessage(categoryName);
            return;

        }


        const category =
            courseDatabase.categories.find(
                function (item) {
                    return item.name === categoryName;
                }
            );


        if (!category) {

            showNoDataMessage(categoryName);
            return;

        }


        resultsTitle.textContent =
            category.name + " in Ireland";


        resultsMessage.textContent =
            category.programme_count +
            " programme options across " +
            category.university_count +
            " universities in the CaraVista database.";


        renderUniversityGroups(category);


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
       GROUP PROGRAMMES BY UNIVERSITY
       ===================================================== */

    function renderUniversityGroups(category) {

        const universityGroups = {};


        category.programmes.forEach(function (programme) {

            const university =
                programme.university ||
                "University not specified";


            if (!universityGroups[university]) {

                universityGroups[university] = [];

            }


            universityGroups[university].push(
                programme
            );

        });


        const universities =
            Object.keys(universityGroups)
                .sort(function (a, b) {
                    return a.localeCompare(b);
                });


        if (universities.length === 0) {

            programmeResults.innerHTML = `
                <p class="empty-results">
                    No programme information is currently available.
                </p>
            `;

            return;

        }


        programmeResults.innerHTML =
            universities.map(function (university) {

                const programmes =
                    universityGroups[university];


                const programmeHTML =
                    programmes.map(function (programme) {

                        const qualification =
                            programme.qualification
                                ? `
                                    <span class="qualification">
                                        ${escapeHtml(programme.qualification)}
                                    </span>
                                  `
                                : "";


                        return `
                            <li class="programme-item">

                                <div class="programme-name">
                                    ${escapeHtml(programme.programme)}
                                </div>

                                ${qualification}

                            </li>
                        `;

                    }).join("");


                return `
                    <article class="university-result-card">

                        <div class="university-result-header">

                            <div class="university-result-icon">
                                <i class="fa-solid fa-building-columns"></i>
                            </div>

                            <div>

                                <h3>
                                    ${escapeHtml(university)}
                                </h3>

                                <p>
                                    ${programmes.length}
                                    programme${programmes.length === 1 ? "" : "s"}
                                </p>

                            </div>

                        </div>


                        <ul class="programme-list">

                            ${programmeHTML}

                        </ul>

                    </article>
                `;

            }).join("");

    }


    /* =====================================================
       DATABASE LOADING MESSAGE
       ===================================================== */

    function showLoadingMessage(categoryName) {

        resultsTitle.textContent =
            categoryName + " in Ireland";


        resultsMessage.textContent =
            "Loading programme and university options...";


        programmeResults.innerHTML = `
            <div class="data-coming-soon">

                <div class="data-coming-soon-icon">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </div>

                <p>
                    Loading CaraVista programme database...
                </p>

            </div>
        `;


        if (resultsSection) {

            resultsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    /* =====================================================
       CATEGORY NOT FOUND
       ===================================================== */

    function showNoDataMessage(categoryName) {

        resultsTitle.textContent =
            categoryName + " in Ireland";


        resultsMessage.textContent =
            "Programme information for this category is not currently available.";


        programmeResults.innerHTML = `
            <div class="data-coming-soon">

                <div class="data-coming-soon-icon">
                    <i class="fa-solid fa-circle-info"></i>
                </div>

                <p>
                    Please contact CaraVista for personalised
                    course guidance.
                </p>

            </div>
        `;


        if (resultsSection) {

            resultsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    /* =====================================================
       SAFE HTML OUTPUT
       ===================================================== */

    function escapeHtml(text) {

        const element =
            document.createElement("div");

        element.textContent =
            String(text || "");

        return element.innerHTML;

    }


    console.log(
        "CaraVista Course Finder JavaScript loaded successfully."
    );

});
