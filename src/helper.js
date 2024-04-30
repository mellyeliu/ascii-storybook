import process from "process";

const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export function isDev()
{
    return development;
}

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

export function generateCookie(cookie_name) {
    let cookie = getCookie(cookie_name);
    if (cookie == "") {
      let cookie_id = create_UUID();
      let cookie_expiration = 365;
  
      const d = new Date();
      d.setTime(d.getTime() + cookie_expiration * 24 * 60 * 60 * 1000);
      let expires = ";expires=" + d.toUTCString();
      document.cookie =
        cookie_name +
        "=" +
        cookie_id +
        ";" +
        cookie_expiration +
        ";path=/" +
        expires;
    }
}

export function getCookie(cookie_name) {
    let name = cookie_name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
  