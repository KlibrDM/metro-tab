$(document).ready(function(){
    setCookies();
});

function setCookies(){
    var once = 0;
    setTimeout(function(){
        var issetup = getCookie('ft');
        if(issetup && once==0){
            once = 1;
            setSettings();
        }
    }, 250);
}

function setSettings(){
    document.getElementById('set_yourName').value = getCookie('yourName');

    if(getCookie('isBackgroundWhite')){
        document.getElementById('set_isBackgroundWhite').checked = true;
    }

    if(getCookie('fillEntirePage')){
        document.getElementById('set_fillEntirePage').checked = true;
    }

    if(getCookie('mobileVersion')){
        document.getElementById('set_mobileVersion').checked = true;
    }

    document.getElementById('set_navbarOpacity').value = getCookie('navbarOpacity');

    var navbarColor = getCookie('navbarColor');
    navbarColor = JSON.parse(navbarColor);
    document.getElementById('set_navbarColorR').value = navbarColor.r;
    document.getElementById('set_navbarColorG').value = navbarColor.g;
    document.getElementById('set_navbarColorB').value = navbarColor.b;

    var coverColor = getCookie('coverColor');
    coverColor = JSON.parse(coverColor);
    document.getElementById('set_coverColorR').value = coverColor.r;
    document.getElementById('set_coverColorG').value = coverColor.g;
    document.getElementById('set_coverColorB').value = coverColor.b;

    var coverTextColor = getCookie('coverTextColor');
    coverTextColor = JSON.parse(coverTextColor);
    document.getElementById('set_coverTextColorR').value = coverTextColor.r;
    document.getElementById('set_coverTextColorG').value = coverTextColor.g;
    document.getElementById('set_coverTextColorB').value = coverTextColor.b;

    setpageslist();
}

function setbackgroundslist(){
    for(var j=0;j<backgrounds.length;++j){
        var html = `
            <img src="img/bg/`+backgrounds[j]+`.jpg" alt="Background`+(j+1)+`" id="set_backgroundImage_`+j+`" class="backgroundImageSelector"/>
        `;
        $("#settingsbackgroundselector").append(html);  
        seteventforbackgroundselector(j);
    }
}

function setpageslist(){
    var pages = getCookie('pages');
    pages = JSON.parse(pages);
    for(var i=0;i<pages.length;++i){
        var checked = "";
        if(pages[i][2]){checked = "checked";} //set as active if it is
        pagestext = pages[i][0].substring(0,60);
        var html = `
        <div class="settingslabel pageslist_settings"><label>`+pagestext+`</label>
            <input type="checkbox" class="pagecheckbox" value="1" id="set_pagebox_`+i+`" `+checked+`>
        `;

        //we need this only if it's unchecked
        var html2 = `
            <input type="button" class="pagedeletebutton" value="X" id="delete_pagebox_`+i+`">
        `;

        var html3 = `
        </div>
        `;

        if(checked == "checked"){
            $("#settingsalreadyexistingpages").append(html+html3);
        }
        else{
            $("#settingsalreadyexistingpages").append(html+html2+html3);
            seteventforpageboxdeleter(i);
        }
    }
}

function removepageslist(){
    while($(".pageslist_settings").length){
        $(".pageslist_settings").remove();
    };
    document.getElementById('set_newPageBox').value = ""; //Clear input field after save
}

function seteventforbackgroundselector(j){
    var backgroundImageInput = [];
    backgroundImageInput[j] = document.getElementById("set_backgroundImage_"+j);
    backgroundImageInput[j].addEventListener("click", function(){
        setCookie('backgroundImage',backgrounds[j],9999);
        setdifferentversions();
    });
}

function seteventforpageboxdeleter(i){
    var deleteButton = [];
    deleteButton[i] = document.getElementById("delete_pagebox_"+i);
    deleteButton[i].addEventListener("click", function(){
        var pages = getCookie('pages');
        pages = JSON.parse(pages);
        pages.splice(i,1);
        setCookie('pages',JSON.stringify(pages),9999);

        //update pages list
        removepageslist();
        setpageslist();
    });
}

function extractwebsite(link){
    var sitename = link;
    sitename = sitename.substring(sitename.indexOf("://")+3);
    if(sitename.substring(0,3)=="www"){
        sitename = sitename.substring(4);
    }
    sitename = sitename.substring(0, sitename.lastIndexOf("."));
	if(sitename.slice(-3) == ".co"){
        sitename = sitename.substring(0, sitename.lastIndexOf(".")); //Do it twice for those that have .co
    }
    return sitename;
}

//Show settings
var settingsbutton = document.getElementById("settingsbutton");
var showbackgroundsonlyonce = 0;
settingsbutton.addEventListener("click", function(){
    if(!showbackgroundsonlyonce){setbackgroundslist();showbackgroundsonlyonce=1;}//Do not load all background pictures unless settings page is requested and only once
    if($("#settingspanel").css("display")=="none"){
        $("#settingspanel").css("animation","fade-in 0.25s");
        $("#settingspanel").css("display","block");
    }
    else{
        $("#settingspanel").css("animation","fade-out 0.25s");
        setTimeout(function() {
            $("#settingspanel").css("display","none");
        }, 150); //Wait for animation to get close to the end
    }
});

function getnumbervalue(element){ //because it glitches out if input is empty
    var x = document.getElementById(element).value;
    if(x==""){return 0;}
    else{return x;}
}

//Save settings
var settingsform = document.getElementById("settingsform");
settingsform.addEventListener("submit", function(e){
    e.preventDefault();

    var yourName = document.getElementById('set_yourName').value;
    var isBackgroundWhite = document.getElementById('set_isBackgroundWhite').checked;
    var fillEntirePage = document.getElementById('set_fillEntirePage').checked;
    var mobileVersion = document.getElementById('set_mobileVersion').checked;
    var navbarOpacity = getnumbervalue('set_navbarOpacity');
    var navbarColor = {r:58, g:153, b:255};
    navbarColor.r = getnumbervalue('set_navbarColorR');
    navbarColor.g = getnumbervalue('set_navbarColorG');
    navbarColor.b = getnumbervalue('set_navbarColorB');
    var coverColor = {r:58, g:153, b:255};
    coverColor.r = getnumbervalue('set_coverColorR');
    coverColor.g = getnumbervalue('set_coverColorG');
    coverColor.b = getnumbervalue('set_coverColorB');
    var coverTextColor = {r:255, g:255, b:255};
    coverTextColor.r = getnumbervalue('set_coverTextColorR');
    coverTextColor.g = getnumbervalue('set_coverTextColorG');
    coverTextColor.b = getnumbervalue('set_coverTextColorB');

    setCookie('yourName',yourName,9999);
    setCookie('isBackgroundWhite',isBackgroundWhite,9999);
    setCookie('fillEntirePage',fillEntirePage,9999);
    setCookie('mobileVersion',mobileVersion,9999);
    setCookie('navbarOpacity',navbarOpacity,9999);
    setCookie('navbarColor',JSON.stringify(navbarColor),9999);
    setCookie('coverColor',JSON.stringify(coverColor),9999);
    setCookie('coverTextColor',JSON.stringify(coverTextColor),9999);
    location.reload();
});

//Save pages
var settingspagesform = document.getElementById("settingspagesform");
settingspagesform.addEventListener("submit", function(e){
    e.preventDefault();
    var newPageBox = document.getElementById('set_newPageBox').value;
    if(newPageBox==null || newPageBox==""){newPageBox = [null,null,0];}
    else{
        if(newPageBox.substring(0,4) == "http"){ //check link
            newPageBox = [newPageBox,'defaultpageimage.jpg',1];
        }
        else{ //Add http if user didn't already add it
            newPageBox = ["http://"+newPageBox,'defaultpageimage.jpg',1];
        }

        //Change image per case
        var sitename = extractwebsite(newPageBox[0]);
        sitename = sitename.toLowerCase();

        if(!knownpages.includes(sitename)){
            sitename = sitename.substring(0,1);
        }

        newPageBox[1] = sitename+".jpg";
    }

    var pages = getCookie('pages');
    pages = JSON.parse(pages);
    for(var i=0;i<pages.length;++i){
        var status = document.getElementById('set_pagebox_'+i).checked;
        if(status == true){status = 1;}
        else{status = 0;}
        pages[i][2] = status;
    }
    if(newPageBox[0]){
        pages.push(newPageBox);
    }
    setCookie('pages',JSON.stringify(pages),9999);
    
    //update speed dial
    removespeeddialpages();
    showspeeddialpages();
    setdifferentversions();//for fix

    //update pages list
    removepageslist();
    setpageslist();
});
