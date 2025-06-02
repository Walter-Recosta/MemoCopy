// document.addEventListener('DOMContentLoaded', function () {
//   const name = document.getElementById('name');
//   const value = document.getElementById('value');
//   const saveButton = document.getElementById('save');
//   const storedOutput = document.getElementById('stored');

//   // Cargar datos al iniciar
//   chrome.storage.local.get(['userData'], function (result) {
//     storedOutput.textContent = result.userData || 'Nada guardado todavía.';
//   });

//   // Guardar datos al hacer clic
//   saveButton.addEventListener('click', function () {
//     const name = name.value;
//     const value = value.value;
//     chrome.storage.local.set({ userData: text }, function () {
//       storedOutput.textContent = text;
//       textarea.value = '';
//     });
//   });
// });




document.addEventListener('DOMContentLoaded', function () {
  const nameInput = document.getElementById('name');
  const valueInput = document.getElementById('value');
  const saveButton = document.getElementById('save');
  const storedOutput = document.getElementById('stored');
  const copy = document.getElementById('copy');
  const remove = document.getElementById('remove');

  function renderList(data) {
    storedOutput.innerHTML = '';
  
    for (const [key, value] of Object.entries(data)) {
      const div = document.createElement('div');
      div.className = 'data';
      div.id = Math.random().toString(36).substring(2, 15); // Genera un ID único
      div.innerHTML = `<h5>${key}</h5><h4>${value}</h4>`;
      div.addEventListener('click', () => {
        navigator.clipboard.writeText(value).then(() => {
          div.classList.add('copied');
          setTimeout(() => div.classList.remove('copied'), 1000);
        });
        showCopyMessage();
        removeItem(key, div);
      });
      storedOutput.appendChild(div);
    }
  }

  chrome.storage.local.get(['userData'], function (result) {
    renderList(result.userData || {});
  });


  saveButton.addEventListener('click', function () {
    const key = nameInput.value.trim();
    const val = valueInput.value.trim();

    if (!key || !val) return;

    chrome.storage.local.get(['userData'], function (result) {
      const data = result.userData || {};
      data[key] = val;

      chrome.storage.local.set({ userData: data }, function () {
        renderList(data);
        nameInput.value = '';
        valueInput.value = '';
      });
    });
  });
});

function showCopyMessage() {
  copy.classList.remove('hidden');
  copy.classList.add('show');

  setTimeout(() => {
    copy.classList.remove('show');
    copy.classList.add('hidden');
  }, 2000); // Oculta después de 2 segundos
}


function removeItem(key, div) {
  remove.classList.remove('hidden');
  remove.classList.add('show');
  remove.addEventListener('click', function () {
    chrome.storage.local.get(['userData'], function (result) {
      const data = result.userData || {};
      delete data[key]; // Elimina la clave del objeto
      chrome.storage.local.set({ userData: data }, function () {
        div.remove();
      });
    });
    remove.classList.remove('show');
    remove.classList.add('hidden');
  });

  setTimeout(() => {
    remove.classList.remove('show');
    remove.classList.add('hidden');
    remove.removeEventListener('click', arguments.callee); // Elimina el listener para evitar múltiples clics
  }, 2000); 
}