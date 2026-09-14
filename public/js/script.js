(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

let searchInput = document.getElementById("searchInput");
let suggestions = document.getElementById("suggestions");

searchInput.addEventListener("input", async () => {

    let q = searchInput.value.trim();

    if (q === "") {
        suggestions.innerHTML = "";
        return;
    }

    let response = await fetch(`/listings/suggestions?q=${q}`);
    let data = await response.json();

    suggestions.innerHTML = "";

    data.forEach(title => {
        let div = document.createElement("div");

        div.innerText = title;

        div.addEventListener("click", () => {
            searchInput.value = title;
            suggestions.innerHTML = "";
        });

        suggestions.appendChild(div);
    });
});