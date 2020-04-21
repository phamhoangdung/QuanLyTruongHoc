var loc = window.location.pathname;
console.log(loc);
$("a.active").removeClass("active");
$("a[href$='"+loc+"']").addClass("active");