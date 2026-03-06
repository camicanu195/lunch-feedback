// app.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx9A1NKKwjFkb0qibhqgqDK3x-Ty1ed0bRyfniVepsUSOoA3bgBvZwpZ6lY4KuPVKT6ag/exec";

function setTodayLabel() {
  const el = document.getElementById("todayLabel");
  if (!el) return;
  const d = new Date();
  const dateStr = d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  el.textContent = dateStr;
}

function toast(msg, ok = true) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.dataset.ok = ok ? "1" : "0";
  el.style.borderColor = ok ? "#16a34a" : "#dc2626";
  el.hidden = false;
  setTimeout(() => {
    el.hidden = true;
  }, 1800);
}

async function postNoCors(payload) {
  const body = new URLSearchParams(payload).toString();

  await fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
}

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function alreadySubmitted(type) {
  const key = `${type}_submitted_${todayKey()}`;
  return localStorage.getItem(key) === "1";
}

function markSubmitted(type) {
  const key = `${type}_submitted_${todayKey()}`;
  localStorage.setItem(key, "1");
}

function clearSubmitted(type) {
  const key = `${type}_submitted_${todayKey()}`;
  localStorage.removeItem(key);
}

function lockPageIfSubmitted(type, formId, bannerId) {
  const form = document.getElementById(formId);
  const banner = document.getElementById(bannerId);
  if (!form || !banner) return;

  if (alreadySubmitted(type)) {
    banner.hidden = false;
    Array.from(form.elements).forEach((el) => {
      el.disabled = true;
    });
  }
}

function unlockPage(type, formId, bannerId) {
  clearSubmitted(type);

  const form = document.getElementById(formId);
  const banner = document.getElementById(bannerId);
  if (!form || !banner) return;

  banner.hidden = true;
  Array.from(form.elements).forEach((el) => {
    el.disabled = false;
  });
}

function setSubmitting(button, isSubmitting, defaultText = "Submit") {
  if (!button) return;
  button.disabled = isSubmitting;
  button.setAttribute("aria-busy", isSubmitting ? "true" : "false");
  button.textContent = isSubmitting ? "Submitting..." : defaultText;
}