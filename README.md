# MRP React Calculator

Aplikacja webowa napisana w React + Vite, służąca do obliczania zapotrzebowania materiałowego zgodnie z algorytmem MRP.

Projekt działa w trybie developerskim i produkcyjnym. 

## Uruchomienie projektu

### Tryb developerski:
```bash
npm install
npm run dev
```

### Tryb produkcyjny
```bash
npm install
npm run build
npm run preview
```



## Cel aplikacji

Program pozwala zaplanować zapotrzebowanie na produkty, półprodukty i materiały na podstawie:

* struktury BOM,
* zapotrzebowania na konkretny dzień,
* czasu produkcji lub dostawy,
* stanu początkowego magazynu,
* zapasu bezpieczeństwa,
* wielkości partii produkcyjnej lub zakupowej.

Aplikacja wylicza, kiedy i ile sztuk należy wyprodukować albo zamówić, żeby pokryć zapotrzebowanie w określonym horyzoncie planowania.

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

Najważniejsze foldery:

* `components/` — komponenty interfejsu użytkownika,
* `utils/` — logika obliczeń MRP oraz eksport plików,
* `hooks/` — zapis danych w localStorage,
* `data/` — przykładowe dane startowe,
* `styles/` — pliki CSS odpowiedzialne za wygląd aplikacji.

## Najważniejsze funkcje

### 1. Wielopoziomowa struktura BOM

Aplikacja obsługuje strukturę BOM składającą się z wielu poziomów. Oznacza to, że produkt końcowy może składać się z półproduktów, a półprodukty mogą składać się z kolejnych materiałów.

Przykład:

```txt
Rower
├── Rama
│   └── Rurka stalowa
└── Koło
    ├── Opona
    └── Felga
```

Program automatycznie określa poziom każdej pozycji i liczy zapotrzebowanie od najwyższego poziomu do najniższego.

### 2. Zapotrzebowanie na wskazany dzień

Użytkownik może wskazać, ile sztuk danego produktu ma być potrzebne w konkretnym dniu.

Przykład:

```txt
Dzień 8 — 40 sztuk produktu końcowego
```

Na tej podstawie aplikacja oblicza zapotrzebowanie brutto oraz zapotrzebowanie na elementy niższych poziomów.

### 3. Czas produkcji lub dostawy

Dla każdej pozycji można określić czas produkcji albo dostawy.

Jeżeli produkt ma być gotowy w dniu 8, a czas produkcji wynosi 3 dni, aplikacja zaplanuje rozpoczęcie produkcji w dniu 5.

### 4. Stan początkowy magazynu

Każda pozycja może mieć ustawiony stan początkowy. Program najpierw wykorzystuje dostępny zapas, a dopiero później wylicza brakującą ilość.

Dzięki temu aplikacja nie planuje niepotrzebnej produkcji, jeżeli dana ilość znajduje się już na magazynie.

### 5. Safety stock

Safety stock oznacza minimalny poziom zapasu, który powinien zostać na magazynie po realizacji zapotrzebowania.

Jeżeli po odjęciu zapotrzebowania stan magazynowy spadłby poniżej safety stock, aplikacja wygeneruje dodatkowe zapotrzebowanie netto.

### 6. Produkcja i zamówienia w partiach

Dla każdej pozycji można ustawić wielkość partii.

Przykład:

```txt
Zapotrzebowanie netto: 13 sztuk
Wielkość partii: 10 sztuk
Planowane przyjęcie: 20 sztuk
```

Program zaokrągla planowaną produkcję lub zakup w górę do pełnej partii.

### 7. Wyniki MRP

Dla każdej pozycji aplikacja generuje tabelę MRP zawierającą:

* zapotrzebowanie brutto,
* planowane przyjęcia,
* przewidywany stan magazynowy,
* zapotrzebowanie netto,
* planowane uruchomienia produkcji albo zamówienia.

Wiersze MRP pokazują wynik osobno dla każdego dnia horyzontu planowania.

## Obsługa błędów i nietypowych sytuacji

### Nieprawidłowy plik JSON

Jeżeli użytkownik spróbuje zaimportować nieprawidłowy plik JSON, aplikacja pokaże komunikat błędu.

Dane w aplikacji nie zostaną nadpisane, więc użytkownik nie traci aktualnego projektu.

### Brak wymaganych danych w JSON

Jeżeli plik JSON nie zawiera wymaganych tablic `items`, `bom` oraz `demands`, aplikacja uzna plik za nieprawidłowy i nie zaimportuje go.

### Uszkodzone dane w localStorage

Aplikacja zapisuje projekt w pamięci przeglądarki. Jeżeli zapisane dane są uszkodzone albo nie da się ich odczytać, aplikacja usuwa błędny zapis i ładuje przykładowy projekt startowy.

Dzięki temu aplikacja dalej się uruchamia i nie zatrzymuje się na błędzie.

### Pętla w strukturze BOM

Jeżeli w strukturze BOM pojawi się pętla, aplikacja wykryje problem i pokaże ostrzeżenie.

Przykład błędnej struktury:

```txt
Produkt A składa się z Produktu B
Produkt B składa się z Produktu A
```

Taka sytuacja jest nielogiczna dla MRP, ponieważ produkt pośrednio wymaga samego siebie. Aplikacja informuje o błędzie, żeby użytkownik mógł poprawić strukturę BOM.

### Produkcja wymagana przed pierwszym dniem

Jeżeli czas produkcji albo dostawy jest zbyt długi, może się okazać, że produkcję trzeba byłoby rozpocząć przed dniem 1.

Przykład:

```txt
Produkt potrzebny: dzień 2
Czas produkcji: 5 dni
Wymagane uruchomienie: dzień -3
```

W takiej sytuacji aplikacja pokazuje ostrzeżenie, że część produkcji lub zamówienia powinna zostać uruchomiona przed początkiem planu.

### Puste dane

Jeżeli użytkownik usunie wszystkie pozycje, aplikacja nie przestaje działać. Zamiast tabel wynikowych pokazuje informację, że trzeba dodać pozycje i zapotrzebowanie.

### Usuwanie pozycji

Po usunięciu pozycji aplikacja automatycznie usuwa również powiązane z nią zależności BOM oraz zapotrzebowania.

Dzięki temu w projekcie nie zostają odwołania do nieistniejących produktów.

### Zakres horyzontu planowania

Horyzont planowania jest ograniczony do zakresu od 1 do 60 dni. Ma to zapobiec przypadkowemu wpisaniu zbyt dużej wartości, która mogłaby pogorszyć czytelność tabel.

## Import i eksport danych

### Eksport JSON

Eksport JSON zapisuje aktualny projekt, czyli:

* horyzont planowania,
* listę pozycji,
* strukturę BOM,
* zapotrzebowania.

Plik JSON można później ponownie zaimportować do aplikacji.

### Import JSON

Import JSON pozwala wczytać wcześniej zapisany projekt.

Aplikacja sprawdza podstawową strukturę pliku przed załadowaniem danych.

### Eksport CSV

Eksport CSV zapisuje wyniki obliczeń MRP w formacie możliwym do otwarcia np. w Excelu lub Google Sheets.

Eksport obejmuje wyniki dla wszystkich pozycji i dni.

## Zapis w przeglądarce

Aplikacja automatycznie zapisuje dane projektu w localStorage.

Oznacza to, że po odświeżeniu strony użytkownik nie traci danych. Projekt zostaje przywrócony z pamięci przeglądarki.

## Technologie

* React,
* Vite,
* JavaScript,
* CSS,

## Charakter projektu

Projekt został wykonany jako aplikacja edukacyjna pokazująca działanie algorytmu MRP w praktyce. Głównym celem jest czytelne przedstawienie zależności między zapotrzebowaniem końcowym, strukturą BOM, czasem produkcji, zapasami oraz planowanymi uruchomieniami produkcji lub zamówień.
