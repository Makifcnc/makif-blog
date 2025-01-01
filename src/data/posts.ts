import { BlogPost } from "@/types/blog";

export const posts: BlogPost[] = [
    {
        id: "1",
        title: "Next.js ile Modern Web Geliştirme",
        excerpt: "Next.js, React tabanlı web uygulamaları geliştirmek için mükemmel bir framework. Bu yazıda Next.js'in temel özelliklerini inceliyoruz.",
        content: `
# Next.js ile Modern Web Geliştirme

Next.js, React tabanlı web uygulamaları geliştirmek için mükemmel bir framework. Bu yazıda Next.js'in temel özelliklerini inceliyoruz.

## Next.js'in Temel Özellikleri

Next.js size aşağıdaki özellikleri sunar:

- **Server-side rendering**: Sayfalarınızı sunucu tarafında render ederek daha iyi SEO ve performans
- **Static site generation**: Statik sayfalar oluşturarak hosting maliyetlerini düşürme
- **API routes**: Backend API'larınızı aynı proje içinde yazabilme
- **File-system based routing**: Dosya sistemi bazlı routing yapısı
- **Built-in CSS ve Sass desteği**: CSS ve Sass dosyalarını doğrudan import edebilme

## Neden Next.js?

1. Kolay kurulum ve yapılandırma
2. Zengin ekosistem
3. Vercel tarafından aktif geliştirme
4. Mükemmel geliştirici deneyimi

\`\`\`javascript
// Basit bir Next.js sayfası
export default function HomePage() {
  return (
    <div>
      <h1>Hoş Geldiniz!</h1>
    </div>
  )
}
\`\`\`

Ve çok daha fazlası...`,
        date: "2023-12-31",
        author: "Mehmet Akif",
        tags: ["Next.js", "React", "Web Development"]
    },
    {
        id: "2",
        title: "TypeScript ile Güvenli Kod Yazımı",
        excerpt: "TypeScript, JavaScript'e tip güvenliği ekleyerek daha güvenilir uygulamalar geliştirmenizi sağlar. Peki nasıl?",
        content: `
# TypeScript ile Güvenli Kod Yazımı

TypeScript, JavaScript'e tip güvenliği ekleyerek daha güvenilir uygulamalar geliştirmenizi sağlar.

## TypeScript'in Avantajları

TypeScript ile aşağıdaki avantajlara sahip olursunuz:

- **Daha az hata**: Tip kontrolü sayesinde hataları derleme zamanında yakalama
- **Kod tamamlama**: IDE'lerde daha iyi kod tamamlama desteği
- **Daha okunabilir kod**: Tip tanımlamaları sayesinde kendini dokümante eden kod
- **Kolay refactoring**: Tip sistemi sayesinde güvenli kod değişiklikleri

## Örnek Kod

\`\`\`typescript
// Interface tanımı
interface User {
  id: number;
  name: string;
  email: string;
}

// Tip güvenli fonksiyon
function getUserName(user: User): string {
  return user.name;
}

// Kullanım
const user: User = {
  id: 1,
  name: "Mehmet",
  email: "mehmet@example.com"
};

console.log(getUserName(user)); // "Mehmet"
\`\`\`

## Best Practices

1. Her zaman tip tanımlamalarını kullanın
2. "any" tipinden kaçının
3. Interface'leri akıllıca kullanın
4. Jenerik tipleri öğrenin

TypeScript, modern web geliştirmede vazgeçilmez bir araç haline geldi.`,
        date: "2023-12-30",
        author: "Mehmet Akif",
        tags: ["TypeScript", "JavaScript", "Programming"]
    }
]; 