(() => {
  const cfg = window.LETTER_CONFIG;
  const $ = id => document.getElementById(id);
  const screens = [$("quizScreen"), $("starScreen"), $("envelopeScreen"), $("letterScreen")];

  const normalize = value => value.toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();

  function show(el) {
    screens.forEach(x => x.classList.add("hidden"));
    el.classList.remove("hidden");
  }

  $("quizQuestion").textContent = cfg.quizQuestion;
  $("envelopeTitle").textContent = cfg.envelopeTitle;
  $("tinyTitle").textContent = cfg.tinyTitle;
  $("mainTitle").textContent = cfg.mainTitle;
  $("recipientLetter").textContent = cfg.recipient;
  
  $("replyTitle").textContent = cfg.replyTitle;
  $("replyIntro").textContent = cfg.replyIntro;
  $("replyMessage").placeholder = cfg.replyPlaceholder;
  $("songIntro").textContent = cfg.songIntro;
  $("songButtonText").textContent = cfg.songButtonText;
  $("signature").textContent = cfg.signature;

  const holder = $("letterParagraphs");

  cfg.letterParagraphs.forEach((text, i) => {
    const p = document.createElement("p");
    p.textContent = text;

    if (i === cfg.letterParagraphs.length - 1) {
      p.classList.add("emphasis");
    }

    holder.appendChild(p);
  });

  $("quizForm").addEventListener("submit", e => {
    e.preventDefault();

    const answer = normalize($("quizAnswer").value);
    const accepted = cfg.quizAnswers.map(normalize);
    const ok = accepted.includes(answer);

    if (ok) {
      $("quizError").textContent = "";
      show($("starScreen"));
      burst();
    } else {
      $("quizError").textContent = "Chưa đúng rồi, thử lại một lần nữa nhé ✨";
    }
  });

  $("starButton").addEventListener("click", () => {
    burst();
    show($("envelopeScreen"));

    setTimeout(() => {
      $("envelope").classList.add("opening");
    }, 500);

    setTimeout(() => {
      show($("letterScreen"));
    }, 2300);
  });

  $("songButton").addEventListener("click", () => {
    window.open(cfg.songUrl, "_blank", "noopener,noreferrer");
  });

  $("replyOpen").addEventListener("click", () => {
    $("replyModal").classList.remove("hidden");
  });

  $("replyClose").addEventListener("click", () => {
    $("replyModal").classList.add("hidden");
  });

  $("replyModal").addEventListener("click", e => {
    if (e.target === $("replyModal")) {
      $("replyModal").classList.add("hidden");
    }
  });

  $("replyForm").addEventListener("submit", async e => {
    e.preventDefault();

    const status = $("replyStatus");
    const endpoint = cfg.formspreeEndpoint.trim();

    if (!endpoint || endpoint.includes("PASTE_YOUR")) {
      status.textContent = "Bạn chưa dán endpoint Formspree thật vào config.js.";
      return;
    }

    status.textContent = "Đang gửi thư…";
    const form = e.currentTarget;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Formspree rejected the message");
      }

      form.classList.add("hidden");
$("deliveryScene").classList.remove("hidden");
$("deliveryText").textContent = cfg.replySuccess;

burst();

setTimeout(() => {
  document.querySelector(".modal-card").classList.add("final-only");

  $("finalMessage").textContent = cfg.finalMessage;
  $("finalMessage").classList.remove("hidden");
}, 4000);
    } catch (err) {
      console.error(err);
      status.textContent = "Chưa gửi được. Kiểm tra endpoint Formspree và xác nhận email Formspree của bạn.";
    }
  });

  function createStars() {
    const layer = $("fallingStars");

    for (let i = 0; i < 75; i++) {
      const s = document.createElement("span");
      s.className = "star";
      s.textContent = Math.random() > 0.28 ? "★" : "✦";
      s.style.left = `${Math.random() * 100}%`;
      s.style.fontSize = `${8 + Math.random() * 18}px`;
      s.style.opacity = `${0.4 + Math.random() * 0.6}`;
      s.style.animationDuration = `${6 + Math.random() * 10}s`;
      s.style.animationDelay = `${-Math.random() * 12}s`;
      s.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
      layer.appendChild(s);
    }
  }

  function shootingStar() {
    const s = document.createElement("span");
    s.className = "shooting";
    s.style.left = `${Math.random() * 28}%`;
    s.style.top = `${Math.random() * 25}%`;
    $("shootingStars").appendChild(s);
    setTimeout(() => s.remove(), 2000);
  }

  function burst() {
    for (let i = 0; i < 10; i++) {
      setTimeout(shootingStar, i * 90);
    }
  }

  createStars();
  setInterval(shootingStar, 4200);
})();
