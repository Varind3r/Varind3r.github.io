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
