# Scroll Animations - Smooth Opacity Based on Scroll Position

Implementasi scroll animations yang smooth di project ini menggunakan **custom hook** yang menghitung opacity berdasarkan posisi scroll element terhadap viewport.

## 📦 Implementasi Terbaru

### 1. **Custom Hook: `useScrollVisibility`**
- **File**: [hooks/useScrollAnimation.ts](hooks/useScrollAnimation.ts)
- **Fungsi**: Menghitung opacity smooth berdasarkan visibility ratio element di viewport
- **Return**: `{ ref, opacity, style }`

### 2. **Cara Kerja**
```typescript
// Hook menghitung berapa persen element terlihat di viewport
const visibilityRatio = visibleHeight / elementHeight;

// Opacity berubah smooth dari 0 sampai 1
// tergantung posisi scroll dan arah scroll
const opacity = Math.max(0, Math.min(1, visibilityRatio));
```

## 🎯 Fitur Smooth Opacity

### **Semua Elemen Sekarang:**
- ✅ **Muncul perlahan** saat scroll ke bawah (opacity naik dari 0 ke 1)
- ✅ **Hilang perlahan** saat scroll ke atas (opacity turun dari 1 ke 0)
- ✅ **Smooth transition** 300ms ease-out
- ✅ **Berdasarkan visibility ratio** - bukan instant show/hide

### **Project Cards:**
- ✅ **Slide up effect** + smooth opacity
- ✅ **Muncul bergeser** dari bawah dengan fade-in smooth

## 📍 Komponen yang Diupdate

### **Pages:**
1. [pages/Home.tsx](pages/Home.tsx) - Hero section
2. [pages/About.tsx](pages/About.tsx)
3. [pages/Experience.tsx](pages/Experience.tsx)
4. [pages/Skills.tsx](pages/Skills.tsx)
5. [pages/Contact.tsx](pages/Contact.tsx)

### **Components:**
1. [link-project/components/ProjectCard.tsx](link-project/components/ProjectCard.tsx)
2. [link-project/components/ExpandableCard.tsx](link-project/components/ExpandableCard.tsx)
3. [link-project/components/ExpandableCardContainer.tsx](link-project/components/ExpandableCardContainer.tsx)

## 💡 Cara Menggunakan

### **Untuk Komponen Baru:**
```tsx
import { useScrollVisibility } from '../hooks/useScrollAnimation';

const MyComponent: React.FC = () => {
  const { ref, opacity, style } = useScrollVisibility();

  return (
    <div ref={ref} style={style}>
      Content yang akan fade in/out smooth
    </div>
  );
};
```

### **Atau Inline Style:**
```tsx
<div
  ref={ref}
  style={{
    opacity: opacity,
    transition: 'opacity 0.3s ease-out'
  }}
>
  Content
</div>
```

## ⚙️ Konfigurasi

### **Global Scroll Listener:**
- **Efficient**: Single listener untuk semua komponen
- **Passive**: Tidak block scroll performance
- **Real-time**: Update setiap scroll event

### **Visibility Calculation:**
```typescript
// Hitung area element yang terlihat
const visibleTop = Math.max(0, -elementTop);
const visibleBottom = Math.min(windowHeight, elementBottom);
const visibleHeight = Math.max(0, visibleBottom - visibleTop);

// Hitung ratio visibility
const visibilityRatio = visibleHeight / elementHeight;

// Smooth opacity dengan direction influence
let opacity = visibilityRatio;
if (scrollDirection === 'up') {
  opacity = Math.min(1, opacity + 0.2); // Lebih visible saat scroll up
} else {
  opacity = Math.max(0, opacity - 0.1); // Lebih hidden saat scroll down
}
```

## ✨ Efek Visual

- **Scroll Down**: Elemen muncul perlahan dari opacity 0 ke 1
- **Scroll Up**: Elemen hilang perlahan dari opacity 1 ke 0
- **Smooth Transition**: 300ms ease-out untuk transisi yang natural
- **No Jerkiness**: Tidak ada instant show/hide yang kasar

## 📊 Build Status
✅ **Build successful** - Semua perubahan terintegrasi dengan baik

---

**Hasil**: Sekarang semua elemen akan muncul dan hilang secara perlahan tergantung posisi scroll, memberikan pengalaman yang lebih smooth dan natural!

  return (
    <div {...scrollProps} className="my-content">
      Content here
    </div>
  );
};
```

### Method 2: Menggunakan data-aos attributes langsung
```tsx
<motion.div
  data-aos="aos-fade-up"
  data-aos-duration="800"
  data-aos-easing="ease-out"
>
  Content here
</motion.div>
```

## ⚙️ Konfigurasi Default AOS
```typescript
AOS.init({
  duration: 800,           // Durasi animasi dalam ms
  easing: 'ease-in-out',   // Easing function
  once: true,              // Animasi hanya terjadi sekali
  offset: 100              // Trigger animation 100px sebelum element masuk viewport
});
```

## ✨ Tips Penggunaan

1. **Stagger Effect**: Gunakan `data-aos-delay` untuk delay animation pada beberapa elemen
   ```tsx
   <div data-aos="aos-fade-up" data-aos-delay="0">Item 1</div>
   <div data-aos="aos-fade-up" data-aos-delay="100">Item 2</div>
   <div data-aos="aos-fade-up" data-aos-delay="200">Item 3</div>
   ```

2. **Accessibility**: Respects `prefers-reduced-motion` - animasi akan disabled untuk users yang prefer reduced motion

3. **Performance**: AOS sudah optimized dengan `contain` strategy

## 📍 Refresh AOS Manual
Jika menambahkan konten dinamis:
```typescript
AOS.refresh(); // Call ini untuk trigger AOS re-calculation
```

## 🔗 Resources
- [AOS Documentation](https://michalsnik.github.io/aos/)
- [AOS GitHub](https://github.com/michalsnik/aos)

---

**Catatan**: ProjectCard memiliki animasi khusus slide-vertikal (muncul terus bergeser), sementara elemen lain menggunakan fade-up standard.
