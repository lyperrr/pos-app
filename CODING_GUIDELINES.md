# NIRA POS — Coding Guidelines (Frontend)

> Dokumen ini adalah panduan wajib untuk semua kontributor frontend NIRA POS.
> Stack: **React + TypeScript**, **shadcn/ui + Tailwind CSS**, **TanStack Query**, **Laravel REST API**.

---

## Daftar Isi

1. [Filter & Search — Wajib Debounce](#1-filter--search--wajib-debounce)
2. [Filtering & Pagination — Server-Side Only](#2-filtering--pagination--server-side-only)
3. [Penggunaan Komponen UI & Standard Icon (Lucide Icons)](#3-penggunaan-komponen-ui--standard-icon-lucide-icons)
4. [Konsistensi Tema & Warna (CSS Variables System)](#4-konsistensi-tema--warna-css-variables-system)
5. [Loading State — Skeleton Mirroring Layout Asli](#5-loading-state--skeleton-mirroring-layout-asli)
6. [Empty State — Wajib Komponen `<Empty />`](#6-empty-state--wajib-komponen-empty-)
7. [Styling — Jangan Override Kalau Tidak Perlu](#7-styling--jangan-override-kalau-tidak-perlu)
8. [Data Fetching — TanStack Query](#8-data-fetching--tanstack-query)
9. [Validasi — Backend adalah Sumber Kebenaran](#9-validasi--backend-adalah-sumber-kebenaran)
10. [API Service Layer](#10-api-service-layer)
11. [TypeScript & Tipe Data](#11-typescript--tipe-data)
12. [Detail-Detail Kecil UI & UX Best Practices](#12-detail-detail-kecil-ui--ux-best-practices)
13. [Struktur File & Penamaan](#13-struktur-file--penamaan)
14. [Error Handling & Pesan Error Ramah Pengguna](#14-error-handling--pesan-error-ramah-pengguna)

---

## 1. Filter & Search — Wajib Debounce

**Aturan:** Setiap input filter (text search, tanggal, dropdown) **WAJIB** menggunakan `useDebounce` sebelum dikirim ke API. Tidak boleh trigger request setiap keystroke.

Hook sudah tersedia di `src/hooks/useDebounce.ts`. **Jangan buat ulang.**

### Benar

```tsx
import { useDebounce } from '@/hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'

export default function ProductListPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')

  // Debounce 400ms — request baru dikirim HANYA setelah user berhenti mengetik
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search: debouncedSearch, categoryId }],
    queryFn: () => productService.getProducts({ search: debouncedSearch, category_id: categoryId }),
  })

  return (
    <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)} // state update langsung (UI responsif)
      placeholder="Cari produk..."
    />
  )
}
```

### Salah — request dikirim setiap karakter

```tsx
// JANGAN — ini akan spam API setiap ketikan
const { data } = useQuery({
  queryKey: ['products', search],       // pakai `search` langsung, bukan debouncedSearch
  queryFn: () => productService.getProducts({ search }),
})
```

### Delay yang Digunakan

| Konteks | Delay |
|---|---|
| Search text (keyboard input) | `400ms` |
| Dropdown / select filter | `0ms` (tidak perlu debounce, langsung) |
| Date range picker | `0ms` (trigger saat date berubah, bukan keydown) |

---

## 2. Filtering & Pagination — Server-Side Only

**Aturan:** Data **tidak boleh** di-filter atau dipaginasi di sisi frontend. Semua filter dikirim sebagai query params ke API.

### Benar — kirim filter ke API

```tsx
// Filter dikirim ke backend sebagai query string:
// GET /api/products?search=kopi&category_id=cat-1&page=2&per_page=15
const { data } = useQuery({
  queryKey: ['products', { search: debouncedSearch, page, categoryId }],
  queryFn: () => productService.getProducts({
    search: debouncedSearch || undefined,
    category_id: categoryId || undefined,
    page,
    per_page: 15,
  }),
})
```

### Salah — filter di frontend

```tsx
// JANGAN — ambil semua data lalu filter di client
const { data } = useQuery({
  queryKey: ['products'],
  queryFn: () => productService.getProducts(),
})
const filtered = data?.filter(p => p.name.includes(search)) // DILARANG
```

### Komponen Pagination

Gunakan komponen `<Pagination />` dari `src/components/ui/pagination.tsx`. Jangan buat custom pagination baru.

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const [page, setPage] = useState(1)

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        aria-disabled={page === 1}
      />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext
        onClick={() => setPage((p) => p + 1)}
        aria-disabled={!data?.meta?.has_next_page}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

## 3. Penggunaan Komponen UI & Standard Icon (Lucide Icons)

**Aturan UI Component:** Selalu cek `src/components/ui/` **terlebih dahulu** sebelum membuat komponen baru. Komponen shadcn/ui yang tersedia wajib digunakan.

**Aturan Icon:** **WAJIB SELALU** menggunakan icon dari `lucide-react` (Lucide Icons). Dilarang menginstall library icon lain (seperti FontAwesome, React Icons, Heroicons) atau membuat SVG manual inline kecuali sangat terpaksa.

### Benar — Import dari `lucide-react`

```tsx
import { Plus, Search, Trash2, Package, Filter, CheckCircle2 } from 'lucide-react'

<Button className="gap-2">
  <Plus className="size-4" /> Tambah Produk
</Button>
```

### Salah — Menggunakan library icon lain atau SVG inline

```tsx
// ❌ JANGAN pakai library lain
import { FaPlus } from 'react-icons/fa'

// ❌ JANGAN buat SVG manual jika di Lucide sudah ada
<svg viewBox="0 0 24 24">...</svg>
```

### Daftar Komponen UI yang Tersedia (`src/components/ui/`)

| Komponen | File | Kegunaan |
|---|---|---|
| `<Button>` | `button.tsx` | Semua tombol aksi |
| `<Input>` | `input.tsx` | Text input, search |
| `<Select>` | `select.tsx` | Dropdown pilihan |
| `<Combobox>` | `combobox.tsx` | Dropdown searchable |
| `<Card>` | `card.tsx` | Container konten |
| `<Badge>` | `badge.tsx` | Status/label |
| `<Dialog>` | `dialog.tsx` | Modal dialog |
| `<ConfirmationDialog>` | `confirmation-dialog.tsx` | Dialog konfirmasi hapus/aksi |
| `<Skeleton>` | `skeleton.tsx` | Loading placeholder |
| `<Pagination>` | `pagination.tsx` | Navigasi halaman |
| `<Table>` | `table.tsx` | Tabel data |
| `<Toast>` | `toast.tsx` | Notifikasi toast |
| `<Field>` | `field.tsx` | Form field dengan label & error |
| `<Empty>` | `empty.tsx` | State kosong/tidak ada data |
| `<Spinner>` | `spinner.tsx` | Loading spinner |

---

## 4. Konsistensi Tema & Warna (CSS Variables System)

**Aturan:** **WAJIB** selalu menggunakan warna tema yang sudah didefinisikan dalam design system / CSS variables (`index.css`). **DILARANG keras** merubah atau menambahkan warna arbitrer di luar tema (seperti hardcoded hex `text-[#1e293b]`, `bg-blue-600`, `border-[#e2e8f0]`).

### CSS Variables Theme Palette

Gunakan semantic class dari Tailwind yang memetakan ke CSS Variables:
- `bg-background` & `text-foreground`
- `bg-card` & `text-card-foreground`
- `bg-primary` & `text-primary-foreground`
- `bg-secondary` & `text-secondary-foreground`
- `bg-muted` & `text-muted-foreground`
- `bg-accent` & `text-accent-foreground`
- `bg-destructive` & `text-destructive-foreground`
- `border-border` & `divide-border`

### Benar — Menggunakan Semantic Color Theme

```tsx
// ✅ Menggunakan warna semantic tema
<div className="bg-card text-card-foreground border border-border p-4 rounded-xl">
  <h2 className="text-foreground font-bold">Judul Card</h2>
  <p className="text-muted-foreground text-sm">Deskripsi menggunakan warna muted theme.</p>
  <Badge variant="secondary">Aktif</Badge>
</div>
```

### Salah — Hardcoding Warna di Luar Tema

```tsx
// ❌ JANGAN — warna sembarangan di luar desain sistem
<div className="bg-white text-gray-900 border-gray-200">
  <h2 className="text-blue-600">Judul Card</h2>
  <p className="text-slate-500">Deskripsi...</p>
</div>

// ❌ JANGAN — hardcoded hex color
<div className="bg-[#f8fafc] text-[#0f172a]">...</div>
```

---

## 5. Loading State — Skeleton Mirroring Layout Asli

**Aturan:** Setiap kali mengakses halaman, bagian card, tabel, atau komponen yang memuat data, **WAJIB** menampilkan Loading Skeleton yang **bentuknya persis menyerupai layout UI aslinya** (Mirroring Skeleton Layout).

Jangan hanya menggunakan Spinner kecil di tengah layar jika UI aslinya berupa Grid Card atau Table Data!

### Benar — Skeleton Mirroring Layout

#### Contoh 1: Halaman Daftar Produk (Table Layout)

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export function ProductTableSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="py-4 flex items-center justify-between gap-4">
          {/* Avatar & Title Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          {/* Price & Badge Skeleton */}
          <div className="flex items-center gap-4">
            <div className="space-y-1 text-right">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-12 ml-auto" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

#### Contoh 2: Dashboard Metric Cards (Grid Layout)

```tsx
export function MetricCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-20" />
        </Card>
      ))}
    </div>
  )
}
```

### Salah — Hanya Spinner / Blank Screen

```tsx
// ❌ JANGAN — Spinner generik tanpa bentuk menyerupai UI asli
if (isLoading) return <Spinner />
```

---

## 6. Empty State — Wajib Komponen `<Empty />`

**Aturan:** Ketika data yang diambil **kosong**, baik karena memang belum ada data maupun karena hasil filter/search tidak ada yang cocok, **WAJIB** menggunakan komponen `<Empty />` dari `src/components/ui/empty.tsx`.

### Benar — Menggunakan Komponen `<Empty />`

```tsx
import { Empty } from '@/components/ui/empty'
import { PackageX, SearchX } from 'lucide-react'

// Kasus 1: Filter/Search tidak menemukan data
if (!isLoading && data?.data.length === 0 && search) {
  return (
    <Empty
      icon={<SearchX className="size-10 text-muted-foreground" />}
      title="Produk tidak ditemukan"
      description={`Tidak ada produk yang cocok dengan kata kunci "${search}". Coba cari kata kunci lain.`}
    />
  )
}

// Kasus 2: Data awal memang kosong
if (!isLoading && data?.data.length === 0) {
  return (
    <Empty
      icon={<PackageX className="size-10 text-muted-foreground" />}
      title="Belum ada produk"
      description="Silakan tambahkan produk pertama Anda untuk mulai berjualan."
      action={
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="size-4" /> Tambah Produk
        </Button>
      }
    />
  )
}
```

### Salah — Text Polosan atau Hilang Tanpa Keterangan

```tsx
// ❌ JANGAN — Teks seadanya tanpa komponen UI standar
if (products.length === 0) return <div>Data tidak ada</div>
```

---

## 7. Styling — Jangan Override Kalau Tidak Perlu

**Aturan:** Ketika menggunakan komponen UI di halaman/file lain, **jangan menambahkan class Tailwind** yang sudah menjadi default komponen tersebut atau yang tidak diperlukan.

### Benar — Gunakan Komponen Apa Adanya

```tsx
// Button sudah punya padding, height, dan font yang tepat.
// Tidak perlu tambahkan px-4, py-2, h-10, dsb.
<Button onClick={handleSubmit}>Simpan Produk</Button>

// Tambahkan class HANYA jika memang diperlukan di konteks ini (misal: spacing layout)
<Button variant="destructive" size="sm" className="gap-2">
  <Trash2 className="size-4" /> Hapus
</Button>
```

### Salah — Override Style Default

```tsx
// ❌ JANGAN — px-6, py-3, rounded-lg sudah ada di komponen Button
<Button className="px-6 py-3 rounded-lg font-semibold w-full">Simpan</Button>

// ❌ JANGAN — font-medium, text-sm sudah default di Input
<Input className="font-medium text-sm border-gray-300 rounded-md" />
```

### Kapan Boleh Menambah Class

Tambahkan class **hanya** jika:
1. Mengubah layout (`w-full`, `flex-1`, `col-span-2`)
2. Mengubah spacing antar elemen di layout tertentu (`mt-4`, `mr-2`, `gap-2`)
3. Mengubah variant yang tidak tersedia via prop (kasus sangat jarang)

---

## 8. Data Fetching — TanStack Query

**Aturan:** Semua data fetching menggunakan **TanStack Query** (`useQuery`, `useMutation`). Jangan gunakan `useState` + `useEffect` untuk fetch data dari API.

### Benar — `useQuery` & `useMutation`

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/services/productService'

export default function ProductListPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 400)
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', { search: debouncedSearch, page }],
    queryFn: () => productService.getProducts({ search: debouncedSearch, page }),
    placeholderData: (prev) => prev, // jaga data lama saat filter berubah
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
```

---

## 9. Validasi — Backend adalah Sumber Kebenaran

**Aturan:** Validasi di frontend hanya bersifat **UX** (mencegah round-trip untuk error sederhana). **Validasi sesungguhnya WAJIB ada di backend** (Laravel Form Request). Frontend tidak boleh menjadi satu-satunya penjaga validasi.

```
Frontend validation (UX, opsional)  →  API Request  →  Backend validation (WAJIB di Laravel)
```

---

## 10. API Service Layer

**Aturan:** Semua panggilan API diletakkan di `src/services/`. Jangan panggil `apiClient` langsung dari komponen atau halaman.

---

## 11. TypeScript & Tipe Data

**Aturan:** Tidak boleh menggunakan `any`. Semua respons API harus bertipe. Tipe didefinisikan di `src/types/`.

---

## 12. Detail-Detail Kecil UI & UX Best Practices

Untuk menjaga aplikasi tetap terasa **premium, responsif, dan rapi**, perhatikan detail-detail kecil berikut:

1. **Truncate Long Text:** Gunakan class `truncate` atau `line-clamp-1` pada nama produk, email, atau teks panjang agar tidak merusak layout tabel/card.
2. **Interactive Cursor:** Pastikan tombol, baris tabel yang dapat diklik, atau elemen interaktif menggunakan `cursor-pointer`.
3. **Disabled State:** Saat tombol sedang memproses (`isPending` / `isLoading`), berikan prop `disabled` dan tunjukkan icon loading spinner.
4. **Number Formatting:** Selalu format angka mata uang menggunakan `toLocaleString('id-ID')` (contoh: `Rp ${price.toLocaleString('id-ID')}`).
5. **Micro-animations:** Manfaatkan transition bawaan Tailwind seperti `transition-all hover:shadow-md` untuk card atau tombol.
6. **Consistent Rounded Corners:** Ikuti radius tema (misalnya `rounded-xl` atau `rounded-2xl` sesuai standar desain yang ditetapkan di proyek).

---

## 13. Struktur File & Penamaan

### Direktori

```
src/
├── components/
│   ├── ui/          ← komponen shadcn/ui (jangan modifikasi kecuali perlu)
│   ├── layout/      ← komponen layout (Sidebar, Topbar, dsb.)
│   └── [feature]/   ← komponen spesifik fitur (ProductCard, TransactionItem, dsb.)
├── hooks/           ← custom hooks (useDebounce, dsb.)
├── pages/
│   └── [feature]/   ← satu folder per fitur (products/, transactions/, dsb.)
├── services/        ← semua API calls
├── types/           ← semua TypeScript interfaces & types
├── lib/             ← utility (axios instance, dsb.)
└── constants/       ← konstanta global
```

---

## 14. Error Handling & Pesan Error Ramah Pengguna

**Aturan:** **DILARANG KERAS** menampilkan pesan error teknis mentah dari backend (seperti `SQLSTATE[...]`, `Connection refused`, stack trace, query SQL, atau error internal server 500) secara langsung di UI/layar pengguna.

Pesan error teknis tidak dipahami oleh pengguna biasa, merusak tampilan/pengalaman pengguna, dan berpotensi menimbulkan celah keamanan (*information disclosure*).

### Prinsip Utama Error Handling

1. **User-Friendly Message:** Semua pesan error di UI wajib menggunakan Bahasa Indonesia yang santun, jelas, dan mudah dimengerti oleh pengguna non-teknis.
2. **Sanitasi Pesan Error:** Frontend (`apiClient` interceptor / error helper) dan Backend (Laravel Exception Handler) **WAJIB** menyaring pesan error teknis sebelum dirender di UI.
3. **Log Teknis Hanya untuk Developer:** Detail error teknis (SQLSTATE, stack trace, error code) hanya boleh dicatat di `console.error()` atau log server (`laravel.log`) untuk debugging developer.

### Contoh Penanganan Error di Frontend

#### Benar — Menggunakan Helper Sanitasi Pesan Error (`getErrorMessage`)

```tsx
// Helper penyaring error teknis menjadi pesan ramah pengguna
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // 1. Error Jaringan / Server Down / Connection Refused
    if (!error.response || error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      return 'Gagal terhubung ke server. Silakan periksa koneksi internet Anda atau coba beberapa saat lagi.'
    }

    const status = error.response.status
    const data = error.response.data
    const rawMessage = data?.message || ''

    // 2. Deteksi & Filter jika backend me-return SQL / Technical Error / Error 500
    if (
      rawMessage.includes('SQLSTATE') ||
      rawMessage.includes('Connection refused') ||
      rawMessage.includes('Syntax error') ||
      status === 500
    ) {
      // JANGAN tampilkan rawMessage! Ganti dengan pesan umum yang santun
      return 'Terjadi kendala pada sistem server. Silakan coba beberapa saat lagi.'
    }

    // 3. Error Validasi / Business Logic yang aman dari backend (misal 422, 400, 403, 404)
    if (rawMessage) {
      return rawMessage
    }
  }

  return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'
}
```

#### Penggunaan pada Komponen UI / Alert Banner

```tsx
// ✅ BENAR — Selalu saring pesan error sebelum ditampilkan ke user
{isError && (
  <Alert variant="destructive">
    <AlertDescription>
      {getErrorMessage(error)}
    </AlertDescription>
  </Alert>
)}
```

#### Salah — Menampilkan raw error / message mentah dari backend

```tsx
// ❌ DILARANG — Teks error mentah backend (seperti `SQLSTATE[HY000]...`) langsung ditampilkan di UI
{isError && (
  <Alert variant="destructive">
    <AlertDescription>
      {error?.response?.data?.message || error.message}
    </AlertDescription>
  </Alert>
)}
```

### Pemetaan Pesan Error yang Direkomendasikan

| Kondisi Error | Pesan yang DILARANG di UI | Pesan Wajib yang Ditampilkan ke User |
|---|---|---|
| Database Down / Connection Refused | `SQLSTATE[HY000] [2002] Connection refused...` | *"Gagal terhubung ke server. Silakan coba beberapa saat lagi."* |
| Internal Server Error (500) | `Call to a member function... on null` / Stack trace | *"Terjadi kendala pada server. Tim kami sedang menanganinya."* |
| Network / Connection Offline | `Network Error` / `ERR_CONNECTION_REFUSED` | *"Koneksi terputus. Pastikan perangkat Anda terhubung ke internet."* |
| Data Tidak Ditemukan (404) | `No query results for model [App\Models\Outlet]` | *"Data yang Anda cari tidak ditemukan."* |
| Akses Ditolak (403) | `This action is unauthorized.` | *"Anda tidak memiliki akses untuk melakukan tindakan ini."* |

---

## Ringkasan Cepat (Cheatsheet)

| Aturan | Lakukan | Jangan |
|---|---|---|
| **Filter input** | Debounce 400ms via `useDebounce` | Trigger request setiap keystroke |
| **Filtering & Pagination** | Server-side, kirim query params ke API | Filter / paginate array di frontend |
| **Icon Library** | **WAJIB Lucide Icons (`lucide-react`)** | Pake FontAwesome/React-Icons/SVG manual |
| **Warna & Tema** | **Gunakan CSS variables theme (`bg-card`, `text-primary`)** | Hardcode hex (`#1e293b`) / warna di luar tema |
| **Loading State** | **Skeleton yang MIRRORING layout UI asli** | Hanya pakai Spinner kecil di tengah |
| **Empty State** | **Wajib komponen `<Empty />` saat data 0** | Teks seadanya / kosong tanpa indikasi |
| **Komponen UI** | Pakai yang ada di `src/components/ui/` | Buat komponen baru jika sudah tersedia |
| **Styling** | Class tambahan hanya untuk layout/spacing | Override style default komponen UI |
| **Data Fetching** | `useQuery` / `useMutation` dari TanStack Query | `useState` + `useEffect` untuk fetch |
| **Validasi** | Frontend UX + **Backend wajib** (Laravel Form Request) | Validasi hanya di frontend |
| **Error Handling** | **Saring pesan ramah user (`getErrorMessage`)** | Tampilkan raw error (`SQLSTATE`, stack trace, SQL) ke UI |
| **API calls** | Melalui service di `src/services/` | Panggil `apiClient` dari komponen |
| **Tipe Data** | Selalu bertipe, tidak `any` | `any` atau `@ts-ignore` |
| **Detail UI/UX** | Format Rp `toLocaleString()`, truncate teks, state disabled | Teks terpotong jelek, tombol tanpa feedback |
