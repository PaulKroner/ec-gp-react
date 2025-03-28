# Frontend zum Gewaltpräventionstool des [EC Sachsen-Anhalt e.V.](https://ecsa.de/)

Die Anwendung ermöglicht das Abrufen, Anlegen, Bearbeiten und Löschen von Mitarbeitern sowie deren Nachweisen (z. B. Polizeiliches Führungszeugnis).\
Sobald ein Nachweis abläuft oder nachgereicht werden muss, werden automatisch E-Mail-Benachrichtigungen an die betroffenen Mitarbeiter versendet. Zudem ist ein Authentifizierungssystem mit Rollenverwaltung für Administratoren und Mitarbeiter implementiert, das auf JWT basiert.\
Das Frontend wurde mit React.js entwickelt, während das Backend in PHP realisiert wurde. Die Anwendung nutzt eine MySQL-Datenbank.\
Verwendete Libraries sind [Shadcn UI](https://ui.shadcn.com/), [JWT](https://auth0.com/de/learn/json-web-tokens), [TailwindCSS](https://tailwindcss.com/), [Axios](https://axios-http.com/docs/intro) und [PHPMailer](https://github.com/PHPMailer/PHPMailer)

Für die Backend Dokumentation siehe: [Backend Dokumentation](https://github.com/PaulKroner/gewaltpraevention-edv)

## Branches

Das Repository enthält zwei Branches, Main und Dev.

Main dient als Production Branch und Dev ist der Entwicklungs Branch, der auf [Localhost]() läuft.

## .env

`REACT_APP_GP_EDV_API_URL=http://localhost`\
Für die Entwicklung der App muss der Pfad, der z.B. in [Xampp](https://www.apachefriends.org/de/index.html) hinterlegt ist, angegeben werden.\
`Localhost` muss dann für die Production geändert werden, z.B. in `https://dein-server.com/api/`.

## Scripts

### `npm start` *Wichtig für Entwicklung*

Startet die App im dev mode.

In der URL des Browsers muss [http://localhost:3000](http://localhost:3000) eingeben werden, um die App zu sehen.\
Die Seite aktualisiert Änderungen automatisch. Syntax Fehler können in der Console oder in den Browser Dev Tools eingesehen werden.

### `npm test`

Startet den Test-Runner im interaktiven Watch-Modus.\
Siehe den Abschnitt über das [Ausführen von Tests](https://facebook.github.io/create-react-app/docs/running-tests) für weitere Informationen.

### `npm run build` *Wichtig für Server*

Erstellt die App für die Produktion auf dem Server im Ordner `build`.  
Dabei wird React korrekt im Produktionsmodus gebündelt und der Build für die beste Leistung optimiert.  

Der Build ist minimiert und die Dateinamen enthalten Hashes.  
Deine App ist bereit für die Bereitstellung!

Mehr zu: [Deployment](https://facebook.github.io/create-react-app/docs/deployment).

## Mehr zur React Dokumentation

[Create React App Dokumentation](https://facebook.github.io/create-react-app/docs/getting-started).

[React Dokumentation](https://reactjs.org/).