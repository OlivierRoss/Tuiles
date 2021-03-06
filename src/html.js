var xTuilesElement = class extends XTagElement {
  '::template' (){`
        <style>
            .carre {
                transform-origin: 50% 50%;
                transform: rotate(45deg);
            }
            @keyframes blink {
               50% { stroke: #ff0000; stroke-width: 3px; }
            }
            .blink {
                animation: blink .5s step-end infinite alternate !important;
            }
            .counter-container {
                position: relative;
                height: 25px;
                margin: 5px;
            }
            .sample {
                position: relative;
                width: 60%;
                height: 16px;
                border: 1px solid black;
                border-radius: 5px;
                float: left;
            }
            .counter {
                position: relative;
                width: 25%;
                height: 20px;
                float: right;
            }
            .container-echantillon-v:hover, .container-echantillon-h:hover, .selected {
                background-color: white;
            }
            .container-echantillon-v {
                position: relative;
                height: 30px;
                width: 100%;
            }
            .container-echantillon-h {
                position: relative;
                float: left;
                height: 100%;
            }
            .echantillon {
                position: relative;
                width: calc(100% - 10px);
                height: calc(100% - 10px);
                margin: 5px;
                display: inline-block;
            }
            .compteur {
                text-align: center;
                height: 30px;
                padding: 5px;
            }
            #canvas {
                position:relative;
                width: 100%;
                height: calc(100% - 60px);
            }
            #header {
                position: relative;
                height: 30px;
                background-color: grey;
            }
            #footer {
                position: relative;
                height: 30px;
                background-color: grey;
            }
            #conteneur-menu, #clear-container, #save-symbol-container {
                position: relative;
                padding: 6px;
                width: 20px;
                float: left;
            }
            #mode-menu {
                position: relative;
                margin-top: 7px;
                width: 100px;
                float: right;
            }
            #input-text-container {
                display: none;
                position: relative;
                padding: 5px;
                width: 100px;
            }
            #hauteur, #largeur {
                width: 40px;
                float: right;
                border-radius: 5px;
            }
            #conteneur-final {
                position: absolute;
                right: 5px;
                top: 8px;
                width: 30px;
            }
            .fa-bars, .fa-arrows-v, .fa-arrows-h, .fa-download, .fa-upload, .fa-check, .fa-file-pdf-o, .fa-font, .fa-toggle-on, .fa-toggle-off, .fa-pencil, .fa-repeat {
              color: white;
              cursor: pointer;
            }
            #conteneur {
                position: absolute;
                left: 0px;
                top: 0px;
                bottom: 0px;
                right: 0px;
                transition: left 0.5s ease;
            }
            #menu {
                position: absolute;
                left: -150px;
                top: 0px;
                bottom: 0px;
                width: 0px;
                background-color: grey;
                overflow: auto;
                transition: left 0.5s ease;
            }
            .dropdown {
                position: relative;
                display: block;
                color: white;
                background: #2980B9;
                -moz-box-shadow: 0 1px 0 #409ad5 inset, 0 -1px 0 #20638f inset;
                -webkit-box-shadow: 0 1px 0 #409ad5 inset, 0 -1px 0 #20638f inset;
                box-shadow: 0 1px 0 #409ad5 inset, 0 -1px 0 #20638f inset;
                text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.3);
                padding: 10px;
            }
            ul {
                padding: 0px;
                margin: 0px;
                list-style-type: none;
            }
            #color-selector-h {
                width: 100%;
                height: 100%;
            }
            #color-selector-v {
                position: absolute;
                right: 10px;
                top: -200px;
                height: 200px;
                width: 100px;
                overflow: auto;
                display: none;
                background-color: grey;
            }
        </style>
        <div id="menu">
            <ul>
                <li class="dropdown">
                    <div style="width: 20px; margin: 0 auto;"><i class="fa fa-paint-brush" title="Statistiques sur l'utilisation des couleurs"></i></div>
                    <ul id="counter-container" class="dropdown-menu"></ul>
                </li>
                <li class="dropdown">
                    <div style="width: 20px; margin: 0 auto;"><i class="fa fa-arrows-alt" title="Taille de la cloture de travail"></i></div>
                    <ul id="counter-container" class="dropdown-menu">
                        <li style="height: 25px; padding: 5px;">
                            <label for="hauteur"><i class="fa fa-arrows-v" title="Hauteur"></i></label>
                            <input type="number" id="hauteur" value="20">
                        </li>
                        <li style="height: 25px; padding: 5px;">
                            <label for="largeur"><i class="fa fa-arrows-h" title="Largeur"></i></label>
                            <input type="number" id="largeur" value="50">
                        </li>
                        <li style="height: 25px; padding: 5px;">
                            <input id="background-image" type="file" style="display: none;">
                            <div id="open-background-upload" style="width: 20px; margin: 0 auto;"><i class="fa fa-camera" title="Image d'arriere-plan"></i></div>
                        </li>
                    </ul>
                </li>
                <li class="dropdown">
                    <div style="width: 20px; margin: 0 auto;"><i class="fa fa-floppy-o" title="Sauvegardes et chargement"></i></div>
                    <ul id="counter-container" class="dropdown-menu">
                        <li style="height: 25px; padding: 5px;">
                            <i id="pdf" class="fa fa-file-pdf-o" style="float: left; width: 33%; text-align: left;" title="Exportation en format SVG"></i>
                            <i id="export" class="fa fa-lg fa-download" style="float: left; width: 33%; text-align: center;" title="Enregistrer"></i>
                            <i id="open" class="fa fa-lg fa-upload" style="float: left; width: 33%; text-align: right;" title="Ouvrir"></i>
                            <input id="upload-file" type="file" style="display: none;">
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div id="conteneur">
            <div id="header">
                <div id="conteneur-menu"><i id="bouton-menu" class="fa fa-lg fa-bars" title="Afficher le menu"></i></div>
                <div id="clear-container"><i id="clear" class="fa fa-lg fa-repeat" title="Effacer"></i></div>
                <div id="save-symbol-container"><i id="save-symbol" class="fa fa-lg fa-check" title="Effacer"></i></div>
                <div id="mode-menu">
                    <i id="mode-toggler-text" class="fa fa-lg fa-font" title="Mode texte"></i>
                    <i id="mode-toggler" class="fa fa-lg fa-toggle-on" style="padding: 0 10px;"></i>
                    <i id="mode-toggler-manual" class="fa fa-lg fa-pencil" title="Mode manuel"></i>
                </div>
            </div>
            <div id="canvas" style="background-size: 100% 100%;">
                <svg xmlns="http://www.w3.org/2000/svg" id="svg" width="100%"></svg>
            </div>
            <div id="footer">
                <div id="input-text-container"><input id="input-text" type="text"></div>
                <div id="color-selector-h"></div>
                <div id="color-selector-v"></div>
                <div id="color-selector-displayer" style="position: absolute; top: 0px; bottom: 0px; right: 0px; width: 9.09091%; display: none;">
                    <div id="active-sample" class="echantillon" style="background-color: black;"></div>
                </div>
            </div>
        </div>
   ` 
  }
};
