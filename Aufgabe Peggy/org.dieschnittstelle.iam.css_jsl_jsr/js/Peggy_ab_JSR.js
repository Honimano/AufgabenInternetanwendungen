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
    prepareAddingNewElements() {
        this.dolly = this.root.querySelector("ul li");
        this.dolly.parentNode.removeChild(this.dolly); /*(Element entfernen)*/
        /* wenn ich auf das Plus Item clicke, soll ein neues Objekt erzeugt werden, aber es muss der andere Listener vom togglen der Ansichten
        vom bubbling abgehalten werden*/
        const addNewElementButton = document.getElementById("plusObjekt");
        addNewElementButton.onclick= (evt) => {
            evt.stopPropagation(); /* bricht die Wanderung des Elementes ab, Event Bubbling beachten!,
             capturing Phase abgechlossen, dann bubbling abrechen*/
            //um verschiede Bilder zu bekommen mit randomfunktion, im String gelöst über Dat und Modulo
            const imgUrl = "./bilder/" + (((Date.now() % 3)+1) * 100) + "_100.jpeg";
            const newObject = {title: Date.now(), src: imgUrl};
            alert("hier soll ein Element zugefügt werden");
            this.addNewElementToLIst(newObject);
        }
    }
    addNewElementToLIst(obj){
        const ulElement = this.mainElement.getElementsByTagName("ul")[0];

        const newLi= this.dolly.cloneNode(true); //fügt die komplette Listenstruktur dazu, aber man sieht noch nichts
        //man muss jetzt die Inhalte zufügen
        newLi.querySelector("b").textContent = obj.title; //fügt Titel ein
        newLi.getElementsByTagName("img") [0].src = obj.src;

        ulElement.appendChild(newLi);
        newLi.scrollIntoView();
        //Variante 1-------------------------------
        /*const newLi= "<li #1>\n" +
            "            <div class=\"inhalt\">\n" +
            "                <div class=\"bild\" class=\"align-left\" >\n" +
            "                    <img  src=\"" + obj.src + "\">\n" +
            "                </div>\n" +
            "                <div class=\"zeilenbox\" class=\"align-left\">\n" +
            "\n" +
            "                    <div class=\"zeile1\">\n" +
            "                        <div class=\"align-left website\">lorempixel.com</div>\n" +
            "                        <div class=\"align-right datum\">10.02.2020</div>\n" +
            "                    </div>\n" +
            "\n" +
            "                    <div class=\"zeile2\" >\n" +
            "                        <div class=\"align-left titel\"> <b>M1- das ist meins</b></div>\n" +
            "                    </div>\n" +
            "\n" +
            "                    <div class=\"zeile3\">\n" +
            "                        <div class=\"play\">\n" +
            "                            <button class=\"imgbutton play align-left\">play\n" +
            "                                <div class=\"nummer\">0</div>\n" +
            "                            </button>\n" +
            "                        </div>\n" +
            "                        <div class=\"punkte\" id=\"p1\">\n" +
            "                            <button class=\"imgbutton align-right\">punkte\n" +
            "                            </button>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "\n" +
            "            </div>\n" +
            "            </div>\n" +
            "        </li>" Variante 1*/
        //Variante 2 ---------------------------------------------------------------------
        /* Variante 2  const newLi = document.createElement("li"); //Instanz eines Elementes mit dem angegebenen tag
           const img = document.createElement("img");
           //data binding
           newLi.appendChild(img);
           img.src = obj.src;
           img.classList.add("bild align-left");

           const h2 = document.createElement("h2");
           newLi.appendChild(h2);
           h2.textContent =obj.title;
           h2.classList.add("align-left");
           /* divs in Variablen packen und damit unterscheiden
           const button = document.createElement("button");
           newLi.appendChild(button);
           button.setAttribute("class", "imgbutton add align-right");

           ulElement.appendChild(newLi);
           /* damit auf der Seite auf das neu eingefügte Listen Item fokussiert wird, bzw hingesprungen
           newLi.scrollIntoView(); Variante2 */

        /*ulElement.innerHTML += newLi; /* neues Element zu dem alten LI dazufügen Variante1*/
        //Variante 3---------------------------------------------------------------------KLONE


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