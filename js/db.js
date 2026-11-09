let db; 

// Fungsi untuk menyimpan catatan ke dalam IndexedDB 
function addNote(title, body) { 
    const transaction = db.transaction(['notes'], 'readwrite'); 
    const store = transaction.objectStore('notes'); 
     
    const noteData = { 
        title: title, 
        body: body, 
        createdAt: new Date().getTime() 
    }; 
     
    const addRequest = store.add(noteData); 
     
    transaction.oncomplete = function() { 
        console.log('Database: Catatan baru berhasil disimpan.'); 
        document.getElementById('note-title').value = '';
        document.getElementById('note-body').value = ''; 
        displayNotes(); 
    }; 
 
    transaction.onerror = function(event) { 
        console.error('Database: Gagal menyimpan catatan.', event.target.error); 
    }; 
} 

// ==========================================
// BARU: Fungsi untuk menghapus catatan berdasarkan ID
// ==========================================
function deleteNote(id) {
    // Ubah id menjadi number karena autoIncrement bertipe angka
    const transaction = db.transaction(['notes'], 'readwrite');
    const store = transaction.objectStore('notes');
    
    const deleteRequest = store.delete(Number(id));

    transaction.oncomplete = function() {
        console.log(`Database: Catatan dengan ID ${id} berhasil dihapus.`);
        displayNotes(); // Perbarui tampilan setelah data dihapus
    };

    transaction.onerror = function(event) {
        console.error('Database: Gagal menghapus catatan.', event.target.error);
    };
}

// Membuka atau membuat database versi 1 
const request = indexedDB.open('PWANotesDB', 1); 

request.onupgradeneeded = function(event) { 
    db = event.target.result; 
     
    if (!db.objectStoreNames.contains('notes')) { 
        const objectStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true }); 
        objectStore.createIndex('title', 'title', { unique: false }); 
        console.log('Database: Object Store "notes" berhasil dibuat.'); 
    } 
}; 
 
request.onsuccess = function(event) { 
    db = event.target.result; 
    console.log('Database: Terhubung ke IndexedDB.'); 
    displayNotes();  
}; 
 
request.onerror = function(event) { 
    console.error('Database: Kesalahan saat membuka database.', event.target.errorCode); 
};

function displayNotes() { 
    const listElement = document.getElementById('note-list'); 
    listElement.innerHTML = ''; 
  
    const transaction = db.transaction(['notes'], 'readonly'); 
    const store = transaction.objectStore('notes'); 
     
    store.openCursor().onsuccess = function(event) { 
        const cursor = event.target.result;
        if (cursor) { 
            const li = document.createElement('li'); 
            
            // DIPERBARUI: Menambahkan struktur tata letak dan tombol Hapus dengan atribut data-id
            li.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4>${cursor.value.title}</h4> 
                        <p>${cursor.value.body}</p>
                    </div>
                    <button class="delete-btn" data-id="${cursor.value.id}" style="background-color: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
                </div>
            `; 
            listElement.appendChild(li); 
             
            cursor.continue(); 
        } else { 
            if(listElement.children.length === 0) { 
                listElement.innerHTML = '<p style="text-align:center;">Belum ada catatan.</p>'; 
            } 
        } 
    }; 
} 

// Event Listener Utama
document.addEventListener('DOMContentLoaded', () => { 
    const saveBtn = document.getElementById('save-btn');
    
    // Event listener untuk tombol simpan
    saveBtn.addEventListener('click', () => { 
        const title = document.getElementById('note-title').value; 
        const body = document.getElementById('note-body').value; 
         
        if (title.trim() === '' || body.trim() === '') { 
            alert('Judul dan isi catatan tidak boleh kosong!'); 
            return; 
         } 
         
        addNote(title, body); 
    }); 

    // ==========================================
    // BARU: Event Delegation untuk tombol hapus pada daftar catatan
    // ==========================================
    const noteList = document.getElementById('note-list');
    noteList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const id = event.target.getAttribute('data-id');
            
            // Konfirmasi sebelum menghapus (opsional tapi disarankan)
            if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
                deleteNote(id);
            }
        }
    });
});
let db; 
const request = indexedDB.open('PWANotesDB', 1);
request.onupgradeneeded = function(event) { 
    db = event.target.result; 
    if (!db.objectStoreNames.contains('notes')) { 
        db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true }); 
    } 
}; 
 
request.onsuccess = function(event) { 
    db = event.target.result; 
    displayNotes();  
}; 
 
request.onerror = function(event) { 
    console.error('Database error:', event.target.errorCode); 
}; 
 
// --- FUNGSI CREATE (TAMBAH DATA) --- 
function addNote(title, body) { 
    const transaction = db.transaction(['notes'], 'readwrite'); 
    const store = transaction.objectStore('notes'); 
     
    store.add({ title: title, body: body, createdAt: new Date().getTime() }); 
     
    transaction.oncomplete = function() { 
        resetForm(); 
        displayNotes(); 
    };
    } 
 
// --- FUNGSI READ (BACA & TAMPILKAN DATA) --- 
function displayNotes() { 
    const listElement = document.getElementById('note-list'); 
    listElement.innerHTML = '';  
 
    const transaction = db.transaction(['notes'], 'readonly'); 
    const store = transaction.objectStore('notes'); 
     
    store.openCursor().onsuccess = function(event) { 
        const cursor = event.target.result; 
         
        if (cursor) { 
            const id = cursor.key; 
            const title = cursor.value.title; 
            const body = cursor.value.body; 
 
            const li = document.createElement('li'); 
            li.innerHTML = ` 
                <h4>${title}</h4> 
                <p>${body}</p> 
            `; 
             
            // Membuat wadah tombol aksi 
            const actionDiv = document.createElement('div'); 
            actionDiv.className = 'action-buttons'; 
 // Tombol Edit 
            const btnEdit = document.createElement('button'); 
            btnEdit.textContent = 'Edit'; 
            btnEdit.className = 'btn-edit'; 
            btnEdit.onclick = () => loadEditData(id, title, body); 
 
            // Tombol Hapus 
            const btnDelete = document.createElement('button'); 
            btnDelete.textContent = 'Hapus'; 
            btnDelete.className = 'btn-delete'; 
            btnDelete.onclick = () => deleteNote(id); 
 
            actionDiv.appendChild(btnEdit); 
            actionDiv.appendChild(btnDelete); 
            li.appendChild(actionDiv); 
             
            listElement.appendChild(li); 
            cursor.continue(); 
        } else { 
            if(listElement.children.length === 0) { 
                listElement.innerHTML = '<p style="text-align:center;">Belum ada catatan.</p>'; 
            } 
        } 
    }; 
}
// --- FUNGSI DELETE (HAPUS DATA) --- 
function deleteNote(id) { 
    if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) { 
        const transaction = db.transaction(['notes'], 'readwrite'); 
        const store = transaction.objectStore('notes'); 
         
        store.delete(id); 
         
        transaction.oncomplete = function() { 
            displayNotes(); 
        }; 
    } 
} 
 
// --- FUNGSI UPDATE (PERBARUI DATA) --- 
// 1. Memuat data ke form 
function loadEditData(id, title, body) { 
    document.getElementById('note-id').value = id; 
    document.getElementById('note-title').value = title; 
    document.getElementById('note-body').value = body; 
     
    const saveBtn = document.getElementById('save-btn'); 
    saveBtn.textContent = 'Update Catatan'; 
    saveBtn.style.backgroundColor = '#28a745'; // Ubah warna jadi hijau 
} 
// 2. Menyimpan data yang diperbarui 
function updateNote(id, title, body) { 
    const transaction = db.transaction(['notes'], 'readwrite'); 
    const store = transaction.objectStore('notes'); 
     
    // Ambil data lama terlebih dahulu agar properti lain (seperti createdAt) tidak hilang 
    const getRequest = store.get(Number(id)); 
     
    getRequest.onsuccess = function(event) { 
        const data = event.target.result; 
        data.title = title; 
        data.body = body; 
         
        // Gunakan method put() untuk memperbarui/menimpa data 
        store.put(data); 
    }; 
 
    transaction.oncomplete = function() { 
        resetForm(); 
        displayNotes(); 
    }; 
} 
 
// Fungsi bantu untuk mengosongkan form 
function resetForm() { 
    document.getElementById('note-id').value = ''; 
    document.getElementById('note-title').value = '';
     document.getElementById('note-body').value = ''; 
     
    const saveBtn = document.getElementById('save-btn'); 
    saveBtn.textContent = 'Simpan Catatan'; 
    saveBtn.style.backgroundColor = '#0056b3'; // Kembalikan ke warna biru 
} 
 
// --- EVENT LISTENER TOMBOL SIMPAN --- 
document.addEventListener('DOMContentLoaded', () => { 
    const saveBtn = document.getElementById('save-btn'); 
     
    saveBtn.addEventListener('click', () => { 
        const id = document.getElementById('note-id').value; 
        const title = document.getElementById('note-title').value; 
        const body = document.getElementById('note-body').value; 
         
        if (title.trim() === '' || body.trim() === '') { 
            alert('Judul dan isi catatan tidak boleh kosong!'); 
            return; 
        } 
         
        // Logika penentuan: Jika ada ID berarti Update, jika kosong berarti Tambah Baru 
        if (id) { 
            updateNote(id, title, body); 
        } else { 
            addNote(title, body); 
        }
        }); 
});