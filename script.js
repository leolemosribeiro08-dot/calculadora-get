console.log("script.js carregado");

import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const alunosRef = collection(db, "alunos");

// 🔢 GET
function calcularGET(sexo, idade, peso, altura, atividade) {
  const tmb = sexo === "homem"
    ? 88.36 + 13.4 * peso + 4.8 * altura - 5.7 * idade
    : 655 + 9.2 * peso + 3.1 * altura - 4.3 * idade;

  return tmb * atividade;
}

// 🧮 MACROS
function calcularMacros(get, peso) {
  const proteina = peso * 2;
  const gordura = peso * 1;
  const carbo = (get - (proteina * 4 + gordura * 9)) / 4;

  return { proteina, gordura, carbo };
}

// 💾 SALVAR
window.salvarAluno = async function () {
  const nome = document.getElementById("nome").value.trim();
  const sexo = document.getElementById("sexo").value;
  const idade = Number(document.getElementById("idade").value);
  const peso = Number(document.getElementById("peso").value);
  const altura = Number(document.getElementById("altura").value);
  const atividade = Number(document.getElementById("atividade").value);

  if (!nome || !idade || !peso || !altura) {
    alert("Preencha tudo");
    return;
  }

  const q = query(alunosRef, where("nome", "==", nome));
  if (!(await getDocs(q)).empty) {
    alert("Aluno já existe");
    return;
  }

  const get = calcularGET(sexo, idade, peso, altura, atividade);
  const macros = calcularMacros(get, peso);

  await addDoc(alunosRef, {
    nome, sexo, idade, peso, altura, atividade,
    get,
    ...macros
  });

  document.getElementById("resultado").innerHTML = `
    GET: ${get.toFixed(0)} kcal<br>
    Proteína: ${macros.proteina.toFixed(0)} g<br>
    Carbo: ${macros.carbo.toFixed(0)} g<br>
    Gordura: ${macros.gordura.toFixed(0)} g
  `;
};

// 📋 LISTAR (só roda se existir a UL)
async function listarAlunos() {
  const ul = document.getElementById("listaAlunos");
  if (!ul) return;

  ul.innerHTML = "";
  const snap = await getDocs(alunosRef);

  snap.forEach(d => {
    const a = d.data();
    ul.innerHTML += `
      <li>
        <strong>${a.nome}</strong><br>
        GET: ${a.get.toFixed(0)} kcal<br>
        P: ${a.proteina.toFixed(0)}g |
        C: ${a.carbo.toFixed(0)}g |
        G: ${a.gordura.toFixed(0)}g<br>
        <button onclick="editarAluno('${d.id}')">Editar</button>
        <button onclick="excluirAluno('${d.id}')">Excluir</button>
        <hr>
      </li>
    `;
  });
}

// 🗑️
window.excluirAluno = async id => {
  await deleteDoc(doc(db, "alunos", id));
  listarAlunos();
};

// ✏️
window.editarAluno = async id => {
  const novoPeso = prompt("Novo peso:");
  if (!novoPeso) return;

  const ref = doc(db, "alunos", id);
  const a = (await getDoc(ref)).data();
  const get = calcularGET(a.sexo, a.idade, Number(novoPeso), a.altura, a.atividade);
  const macros = calcularMacros(get, Number(novoPeso));

  await updateDoc(ref, {
    peso: Number(novoPeso),
    get,
    ...macros
  });

  listarAlunos();
};

window.addEventListener("DOMContentLoaded", listarAlunos);
