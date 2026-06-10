export default function Explanation() {
  return (
    <section className="panel explanation" id="docs">
      <h2>Opis działania programu</h2>
      <p>
        Dla każdego dnia program bierze zapotrzebowanie brutto, odejmuje stan magazynowy, pilnuje minimalnego
        zapasu bezpieczeństwa, a brakującą ilość zaokrągla do pełnej partii produkcyjnej lub zakupowej.
        Następnie cofa planowane uruchomienie o czas produkcji albo dostawy. Dla elementów niższego poziomu
        zapotrzebowanie powstaje automatycznie z uruchomień produktów nadrzędnych.
      </p>
    </section>
  );
}
