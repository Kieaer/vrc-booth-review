// ==UserScript==
// @name        부스 리뷰 기능
// @namespace   Violentmonkey Scripts
// @match       https://booth.pm/*
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      Gureumi
// @description 2023. 12. 5. 오후 7:20:56
// ==/UserScript==

var regex = /\d+$/;
var match = document.URL.match(regex);
var productId = match ? parseInt(match[0]) : null;

if (productId != null) {
  var css = "#comments { width: 100%; height: 100%; float:left; } .comment { width: 100%; height: 100%; margin-bottom: 5px; border-radius: 10px; background-color: rgb(30, 41, 59); float: left; color: white; padding: 10px; box-sizing: border-box;} .comment_username { position: relative; width: 65%; float: left; font-weight: bold; } .comment_date { position: relative; width: 35%; float: left; font-size: 0.8em; } .comment_content { position: relative; float: left; font-size: 0.8em; width: 100% }"
  var styleSheet = document.createElement("style")
  styleSheet.innerText = css
  document.head.appendChild(styleSheet)

  var result = "<div id='comments'><span style='font-size: 1.5em; font-weight: bold;'>상품 리뷰</span>";

  GM_xmlhttpRequest({
    method: "GET",
    url: "https://vrc-booth.com/api/comment?productId=" + productId,
    onload: function(xhr) {
      var json = JSON.parse(xhr.responseText);
      var count = json["count"];
      var comments = json["comments"]
      if (comments.length != 0) {
        for(var i=0;i<comments.length;i++){
          var obj = comments[i];
          var username = obj["user"]["username"];
          var content = obj["content"];
          var updated = new Date(obj["updatedAt"]);
          var html = "";
          if (i > 2) {
            html += "<div class='comment' style='display: none;'>";
          } else {
            html += "<div class='comment'>";
          }
          html += "<div class='comment_username'>" + username + "</div><div class='comment_date'>" + updated.toLocaleString("ko-KR") + "</div><div class='comment_content'>" + content + "</div></div>";
          result += html;
        }
        if (comments.length > 2) {
          result += "<button id='showAllComments' style='float:left; width:100%; padding: 10px; background-color: rgb(67, 56, 202); color: white; border-radius: 10px;' onclick='showHiddenComments()'>모두 보이기</button>";
        }
      } else {
        result += "<span style='float:left; width: 100%;'>현재 이 상품에는 리뷰가 없습니다.</span>";
      }
      result += "<span style='float:left; width: 100%; margin-bottom: 50px;'>리뷰 추가는 <a href='https://vrc-booth.com/product/" + productId + "'>여기</a>에서 할 수 있습니다.</span></div>";

      var co = document.querySelector(".main-info-column")
      co.insertAdjacentHTML("afterbegin", result);


      if (comments.length > 2) {
        document.getElementById("showAllComments").addEventListener (
          "click", showHiddenComments, false
        );

        function showHiddenComments() {
          var hiddenComments = document.getElementsByClassName("comment");
          for(var i=0;i<hiddenComments.length;i++){
            hiddenComments[i].style.display = "block";
          }

          document.querySelector("#showAllComments").style.display = "none";
        }
      }
    }
  });
}
