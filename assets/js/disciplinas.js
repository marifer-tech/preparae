document.addEventListener("DOMContentLoaded", function () {
  const botoes = document.querySelectorAll(".disciplina-btn");

  botoes.forEach((btn) => {
    btn.addEventListener("click", function () {
      const topicos = this.nextElementSibling;
      if (topicos.style.display === "block") {
        topicos.style.display = "none";
      } else {
        topicos.style.display = "block";
      }
    });
  });
});