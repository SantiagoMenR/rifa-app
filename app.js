document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('puestos-container');
  
    const modal = document.getElementById("modal");
    const modalNumero = document.getElementById("modal-numero");
    const clienteInput = document.getElementById("cliente");
    const responsableSelect = document.getElementById("responsable");
    const guardarBtn = document.getElementById("guardar-btn");
    const cancelarBtn = document.getElementById("cancelar-btn");
  
    let puestoSeleccionado = null;
    let esVisualizacion = false;
  
    // Crear botones
    for (let i = 1; i <= 100; i++) {
      const btn = document.createElement("button");
      btn.innerText = i;
      btn.classList.add("puesto");
      btn.id = `puesto-${i}`;
  
      btn.addEventListener("click", async () => {
        puestoSeleccionado = i;
        const docRef = db.collection("puestos").doc(i.toString());
        const docSnap = await docRef.get();
  
        if (docSnap.exists) {
          // Visualizar datos ya guardados
          const data = docSnap.data();
          clienteInput.value = data.cliente || "";
          responsableSelect.value = data.responsable || "";
  
          clienteInput.disabled = true;
          responsableSelect.disabled = true;
          guardarBtn.style.display = "none";
  
          modalNumero.textContent = i;
          modal.classList.remove("hidden");
          esVisualizacion = true;
        } else {
          // Nuevo registro
          clienteInput.value = "";
          responsableSelect.value = "";
          clienteInput.disabled = false;
          responsableSelect.disabled = false;
          guardarBtn.style.display = "inline-block";
  
          modalNumero.textContent = i;
          modal.classList.remove("hidden");
          esVisualizacion = false;
        }
      });
  
      container.appendChild(btn);
    }
  
    // Guardar datos del modal
    guardarBtn.addEventListener("click", async () => {
      const nombreCliente = clienteInput.value.trim();
      const responsable = responsableSelect.value;
  
      if (!nombreCliente || !responsable) {
        alert("Por favor completa todos los campos.");
        return;
      }
  
      await db.collection("puestos").doc(puestoSeleccionado.toString()).set({
        vendido: true,
        cliente: nombreCliente,
        responsable: responsable,
        fecha: new Date()
      });
  
      modal.classList.add("hidden");
      alert(`¡Puesto #${puestoSeleccionado} registrado exitosamente!`);
    });
  
    // Cerrar modal
    cancelarBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  
    // Escuchar cambios en Firestore
    db.collection("puestos").onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        const id = doc.id;
        const btn = document.getElementById(`puesto-${id}`);
        if (btn) {
          btn.classList.add("vendido");
          btn.disabled = false; // Habilitado para ver detalles
        }
      });
    });
  });
  





