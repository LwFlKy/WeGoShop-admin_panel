export function TMap() {
          return new Promise(function (resolve, reject) {
               window.init = function () {
              resolve(qq)//注意这里
         }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://map.qq.com/api/js?v=2.exp&callback=init&key=XQ6BZ-ZQRC3-NAP3H-YDXXG-B3QRS-A5FOD";
        script.onerror = reject;
        document.head.appendChild(script);
      })
    }