const validateRequest = (formData) => {
  let isValid = true;
  const requiredFields = ["nombre", "apellidos", "nota"];

  for (const field of requiredFields) {
    const value = formData.get(field);
    const input = document.querySelector(`#${field}`);

    if (!value || value.trim() === "") {
      input.classList.add("border-rose-500");
      input.setAttribute("placeholder", "Campo requerido");
      isValid = false;
      continue;
    } else {
      input.classList.remove("border-rose-500");
    }

    if (field !== "nota") {
      continue;
    }

    const nota = parseFloat(value);

    if (isNaN(nota)) {
      input.classList.add("border-rose-500");
      input.value = "";
      input.setAttribute("placeholder", "La nota tiene que ser numerica");
      isValid = false;
    } else if (!(nota >= 0 && nota <= 100)) {
      input.classList.add("border-rose-500");
      input.value = "";
      input.setAttribute("placeholder", "Rango valido de nota: entre 0 y 100");
      isValid = false;
    }
  }

  return isValid;
};
const saveGradeToLocalDb = (grade) => {
  const { nombre, apellidos, nota } = Object.fromEntries(grade.entries());
  const currentGrades = getGradesFromLocalDb();

  currentGrades.push({
    nombre,
    apellidos,
    nota,
  });

  localStorage.setItem("notas", JSON.stringify(currentGrades));
};

const cleanForm = (formData) => {
  const fields = Object.fromEntries(formData.entries());

  for (let field of Object.keys(fields)) {
    const input = document.querySelector(`#${field}`);
    input.value = "";
  }
};

const getGradesFromLocalDb = () => {
  const grades = JSON.parse(localStorage.getItem("notas"));
  console.log(grades);

  return grades || [];
};

const renderGradesToTable = () => {
  const gradesTable = document.querySelector("#tabla-notas");
  const grades = getGradesFromLocalDb();

  if (!(grades.length > 0)) {
    gradesTable.innerHTML = `
            <tr>
              <td colspan="3" class="px-4 py-8 text-center text-gray-400 italic">
                No hay estudiantes registrados
              </td>
            </tr>
          `;
  } else {
    gradesTable.innerHTML = grades
      .map(
        (est) => `
            <tr class="border-b hover:bg-gray-50 transition duration-150">
              <td class="px-4 py-3">${est.nombre}</td>
              <td class="px-4 py-3">${est.apellidos}</td>
              <td class="px-4 py-3 font-semibold">${est.nota}</td>
            </tr>
          `
      )
      .join("");
  }
};

const processForm = (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  try {
    const isValid = validateRequest(formData);

    if (!isValid) {
      return;
    }

    saveGradeToLocalDb(formData);
    renderGradesToTable();
    cleanForm(formData);
    Swal.fire({
      title: "Nota agregada!",
      text: "La nota del estudiante fue agregada. Ver mas detalles en la tabla",
      icon: "success",
    });
  } catch (error) {
    Swal.fire({
      title: "Algo salió mal",
      text: error,
      icon: "error",
    });
  }
};

const main = () => {
  const grades = getGradesFromLocalDb();
  renderGradesToTable(grades);

  const form = document.querySelector("#form-notas");
  form.addEventListener("submit", processForm);
};

document.addEventListener("DOMContentLoaded", () => {
  main();
});
