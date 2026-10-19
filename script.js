// ====== EDIT YOUR DETAILS HERE ======
const CONFIG = {
  phone: "+91 00000 00000",        // shown on the page and used for tap-to-call
  whatsapp: "910000000000",        // country code + number, digits only
  email: "hello@example.com",      // enquiries are sent to this address
  address: "Your address, City",
  hours: "Mon–Sat, 4 pm – 8 pm",
};
// ====================================

document.documentElement.classList.add("js");

// Fill contact details from CONFIG
const digits = CONFIG.phone.replace(/[^\d+]/g, "");
document.querySelectorAll("[data-contact]").forEach((el) => {
  const k = el.dataset.contact;
  if (k === "phone") { el.textContent = CONFIG.phone; el.href = "tel:" + digits; }
  if (k === "whatsapp") el.href = "https://wa.me/" + CONFIG.whatsapp;
  if (k === "email") { el.textContent = CONFIG.email; el.href = "mailto:" + CONFIG.email; }
  if (k === "address") el.textContent = CONFIG.address;
  if (k === "hours") el.textContent = CONFIG.hours;
});
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("menu");
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }
});

// Tabs (with arrow-key support)
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    const move = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!move) return;
    const next = tabs[(i + move + tabs.length) % tabs.length];
    next.focus(); selectTab(next);
  });
});

// Reveal on scroll
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add("in"));
}

// Enquiry form: validates, then opens the visitor's email app with the details filled in
const form = document.getElementById("enquiry");
const msg = form.querySelector(".form__msg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const bad = ["parent", "phone", "class"].filter((k) => !String(d[k] || "").trim());
  form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  bad.forEach((k) => form.elements[k].classList.add("invalid"));
  if (bad.length) { msg.className = "form__msg err"; msg.textContent = "Please fill in your name, phone number and the student's class."; return; }

  const body = [
    `Parent: ${d.parent}`, `Phone: ${d.phone}`, `Class: ${d.class}`,
    `Subjects: ${d.subjects || "-"}`, `Notes: ${d.message || "-"}`,
  ].join("\n");
  location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Demo class enquiry - " + d.parent)}&body=${encodeURIComponent(body)}`;
  msg.className = "form__msg";
  msg.textContent = "Thanks! Your email app should open. Just press send.";
});
