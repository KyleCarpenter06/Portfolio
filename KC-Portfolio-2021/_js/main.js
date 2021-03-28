// #region INTRO
// --- JS Code for Kyle Carpenter Website, © 2020
// --- Created by Kyle Carpenter
// --- Last Edited 3/2/20
// --- Any issues please contact kylecarpenter06@gmail.com

//          ___  ____      ______       __   
//     __  |_  ||_  _|   .' ___   |    / /   __
//    / /    | |_/ /    / .'    \_|   / /    \ \  
//   < <     | __ '.    | |          / /      > > 
//    \_\   _| |  \ \_  \ `.___.'\  / /      /_/  
//         |____||____|  `.____.'  /_/          
// #endregion
// #region INTELLISENSE PATHS (jQuery)
/// <reference path="../_scripts/jquery-3.4.1.js" />
/// <reference path="../_scripts/jquery-3.4.1.intellisense.js" />
// #endregion
// #region VARIABLES
var webURL;
// #endregion
// #region LOADED
$(document).ready(function ()
{
    // get name of page
    var path = window.location.pathname;
    var page = path.split("/").pop();

    // call function for specific page
    if (page === "index.html" || page === "")
    {
        homeFunctions();
    }
    if (page === "portfolio-art.html")
    {
        portfolioArtInit();
    }
    if (page === "portfolio-web.html")
    {
        portfolioWebInit();
    }

    // --- script to prevent spam from SEO spiders

    // phone
    var phone = new Array('&#116;&#101;&#108;&#58;', '&#40;&#53;&#49;&#54;&#41;&#32;&#57;&#48;&#48;&#45;&#50;&#50;&#57;&#54');
    $("#phone-number").html(phone[1]);
});
// #endregion
// #region BACK TO TOP
$(document).scroll(function ()
{
    if ($(document).scrollTop() > 20)
    {
        $("#back-to-top").addClass("back-to-top-active");
    }
    else
    {
        $("#back-to-top").removeClass("back-to-top-active");
    }
});

function backToTop()
{
    $("html, body").animate({ scrollTop: 0 }, 1000, "easeInOutCubic");
    
}
// #endregion
// #region NAV
function toggleHamburger()
{
    $("nav").slideToggle(500, "swing");
}
// #endregion
// #region HOME
function homeFunctions()
{
    // fade in video when loaded
    var kyleVideo = document.getElementById("kyle-video");
    kyleVideo.onloadeddata = function ()
    {
        $("#kyle-video").addClass("video-loaded");
    };
}
// #endregion
// #region PORTFOLIO ART FUNCTIONS
function portfolioArtInit()
{
    // preload all large art images
    //preloadArt();

    // create all "more art" images
    createMoreArt();

    // art button click listener
    $(".port-flex").click(function ()
    {
        // change art image
        findArtIndex(this);

        // scroll to art
        $("html, body").animate({ scrollTop: $("#title-div").offset().top - 40 }, 1000, "easeInOutCubic");
    });

    // default art image
    findArtIndex($("#amber_and_amethyst"));
}

// FIND ARRAY FROM ELEMENT CLICKED
function findArtIndex(art)
{
    // find array index
    var id = $(art).attr("id");
    //var src = $(art).find("img").first().attr("src");
    var piece = artGallery.filter(function (element)
    {
        return element.name === id;
    });

    // change art
    changeArt(piece[0]);
}

function preloadArt()
{
    var imgBig = new Image();

    imgBig.onload = () =>
    {
        
        alert("LOADED");
    };

    imgBig.src = "../_img/art/gargantua.jpg";
    //artGallery.forEach(function(art))
}

// CREATE ART
function createMoreArt()
{
    var images = [];
    artGallery.forEach(function (art, i)
    {
        images[i] = new Image();
        images[i].src = "../_img/art/" + art.name + ".jpg";
        art.image = images[i];
        //document.body.appendChild(imgBig);

        var moreArtGrid = document.getElementById("more-port-grid");
        var flexDiv = document.createElement("div");
        flexDiv.classList.add("port-flex");
        flexDiv.setAttribute("id", art.name);
        var branchDiv = document.createElement("div");
        branchDiv.classList.add("branch-x");
        branchDiv.classList.add("center");
        var nodeLeftDiv = document.createElement("div");
        nodeLeftDiv.classList.add("node");
        nodeLeftDiv.classList.add("left");
        nodeLeftDiv.classList.add("center");
        var outerDiv = document.createElement("div");
        outerDiv.classList.add("more-port-container");
        var innerDiv = document.createElement("div");
        innerDiv.classList.add("more-port-inner");
        var img = document.createElement("img");
        img.src = "../_img/thumbnails/" + art.name + ".jpg";

        innerDiv.appendChild(img);
        outerDiv.appendChild(innerDiv);
        flexDiv.appendChild(outerDiv);
        flexDiv.appendChild(branchDiv);
        flexDiv.appendChild(nodeLeftDiv);
        moreArtGrid.appendChild(flexDiv);
    });
}

// ART CLICK FUNCTION
function changeArt(piece)
{
    // reset all selected images
    $(".more-port-inner").removeClass("selected");

    // highlight selected piece

    $("#" + piece.name).find(".more-port-inner").addClass("selected");

    // edit art info section
    $("#port-title").html(piece.full.toUpperCase()); // art title (desktop & tablet)
    $("#port-title-phone").html(piece.full.toUpperCase()); // art title (phone only)
    $("#art-type").html(piece.type.toUpperCase()); // art type
    $("#art-medium").html(piece.medium.toUpperCase()); // art medium
    $("#art-date").html("COMPLETED " + piece.date.toUpperCase()); // art completion date
    $("#art-time").html(piece.time.toUpperCase() + " HOURS TO COMPLETE"); // art hours to finish
    $("#port-about").find("p").html(piece.info); // art about section

    var src = "../_img/art/" + piece.name + ".jpg";
    //var src = piece.image;
    $("#port-img").css("background-image", "url('" + src + "')"); // art image
    $(".lightbox-front").css("background-image", "url('" + src + "')"); // art lightbox
}

const artGallery =
    [
        {
            name: "amber_and_amethyst",
            full: "amber &amp; amethyst",
            type: "traditional",
            medium: "acrylic on canvas",
            date: "11/1/18",
            time: "10",
            info: "This piece was made in my 'ART 105 - Principles of 2-Dimensional Design' class. The goal of this piece was to use a combination of color values and size to create a sense of 3-dimensional depth within a 2-dimensional space. I decided to go with a complimentary color scheme of gold and purple, hence the name of the piece. A hard part about this piece was using the exacto-knife along with frisket film in the correct way in order to get the well-defined edges across the canvas."
        },
        {
            name: "boardwalk",
            full: "the boardwalk",
            type: "digital",
            medium: "photoshop",
            date: "4/10/19",
            time: "6",
            info: "This piece I made in my 'ART 131 - Digital Imaging' class. The goal of this project was to use the photoshop masking tool as well as our knowledge of design to create a photo-realistic image. I think I used the concepts of size, depth and color quite well as it's quite hard to tell what elements were placed in the image and what wasn't."
        },
        {
            name: "motions-of-the-earth",
            full: "motions of the earth",
            type: "traditional",
            medium: "acrylic on canvas",
            date: "11/31/18",
            time: "10",
            info: "This piece was made in my 'ART 105 - Principles of 2-Dimensional Design' class. The goal of this piece was to use a variety of both primary and secondary colors to create tertiary colors as well as color tints and shades with white and black. I used a combination of blues and greens to create a dynamic grass-like texture. I also added accent colors of orange and red which represent 'fire' or 'light' in the context of the piece."

        },
        {
            name: "jigsaw",
            full: "jigsaw",
            type: "traditional",
            medium: "graphite on newsprint",
            date: "9/14/18",
            time: "3",
            info: "This piece was made in my 'ART 105 - Principles of 2-Dimensional Design' class. The goal of this piece was to use the element of straight lines to create movement. This was a practice for actual piece so this piece was done in pencil on newsprint size paper. I settled on the name 'Jigsaw' for this piece because of the puzzle-like lines that fill the background as well as the jagged crystal like figures that fill the foreground."
        },
        {
            name: "insomniac",
            full: "insomniac",
            type: "digital",
            medium: "illustrator",
            date: "11/14/18",
            time: "6",
            info: "This piece was made in my 'ART 130 - Graphic Design' class. The goal of this piece was to use our working knowledge of Adobe Illustrator to create a still life. My initial plan was to create something more eloborate but I was instructed to dim it way down and I settled with a simple setting of coffee on a wooden table. The odd part about this piece was that the pencil, which looks very realistic, actually took the least amount of time to complete, probably under a half-hour."
        },
        {
            name: "the-mountain-between",
            full: "the mountain between us",
            type: "digital",
            medium: "illustrator",
            date: "4/12/19",
            time: "10",
            info: "This piece was made in my 'ART 137 - Computer Illustration' class. For this piece, we were instructed to recreate a book cover using our knowledge of Adobe Illustrator. The book I chose was 'The Mountain Between Us' by Charles Martin, which was recently given a movie adaption. The reason for my choice is because I enjoy movies about survival and the story was about a couple whose plane crashed in the middle of nowhere in the dead of winter and they needed to get out alive. While creating this piece, took a large tool on my computer, in the end I'm quite proud of the intricate stroke-work around the trees and the massive depth of the wooded areas."
        },
        {
            name: "camping-in-nature",
            full: "camping in nature",
            type: "digital",
            medium: "photoshop",
            date: "4/12/19",
            time: "12",
            info: "This piece was made in my 'ART 131 - Digital Imaging' class. We were tasked with taking an image of a landscape and expanding on it using our knowledge of Photoshop and making it more impressionist similar to the works of Claude Monet or Van Gogh. I loved how this piece turned out, especially with the color in the background and texture of the entire piece."
        },
        {
            name: "gargantua",
            full: "gargantua",
            type: "traditional",
            medium: "micron on newsprint",
            date: "9/21/18",
            time: "6",
            info: "This piece was made in my 'ART 105 - Principles of 2-Dimensional Design' class. The goal of this piece was to use the element of curved lines to create movement. This was a practice for actual piece so this piece was done in micron pen on newsprint size paper. Before doing this piece, I recently saw the movie 'Interstellar' which was the inspiration for this piece and I have a fascination for space and what is always out there. It may be hard to see, but the lines actually never cross as they form the black hole structure 'Gargantua' as seen in the movie."
        },
        {
            name: "long-beach-map",
            full: "long beach map",
            type: "digital",
            medium: "illustrator",
            date: "5/15/19",
            time: "14",
            info: "This piece was made in my 'ART 137 - Computer Illustration' class. For this piece, the idea was to create a tourist map of a physical area, city or location you have been to or have fantasized about going to. I chose a place I frequent many times every summer which is Long Beach, NY. I used a variety of elements to help capture the spirit of the town such as their famous long boardwalk, the pristinely-kept beach, their frequent volleyball tournaments and of course, the nice ocean view apartments."
        },
        {
            name: "pumpkin",
            full: "pumpkin seeds",
            type: "digital",
            medium: "illustrator",
            date: "11/26/18",
            time: "10",
            info: "This piece was made in my 'ART 130 - Graphic Design' class. The goal of this piece was to use our working knowledge of Adobe Illustrator to create a plant or vegetable seed packet, complete with an image, company logo and pricing information. I chose to recreate a pumpkin seed packet I saw on the internet. This was my first time using Illustrator, and I think the final product came out great in terms of color, typography and hierarchy."
        },
        {
            name: "tikka-masala",
            full: "tikka masala recipe",
            type: "digital",
            medium: "illustrator",
            date: "5/17/19",
            time: "16",
            info: "This piece was made in my 'ART 137 - Computer Illustration' class. For this piece, we were tasked with creating an infographic instructional guide using vector graphics and with as little words as possible. I decided to a recipe based on one of my favorite Indian dishes, Halal Chicken Tikka Masala. Known for its spicy flavor and warm colors, I based my the overall form of my piece off of the colors of the dish as well as traditional Indian art. I hope by looking at this you will be encouraged to go out and try some."
        },
        {
            name: "contours",
            full: "contours",
            type: "traditional",
            medium: "micron on newsprint",
            date: "9/22/18",
            time: "7",
            info: "This piece was made in my 'ART 105 - Principles of 2-Dimensional Design' class. The goal of this piece was to use the element of curved lines to create movement. I took inspiration from the contours of a weather map, hence the name of the piece. If you look real close, all the lines on the paper never cross and all were done using the same width micron pen. The distance between some of the lines creates weight along with the visual movement of the ridges and troughs. On the top of the page, in the distance, it also looks like waves flowing across and never ending ocean."
        },
        {
            name: "mystery-man",
            full: "mystery man!?!",
            type: "digital",
            medium: "photoshop",
            date: "4/12/19",
            time: "14",
            info: "This piece was made in my 'ART 131 - Digital Imaging' class. We were instructed to create our own comic book cover complete with the issue number, pricing and barcode. For my cover, I decided to go with a mysterious purple caped crusader otherwise known as 'Mystery Man' which is inspired by characters such as Batman, Green Arrow and Rorschach. This is one of my favorite pieces because of the amount of elements in this piece from the rain, to the color choices, to the realistic figure and the dark and eerie tone of the image."
        },
        {
            name: "the-web",
            full: "the web",
            type: "traditional",
            medium: "micron pen on canvas",
            date: "9/29/18",
            time: "10",
            info: "This piece was made in my 'ART 105 - Principles of 2-Dimensional Design' class. The goal of this piece was to use the element of straight lines to create movement. For this piece specifically, we were instructed to use straight lines in order to create curved shapes. By using simple math, I was able to create series of 3-dimensional shapes with the use of lines at various intervals. The shapes created form what looks like a net or a spiders web."
        },
        {
            name: "stress-2",
            full: "stress ii",
            type: "digital",
            medium: "photoshop",
            date: "5/17/19",
            time: "9",
            info: "This piece was made in my 'ART 131 - Digital Imaging' class. This was our final project for this class and we were instructed to create a self portrait. I decided to do something quite serious and because this was a stressful time, I decided to base my artwork off it. This is part two, of a three part work called 'Stress'. Devoid of any color, this piece speaks about some of my inner-thoughts as various words are scribbled all over my face. Having no color, only grayness, gives you a sense of dullness and bleakness that I was experiencing. This was inspired by the movie poster for 'The Number 23' starring Jim Carrey."
        },
        {
            name: "bigger-brother",
            full: "bigger brother",
            type: "digital",
            medium: "photoshop",
            date: "4/12/19",
            time: "12",
            info: "This piece was made in my 'ART 131 - Digital Imaging' class. We were instructed to create our own comic book cover complete with the issue number, pricing and barcode. While this isn't a superhero comic, I thought having a dysfunctional sibling relationship might be a good idea for a story. Inspired by true events, I created the cover for the fictional comic 'Bigger Brother' where an older, more muscular brother is picking constantly picking on his younger smaller siblings."
        },
        {
            name: "rivers",
            full: "rivers",
            type: "traditional",
            medium: "micron pen on canvas",
            date: "9/30/18",
            time: "8",
            info: "This piece was made in my 'ART 105 - Principles of 2-Dimensional Design' class. The goal of this piece was to use the element of curved lines to create movement. I took inspiration from water flowing down a river as I was creating this piece. It is very hard to see but none of the lines touch as its going across the page and the strokes are of all the same width. Using a variety of space between each line gives the piece flow and movement."
        },
        {
            name: "south-long-beach-ave",
            full: "south long beach ave",
            type: "traditional",
            medium: "micron pen on canvas",
            date: "10/30/18",
            time: "24",
            info: "This piece was made in my 'ART 105 - Principles of 2-Dimensional Design' class. As a culmination of what we learned with line, shape and texture to create art, we were instructed to create a scene made up of various elements as well as multiple depths of field. We needed to use tracing paper as well as carbon paper to place the layers onto the final board. While this took many weeks of planning, tracing and editing, I think it came out beautiful and shows a rather large number of elements both in the foreground and in the background. Some of the elements on the canvas were inspired by growing up fishing with my family."
        }
    ];
// #endregion

// #region PORTFOLIO WEB FUNCTIONS
function portfolioWebInit()
{
    // create all "more art" images
    createMoreWeb();

    // art button click listener
    $(".port-flex").click(function ()
    {
        // change art image
        findWebIndex(this);

        // scroll to art
        $("html, body").animate({ scrollTop: $("#title-div").offset().top - 40 }, 1000, "easeInOutCubic");
    });

    // default art image
    findWebIndex($("#elite_feats"));
}

// CHANGE WEB PROJECT FUNCTION
function changeWeb(piece)
{
    // reset all selected images
    $(".more-port-inner").removeClass("selected");

    // highlight selected piece
    $("#" + piece.name).find(".more-port-inner").addClass("selected");

    // edit art info section
    $("#port-title").html(piece.full.toUpperCase()); // web title (desktop & tablet)
    $("#port-title-phone").html(piece.full.toUpperCase()); // web title (phone only)
    $("#web-industry").html(piece.industry.toUpperCase()); // web industry
    $("#web-created").html("ESTABLISHED " + piece.date.toUpperCase()); // website created date
    $("#port-about").find("p").html(piece.info); // website about section

    var src = "../_img/web/" + piece.name + ".jpg";
    webURL = piece.link;
    //var src = piece.image;
    $("#port-img").css("background-image", "url('" + src + "')"); // art image
    $(".lightbox-front").css("background-image", "url('" + src + "')"); // art lightbox
}

// FIND ARRAY FROM ELEMENT CLICKED
function findWebIndex(web)
{
    // find array index
    var id = $(web).attr("id");
    //var src = $(art).find("img").first().attr("src");
    var piece = webGallery.filter(function (element)
    {
        return element.name === id;
    });

    // change art
    changeWeb(piece[0]);
}

// CREATE 'MORE WEB' ITEMS
function createMoreWeb()
{
    var images = [];
    webGallery.forEach(function (art, i)
    {
        images[i] = new Image();
        images[i].src = "../_img/web/" + art.name + ".jpg";
        art.image = images[i];
        //document.body.appendChild(imgBig);

        var moreArtGrid = document.getElementById("more-port-grid");
        var flexDiv = document.createElement("div");
        flexDiv.classList.add("port-flex");
        flexDiv.setAttribute("id", art.name);
        var branchDiv = document.createElement("div");
        branchDiv.classList.add("branch-x");
        branchDiv.classList.add("center");
        var nodeLeftDiv = document.createElement("div");
        nodeLeftDiv.classList.add("node");
        nodeLeftDiv.classList.add("left");
        nodeLeftDiv.classList.add("center");
        var outerDiv = document.createElement("div");
        outerDiv.classList.add("more-port-container");
        var innerDiv = document.createElement("div");
        innerDiv.classList.add("more-port-inner");
        var img = document.createElement("img");
        img.src = "../_img/thumbnails/" + art.name + ".jpg";

        innerDiv.appendChild(img);
        outerDiv.appendChild(innerDiv);
        flexDiv.appendChild(outerDiv);
        flexDiv.appendChild(branchDiv);
        flexDiv.appendChild(nodeLeftDiv);
        moreArtGrid.appendChild(flexDiv);
    });
}

const webGallery =
    [
        {
            name: "elite_feats",
            full: "elitefeats",
            industry: "Online Marketing",
            date: "2015",
            link: "https://elitefeats.com/",
            info: "EliteFeats is an event marketing, registration, timing company based in Centereach, NY. Since the summer of 2019, I have been creating and hosting registration pages using their proprietary software as well as updating parts of their main website. I also use third-party software for email marketing as well as providing email support to our clients and customers."
        },
        {
            name: "space_trivia",
            full: "space trivia: the game",
            industry: "Entertainment",
            date: "2019",
            link: "http://www.space-trivia/com",
            info: "Space Trivia is an interactive single-page space-themed trivia game I made for my Advanced Web Design class. All of the visual content I made using Adobe Illustrator, Photoshop, and Dreamweaver as well as my knowledge of front-end development. The game has 5 levels of difficulty and using JavaScript, all the questions are randomized. The page also features cool sound effects and other interactive animations."
        },
        {
            name: "sports_now_live",
            full: "sports now live",
            industry: "Entertainment",
            date: "2016",
            link: "http://www.sportsnowlive.com",
            info: "Sports Now Live is an independent sports project I have been working on in my spare time. The project is geared toward providing a way for people to stream live scores and updates of their favorite local lower-level sports teams. While mainly used to test out different programming concepts, the various pages on this website does showcase some of my front-end development skills such as having a mobile-friendly design as well as back-end skills such as having a login system coupled with taking to an SQL Database."
        },
        {
            name: "moms_meals",
            full: "mom's meals nourish care",
            industry: "Meal Delivery",
            date: "2018",
            link: "https://www.momsmealsnc.com/",
            info: "Mom's Meals Nourish Care is a meal delivery service based in Iowa that specializes in providing meals & nutrition services for individuals in independent living and for patients recuperating from chronic diseases. While working for a software consulting firm, I worked with a Senior Developer with the front-end of their website. One of the main areas that I worked on was the 'Order Now' section were customers can order customized meals if they qualify. <b>Enter a California area code '90210' to continue to the site.</b> The meals are only available to people in certain states."
        }
    ];
// #endregion
// #region LIGHTBOX FUNCTIONS
function lightboxOpen()
{
    document.getElementById("lightbox").style.display = "block";
}

function lightboxClose()
{
    document.getElementById("lightbox").style.display = "none";
}

function lightboxLeft_Art()
{
    // find index of art gallery
    var title = $("#port-title").html();
    var piece = artGallery.filter(function (element)
    {
        return element.full === title.toLowerCase();
    });
    var index = artGallery.indexOf(piece[0]);

    // if index is zero, set to length of array
    var newIndex = index;
    if (index === 0)
    {
        newIndex = artGallery.length - 1;
    }
    else
    {
        newIndex--;
    }

    // change art with index
    changeArt(artGallery[newIndex]);
}

function lightboxLeft_Web()
{
    // find index of art gallery
    var title = $("#port-title").html();
    var piece = webGallery.filter(function (element)
    {
        return element.full === title.toLowerCase();
    });
    var index = webGallery.indexOf(piece[0]);

    // if index is zero, set to length of array
    var newIndex = index;
    if (index === 0)
    {
        newIndex = webGallery.length - 1;
    }
    else
    {
        newIndex--;
    }

    // change art with index
    changeWeb(webGallery[newIndex]);
}

function lightboxRight_Art()
{
    // find index of art gallery
    var title = $("#port-title").html();
    var piece = artGallery.filter(function (element)
    {
        return element.full === title.toLowerCase();
    });
    var index = artGallery.indexOf(piece[0]);

    var newIndex = index;
    if (index === artGallery.length - 1)
    {
        newIndex = 0;
    }
    else
    {
        newIndex++;
    }

    // change art with index
    changeArt(artGallery[newIndex]);
}

function lightboxRight_Web()
{
    // find index of art gallery
    var title = $("#port-title").html();
    var piece = webGallery.filter(function (element)
    {
        return element.full === title.toLowerCase();
    });
    var index = webGallery.indexOf(piece[0]);

    var newIndex = index;
    if (index === webGallery.length - 1)
    {
        newIndex = 0;
    }
    else
    {
        newIndex++;
    }

    // change art with index
    changeWeb(webGallery[newIndex]);
}

function lightboxLink()
{
    window.open(webURL, "_blank");
}
// #endregion