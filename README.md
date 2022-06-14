# UNGUESS CORE API - BLOCKS

Questo è il progetto iniziale per la definizione di un API di comunicazione tra i componenti del core di UNGUESS.

L'obiettivo è quello di definire una serie di blocchi che possono essere utilizzati per costruire i servizi di UNGUESS. Ogni servizio potrà contare su un numero variabile di blocchi permettendoci di adattarci ad ogni necessità.

I blocchi base ma non unici che costituiscono un servizio sono:

- Blocco [Quests](#quests): Elenco di missioni da svolgere, richiede il rispetto di determinate condizioni di accesso per poterne prendere parte.
- Blocco [Costs](#costs): Elenco di blocchi di costo che possono essere automaticamente calcolati dal sistema (es: determinato dalle quests) o inserito a mano dall'utente (es: campagna pubblicitaria facebook, costo in giornate del csm).
- Blocco [Price](#price): Prezzo del servizio.
- Blocco [Taxonomies](#taxonomies): Elenco di taxonomie che possono essere utilizzate per raggruppare un servizio. Non ha impatto sull'esecuzione del servizio, ma è utile solo a fini statistici.

```mermaid
  graph TD;
      Service-->Quest1;
      Service-->Quest2;
      Service-->Price;
      Service-->Costs;
      Service-->Taxonomies;
      Quest1-->StepBugFinding;
      Quest1-->StepThinkingAloud;
      Quest2-->StepBugFinding;
      Quest2-->Survey;

```

## Quests
E' l'elemendo fondamentale del servizio, corrisponde all'attività che si vuole completare ed è formata da un elenco di blocchettini di tipo [Step](#step). 

Prevede una serie di condizioni di accesso che determinano la partecipazione del tester e l'impatto sul costo del servizio.

### Condizioni di accesso alla quest


### Step
Il blocco di tipo [Step](#step) è una singola attività da svolgere con uno specifico output. Inizialmente sono previste tre tipologie di step:
- BugForm Step
- Survey Step
- Media Step


## Costs
TBD

## Price
TBD

## Taxonomies
TBD

## Description
TBD STRAPI DOC


---

```mermaid
  sequenceDiagram
    Customer Platform->>+Core: Require service
    Core-->>-Tester Platform: Publish quests on Tryber
    Tester Platform->>+Core: Retrieve outputs
    Core->>+Customer Platform: Keep customer updated
    Core-->>-Tester Platform: Award testers
```
