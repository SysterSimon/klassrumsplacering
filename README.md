# Klassrumsplacering (offline, lokal)

En liten lokal webbapp (ingen backend) för att:

- redigera och spara en standardlista med elever,
- redigera och spara regler mellan elever,
- slumpa en aktuell placering i en visuell klassrumslayout,
- rensa aktuell placering utan att påverka sparad data.

## Kör lokalt

Öppna `index.html` i en webbläsare.

## Lagring

- Standardlista sparas i `localStorage` med nyckel `klassrum.standardlista.v1`.
- Regler sparas i `localStorage` med nyckel `klassrum.regler.v1`.
- Aktuell placering sparas inte permanent.

## Viktig avgränsning i version 1

`classroom-layout.js` innehåller just nu en **placeholder-layout**.
När den faktiska skissen finns måste filen uppdateras så att:

1. platskoordinater (`row`, `col`) motsvarar verklig skiss,
2. varje plats har korrekt zon/sida,
3. `oppositeSides` matchar skissens tydliga sidindelning.

Regeltypen i version 1 är enbart: två elever ska placeras i motsatta zoner.
