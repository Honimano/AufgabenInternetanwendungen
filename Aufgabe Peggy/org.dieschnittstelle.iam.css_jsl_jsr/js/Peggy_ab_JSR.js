class Viewcontroller {
    //neuerdings mit Konstruktor ähnlich Java - keyword "constructor"
    constructor(root) {
        console.log("created view controller: " + root);
        this.root = root;
    }

    initialiseView() {
        /*this.testFadeOnPicture();*/
        console.log("hallo Testfade");
        this.prepareToggleViewmode();
        this.prepareListInteraction();
        this.prepareAddingNewElements();
    }

    /*testFadeOnPicture(){

        this.fadeElement = document.getElementById("fadepic");
        this.fadebutton = document.getElementById("fadebutton");
        //neuerdings fat arrow functions
        this.fadebutton.onclick = () => {
            this.fadeElement.classList.toggle("fade");
        }
    }*/

    prepareToggleViewmode() {

        this.bodyElement = document.querySelector("body");
        this.mainElement = document.querySelector("main");
        this.tilesButton = document.getElementsByClassName("thumbnails")[0]; // id vom Button (thumbnails die Kacheln zeigt

        console.log("meep, hier startet ToggleViewmode");

        this.tilesButton.onclick = () => { //onclick ist ein eventhandler - call back, wenn der click auf button eintritt
            let listener = () => { //funktion die was tut, asynchrone Events, lauscht, auf das Ende der fade transition
                this.mainElement.removeEventListener("transitionend", listener);//deswegen muss der transition end listener weg, ab der zweiten Runde
                // der listener darf nur einmal aufgerufen werden und muss deregistriert werden
                this.bodyElement.classList.toggle("tiles");
                this.mainElement.classList.remove("faded");
                //an der stelle würde jetzt der transitionend listener wieder aufgerufen, was doof wäre, deswegen wird er zuerst oben im Code entfernt,
            };
            this.mainElement.addEventListener("transitionend", listener);
            this.mainElement.classList.add("faded");//transition ausgelöst
            //listener auf das Ende der transition fade
            console.log("Klasse tiles getoggled");
        }

    }

    /* ok, jetzt soll das Optionen Element, also meine Css punkte  sollen bei click den Titel Mx UND die Url lorempixel.com im alert kommen
      klassen auf den Elemente: titel für Mx, website für lorempixel*/

    prepareListInteraction() {

        /*variante4 ohne Schleife mit nur einem Eventlistener auf UL* der Listener handelt alles unterhalb = ein listener für alles, statt mehrere auf Li*/
        //Lösung für beliebige Listenelemente anwendbar, oder dazukommend durch Nutzerinteraktion - für zufügen von neuen Elementen in die Liste nutzen!

        this.listRoot = this.mainElement.querySelector("ul");
        this.listRoot.onclick = (evt) => { //auf listRoot kann ein click listener, mit dem Event Mouse
            const selectedLi = this.findLiForElement(evt.target); //ich nutze die Rekursionsfunktion für das Event target
            //wenn ich auf das Listenelement clicke und aber ein Item aus der Gruppe punkte erwische, möchte ich einen
            //weiteren Fall einfügen
            const punkteID = this.findIDforSelectedElement(evt.target);
            //wenn ich die ID von der Listenzeile habe, kann ich die passende punkte klasse auslesen

            if (punkteID) {
                alert("Options: Hier die Anzeige von Titel und SeitenQuelle, wenn man auf die Punkte clickt innerhalb des Listenelementes: "
                    + "Titel: "+ this.getTitleFromLi(selectedLi)+ ", " + "Quelle:" + ", " + this.getWebsiteFromLi(selectedLi));
            }
            else if (selectedLi) {
                alert("Rest des Listenelementes zeigt nur die Titel: " + this.getTitleFromLi(selectedLi));
            } else {
                alert("something went wrong...");
            }

        }
    }

    findIDforSelectedElement(el){
        let punkteID=  el.getAttribute("Id");
        console.log("Die ID des aktuellen Punkteelementes ist " + punkteID);
        return punkteID;
    }
    /* lookupLi(el){
    if(el instanceofHTMLLIElement)return el;
    else return this.lookupLI(el.parentElement);
    }
     */

    findLiForElement(el) {
        if (el.tagName ==="LI") {
            return el;
        } else if (el.tagName === "UL") {
            return null;
        } else if (el.parentNode) {
            return this.findLiForElement(el.parentNode);
        } else {
            return null;
        }
    }

    getTitleFromLi(liElement) { //Methode um den Titel in den Li und divs zu finden nach Klassenname
        return liElement.getElementsByClassName("titel") [0].textContent;

    }
    getWebsiteFromLi(liElement){
        return liElement.getElementsByClassName("website") [0].textContent;
    }
    /* die Teile für JSR1*/
    prepareAddingNewElements(){

    }
}

//wenn die Datei vom Browser geladen wird, wollen wir Instanz der Klasse erstellen und durch Constructor Aufruf im Window auf das load event horchen, wenn
//das der Fall ist, möchte ich was tun -> initialise


window.onload = () => {
    const instance = new Viewcontroller(document.body); //beim Laden soll die Funktion initialiseView aufgerufen werden
    //arrow function/lambda Funktion in Java 8 -> gibts das jetzt auch
    //arrow function hat den Vorteil, dass man das this keyword auf die umgebende Instanz bezieht nicht auf das DOM Element
    instance.initialiseView();
}