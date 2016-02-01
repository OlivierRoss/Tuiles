xTuilesElement.methods = {
    updateBackgroundImage: function () {
        readUrlAsData(document.getElementById("background-image").files[0], function (file) {
            document.getElementById('canvas').style.backgroundImage = "url(" + file + ")";        
        });
    },
    writeExtraitMatrice: function (x, y, matrice) { // Pour ecrire lettres
        var me = this;
        matrice.forEach(function (line, indexLigne) {
            line.forEach(function (tuile, indexColonne) {
                me.matrice[x + indexLigne][y + indexColonne] = tuile; 
            });
        });
        this.dessiner();
    },
    drawComponents: function () {
        var svg = this.svg.node();
        var canvas = this.canvas.node();
        svg.offsetWidth = canvas.offsetWidth;
        this.dessiner();
    },
    toggleMenu: function () {
        var menu = document.getElementById("menu");
        var conteneur = document.getElementById("conteneur");
        if(this.menuHidden){
            conteneur.style.left = this.menuWidth;
            menu.style.left = "0px";
        }
        else {
            conteneur.style.left = "0px";
            menu.style.left = "-" + this.menuWidth;
        }

        document.getElementById("conteneur").style.left = document.getElementById("menu").style.width = this.menuHidden ? "100px": "0px" ;
        for(var i = 200; i < 1000; i+= 200) window.setTimeout(this.drawComponents.bind(this), i);
        this.menuHidden = !this.menuHidden;
    },
    calculerMetriques: function () {
        // Constantes
        this.nblignes = (this.hauteur.value * this.carresparpied * 2) - 1;
        this.nbcarresligne = this.largeur.value * this.carresparpied;

        // Calcul de cote
        var canvas = this.canvas.node();
        this.diagonale = Math.min((canvas.offsetWidth - 2) / this.nbcarresligne, (canvas.offsetHeight - 2) / ((this.nblignes / 2) + 0.5));
        this.cote = diagonal2Side(this.diagonale);
        this.decalageRotation = (this.diagonale - this.cote) / 2;
    },
    dessiner: function () {
        this.calculerMetriques();
        this.lignes = this.matrix.extract(this.nblignes, this.nbcarresligne);
        //this.resetHandicap();
        this.nettoyer();
        this.afficher();
        this.afficherDecompte();
    },
    nettoyer: function () {
        this.svg.selectAll("g.ligne").remove();
    },
    resetHandicap: function () {
        for(var c in this.couleurs){
            this.couleurs[c].handicap = 0;
        }
    },
    afficher: function () {
        var me = this;

        // Creation des lignes
        var groupes = this.svg.selectAll("g.ligne").data(this.lignes).enter().append("g")
        .attr("index", function (d, i) { return i })
        .attr("class", "ligne")
        .attr("index", function (d, i) { return i})
        .attr("transform", function (d, i) {
            if(i % 2 === 0){
                return "translate(0, " + me.diagonale * i / 2 + ")" 
            }
            else {
                return "translate(" + me.diagonale / 2 + ", " + me.diagonale * i / 2 + ")" 
            }
        });

        // Creation des carres
        groupes.selectAll("rect").data(function(d) { return d; }).enter().append("rect") 
        .attr("index", function (d, i) { return i })
        .attr("class", "carre")
        .attr("index", function (d, i) { return i})
        .attr("height", this.cote)
        .attr("width", this.cote)
        .attr("x", function (d, i) { return (i * me.diagonale) + me.decalageRotation})
        .attr("y", this.decalageRotation)
        .attr("fill-opacity", function(d) { return d.opacity})
        .attr("fill", function(d) { return d.fill })
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .on("mousedown", function () { me.changecolor.call(this, me)} )
        .on("mouseover", function () { if(me.sourisenfoncee) me.changecolor.call(this, me)});
    },


    ///// Sauvegarde + enregistrement /////
    export: function () {
        var sauvegarde = {};
        sauvegarde.couleurs = this.couleurs;
        sauvegarde.matrice = this.matrice;
        var blob = new Blob([JSON.stringify(sauvegarde)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, window.prompt("Nom du fichier: ") + ".txt");
    },
    finalExport: function () {
        window.prompt("Copier dans le presse-papier avec CTRL-C et sauvegardez dans un document sur votre bureau", JSON.stringify(getSmallestMatrix(this.matrice)));
    },
    pdf: function () {
        saveSvgAsPng(document.getElementById("svg"), "cloture");
    },
    loadFile: function () {
        var me = this;
        readUrlAsText(document.getElementById("upload-file").files[0], function (text) { 
            me.loadConfiguration(JSON.parse(text));
            console.log(JSON.parse(text));
        });
    },
    loadConfiguration: function (config) {
        this.matrice = config.matrice;
        this.couleurs = config.couleurs;
        this.dessiner();
    },
    //--- Sauvegarde + enregistrement ---//

    ///// Couleurs /////
    changerCouleur: function (ev) {
        this.setSelectedColor(ev.currentTarget);
    },
    setSelectedColor: function (element) {
        var nodes = document.querySelectorAll(".container-echantillon.selected");
        for(var i = 0; i < nodes.length; ++i){
            nodes[i].className = "container-echantillon";
        }
        element.className += " selected";
        this.couleur = element.id;
    },
    ajouterCouleurs: function (couleurs) {
        var me = this;
        couleurs.forEach(function (couleur) {
            me.couleurs[couleur.code] = {
                compte: 0,
                handicap: 0,
                nom: couleur.nom,
                code: couleur.code,
                traduction: {}
            }
        });
    },

    afficherDecompte: function () {
        var decompte = "";
        for(var c in this.couleurs){
            var couleur = this.couleurs[c];
            document.getElementById(couleur.code + "-counter").innerHTML = couleur.compte - couleur.handicap;
        }
    },
    changecolor: function (me) {
        var element = d3.select(this);
        var couleur = me.getCouleur.call(me);
        var datum = me.matrix.get(element.node());

        if(datum.opacity == 0 && couleur.opacity == 0) return; // pas de changement
        else if(datum.opacity == 0 && couleur.opacity != 0){ // nouvelle case
            element.attr("fill", couleur.fill);
            element.attr("fill-opacity", couleur.opacity);
            ++me.couleurs[couleur.fill].compte;
        }
        else if(datum.opacity != 0 && couleur.opacity == 0){ // efface
            --me.couleurs[couleur.fill].compte;
            element.attr("fill", couleur.fill);
            element.attr("fill-opacity", couleur.opacity);
        }
        else { // changement couleur
            --me.couleurs[couleur.fill].compte;
            element.attr("fill", datum.fill);
            element.attr("fill-opacity", datum.opacity);
            ++me.couleurs[couleur.fill].compte;
        }
        me.matrix.updateCell(element.node(), couleur.fill, couleur.opacity);
        me.afficherDecompte();
    },
    getCouleur: function () {
        return {fill: this.couleur, opacity: d3.event.altKey ? 0 : 1};
    },
    createColorCounter: function (color) {
        var li = document.createElement("li"); 
        li.id = color + "-counter-container";
        li.setAttribute("class", "counter-container");
        li.innerHTML = '<div id="' + color + '-sample" class="sample" style="background-color: ' + color + '"></div><div id="' + color + '-counter" class="counter"></div>'
        document.getElementById("counter-container").appendChild(li);
    },
    createPickerSample: function (color, width) {
        var div = document.createElement("div");
        div.id = color.code;
        div.setAttribute("class", "container-echantillon");
        div.setAttribute("style", "width:" + width + "%;");
        div.innerHTML = '<div class="echantillon" style="background-color: ' + color.code + ';"></div>';
        div.onclick = this.changerCouleur.bind(this);
        document.getElementById("footer").appendChild(div);
        color.element = div;
    }
    //--- Couleurs ---//
}

