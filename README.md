# Simons placeringsgenerator

Liten, helt offline-baserad lokal webbapp för klassrumsplacering.

## Vad som finns i versionen

- Standardlista med elever (lägg till, ta bort, spara lokalt).
- Sidregler mellan elever (motsatta sidor).
- Platsbegränsningar per elev via explicita platsnummer.
- Visuell klassrumslayout enligt given 28-plats-skiss.
- Väntesekvens vid slumpning: 3 sek nedräkning + 2 sek laddningsindikator.

## Lokal lagring

- `klassrum.standardlista.v1` (elevlista)
- `klassrum.regler.v1` (sidregler)
- `klassrum.platsbegransningar.v1` (platsbegränsningar)

Aktuell placering sparas inte permanent.

## Zonlogik för sidregel

- vänster zon: 01-09
- mittzon: 10-15
- höger zon: 16-24
- bakzon: 25-28

Regeln "motsatta sidor" använder endast vänster ↔ höger.
Mittzon och bakzon räknas som separata zoner (inte motsatta sidor).

## Kör lokalt

Öppna `index.html` i en webbläsare.
