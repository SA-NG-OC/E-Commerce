let li_item = document.getElementsByTagName("li");
let li_class = document.getElementsByClassName("list");
let li_id = document.getElementById("item1");
console.log(li_item);
for (let i = 0; i < li_item.length; i++) {

    li_item[i].onclick = function () {
        li_item[i].innerHTML = "Bạn vừa click vào mục " + (i + 1);
    }
}

// Get set attribute
let a = document.getElementById("item1");
let b = document.querySelector("li a");
let id = a.getAttribute("id");
let href = b.getAttribute("href");
b.setAttribute("href", "https://www.facebook.com/");
console.log(href);