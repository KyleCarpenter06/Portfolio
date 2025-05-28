$(document).ready(function ()
{
    // SHOW HEADER
    $("#header").load("header.html", function ()
    {
        $("#logo").attr("src", "img/icons/cloud-" + colorCode + ".svg");
        $(".logo-node-img").attr("src", "img/icons/node-" + colorCode + ".svg");
    });

    // SHOW FOOTER
    $("#footer").load("footer.html");
});

$(window).on('load', function ()
{
    // SHOW BODY ON LOAD
    $("body").show();

    var phone = new Array('&#116;&#101;&#108;&#58;', '&#40;&#53;&#49;&#54;&#41;&#32;&#57;&#48;&#48;&#45;&#50;&#50;&#57;&#54');
    $("#phone-number").html(phone[1]);
});