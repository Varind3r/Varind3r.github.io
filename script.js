const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeMenu() {
  nav.classList.remove("is-open");
  header.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
}

toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMenu();
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
year.textContent = new Date().getFullYear();
updateHeader();

const revealItems = document.querySelectorAll("[data-reveal], .section-heading, .project-card, .service-card, .skill-column, .timeline-item");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    item.classList.add("reveal");
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

async function loadGitHubRepositories() {
  const grid = document.querySelector("[data-github-grid]");
  if (!grid) return;

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  try {
    const response = await fetch("https://api.github.com/users/Varind3r/repos?per_page=100&sort=updated");
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const repositories = await response.json();
    const visibleRepositories = repositories
      .filter((repository) => ["Quiz-Plugin", "Upcoming-Calendar-Events"].includes(repository.name))
      .filter((repository) => !repository.fork && !repository.archived)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    if (!visibleRepositories.length) {
      grid.innerHTML = '<p class="github-status">No public repositories to display yet.</p>';
      return;
    }

    grid.innerHTML = visibleRepositories.map((repository) => {
      const description = escapeHtml(repository.description || "Public GitHub repository");
      const language = escapeHtml(repository.language || "Code");
      const name = escapeHtml(repository.name);
      const repositoryUrl = escapeHtml(repository.html_url);

      return `
        <article class="github-card">
          <div class="github-card-meta">
            <span>${language}</span>
            <span>★ ${repository.stargazers_count}</span>
          </div>
          <h3>${name}</h3>
          <p>${description}</p>
          <a href="${repositoryUrl}" target="_blank" rel="noopener noreferrer">View repository ↗</a>
        </article>
      `;
    }).join("");
  } catch (error) {
    grid.innerHTML = '<p class="github-status">GitHub repositories are temporarily unavailable. <a href="https://github.com/Varind3r" target="_blank" rel="noopener noreferrer">View my GitHub profile ↗</a></p>';
  }
}

loadGitHubRepositories();
