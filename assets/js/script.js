document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     HELPERS
  ========================== */

  function getTranslation(path, lang = window.currentLang || "fr") {
    return path
      .split(".")
      .reduce((obj, key) => obj?.[key], translations?.[lang]);
  }

  function setText(el, value) {
    if (el && value !== undefined) {
      el.textContent = value;
    }
  }

  function t(path) {
    return getTranslation(path, window.currentLang);
  }

  /* =========================
     STATE
  ========================== */

  window.currentLang = localStorage.getItem("lang") || "fr";
  let theme = localStorage.getItem("theme") || "light";

  /* =========================
     ELEMENTS
  ========================== */

  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenu = document.getElementById("closeMenu");

  const themeBtn = document.getElementById("themeToggle");
  const langBtn = document.getElementById("langButton");

  const mobileThemeBtn = document.querySelector(".mobile-theme-toggle");
  const mobileLangBtn = document.querySelector(".mobile-lang-button");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeLightboxBtn = document.getElementById("closeBtn");

  /* =========================
     FADE IN
  ========================== */

  const fades = document.querySelectorAll(".fade-in");

  window.addEventListener("load", () => {
    fades.forEach((el) => observer.observe(el));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  fades.forEach((el) => observer.observe(el));

  /* =========================
     MOBILE MENU
  ========================== */

  function openMenu() {
    mobileMenu?.classList.add("open");
  }

  function closeMenuFn() {
    mobileMenu?.classList.remove("open");
  }

  hamburger?.addEventListener("click", (e) => {
    e.stopPropagation();
    openMenu();
  });

  closeMenu?.addEventListener("click", closeMenuFn);

  document.addEventListener("click", (e) => {
    if (
      mobileMenu?.classList.contains("open") &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenuFn();
    }
  });

  document.querySelectorAll("#mobileMenu a").forEach((link) => {
    link.addEventListener("click", closeMenuFn);
  });

  /* =========================
     LIGHTBOX
  ========================== */

  document.querySelectorAll(".clickable").forEach((img) => {
    img.addEventListener("click", () => {
      if (!lightbox || !lightboxImg) return;

      // reset animation
      lightboxImg.style.opacity = 0;
      lightboxImg.style.transform = "scale(0.92)";

      lightbox.classList.add("active");

      lightboxImg.src = img.src;

      lightboxImg.onload = () => {
        lightboxImg.style.opacity = 1;
        lightboxImg.style.transform = "scale(1)";
      };
    });
  });

  function closeLightbox() {
    lightbox?.classList.remove("active");
    if (lightboxImg) lightboxImg.src = "";
  }

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  closeLightboxBtn?.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* =========================
     THEME
  ========================== */

  function applyTheme(mode) {
    document.body.classList.toggle("dark", mode === "dark");

    const label =
      mode === "dark"
        ? window.currentLang === "fr"
          ? "Clair"
          : "Light"
        : window.currentLang === "fr"
        ? "Sombre"
        : "Dark";

    setText(themeBtn, label);
    setText(mobileThemeBtn, label);

    const github_icon = document.getElementById("github_icon");
    if (github_icon) {
      github_icon.src =
        mode === "dark"
          ? "assets/icon/github_dark.svg"
          : "assets/icon/github_light.svg";
    }

    const pinterest_icon = document.getElementById("pinterest_icon");
    if (pinterest_icon) {
      pinterest_icon.src =
        mode === "dark"
          ? "assets/icon/pinterest_dark.svg"
          : "assets/icon/pinterest_light.svg";
    }

    const redbubble_icon = document.getElementById("redbubble_icon");
    if (redbubble_icon) {
      redbubble_icon.src =
        mode === "dark"
          ? "assets/icon/redbubble_dark.svg"
          : "assets/icon/redbubble_light.svg";
    }

    const dashery_icon = document.getElementById("dashery_icon");
    if (dashery_icon) {
      dashery_icon.src =
        mode === "dark"
          ? "assets/icon/dashery_dark.svg"
          : "assets/icon/dashery_light.svg";
    }

    const teepublic_icon = document.getElementById("teepublic_icon");
    if (teepublic_icon) {
      teepublic_icon.src =
        mode === "dark"
          ? "assets/icon/teepublic_dark.svg"
          : "assets/icon/teepublic_light.svg";
    }

    localStorage.setItem("theme", mode);
    theme = mode;
  }

  themeBtn?.addEventListener("click", () => {
    applyTheme(theme === "light" ? "dark" : "light");
  });

  mobileThemeBtn?.addEventListener("click", () => {
    applyTheme(theme === "light" ? "dark" : "light");
  });

  /* =========================
     LANGUAGE
  ========================== */

  function applyLanguage(lang) {
    document.body.classList.add("lang-fade");

    setTimeout(() => {
      window.currentLang = lang;

      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const value = getTranslation(el.dataset.i18n, lang);
        if (value !== undefined) el.innerHTML = value;
      });

      document.querySelectorAll("[data-placeholder]").forEach((el) => {
        const value = getTranslation(el.dataset.placeholder, lang);
        if (value) el.placeholder = value;
      });

      setText(langBtn, lang.toUpperCase());
      setText(mobileLangBtn, lang.toUpperCase());

      const themeLabel = document.body.classList.contains("dark")
        ? lang === "fr"
          ? "Clair"
          : "Light"
        : lang === "fr"
        ? "Sombre"
        : "Dark";

      setText(themeBtn, themeLabel);
      setText(mobileThemeBtn, themeLabel);

      localStorage.setItem("lang", lang);

      requestAnimationFrame(() => {
        document.body.classList.remove("lang-fade");
      });
    }, 200);
  }

  langBtn?.addEventListener("click", () => {
    const newLang = window.currentLang === "fr" ? "en" : "fr";
    applyLanguage(newLang);
  });

  mobileLangBtn?.addEventListener("click", () => {
    const newLang = window.currentLang === "fr" ? "en" : "fr";
    applyLanguage(newLang);
  });

  /* =========================
     NEWSLETTER FORM
  ========================== */

  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterMessage = document.getElementById("newsletterMessage");

  newsletterForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstname = newsletterForm.firstname.value;
    const lastname = newsletterForm.lastname.value;
    const email = newsletterForm.email.value;

    const formData = new FormData();

    formData.append("type", "newsletter");
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbxUZMQ-OZVPpEhJ3S612wfIkbQaX0Mns-5Nu3aKvkzMe6eG7UZP9VR9Wi2elzsZXXK3zw/exec",
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await res.text();

      if (text === "success") {
        newsletterMessage.textContent = t("messages.newsletterSuccess");
        newsletterMessage.classList.add("show", "success");
        newsletterForm.reset();

        setTimeout(() => {
          newsletterMessage.classList.remove("show", "success");
        }, 4000);
      } else {
        newsletterMessage.textContent = t("messages.newsletterError");
        newsletterMessage.classList.add("show", "error");
      }
    } catch (err) {
      newsletterMessage.textContent = t("messages.newsletterError");
      newsletterMessage.classList.add("show", "error");
    }
  });

  /* =========================
     CONTACT FORM
  ========================== */

  const contactForm = document.getElementById("contactForm");
  const contactMessage = document.getElementById("contactMessage");

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    formData.append("type", "contact");

    // message loading (optionnel mais propre)
    contactMessage.textContent = t("messages.loading");
    contactMessage.classList.remove("success", "error");
    contactMessage.classList.add("show");

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbxUZMQ-OZVPpEhJ3S612wfIkbQaX0Mns-5Nu3aKvkzMe6eG7UZP9VR9Wi2elzsZXXK3zw/exec",
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await res.text();

      if (text === "success") {
        contactMessage.textContent = t("messages.contactSuccess");
        contactMessage.classList.add("success");
        contactMessage.classList.remove("error");
        contactForm.reset();

        setTimeout(() => {
          contactMessage.classList.remove("show", "success");
        }, 4000);
      } else {
        contactMessage.textContent = t("messages.contactError");
        contactMessage.classList.add("error");
      }
    } catch (err) {
      contactMessage.textContent = t("messages.contactError");
      contactMessage.classList.add("error");
    }
  });

  /* =========================
     INIT
  ========================== */

  applyLanguage(window.currentLang);
  applyTheme(theme);
});
