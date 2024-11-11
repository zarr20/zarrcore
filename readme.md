
# Installation

```bash
npm install zarcore
```

```bash
<script src="zarcore.min.js"></script>
<link href="zarcore.min.css">
```

## Modules
#### LazyLoader
- **Lazy Loading**: Loads images only when they appear in the viewport to save bandwidth.
- **Caching dengan IndexedDB**: Stores loaded images to 
- **Loader Animasi**: Provides visual feedback while images are being loaded.

#### Usage
```bash
<div class="lazy-image-container">
    <div class="loader-container">
        <div class="loader"></div> <!-- Loader Animation -->
    </div>
    <img class="lazy-load" src="path/to/placeholder.jpg" data-src="path/to/image.jpg" alt="Lazy loaded image">
</div>
```

```bash
new zarcore.LazyLoader('.lazy-load', {
    rootMargin: '0px',    // Margin to start loading images before the element enters the viewport
    threshold: 0.1        // Percentage of the element in the viewport to start loading
});
```
----

## 📫 Connect with Me

[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/zarr20)

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zarr20)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dzarr-al-ghifari-371a491a8/)
