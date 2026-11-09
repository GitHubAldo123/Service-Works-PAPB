// --- BAGIAN 1: Deteksi Status Jaringan --- 
const offlineBanner = document.getElementById('offline-banner'); 
 
function updateNetworkStatus() { 
    if (navigator.onLine) { 
        // Jika internet kembali menyala 
        offlineBanner.style.display = 'none'; 
        console.log('Jaringan: Kembali Online'); 
    } else { 
        // Jika terputus dari internet 
        offlineBanner.style.display = 'block'; 
        console.log('Jaringan: Mode Offline'); 
    } 
} 
 
// Menjalankan fungsi saat pertama kali web dimuat 
window.addEventListener('load', updateNetworkStatus); 
 
// Mendengarkan perubahan status jaringan 
window.addEventListener('online', updateNetworkStatus); 
window.addEventListener('offline', updateNetworkStatus); 
 
 
// --- BAGIAN 2: Kustomisasi Tombol Install (A2HS) --- 
let deferredPrompt; 
const installBtn = document.getElementById('install-btn'); 
 
// Event ini dipicu browser JIKA syarat PWA (SW, Manifest) terpenuhi 
window.addEventListener('beforeinstallprompt', (e) => { 
    // 1. Mencegah browser memunculkan prompt otomatis (infobar) di beberapa 
perangkat 
    e.preventDefault(); 
     
    // 2. Simpan event ke variabel agar bisa dipanggil nanti 
    deferredPrompt = e; 
     
    // 3. Tampilkan tombol install milik kita 
    installBtn.style.display = 'block'; 
    console.log('PWA: Memenuhi syarat untuk diinstal.'); 
}); 
 
// Menangani klik pada tombol install kita 
installBtn.addEventListener('click', async () => { 
    if (deferredPrompt) { 
        // 4. Munculkan prompt instalasi bawaan browser 
        deferredPrompt.prompt();
         // 5. Tunggu respon pengguna (apakah mereka klik Install atau Cancel) 
        const { outcome } = await deferredPrompt.userChoice; 
         
        if (outcome === 'accepted') { 
            console.log('PWA: Pengguna menerima instalasi'); 
        } else { 
            console.log('PWA: Pengguna membatalkan instalasi'); 
        } 
         
        // 6. Reset variabel dan sembunyikan tombol 
        deferredPrompt = null; 
        installBtn.style.display = 'none'; 
    } 
}); 
 
// Mendengarkan event jika PWA sukses terinstal dengan cara apapun 
window.addEventListener('appinstalled', () => { 
    console.log('PWA: Aplikasi berhasil diinstal secara penuh'); 
    installBtn.style.display = 'none'; 
    deferredPrompt = null; 
});