<div align="center">

# Launch Curtain

### Dal menu al gioco, senza finestre fuori posto.

Nasconde desktop, launcher e passaggi poco eleganti dietro una schermata di avvio costruita per Steam Big Picture.

[![Release](https://img.shields.io/github/v/release/LoZazaMastro/Launch-Curtain?style=for-the-badge&label=Release&labelColor=111111&color=ffffff)](https://github.com/LoZazaMastro/Launch-Curtain/releases/latest)
[![Licenza MIT](https://img.shields.io/badge/Licenza-MIT-ffffff?style=for-the-badge&labelColor=111111)](LICENSE)

</div>

<img width="100%" alt="Launch Curtain in Steam Big Picture" src="https://github.com/user-attachments/assets/8dcaf273-50da-4db1-ad2a-ca172f1627bd" />

## Un avvio da console anche su Windows

Launch Curtain copre i momenti in cui un gioco apre launcher, finestre intermedie o il desktop. La transizione parte dentro Steam, resta controllabile dal gamepad e si chiude quando il gioco raggiunge uno stato stabile a schermo intero.

Puoi scegliere fra tre modalità:

- **Moderna:** disegna la schermata direttamente nell'interfaccia Big Picture; è la modalità predefinita.
- **Classica:** usa l'overlay esterno Windows della serie 1.5.
- **Disattivata:** lascia l'avvio originale.

Le impostazioni estetiche per gioco vengono condivise fra Moderna e Classica.

## Cosa puoi personalizzare

- attivazione, ritardo di uscita e comportamento per ogni gioco;
- sfondo, opacità, posizione, scala e zoom;
- logo del gioco, posizione, dimensione e ombra;
- testo sullo stato di avvio;
- chiusura manuale da controller o tastiera;
- immagini locali, logo Steam, fallback Playhub e risultati dai provider supportati;
- **Soundbite** per gioco, con anteprima, importazione locale e volume dedicato;
- volume globale dei Soundbite nel QAM, applicato senza cambiare il valore del singolo titolo.

## Sorgenti e lavori in serie

Gli sfondi possono arrivare da PlayStation Store, IGDB, AlphaCoders, Nintendo Store, Xbox Store, iiDB Assets e SteamGridDB Heroes. SteamGridDB viene interrogato esclusivamente per gli Hero e richiede una [chiave API personale](https://www.steamgriddb.com/profile/preferences/api).

Il QAM può completare Soundbite e Asset iiDB mancanti per i giochi installati, gestire le esclusioni, mostrare i titoli con o senza Soundbite e ripulire i soli file gestiti dal plugin. Gli artwork e i file audio scelti manualmente non vengono sovrascritti o cancellati dai lavori automatici.

## Backup e ripristino

**Crea backup** salva impostazioni, asset gestiti e copie dei file locali referenziati in una cartella `Launch-Curtain-Backup-*`. **Ripristina backup** valida il contenuto prima di toccare i dati attivi, crea una copia di rollback e rimappa i percorsi locali, rendendo il backup trasferibile.

## Installazione

Puoi installare e aggiornare Launch Curtain dal Plugin Store di [Playhub](https://github.com/LoZazaMastro/Playhub), oppure manualmente:

1. scarica `Launch-Curtain_Installer-2.5.1.zip` dall'[ultima release](https://github.com/LoZazaMastro/Launch-Curtain/releases/latest);
2. abilita la modalità sviluppatore di Decky;
3. scegli **Decky → Impostazioni → Sviluppatore → Installa plugin da ZIP**;
4. dopo una sostituzione manuale, esci completamente da Steam e riaprilo: chiudere soltanto la finestra non svuota la cache del frontend.

## Sviluppo

Il sorgente mantenuto è in `src/`; `dist/index.js` è un artefatto di build.

```powershell
node tools/build-local.mjs
node --check dist/index.js
python -m py_compile main.py
```

Con le dipendenze installate sono disponibili anche `npm run test`, `npm run build` e `package-win.ps1`.

## Licenza e riconoscimenti

Launch Curtain è distribuito con licenza [MIT](LICENSE). Dipendenze e attribuzioni sono raccolte in [NOTICE](NOTICE). Gli asset ottenuti da iiDB restano soggetti alla [licenza iiSU Network](https://iisu.network/license); l'integrazione non li ripubblica sotto MIT.

Un ringraziamento al team e alla community iiSU per iiDB, i suoi artwork e i Soundbite.

<div align="center">

Creato e mantenuto da **[LoZazaMastro](https://github.com/LoZazaMastro)**.

</div>
