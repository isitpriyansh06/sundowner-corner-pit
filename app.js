(() => {
  const config = window.RAVES_CONFIG || {};
  const form = document.querySelector("#rsvp-form");
  const nameInput = document.querySelector("#name");
  const nameError = document.querySelector("#name-error");
  const formStatus = document.querySelector("#form-status");
  const successView = document.querySelector("#success-view");
  const invitation = document.querySelector(".invitation");
  const opening = document.querySelector(".opening");
  const artFragment = document.querySelector(".art-fragment");
  const guestName = document.querySelector("#guest-name");
  const mapLink = document.querySelector("#map-link");
  const submitButton = form.querySelector("button[type=submit]");

  const endpoint = String(config.SHEET_ENDPOINT || "").trim();
  const mapUrl = String(config.MAP_LINK || "").trim();
  const maxPlusOnes = Number.isInteger(config.MAX_PLUS_ONES) ? config.MAX_PLUS_ONES : 2;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function addGrainTexture() {
    const size = 96;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = size;
    canvas.height = size;
    const texture = context.createImageData(size, size);

    for (let pixel = 0; pixel < texture.data.length; pixel += 4) {
      const grain = 20 + Math.floor(Math.random() * 18);
      texture.data[pixel] = grain;
      texture.data[pixel + 1] = grain;
      texture.data[pixel + 2] = grain;
      texture.data[pixel + 3] = Math.random() > 0.5 ? 24 : 0;
    }

    context.putImageData(texture, 0, 0);
    document.documentElement.style.setProperty("--grain-image", `url("${canvas.toDataURL("image/png")}")`);
  }

  function setArtworkReveal(progress) {
    const crop = 160 - (42 * progress);
    const position = 12 * progress;
    artFragment.style.setProperty("--art-scale", `${crop.toFixed(2)}%`);
    artFragment.style.setProperty("--art-position-y", `${position.toFixed(2)}%`);
  }

  function setUpArtworkReveal() {
    if (!opening || !artFragment || reducedMotionQuery.matches) return;

    let openingVisible = true;
    let framePending = false;

    const update = () => {
      framePending = false;
      if (!openingVisible) return;

      const progress = Math.min(Math.max(window.scrollY / Math.max(opening.offsetHeight, 1), 0), 1);
      setArtworkReveal(progress);
    };

    const requestUpdate = () => {
      if (framePending) return;
      framePending = true;
      window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      openingVisible = entries.some((entry) => entry.isIntersecting);
      if (openingVisible) requestUpdate();
    }, { threshold: 0 });

    observer.observe(opening);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
  }

  function startUnlockSequence() {
    successView.classList.remove("is-unlocking");
    window.requestAnimationFrame(() => {
      successView.classList.add("is-unlocking");
    });

    if (!mapUrl) return;

    window.setTimeout(() => {
      mapLink.hidden = false;
    }, reducedMotionQuery.matches ? 0 : 2050);
  }

  function cleanName(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function setStatus(message) {
    formStatus.textContent = message;
  }

  function setSubmitting(isSubmitting) {
    form.classList.toggle("is-submitting", isSubmitting);
    submitButton.disabled = isSubmitting;
    submitButton.querySelector(".button-label").textContent = isSubmitting ? "Saving your place..." : "Put me on the list";
  }

  function validateName() {
    const name = cleanName(nameInput.value);
    nameInput.value = name;
    if (!name) {
      nameError.textContent = "Add a name so we know who to save the place for.";
      nameInput.focus();
      return false;
    }
    nameError.textContent = "";
    return true;
  }

  function getPlusOnes() {
    const selected = form.querySelector("input[name=plusOnes]:checked");
    const value = Number(selected ? selected.value : 0);
    return Math.min(Math.max(value, 0), maxPlusOnes);
  }

  async function saveRsvp(name, plusOnes) {
    if (!endpoint) {
      // Keeps the local preview usable before the sheet endpoint is connected.
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      return;
    }

    const payload = new URLSearchParams({
      name,
      plusOnes: String(plusOnes),
      website: ""
    });

    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      body: payload,
      keepalive: true
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("");
    if (!validateName()) return;

    const name = cleanName(nameInput.value);
    const plusOnes = getPlusOnes();
    setSubmitting(true);

    try {
      await saveRsvp(name, plusOnes);
      guestName.textContent = name;
      if (mapUrl) {
        mapLink.href = mapUrl;
        mapLink.hidden = true;
      } else {
        mapLink.hidden = true;
      }
      form.hidden = true;
      successView.hidden = false;
      invitation.classList.add("is-confirmed");
      startUnlockSequence();
      successView.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      setStatus("That didn’t go through. Please try once more.");
      setSubmitting(false);
    }
  });

  nameInput.addEventListener("input", () => {
    if (nameError.textContent) validateName();
  });

  addGrainTexture();
  setUpArtworkReveal();
})();
