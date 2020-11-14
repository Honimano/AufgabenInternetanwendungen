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
        this.removeAllElementsFromList();
        this.loadDataFromServerAndPopulateList();
    }

    /*testFadeOnPicture(){

        this.fadeElement = document.getElementById("fadepic");
        this.fadebutton = document.getElementById("fadebutton");
        //neuerdings fat arrow functions
        this.fadebutton.onclick = () => {
            this.fadeElement.classList.toggle("fade");
        }
    } hier habe ich ein Testbild zwischendurch implementiert um zu sehen wie fade funktioniert*/

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
                let check = confirm("Du hast ein Listenelement ausgewählt: "
                    + "Titel: "+ this.getTitleFromLi(selectedLi)+ ", " + "Quelle:" + ", " + this.getWebsiteFromLi(selectedLi) +":" + " "+
                "Möchtest Du dieses Element löschen? Dann click auf OK!");
                if (check === true) {
                   let löschen = this.findLiForElement(evt.target);
                   löschen.remove();
                }
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
    prepareAddingNewElements() {
        this.dolly = this.root.querySelector("ul li");
        this.dolly.parentNode.removeChild(this.dolly); /*(Element entfernen) - alternativ mit template element ab 0:45 10te Vorlesung*/
        /* wenn ich auf das Plus Item clicke, soll ein neues Objekt erzeugt werden, aber es muss der andere Listener vom togglen der Ansichten
        vom bubbling abgehalten werden - stop propagation*/
        const addNewElementButton = document.getElementById("plusObjekt");
        addNewElementButton.onclick= (evt) => {
            evt.stopPropagation(); /* bricht die Wanderung des Elementes ab, Event Bubbling beachten!,
             capturing Phase abgechlossen, dann bubbling abrechen*/
            //um verschiede Bilder zu bekommen mit randomfunktion, im String gelöst über Dat und Modulo
            const imgUrl = "./bilder/" + (((Date.now() % 3)+1) * 100) + "_100.jpeg"; //Randomfunktion über aktuelles Datum und Modulo
            const website = document.getElementsByClassName("website")[0];
            const nummer = document.getElementsByClassName("nummer")[0];
            const titel = "lorem ipsum";
            /* hier wird das Datum in lesbarer Form aus dem aktuellen Datum generiert*/
            let datum = new Date();
            let tag = datum.getDate();
            let monat = datum.getMonth();
            let jahr = datum.getFullYear();
            let date = tag + "." + monat + "." + jahr;
            /* eine Random Funktion im Intervall[0,10[, damit die Tag Names in den zugefügten Objekten nicht so langweilig sind*/
            let min = 0;
            let max = 10;
            let random = Math.floor(Math.random() * (max-min)) + min;
            /* Quelle: https://wiki.selfhtml.org/wiki/JavaScript/Tutorials/Zufallszahlen*/
            const newObject = { title: titel , src: imgUrl, added: date , numOfTags: random , owner:"lorempixel.com"};
           /* alert("hier soll ein Element zugefügt werden");*/
            this.addNewElementToLIst(newObject);
        }
    }
    addNewElementToLIst(obj){
        const ulElement = this.mainElement.getElementsByTagName("ul")[0];

        const newLi= this.dolly.cloneNode(true); //fügt die komplette Listenstruktur dazu, aber man sieht noch nichts
        //man muss jetzt die Inhalte zufügen
        newLi.querySelector("b").textContent = obj.title; //fügt Titel ein
        newLi.getElementsByTagName("img") [0].src = obj.src;
        newLi.getElementsByClassName("website") [0].textContent = obj.owner;
        newLi.getElementsByClassName("nummer") [0].textContent = obj.numOfTags;
        newLi.getElementsByClassName("datum") [0].textContent=obj.added;



        ulElement.appendChild(newLi);
        newLi.scrollIntoView();

    }
    /* Funktion um die Liste zu leeren, ohne die Seite zu laden*/
    removeAllElementsFromList(obj){
        const removeElement = document.getElementsByClassName("refresh")[0];
        removeElement.onclick = () =>{
            this.root.querySelector("ul").innerHTML="";
            this.loadDataFromServerAndPopulateList();
        }

    }

    /* Laden der Daten vom Server*/

        loadDataFromServerAndPopulateList() {
        xhr("GET", "data/listitems.json", null, (xhrobj) => {
           // alert("xhrobj: " + xhrobj.responseText);
            const objs = JSON.parse(xhrobj.responseText);
            //alert("objs: " + JSON.stringify(objs));
            objs.forEach(obj => {
                this.addNewElementToLIst(obj);
            })
        }); /* Funktion bewirkt, dass ein GET Request an den Server gesendet wird, lokaler Server oder Node JS Server*/
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