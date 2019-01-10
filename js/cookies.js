function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

var issetup = getCookie('ft');
if(!issetup){
    setCookie('ft',1,9999);
    setCookie('yourName',yourName,9999);
    setCookie('isBackgroundWhite',isBackgroundWhite,9999);
    setCookie('backgroundImage',backgroundImage,9999);
    setCookie('fillEntirePage',fillEntirePage,9999);
    setCookie('mobileVersion',mobileVersion,9999);
    setCookie('navbarOpacity',navbarOpacity,9999);
    setCookie('navbarColor',JSON.stringify(navbarColor),9999);
    setCookie('coverColor',JSON.stringify(coverColor),9999);
    setCookie('coverTextColor',JSON.stringify(coverTextColor),9999);
    setCookie('pages',JSON.stringify(pages),9999);
}