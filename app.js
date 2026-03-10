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

function setSubmitting(button, isSubmitting, defaultText = "Submit") {
  if (!button) return;
  button.disabled = isSubmitting;
  button.setAttribute("aria-busy", isSubmitting ? "true" : "false");
  button.textContent = isSubmitting ? "Submitting..." : defaultText;
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

function redirectIfAlreadySubmitted(type) {
  if (alreadySubmitted(type)) {
    window.location.href = `already-submitted.html?type=${encodeURIComponent(type)}`;
    return true;
  }
  return false;
}

function goToThankYou(type) {
  window.location.href = `thankyou.html?type=${encodeURIComponent(type)}`;
}