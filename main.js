colorSchemes = [
    ["#DBE4EE", "#81A4CD", "#3E7CB1", "#054A91"],
    ["#FAF4D3", "#176164", "#F5C800", "#0C1618"],
    ["#BEABD3", "#FBF4FB", "#6D466B", "#4d283e"],
    ["#FFF5E0", "#FF6969", "#C70039", "#141E46"],
    ["#F8E44F", "#F94C10", "#C70039", "#900C3F"],
    ["#F7F1E5", "#E7B10A", "#898121", "#4C4B16"]
]


let generateOnChange = false;
let openedColorSchemes = false;
let selectedColorSceme = [];

let schemesOpenAnim;
let schemesCloseAnim;
let curAnimScheme = 0;

let genSand;
let genIters;
let noEffectSandAmount = 0;
let noEffectItersCount = 0;

drawSchemes();

selectColorScheme(colorSchemes[0], false);

window.onload = function loaded(){
    startCanvas();
    generateButton();
}

function generateButton(){
    let startSand = document.getElementById("start-sand-slider").value;
    let maxIters = document.getElementById("max-iters-slider").value;
    generate(startSand, maxIters, selectedColorSceme);
}

function filterNumberInput(input, limit){
    input.value = input.value.replace(/[^0-9]/g, '');
    if(input.value != ""){
        if(limit < parseInt(input.value)){
            input.value = limit;
        }
    }
}

function generateOnChangeTick(){
    generateOnChange = !generateOnChange;

    if(generateOnChange){
        document.getElementById("checkbox-replacement-t").classList.remove("hide");
        document.getElementById("checkbox-replacement-f").classList.add("hide");
    }
    else{
        document.getElementById("checkbox-replacement-t").classList.add("hide");
        document.getElementById("checkbox-replacement-f").classList.remove("hide");
    }
}

function settingChanged(){
    if(generateOnChange){
        generateButton();
    }
}

function dropdownColors(){
    openedColorSchemes = !openedColorSchemes;

    if(openedColorSchemes){
        openColorsDropdown();
        document.getElementById("dropdown-replacement-t").classList.remove("hide");
        document.getElementById("dropdown-replacement-f").classList.add("hide");
    }
    else{
        closeColorsDropdown();
        document.getElementById("dropdown-replacement-t").classList.add("hide");
        document.getElementById("dropdown-replacement-f").classList.remove("hide");
    }
}

function openColorsDropdown(){
    if(schemesOpenAnim != null) clearInterval(schemesOpenAnim);
    if(schemesCloseAnim != null) clearInterval(schemesCloseAnim);

    const schemesList = document.getElementById("schemes-list");
    schemesList.style.display = "block";

    schemesOpenAnim = setInterval(function () {
        const schemesList = document.getElementById("schemes-list");
        schemesList.children.item(curAnimScheme).style.display = "block";
        curAnimScheme++;
        if(curAnimScheme >= schemesList.children.length){
            curAnimScheme = schemesList.children.length - 1;
            clearInterval(schemesOpenAnim);
        }
    }, 10);
}

function closeColorsDropdown(){
    if(schemesOpenAnim != null) clearInterval(schemesOpenAnim);
    if(schemesCloseAnim != null) clearInterval(schemesCloseAnim);

    const schemesList = document.getElementById("schemes-list");

    schemesCloseAnim = setInterval(function () {
        const schemesList = document.getElementById("schemes-list");
        schemesList.children.item(curAnimScheme).style.display = "none";
        curAnimScheme--;
        if(curAnimScheme < 0){
            curAnimScheme = 0;
            schemesList.children.item(curAnimScheme).style.display = "none";
            clearInterval(schemesCloseAnim);
        }
    }, 10);
}

function drawSchemes(){
    const schemesList = document.getElementById("schemes-list");
    for(let i = 0; i < colorSchemes.length; i++){
        const separator = document.createElement("div");
        separator.classList.add("separator");
        separator.style.display = "none";
        schemesList.appendChild(separator);

        const colors = colorSchemes[i];

        const colorsButton = document.createElement("button");
        colorsButton.classList.add("colors-button");
        colorsButton.style.display = "none";
        colorsButton.onclick = () => {selectColorScheme(colorSchemes[i], true)};

        const colorsContainer = document.createElement("div");
        colorsContainer.classList.add("colors-container");
        colorsButton.appendChild(colorsContainer);

        for(let k = 0; k < colors.length; k++){
            const colorInScheme = document.createElement("div");
            colorInScheme.classList.add("color-in-scheme");
            colorsContainer.appendChild(colorInScheme);

            const square = document.createElement("div");
            square.classList.add("square");
            square.style.backgroundColor = colors[k];
            square.style.border = "2px #9480ab solid";
            colorInScheme.appendChild(square);
        }

        schemesList.appendChild(colorsButton);
    }
}

function selectColorScheme(colorScheme, redraw){
    selectedColorSceme = []
    for(let i = 0; i < colorScheme.length; i++){
        selectedColorSceme.push(colorScheme[i]);
        document.getElementById("color-" + i).value = colorScheme[i];
    }

    if(redraw){
        drawGrid();
    }
}

function colorsUpdated(colorId){
    let val = document.getElementById("color-" + colorId).value;
    selectedColorSceme[colorId] = val;
    drawGrid();
}

function generateRandom(){
    const sand = Math.floor(Math.random() * 2000);
    let iters = Math.floor(Math.random() * 1000);
    if(Math.random() < 0.4){
        iters = Math.floor(Math.random() * 500);
    }

    document.getElementById("start-sand-slider").value = sand;
    document.getElementById("max-iters-slider").value = iters;

    const newColorSchemeIdx = Math.floor(Math.random() * colorSchemes.length);
    selectColorScheme(colorSchemes[newColorSchemeIdx], false);
    generate(sand, iters)
}

function noEffectSand(state){
    if(state){
        noEffectSandAmount = 1;
        document.getElementById("no-effect-sand").style.visibility = "visible";
    }
    else{
        noEffectSandAmount = 0;
        document.getElementById("no-effect-sand").style.visibility = "hidden";
    }
}

function noEffectIters(state){
    if(state){
        noEffectItersCount = 1;
        document.getElementById("no-effect-iters").style.display = "block";
    }
    else{
        noEffectItersCount = 0;
        document.getElementById("no-effect-iters").style.display = "none";
    }
}

function sandChanged(){
    if(noEffectSandAmount == 1){
        if(document.getElementById("start-sand-slider").value < genSand){
            noEffectSand(false);
        }
    }

    if(noEffectItersCount == 1){
        if(document.getElementById("start-sand-slider").value > genSand){
            noEffectIters(false);
        }
    }
}

function itersChanged(){
    if(noEffectItersCount == 1){
        if(document.getElementById("max-iters-slider").value < genIters){
            noEffectIters(false);
        }
    }

    if(noEffectSandAmount == 1){
        if(document.getElementById("max-iters-slider").value > genIters){
            noEffectSand(false);
        }
    }
}

