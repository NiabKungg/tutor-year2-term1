/* เว็บติวสอบ ปี 2 เทอม 1 : สคริปต์หลัก (สารบัญ + แบบทดสอบ) */
(function () {
  "use strict";

  /* ----- ไฮไลต์สารบัญตามตำแหน่งที่อ่าน ----- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          if (current) current.classList.remove("current");
          current = map[en.target.id];
          if (current) current.classList.add("current");
        }
      });
    }, { rootMargin: "-80px 0px -60% 0px" });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* ----- ระบบแบบทดสอบ ----- */
  function initQuiz(section) {
    var qs = Array.prototype.slice.call(section.querySelectorAll(".q[data-answer]"));
    var status = section.querySelector(".quiz-status");
    var reset = section.querySelector(".quiz-reset");
    var done = 0, correct = 0;

    function updateStatus() {
      if (!status) return;
      status.textContent = "ทำแล้ว " + done + " / " + qs.length + " ข้อ  ตอบถูก " + correct + " ข้อ";
    }
    updateStatus();

    qs.forEach(function (q) {
      var answer = q.getAttribute("data-answer").trim().toUpperCase();
      var choices = Array.prototype.slice.call(q.querySelectorAll(".choice"));
      choices.forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (q.classList.contains("answered")) return;
          q.classList.add("answered");
          done++;
          var picked = btn.getAttribute("data-k").toUpperCase();
          choices.forEach(function (b) {
            if (b.getAttribute("data-k").toUpperCase() === answer) b.classList.add("correct");
          });
          if (picked === answer) { correct++; } else { btn.classList.add("wrong"); }
          updateStatus();
        });
      });
    });

    if (reset) {
      reset.addEventListener("click", function () {
        done = 0; correct = 0;
        qs.forEach(function (q) {
          q.classList.remove("answered");
          Array.prototype.slice.call(q.querySelectorAll(".choice")).forEach(function (b) {
            b.classList.remove("correct", "wrong");
          });
        });
        updateStatus();
        section.scrollIntoView({ behavior: "smooth" });
      });
    }
  }
  Array.prototype.slice.call(document.querySelectorAll("[data-quiz]")).forEach(initQuiz);
})();
