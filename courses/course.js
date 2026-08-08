document.addEventListener("DOMContentLoaded", function () {

    const searchInput =
        document.getElementById("courseSearch");

    const courseCards =
        document.querySelectorAll(".course-card");

    const courseButtons =
        document.querySelectorAll(".course-link");

    const noResults =
        document.getElementById("noResults");

    const resultsSection =
        document.getElementById("course-results");

    const resultsTitle =
        document.getElementById("resultsTitle");

    const resultsMessage =
        document.getElementById("resultsMessage");

    const programmeResults =
        document.getElementById("programmeResults");

    const universityFilter =
        document.getElementById("universityFilter");

    const qualificationFilter =
        document.getElementById("qualificationFilter");

    const clearFiltersButton =
        document.getElementById("clearFilters");

    const resultsFilters =
        document.getElementById("resultsFilters");
const mobileMenuToggle =
    document.getElementById("mobileMenuToggle");

const mobileMenu =
    document.getElementById("mobileMenu");

    let courseDatabase = null;

    let activeCategory = null;


    /* =====================================================
       LOAD DATABASE
       ===================================================== */

    async function loadCourseDatabase() {

        try {

            const response =
                await fetch("data/courses.json");

            if (!response.ok) {

                throw new Error(
                    "Unable to load courses.json. HTTP status: " +
                    response.status
                );

            }

            courseDatabase =
                await response.json();

            console.log(
                "CaraVista Course Database loaded:",
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
       HOMEPAGE CATEGORY SEARCH
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const searchTerm =
                    searchInput.value
                        .toLowerCase()
                        .trim();

                let visibleCount = 0;


                courseCards.forEach(
                    function (card) {

                        const searchableText =
                            (
                                (card.dataset.course || "") +
                                " " +
                                card.textContent
                            ).toLowerCase();


                        const matches =
                            searchableText.includes(
                                searchTerm
                            );


                        card.classList.toggle(
                            "hidden",
                            !matches
                        );


                        if (matches) {
                            visibleCount++;
                        }

                    }
                );


                if (noResults) {

                    noResults.style.display =
                        visibleCount === 0
                            ? "block"
                            : "none";

                }

            }
        );

    }


    /* =====================================================
       COURSE BUTTONS
       ===================================================== */

    courseButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const categoryName =
                        button.getAttribute(
                            "data-category"
                        );


                    if (!categoryName) {
                        return;
                    }


                    showCourseResults(
                        categoryName
                    );

                }
            );

        }
    );


    /* =====================================================
       SHOW CATEGORY
       ===================================================== */

    function showCourseResults(
        categoryName
    ) {

        if (!courseDatabase) {

            showLoadingMessage(
                categoryName
            );

            return;

        }


        const category =
            courseDatabase.categories.find(
                function (item) {

                    return (
                        item.name ===
                        categoryName
                    );

                }
            );


        if (!category) {

            showNoDataMessage(
                categoryName
            );

            return;

        }


        activeCategory =
            category;


        resultsTitle.textContent =
            category.name +
            " in Ireland";


        resultsMessage.textContent =
            category.programme_count +
            " programme options across " +
            category.university_count +
            " universities in the CaraVista database.";


        populateFilters(
            category
        );


        renderFilteredResults();


        if (resultsSection) {

            setTimeout(
                function () {

                    resultsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                },
                100
            );

        }

    }


    /* =====================================================
       POPULATE FILTER OPTIONS
       ===================================================== */

    function populateFilters(
        category
    ) {

        if (
            !universityFilter ||
            !qualificationFilter
        ) {
            return;
        }


        universityFilter.innerHTML = `
            <option value="">
                All Universities
            </option>
        `;


        qualificationFilter.innerHTML = `
            <option value="">
                All Qualifications
            </option>
        `;


        const universities =
            [
                ...new Set(
                    category.programmes
                        .map(
                            function (programme) {

                                return (
                                    programme.university ||
                                    ""
                                ).trim();

                            }
                        )
                        .filter(Boolean)
                )
            ]
            .sort(
                function (a, b) {
                    return a.localeCompare(b);
                }
            );


        universities.forEach(
            function (university) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    university;

                option.textContent =
                    university;

                universityFilter.appendChild(
                    option
                );

            }
        );


        const qualifications =
            [
                ...new Set(
                    category.programmes
                        .map(
                            function (programme) {

                                return (
                                    programme.qualification ||
                                    ""
                                ).trim();

                            }
                        )
                        .filter(Boolean)
                )
            ]
            .sort(
                function (a, b) {
                    return a.localeCompare(b);
                }
            );


        qualifications.forEach(
            function (qualification) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    qualification;

                option.textContent =
                    qualification;

                qualificationFilter.appendChild(
                    option
                );

            }
        );


        universityFilter.value = "";
        qualificationFilter.value = "";


        if (resultsFilters) {

            resultsFilters.classList.add(
                "active"
            );

        }

    }


    /* =====================================================
       FILTER EVENTS
       ===================================================== */

    if (universityFilter) {

        universityFilter.addEventListener(
            "change",
            renderFilteredResults
        );

    }


    if (qualificationFilter) {

        qualificationFilter.addEventListener(
            "change",
            renderFilteredResults
        );

    }


    if (clearFiltersButton) {

        clearFiltersButton.addEventListener(
            "click",
            function () {

                if (universityFilter) {
                    universityFilter.value = "";
                }

                if (qualificationFilter) {
                    qualificationFilter.value = "";
                }

                renderFilteredResults();

            }
        );

    }


    /* =====================================================
       APPLY FILTERS
       ===================================================== */

    function renderFilteredResults() {

        if (!activeCategory) {
            return;
        }


        const selectedUniversity =
            universityFilter
                ? universityFilter.value
                : "";


        const selectedQualification =
            qualificationFilter
                ? qualificationFilter.value
                : "";


        const filteredProgrammes =
            activeCategory.programmes.filter(
                function (programme) {

                    const universityMatches =
                        !selectedUniversity ||
                        programme.university ===
                            selectedUniversity;


                    const qualificationMatches =
                        !selectedQualification ||
                        programme.qualification ===
                            selectedQualification;


                    return (
                        universityMatches &&
                        qualificationMatches
                    );

                }
            );


        renderUniversityGroups(
            filteredProgrammes
        );


        const filteredUniversities =
            new Set(
                filteredProgrammes.map(
                    function (programme) {
                        return programme.university;
                    }
                )
            );


        resultsMessage.textContent =
            filteredProgrammes.length +
            " programme" +
            (
                filteredProgrammes.length === 1
                    ? ""
                    : "s"
            ) +
            " across " +
            filteredUniversities.size +
            " universit" +
            (
                filteredUniversities.size === 1
                    ? "y"
                    : "ies"
            ) +
            ".";

    }


    /* =====================================================
       GROUP PROGRAMMES BY UNIVERSITY
       ===================================================== */

    function renderUniversityGroups(
        programmes
    ) {

        const universityGroups = {};


        programmes.forEach(
            function (programme) {

                const university =
                    programme.university ||
                    "University not specified";


                if (
                    !universityGroups[
                        university
                    ]
                ) {

                    universityGroups[
                        university
                    ] = [];

                }


                universityGroups[
                    university
                ].push(
                    programme
                );

            }
        );


        const universities =
            Object.keys(
                universityGroups
            )
            .sort(
                function (a, b) {
                    return a.localeCompare(b);
                }
            );


        if (
            universities.length === 0
        ) {

            programmeResults.innerHTML = `
                <div class="empty-results">

                    <i class="fa-solid fa-magnifying-glass"></i>

                    <h3>
                        No matching programmes
                    </h3>

                    <p>
                        Try changing or clearing
                        the selected filters.
                    </p>

                </div>
            `;

            return;

        }


        programmeResults.innerHTML =
            universities.map(
                function (university) {

                    const universityProgrammes =
                        universityGroups[
                            university
                        ];


                    const programmeHTML =
                        universityProgrammes.map(
                            function (
                                programme
                            ) {

                                const qualification =
                                    programme.qualification
                                        ? `
                                            <span class="qualification">
                                                ${escapeHtml(
                                                    programme.qualification
                                                )}
                                            </span>
                                          `
                                        : "";


                                return `
                                    <li class="programme-item">

                                        <div class="programme-name">
                                            ${escapeHtml(
                                                programme.programme
                                            )}
                                        </div>

                                        ${qualification}

                                    </li>
                                `;

                            }
                        ).join("");


                    return `
                        <article class="university-result-card">

                            <div class="university-result-header">

                                <div class="university-result-icon">

                                    <i class="fa-solid fa-building-columns"></i>

                                </div>

                                <div>

                                    <h3>
                                        ${escapeHtml(
                                            university
                                        )}
                                    </h3>

                                    <p>
                                        ${universityProgrammes.length}
                                        programme${
                                            universityProgrammes.length === 1
                                                ? ""
                                                : "s"
                                        }
                                    </p>

                                </div>

                            </div>


                            <ul class="programme-list">

                                ${programmeHTML}

                            </ul>

                        </article>
                    `;

                }
            ).join("");

    }


    /* =====================================================
       LOADING MESSAGE
       ===================================================== */

    function showLoadingMessage(
        categoryName
    ) {

        resultsTitle.textContent =
            categoryName +
            " in Ireland";


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
       NO CATEGORY DATA
       ===================================================== */

    function showNoDataMessage(
        categoryName
    ) {

        resultsTitle.textContent =
            categoryName +
            " in Ireland";


        resultsMessage.textContent =
            "Programme information for this category is not currently available.";


        programmeResults.innerHTML = `
            <div class="data-coming-soon">

                <div class="data-coming-soon-icon">

                    <i class="fa-solid fa-circle-info"></i>

                </div>

                <p>
                    Please contact CaraVista
                    for personalised course guidance.
                </p>

            </div>
        `;

    }


    /* =====================================================
       SAFE TEXT
       ===================================================== */

    function escapeHtml(text) {

        const element =
            document.createElement(
                "div"
            );

        element.textContent =
            String(text || "");

        return element.innerHTML;

    }
/* =====================================================
   MOBILE MENU
   ===================================================== */

if (
    mobileMenuToggle &&
    mobileMenu
) {

    mobileMenuToggle.addEventListener(
        "click",
        function () {

            const isOpen =
                mobileMenu.classList.toggle(
                    "active"
                );

            mobileMenuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            mobileMenuToggle.innerHTML =
                isOpen
                    ? '<i class="fa-solid fa-xmark"></i>'
                    : '<i class="fa-solid fa-bars"></i>';

        }
    );


    mobileMenu.querySelectorAll("a").forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    mobileMenu.classList.remove(
                        "active"
                    );

                    mobileMenuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    mobileMenuToggle.innerHTML =
                        '<i class="fa-solid fa-bars"></i>';

                }
            );

        }
    );

}

    console.log(
        "CaraVista Course Finder filters loaded successfully."
    );

});
