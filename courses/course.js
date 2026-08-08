document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("courseSearch");
    const courseCards = document.querySelectorAll(".course-card");
    const noResults = document.getElementById("noResults");

    const resultsSection = document.getElementById("course-results");
    const resultsTitle = document.getElementById("resultsTitle");
    const resultsMessage = document.getElementById("resultsMessage");
    const programmeResults = document.getElementById("programmeResults");

    const courseButtons = document.querySelectorAll(".course-link");


    /* =====================================================
       1. COURSE SEARCH
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const searchTerm =
                searchInput.value
                    .toLowerCase()
                    .trim();

            let visibleCount = 0;

            courseCards.forEach((card) => {

                const searchData =
                    (
                        card.dataset.course +
                        " " +
                        card.textContent
                    )
                    .toLowerCase();

                const matches =
                    searchData.includes(searchTerm);

                card.classList.toggle(
                    "hidden",
                    !matches
                );

                if (matches) {
                    visibleCount++;
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
       2. COURSE CARD BUTTONS
       ===================================================== */

    courseButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const category =
                button.dataset.category;

            showCategoryPlaceholder(category);

        });

    });


    /* =====================================================
       3. PLACEHOLDER RESULTS
       Until courses.json is connected
       ===================================================== */

    function showCategoryPlaceholder(category) {

        if (
            !resultsTitle ||
            !resultsMessage ||
            !programmeResults
        ) {
            return;
        }

        resultsTitle.textContent =
            `${category} in Ireland`;

        resultsMessage.textContent =
            `University and programme options for ${category} will be displayed here once the CaraVista programme database is connected.`;

        programmeResults.innerHTML = `
            <div class="data-coming-soon">

                <div class="data-coming-soon-icon">
                    <i class="fa-solid fa-database"></i>
                </div>

                <h3>
                    Programme Data Integration in Progress
                </h3>

                <p>
                    We are preparing verified programme and university
                    options for <strong>${escapeHtml(category)}</strong>.
                </p>

                <p class="data-note">
                    The next development stage will connect this section
                    to the Excel-derived CaraVista course database.
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
       4. SAFE TEXT OUTPUT
       ===================================================== */

    function escapeHtml(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

});
/* =========================================================
   21. COURSE DATA PLACEHOLDER
   ========================================================= */

.data-coming-soon {
    margin-top: 30px;
    padding: 28px 24px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: var(--shadow);
}

.data-coming-soon-icon {
    width: 54px;
    height: 54px;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(7, 135, 92, 0.10);
    color: var(--green);
    font-size: 22px;
}

.data-coming-soon h3 {
    color: var(--primary);
    font-size: 20px;
    margin-bottom: 10px;
}

.data-coming-soon p {
    color: var(--text-light);
    font-size: 14px;
}

.data-note {
    margin-top: 8px;
    font-size: 12px !important;
    opacity: 0.8;
}
