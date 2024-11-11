class LazyLoader {
    constructor(options = {}) {
        this.selector = '.lazyload';
        this.options = options;
        this.dbName = "imageCacheDB";
        this.storeName = "images";
        this.init();
    }

    // Inisialisasi Observer dan Observasi Elemen
    init() {
        const lazyElements = document.querySelectorAll(`img${this.selector}`);
        const observerOptions = {
            root: this.options.root || null,
            rootMargin: this.options.rootMargin || '0px',
            threshold: this.options.threshold || 0.1,
        };

        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), observerOptions);
        lazyElements.forEach(element => this.observer.observe(element));
    }

    // Menangani Elemen yang Terlihat di Viewport
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                this.loadElement(element);
                this.observer.unobserve(element); // Berhenti mengawasi setelah dimuat
            }
        });
    }

    // Memuat Elemen dan Menggunakan Caching
    async loadElement(element) {
        const dataSrc = element.dataset.src;
        if (!dataSrc) return;

        try {
            const cachedImage = await this.getImageFromDB(dataSrc);
            if (cachedImage) {
                // Jika ada di cache, gunakan Blob URL dari IndexedDB
                element.src = URL.createObjectURL(cachedImage);
            } else {
                // Jika belum di-cache, unduh dan simpan ke IndexedDB
                const response = await fetch(dataSrc);
                if (!response.ok) throw new Error("Failed to fetch image");

                const blob = await response.blob();
                element.src = dataSrc;
                this.saveImageToDB(dataSrc, blob);
            }

            // Tambahkan kelas untuk efek fade-in dan sembunyikan loader
            element.classList.add('lazyload-loaded');
            element.classList.remove(this.selector.replace('.', ''));
            this.hideLoader(element);
        } catch (error) {
            console.error("Image fetch or caching failed:", error);
            // this.hideLoader(element);
        }
    }

    // Sembunyikan Loader Setelah Gambar Dimuat
    hideLoader(element) {
        const loader = element.closest('.lazy-image-container').querySelector('.loader-container');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    // Membuka atau Membuat Database IndexedDB
    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName); // Membuat store jika belum ada
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Menyimpan Gambar ke IndexedDB
    saveImageToDB(url, blob) {
        this.openDB().then(db => {
            const transaction = db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            store.put(blob, url);
        }).catch(error => {
            console.error("Failed to save image to IndexedDB:", error);
        });
    }

    // Mengambil Gambar dari IndexedDB
    getImageFromDB(url) {
        return this.openDB().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, "readonly");
                const store = transaction.objectStore(this.storeName);
                const request = store.get(url);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    }
}

export default LazyLoader;
