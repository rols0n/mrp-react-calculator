# MRP Purple Dashboard

Projekt React + Vite w trybie developerskim.

## Uruchomienie

```bash
npm install
npm run dev
```

Po uruchomieniu Vite pokaże adres aplikacji, zwykle:

```bash
http://localhost:5173
```

## Struktura projektu

```txt
src/
  components/
    bom/
    common/
    dashboard/
    docs/
    forms/
    layout/
    results/
  constants/
  data/
  hooks/
  styles/
  utils/
  App.jsx
  main.jsx
```

## Funkcje

- wielopoziomowa struktura BOM,
- czas produkcji lub dostawy,
- stan początkowy magazynu,
- zapotrzebowanie na wskazany dzień,
- zależności ilościowe między produktami,
- safety stock,
- produkcja albo zakup w partiach,
- automatyczne obliczenia MRP,
- ostrzeżenia o uruchomieniach przed dniem 1,
- import i eksport JSON,
- eksport wyników CSV,
- zapis projektu w localStorage.
