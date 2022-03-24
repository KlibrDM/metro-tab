$(document).ready(function(){
    showname();
    hidename();
    showspeeddialpages();
    setdifferentversions();
    showtime();
    showrandomgithub();
});

function showname(){
    document.getElementById("nameblock").innerHTML = getCookie('yourName');
}

function hidename(){
    setTimeout(function() {
        $(".nameblockbox").css('display', 'none');
    }, 1000);
}

function showspeeddialpages(){
    pages = getCookie('pages');
    pages = JSON.parse(pages);
    for(var i=0;i<pages.length;++i){
        if(pages[i][2] == 1){ //if active
            var html = `
                <a href="`+pages[i][0]+`" class="pagebutton" id="pagebutton_`+i+`" style="background-image: url('img/thumbnails/`+pages[i][1]+`');"></a>
            `;
            $(".buttonsrow").append(html);
        }
    }
}

function removespeeddialpages(){
    while($(".pagebutton").length){
        $(".pagebutton").remove();
    };
}

function setdifferentversions(){
    if(!getCookie('isBackgroundWhite')){
        var bg = getCookie('backgroundImage');
        document.body.style.backgroundImage = "url('img/bg/"+bg+".jpg')";
        if(clockborderbackgrounds.includes(bg)){
            $("#time").css("background-color","rgba(0,0,0,0.25)");
        }
        else{
            $("#time").css("background-color","rgba(0,0,0,0)");
        }
    }

    if(getCookie('mobileVersion')){
        $(".buttonsrow").css("flex-direction","column");
        $('body').css("overflowX","hidden");
    }

    if(!getCookie('fillEntirePage') && !getCookie('mobileVersion')){
        $(".speeddialpages").css("display","flex");
        $(".speeddialpages").css("height","75vh");
        $(".speeddialpages").css("justify-content","center");
        $(".speeddialpages").css("align-items","center");
        $(".buttonsrow").css("width","75vw");
        $(".pagebutton").css("height","55vh");
    }

    if(getCookie('fillEntirePage')){
        $("body").css("overflow","hidden");
    }

    //Navbar color and opacity
    if(getCookie('isBackgroundWhite')){navbarOpacity = 1;}
    else{navbarOpacity = getCookie('navbarOpacity')}

    var navbarColor = getCookie('navbarColor');
    navbarColor = JSON.parse(navbarColor);
    $(".indexnavbar").css("background-color","rgba("+navbarColor.r+", "+navbarColor.g+", "+navbarColor.b+", "+navbarOpacity+")");
    
    //Cover colors
    var coverColor = getCookie('coverColor');
    coverColor = JSON.parse(coverColor);
    $(".indexcover").css("background-color","rgb("+coverColor.r+", "+coverColor.g+", "+coverColor.b+")");

    var coverTextColor = getCookie('coverTextColor');
    coverTextColor = JSON.parse(coverTextColor);
    $("#nameblock").css("color","rgb("+coverTextColor.r+", "+coverTextColor.g+", "+coverTextColor.b+")");
}

function showtime(){
    var time = new Date();
    document.getElementById("time").innerHTML = ("0" + time.getHours()).slice(-2) + "<span id='timeminutes'>:" + ("0" + time.getMinutes()).slice(-2) +"</span>";
    setInterval(function() {
        time = new Date();
        document.getElementById("time").innerHTML = ("0" + time.getHours()).slice(-2) + "<span id='timeminutes'>:" + ("0" + time.getMinutes()).slice(-2) +"</span>";
    }, 1000);
}

function showrandomgithub(){
    var chance = 0;
    setInterval(function() {
        if(chance==50){//If it was shown before, hide it
            $("#randomgithub").css("display","none");
        }
        chance = Math.floor(Math.random() * 299);
        if(chance==50 && $(window).width()>799){
            $("#randomgithub").css("display","initial");
        }
    }, 15000);
}

//Searchbar
var googlesearchform = document.getElementById("googlesearchform");
googlesearchform.addEventListener("submit", function(e){
    e.preventDefault();
    var searchedterm = document.getElementById("googlesearchinput").value;
    if(searchedterm!=""){
        window.location.replace("https://www.google.com/search?q="+searchedterm);
        return false;
    }
});

//Browser options
var element = document.getElementById("browserhistorybutton");
element.addEventListener("click", function(e) {
    chrome.tabs.create({'url': 'chrome://history'});
});
var element = document.getElementById("browserdownloadsbutton");
element.addEventListener("click", function(e) {
    chrome.tabs.create({'url': 'chrome://downloads'});
});
var element = document.getElementById("browserbookmarksbutton");
element.addEventListener("click", function(e) {
    chrome.tabs.create({'url': 'chrome://bookmarks'});
});
var element = document.getElementById("browserextensionsbutton");
element.addEventListener("click", function(e) {
    chrome.tabs.create({'url': 'chrome://extensions'});
});