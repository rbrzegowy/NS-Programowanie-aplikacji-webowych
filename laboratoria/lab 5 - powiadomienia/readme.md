### Powiadomienia
- Zaprojektuj serwis powiadomień w aplikacji.
- Zaimplementuj komponent licznika nieprzeczytanych powiadomień (np. przy imieniu/nazwisku zalogowanej osoby).
- Zaimplementuj widok wszystkich (nawigacja do widoku po kliknięciu w licznik oraz link w menu) oraz pojedynczego powiadomienia
- Wiadomość zostaje oznaczona jako przeczytana po akcji użytkownika (np. "oznacz jako przeczytane") oraz po wejściu na widok szczegółów powiadomienia.
- Zaimplementuj komponent okna dialogowego z powiadomieniami (pokazuje się od razu przy wysłaniu powiadomienia, tylko dla powiadomień o prority 'medium' i 'high')
- Zaimplementuj przykładowe powiadomienia w aplikacji:
  - Utworzono nowy projekt (high, otrzymuje każdy admin)
  - Przypisanie osoby do historyjki/zadania (high)
  - Nowe zadanie w historyjce (medium, otrzymuje właściciel historyjki)
  - Usunięcie zadania z historyjki (medium, otrzymuje właściciel historyjki)
  - Zmiana statusu zadania w historyjce (status zadania done - priorytet medium, status doing - priorytet low, otrzymuje właściciel historyjki)
- Zapamiętaj listę powiadomień 
#### Model powiadomienia
Powiadomienie posiada:
 - tytuł
 - treść
 - datę utworzenia
 - priorytet (low, medium, high)
 - flagę "przeczytane"
 - id osoby do której jest przesłane powiadomienie

Minimum:  
```js
type ISOString = string // lub np. number
type UserID = string
type Notification = {
  title: string,
  message: string,
  date: ISOString,
  prority: 'low'|'medium'|'high',
  isRead: boolean,
  recipientId: UserID
  }
```
