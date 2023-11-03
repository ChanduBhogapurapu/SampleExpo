(function ($) {
  "use strict";

  /* ========================================================================= */
  /*	Event Gallery
  /* ========================================================================= */
  //   let downnavbar = document.getElementById('downnavbar');
  //   let togglenav = document.getElementById('togglenav');
  // document.addEventListener('scroll',()=>{
  //   if(window.scrollY>=57){
  //     downnavbar.style.position = 'fixed';
  //     downnavbar.style.top = '0';
  //     downnavbar.style.zIndex = '100';
  //     // togglenav.classList.remove('bg-white');
  //     // togglenav.classList.add('bg-dark');
  //     // downnavbar.classList.remove('bg-white');
  //     // downnavbar.classList.add('bg-dark');
  //     downnavbar.style.backgroundColor = '#fff';
  //     }
  //   else {
  //     downnavbar.style.position = 'relative';
  //     downnavbar.style.top = '0';
  //     downnavbar.style.zIndex = '100';
  //     // downnavbar.classList.remove('bg-dark');
  //     // downnavbar.classList.add('bg-white');
  //     // togglenav.classList.remove('bg-dark');
  //     // togglenav.classList.add('bg-white');
  //   }
  //     });

  const { gsap, imagesLoaded } = window;

  const buttons = {
    prev: document.querySelector(".btn--left"),
    next: document.querySelector(".btn--right"),
  };
  const cardsContainerEl = document.querySelector(".cards__wrapper");
  const appBgContainerEl = document.querySelector(".app__bg");

  const cardInfosContainerEl = document.querySelector(".info__wrapper");

  buttons.next.addEventListener("click", () => swapCards("right"));

  buttons.prev.addEventListener("click", () => swapCards("left"));

  function swapCards(direction) {
    const currentCardEl = cardsContainerEl.querySelector(".current--card");
    const previousCardEl = cardsContainerEl.querySelector(".previous--card");
    const nextCardEl = cardsContainerEl.querySelector(".next--card");

    const currentBgImageEl = appBgContainerEl.querySelector(".current--image");
    const previousBgImageEl =
      appBgContainerEl.querySelector(".previous--image");
    const nextBgImageEl = appBgContainerEl.querySelector(".next--image");

    changeInfo(direction);
    swapCardsClass();

    removeCardEvents(currentCardEl);

    function swapCardsClass() {
      currentCardEl.classList.remove("current--card");
      previousCardEl.classList.remove("previous--card");
      nextCardEl.classList.remove("next--card");

      currentBgImageEl.classList.remove("current--image");
      previousBgImageEl.classList.remove("previous--image");
      nextBgImageEl.classList.remove("next--image");

      currentCardEl.style.zIndex = "50";
      currentBgImageEl.style.zIndex = "-2";

      if (direction === "right") {
        previousCardEl.style.zIndex = "20";
        nextCardEl.style.zIndex = "30";

        nextBgImageEl.style.zIndex = "-1";

        currentCardEl.classList.add("previous--card");
        previousCardEl.classList.add("next--card");
        nextCardEl.classList.add("current--card");

        currentBgImageEl.classList.add("previous--image");
        previousBgImageEl.classList.add("next--image");
        nextBgImageEl.classList.add("current--image");
      } else if (direction === "left") {
        previousCardEl.style.zIndex = "30";
        nextCardEl.style.zIndex = "20";

        previousBgImageEl.style.zIndex = "-1";

        currentCardEl.classList.add("next--card");
        previousCardEl.classList.add("current--card");
        nextCardEl.classList.add("previous--card");

        currentBgImageEl.classList.add("next--image");
        previousBgImageEl.classList.add("current--image");
        nextBgImageEl.classList.add("previous--image");
      }
    }
  }

  function changeInfo(direction) {
    let currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
    let previousInfoEl = cardInfosContainerEl.querySelector(".previous--info");
    let nextInfoEl = cardInfosContainerEl.querySelector(".next--info");

    gsap
      .timeline()
      .to([buttons.prev, buttons.next], {
        duration: 0.2,
        opacity: 0.5,
        pointerEvents: "none",
      })
      .to(
        currentInfoEl.querySelectorAll(".text"),
        {
          duration: 0.4,
          stagger: 0.1,
          translateY: "-120px",
          opacity: 0,
        },
        "-="
      )
      .call(() => {
        swapInfosClass(direction);
      })
      .call(() => initCardEvents())
      .fromTo(
        direction === "right"
          ? nextInfoEl.querySelectorAll(".text")
          : previousInfoEl.querySelectorAll(".text"),
        {
          opacity: 0,
          translateY: "40px",
        },
        {
          duration: 0.4,
          stagger: 0.1,
          translateY: "0px",
          opacity: 1,
        }
      )
      .to([buttons.prev, buttons.next], {
        duration: 0.2,
        opacity: 1,
        pointerEvents: "all",
      });

    function swapInfosClass() {
      currentInfoEl.classList.remove("current--info");
      previousInfoEl.classList.remove("previous--info");
      nextInfoEl.classList.remove("next--info");

      if (direction === "right") {
        currentInfoEl.classList.add("previous--info");
        nextInfoEl.classList.add("current--info");
        previousInfoEl.classList.add("next--info");
      } else if (direction === "left") {
        currentInfoEl.classList.add("next--info");
        nextInfoEl.classList.add("previous--info");
        previousInfoEl.classList.add("current--info");
      }
    }
  }

  function updateCard(e) {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const centerPosition = {
      x: box.left + box.width / 2,
      y: box.top + box.height / 2,
    };
    let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
    gsap.set(card, {
      "--current-card-rotation-offset": `${angle}deg`,
    });
    const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
    gsap.set(currentInfoEl, {
      rotateY: `${angle}deg`,
    });
  }

  function resetCardTransforms(e) {
    const card = e.currentTarget;
    const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
    gsap.set(card, {
      "--current-card-rotation-offset": 0,
    });
    gsap.set(currentInfoEl, {
      rotateY: 0,
    });
  }

  function initCardEvents() {
    const currentCardEl = cardsContainerEl.querySelector(".current--card");
    currentCardEl.addEventListener("pointermove", updateCard);
    currentCardEl.addEventListener("pointerout", (e) => {
      resetCardTransforms(e);
    });
  }

  initCardEvents();

  function removeCardEvents(card) {
    card.removeEventListener("pointermove", updateCard);
  }

  function init() {
    let tl = gsap.timeline();

    tl.to(cardsContainerEl.children, {
      delay: 0.15,
      duration: 0.5,
      stagger: {
        ease: "power4.inOut",
        from: "right",
        amount: 0.1,
      },
      "--card-translateY-offset": "0%",
    })
      .to(
        cardInfosContainerEl
          .querySelector(".current--info")
          .querySelectorAll(".text"),
        {
          delay: 0.5,
          duration: 0.4,
          stagger: 0.1,
          opacity: 1,
          translateY: 0,
        }
      )
      .to(
        [buttons.prev, buttons.next],
        {
          duration: 0.4,
          opacity: 1,
          pointerEvents: "all",
        },
        "-=0.4"
      );
  }

  const waitForImages = () => {
    const images = [...document.querySelectorAll("img")];
    const totalImages = images.length;
    let loadedImages = 0;
    const loaderEl = document.querySelector(".loader span");

    gsap.set(cardsContainerEl.children, {
      "--card-translateY-offset": "100vh",
    });
    gsap.set(
      cardInfosContainerEl
        .querySelector(".current--info")
        .querySelectorAll(".text"),
      {
        translateY: "40px",
        opacity: 0,
      }
    );
    gsap.set([buttons.prev, buttons.next], {
      pointerEvents: "none",
      opacity: "0",
    });

    images.forEach((image) => {
      imagesLoaded(image, (instance) => {
        if (instance.isComplete) {
          loadedImages++;
          let loadProgress = loadedImages / totalImages;

          gsap.to(loaderEl, {
            duration: 1,
            scaleX: loadProgress,
            backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%`,
          });

          if (totalImages == loadedImages) {
            gsap
              .timeline()
              .to(".loading__wrapper", {
                duration: 0.8,
                opacity: 0,
                pointerEvents: "none",
              })
              .call(() => init());
          }
        }
      });
    });
  };

  waitForImages();

  /* ========================================================================= */
  /*	Page Preloader
  /* ========================================================================= */

  // window.load = function () {
  // 	document.getElementById('preloader').style.display = 'none';
  // }

  $(window).on("load", function () {
    $("#preloader").fadeOut("slow", function () {
      $(this).remove();
    });
  });

  //Hero Slider
  $(".hero-slider").slick({
    autoplay: true,
    infinite: true,
    // arrows: true,
    // prevArrow: '<button type=\'button\' class=\'prevArrow\'></button>',
    // nextArrow: '<button type=\'button\' class=\'nextArrow\'></button>',
    dots: false,
    autoplaySpeed: 7000,
    pauseOnFocus: false,
    pauseOnHover: false,
  });
  $(".hero-slider").slickAnimation();

  /* ========================================================================= */
  /*	Header Scroll Background Change
  /* ========================================================================= */

  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    //console.log(scroll);
    if (scroll > 200) {
      //console.log('a');
      $(".navigation").addClass("sticky-header");
    } else {
      //console.log('a');
      $(".navigation").removeClass("sticky-header");
    }
  });

  /* ========================================================================= */
  /*	Chat Bot
  /* ========================================================================= */
  $(function () {
    var INDEX = 0;
    $("#chat-submit").click(function (e) {
      e.preventDefault();
      var msg = $("#chat-input").val();
      if (msg.trim() == "") {
        return false;
      }
      generate_message(msg, "self");
      var buttons = [
        {
          name: "Existing User",
          value: "existing",
        },
        {
          name: "New User",
          value: "new",
        },
      ];
      setTimeout(function () {
        generate_message(msg, "user");
      }, 1000);
    });

    function generate_message(msg, type) {
      INDEX++;
      var str = "";
      str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + '">';
      str += '          <span class="msg-avatar">';
      str +=
        '            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png">';
      str += "          </span>";
      str += '          <div class="cm-msg-text">';
      str += msg;
      str += "          </div>";
      str += "        </div>";
      $(".chat-logs").append(str);
      $("#cm-msg-" + INDEX)
        .hide()
        .fadeIn(300);
      if (type == "self") {
        $("#chat-input").val("");
      }
      $(".chat-logs")
        .stop()
        .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    }

    function generate_button_message(msg, buttons) {
      /* Buttons should be object array 
      [
        {
          name: 'Existing User',
          value: 'existing'
        },
        {
          name: 'New User',
          value: 'new'
        }
      ]
    */
      INDEX++;
      var btn_obj = buttons
        .map(function (button) {
          return (
            '              <li class="button"><a href="javascript:;" class="btn btn-primary chat-btn" chat-value="' +
            button.value +
            '">' +
            button.name +
            "</a></li>"
          );
        })
        .join("");
      var str = "";
      str += "<div id='cm-msg-" + INDEX + '\' class="chat-msg user">';
      str += '          <span class="msg-avatar">';
      str +=
        '            <img src="https://image.crisp.im/avatar/operator/196af8cc-f6ad-4ef7-afd1-c45d5231387c/240/?1483361727745">';
      str += "          </span>";
      str += '          <div class="cm-msg-text">';
      str += msg;
      str += "          </div>";
      str += '          <div class="cm-msg-button">';
      str += "            <ul>";
      str += btn_obj;
      str += "            </ul>";
      str += "          </div>";
      str += "        </div>";
      $(".chat-logs").append(str);
      $("#cm-msg-" + INDEX)
        .hide()
        .fadeIn(300);
      $(".chat-logs")
        .stop()
        .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
      $("#chat-input").attr("disabled", true);
    }

    $(document).delegate(".chat-btn", "click", function () {
      var value = $(this).attr("chat-value");
      var name = $(this).html();
      $("#chat-input").attr("disabled", false);
      generate_message(name, "self");
    });

    $("#chat-circle").click(function () {
      $("#chat-circle").toggle("scale");
      $(".chat-box").toggle("scale");
    });

    $(".chat-box-toggle").click(function () {
      $("#chat-circle").toggle("scale");
      $(".chat-box").toggle("scale");
    });
  });
  /* ========================================================================= */
  /*	Auto Search
  /* ========================================================================= */
  // const basicAutocomplete = document.querySelector('#search-autocomplete');
  // const data = ['One', 'Two', 'Three', 'Four', 'Five'];
  // const dataFilter = (value) => {
  //   return data.filter((item) => {
  //     return item.toLowerCase().startsWith(value.toLowerCase());
  //   });
  // };

  // new mdb.Autocomplete(basicAutocomplete, {
  //   filter: dataFilter
  // });

  /* ========================================================================= */
  /*	ranking slider
  /* ========================================================================= */

  // class CardSlider {
  // 	constructor(cards, { slide = 0 }) {
  // 		this.options = {
  // 			margin: 27,
  // 			width: 280,
  // 			height: 150
  // 		}
  // 		this.cards = this.initCards(cards)
  // 		this.slides = this.initSlides(cards)
  // 		this.slide(slide)
  // 		this.render()
  // 	}

  // 	setActiveCard(n) {
  // 		// remove styles
  // 		if (this.currentSlide !== undefined) {
  // 			this.cards[this.currentSlide].classList.remove('card-active')
  // 			this.slides[this.currentSlide].classList.remove('card-slider__item-active')
  // 		}

  // 		this.currentSlide = n

  // 		this.cards[this.currentSlide].classList.add('card-active')
  // 		this.slides[this.currentSlide].classList.add('card-slider__item-active')
  // 	}

  // 	generateCardTemplate(card) {
  // 		return `
  // 			${card.verified
  // 				? '<div class="card-verified"></div>'
  // 				: ''
  // 			}
  // 			<div class="card-info " style="display:flex;">
  //         <div>
  // 					<p class="card-info__title" style="color:#5f2967;font-weight:700;font-size:16px">Ranking</p>
  //           </div>
  //           <div>
  //           <img src="images/logo.jpg" style="height:30px;" class="me-0">
  //           </div>

  //       </div>
  //       <p class="card-info__balance" style="font-size:13px;">${card.balance}</p>

  // 			<div class="card-numbers" style="font-size:12px;">
  // 				<div>${card.number}</div>
  // 			</div>
  // 		`
  // 	}

  // 	initCards(cards) {
  // 		const cardsElements = []

  // 		for (let i = 0; i < cards.length; i++) {
  // 			const newCard = document.createElement('div')
  // 			newCard.classList.add('card')
  // 			newCard.style.left = `${(this.options['width'] + this.options['margin']) * i}px`
  // 			newCard.style.zIndex = String(i)
  // 			newCard.innerHTML = this.generateCardTemplate(cards[i])
  // 			cardsElements.push(newCard)
  // 		}

  // 		return cardsElements
  // 	}

  // 	initSlides(cards) {
  // 		const slideElements = []

  // 		for (let i = 0; i < cards.length; i++) {
  // 			const slideItem = document.createElement('span')

  // 			slideItem.classList.add('card-slider__item')
  // 			slideItem.addEventListener('click', () => {
  // 				this.slide(i)
  // 			})
  // 			slideElements.push(slideItem)
  // 		}

  // 		return slideElements
  // 	}

  // 	slide(item) {
  // 		this.setActiveCard(item)

  // 		const MAX_HEIGHT_CARD = this.options['height']
  // 		const MULTIPLIER_HEIGHT = 0.9

  // 		for (let i = 0; i <= item; i++) {
  // 			this.cards[i].style.left = `${5 * i}px`

  // 			if (i !== item)
  // 				this.cards[i].style.height = `${MAX_HEIGHT_CARD * MULTIPLIER_HEIGHT ** (item - i)}px`
  // 		}

  // 		this.cards[item].style.height = ''

  // 		for (let i = item + 1; i < this.cards.length; i++) {
  // 			const offsetLeft = (this.options['width'] + this.options['margin']) * (i - item)
  // 			this.cards[i].style.left = `${offsetLeft}px`
  // 			this.cards[i].style.height = ''
  // 		}

  // 	}

  // 	render(cardListClass = '.card-list', cardSliderClass = '.card-slider') {
  // 		const cardList = document.querySelector(cardListClass)
  // 		const cardSlider = document.querySelector(cardSliderClass)

  // 		if (!cardList || !cardSlider) throw new Error('Render error')

  // 		const cardListWrapper = document.createElement('div')

  // 		this.cards.forEach(cardElement => cardListWrapper.appendChild(cardElement))
  // 		this.slides.forEach(slideElement => cardSlider.appendChild(slideElement))

  // 		cardList.appendChild(cardListWrapper)
  // 	}
  // }

  // const cards = [
  // 	{
  // 		balance: "Ranked 20th among the top 100 (government and private Engg) colleges and Ranked 13th among the private institutions in the country. Also ranked 9th in the south region by",
  // 		number: 'Data Quest Employability Ranking 2021, September 2021',
  // 	},
  // 	{
  // 		balance: "Ranked with “AAAAA” rating among the finest private engineering colleges in the South Zone - AP: by",
  // 		number: "Digital Learning, September 2021",
  // 	},
  // 	{
  // 		balance: "Ranked in the band of 201-250 at National level in.",
  // 		number: "NIRF ranking ,MHRD,New Delhi, September 2021",
  // 	},
  // 	{
  // 		balance: "Ranked 61th among the Top Private Engineering colleges in the country and 36th in the South zone and 2nd in Andhra Pradesh by.",
  // 		number: "The Week - August, 2021",
  // 	},
  //   	{
  // 		balance: "Ranked 61th among the Top Private Engineering colleges in the country and 36th in the South zone and 2nd in Andhra Pradesh by.",
  // 		number: "The Week - August, 2021",
  // 	},
  //   	{
  // 		balance: "Ranked 61th among the Top Private Engineering colleges in the country and 36th in the South zone and 2nd in Andhra Pradesh by.",
  // 		number: "The Week - August, 2021",
  // 	},
  // ]

  // new CardSlider(cards, { slide: cards.length-1 })
  /* ========================================================================= */
  /*	Portfolio Filtering Hook
  /* =========================================================================  */

  // filter
  setTimeout(function () {
    var containerEl = document.querySelector(".filtr-container");
    var filterizd;
    if (containerEl) {
      filterizd = $(".filtr-container").filterizr({});
    }
  }, 500);

  /* ========================================================================= */
  /*	Testimonial Carousel
  /* =========================================================================  */

  //Init the slider
  $(".testimonial-slider").slick({
    infinite: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
  });

  /* ========================================================================= */
  /*	Clients Slider Carousel
  /* =========================================================================  */

  //Init the slider
  $(".clients-logo-slider").slick({
    infinite: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
  });

  /* ========================================================================= */
  /*	Company Slider Carousel
  /* =========================================================================  */
  $(".company-gallery").slick({
    infinite: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
  });

  /* ========================================================================= */
  /*   Contact Form Validating
  /* ========================================================================= */

  $("#contact-form").validate({
    rules: {
      name: {
        required: true,
        minlength: 4,
      },
      email: {
        required: true,
        email: true,
      },
      subject: {
        required: false,
      },
      message: {
        required: true,
      },
    },
    messages: {
      user_name: {
        required: "Come on, you have a name don't you?",
        minlength: "Your name must consist of at least 2 characters",
      },
      email: {
        required: "Please put your email address",
      },
      message: {
        required: "Put some messages here?",
        minlength: "Your name must consist of at least 2 characters",
      },
    },
    submitHandler: function (form) {
      $(form).ajaxSubmit({
        type: "POST",
        data: $(form).serialize(),
        url: "sendmail.php",
        success: function () {
          $("#contact-form #success").fadeIn();
        },
        error: function () {
          $("#contact-form #error").fadeIn();
        },
      });
    },
  });

  /* ========================================================================= */
  /*	On scroll fade/bounce effect
  /* ========================================================================= */
  var scroll = new SmoothScroll('a[href*="#"]');

  // -----------------------------
  //  Count Up
  // -----------------------------
  function counter() {
    if ($(".counter").length !== 0) {
      var oTop = $(".counter").offset().top - window.innerHeight;
    }
    if ($(window).scrollTop() > oTop) {
      $(".counter").each(function () {
        var $this = $(this),
          countTo = $this.attr("data-count");
        $({
          countNum: $this.text(),
        }).animate(
          {
            countNum: countTo,
          },
          {
            duration: 1000,
            easing: "swing",
            step: function () {
              $this.text(Math.floor(this.countNum));
            },
            complete: function () {
              $this.text(this.countNum);
            },
          }
        );
      });
    }
  }
  // -----------------------------
  //  On Scroll
  // -----------------------------
  $(window).scroll(function () {
    counter();
  });
})(jQuery);

/* Ranking Card */
var $ranking_card = $(".ranking_card");
var lastranking_card = $(".ranking_card-list .ranking_card").length - 1;

$(".ranking_next").click(function () {
  var prependList = function () {
    if ($(".ranking_card").hasClass("activeNow")) {
      var $slicedranking_card = $(".ranking_card")
        .slice(lastranking_card)
        .removeClass("transformThis activeNow");
      $(".ranking_card-stack ul").prepend($slicedranking_card);
    }
  };
  $(".ranking_card-list li")
    .last()
    .removeClass("transformPrev")
    .addClass("transformThis")
    .prev()
    .addClass("activeNow");
  setTimeout(function () {
    prependList();
  }, 150);
});

$(".ranking_prev").click(function () {
  var appendToList = function () {
    if ($(".ranking_card").hasClass("activeNow")) {
      var $slicedranking_card = $(".ranking_card")
        .slice(0, 1)
        .addClass("transformPrev");
      $(".ranking_card-list").append($slicedranking_card);
    }
  };

  $(".ranking_card-stack li")
    .removeClass("transformPrev")
    .last()
    .addClass("activeNow")
    .prevAll()
    .removeClass("activeNow");
  setTimeout(function () {
    appendToList();
  }, 150);
});

/* Right Side Bar */
let headings = [
  document.getElementById("head1"),
  document.getElementById("head2"),
];
let forms = [
  document.getElementById("form1"),
  document.getElementById("form2"),
];

headings.forEach((head) => head.addEventListener("mouseover", activeLink));

function activeLink() {
  forms.forEach((form) => {
    form.style.visibility = "hidden";
    form.style.opacity = 0;
  });
  let i = headings.indexOf(this);
  forms[i].style.visibility = "visible";
  forms[i].style.opacity = 1;
  this.style.left = "2rem";
}

forms.forEach((form) => form.addEventListener("mouseleave", removeLink));

function removeLink() {
  forms.forEach((form) => {
    form.style.visibility = "hidden";
    form.style.opacity = 0;
  });
  let index = forms.indexOf(this);
  headings[index].style.left = "13.5rem";
}

let top1 = document.getElementById("clickTop");
top1.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

let topEle = document.getElementById("clickTop");
document.addEventListener("scroll", () => {
  if (window.scrollY >= 2500) {
    topEle.style.display = "block";
  } else {
    topEle.style.display = "none";
  }
});

//right side bar
let rightsidebar = document.getElementById("rightsidebar");
document.addEventListener("scroll", () => {
  if (window.scrollY >= 250) {
    rightsidebar.style.display = "none";
  } else {
    rightsidebar.style.display = "block";
  }
});
// companies js
// const root = document.documentElement;
// const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue("--marquee-elements-displayed");
// const marqueeContent = document.querySelector("ul.marquee-content");

// root.style.setProperty("--marquee-elements", marqueeContent.children.length);

// for(let i=0; i<marqueeElementsDisplayed; i++) {
//   marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
// }

// // compaines js end

// // Search Function
// var input = document.getElementById("searchinput");

// input.addEventListener("keyup", function() {
//   document.getElementById("dropdownMenu").click();
//   input.focus();
// });

// var all_headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
// var i = 0;
// all_headings.forEach(element => {
//   element.id = 'heading'+i++;
// });

// function scrollMe(id) {
//   element = document.getElementById(id);
//   element.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
// }

// document.getElementById("dropdownMenu").addEventListener("click", function search() {

//   var txt = document.getElementById("searchinput").value;

//   var txtRE = new RegExp(txt, 'i');
//   var found = 0;

//   var searchDropDown = document.getElementById('searchDropDown');
//   searchDropDown.innerHTML = '';

//   if(txt == '') {
//     searchDropDown.style.display = 'none';
//     return;
//   }

//   searchDropDown.style.display = 'block';
//   all_headings.forEach(element => {
//     var data = element.innerHTML;
//     if(data.match(txtRE)) {

//       var anchor = document.createElement('a');
//       anchor.classList.add('dropdown-item');
//       anchor.innerHTML = element.innerHTML;
//       anchor.href = 'javascript:';
//       anchor.divVal = element.id;
//       searchDropDown.appendChild(anchor);

//       found = 1;
//     }
//   });

//   if(found == 1) {
//     var all_links = document.querySelectorAll('.dropdown-item');
//     all_links.forEach(element => {
//       element.addEventListener("click", function() {
//         scrollMe(element.divVal);
//       })
//     });
//   } else {
//     searchDropDown.style.display = 'none';
//     console.log('Element Not Found');
//   }
// });

/* Contact Us */
function sendMail() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;
  var subject = document.getElementById("subject").value;
  var flag = 0;

  if (name == "") {
    document.getElementById("name").style.border = "1px solid red";
    document.getElementById("nameError").style.display = "inline-block";
    flag = 1;
  } else {
    document.getElementById("name").style.border = "";
    document.getElementById("nameError").style.display = "none";
  }

  if (email == "") {
    document.getElementById("email").style.border = "1px solid red";
    document.getElementById("emailError").style.display = "inline-block";
    flag = 1;
  } else {
    document.getElementById("email").style.border = "";
    document.getElementById("emailError").style.display = "none";
  }

  if (message == "") {
    document.getElementById("message").style.border = "1px solid red";
    document.getElementById("msgError").style.display = "inline-block";
  } else {
    document.getElementById("message").style.border = "";
    document.getElementById("msgError").style.display = "none";
  }

  if (subject == "") {
    document.getElementById("subject").style.border = "1px solid red";
    document.getElementById("subError").style.display = "inline-block";
  } else {
    document.getElementById("subject").style.border = "";
    document.getElementById("subError").style.display = "none";
  }

  if (flag == 0) {
    var emailBody =
      "Hello GMRIT, \n My name is " +
      name +
      "\n and My email is " +
      email +
      "\nI would like to convey you that '" +
      message +
      "'";
    emailBody = emailBody.replace(/\n/g, "%0D%0A");
    var mailto_link =
      "mailto:gmrit@gmrit.edu.in?subject='" +
      subject +
      "'  &  body=" +
      emailBody;
    document.getElementById("mail").action = mailto_link;
  } else {
    return false;
  }
}

/* Horizontal Scroll */
const flavoursContainer = document.getElementById("flavoursContainer");

document.addEventListener("load", () => {
  self.setInterval(() => {
    flavoursContainer.scrollTo(flavoursContainer.scrollLeft + 50, 0);
  }, 200);
});

/* Brochure and Enquiry Database Submission */
function validate(form_type) {
  let name = document.getElementById(form_type + "_name").value;
  let email = document.getElementById(form_type + "_email").value;
  let contact = document.getElementById(form_type + "_contact").value;

  let url =
    "?pageType=" +
    form_type +
    "&name=" +
    name +
    "&email=" +
    email +
    "&contact=" +
    contact;

  if (form_type == "enquiry") {
    let enquiry = document.getElementById(form_type + "_enquiry").value;
    console.log(document.getElementById(form_type + "_enquiry"));
    console.log(enquiry);
    url += "&enquiry=" + enquiry;
  }

  console.log(url);

  let flag = false;

  let name_regex = /^[a-zA-Z]+$/;
  //let email_regex = /^[a-z0-9]+@+[a-z0-9]+[/.]{1}+[a-z]{3,4}$/;
  //let contact_regex = /^[0-9]{10}$/;

  // if(name_regex.test(name)) {
  //   console.log(name);
  // } else {
  //   flag = true;
  // }

  if (flag) {
    return false;
  }

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      if (this.responseText == "Success" && form_type == "brochure") {
        Swal.fire({
          icon: "success",
          title: "Download Brochure",
          html:
            '<a href="http://www.gmrit.org/College_Brochure.pdf" download="' +
            form_type +
            '" style="color: white" target="_blank"><button class="btn btn-primary">Download <i class="fas fa-download"></i></button></a>',
          showConfirmButton: false,
        });
      } else if (this.responseText == "Success" && form_type == "enquiry") {
        Swal.fire({
          icon: "success",
          title: "Enquiry Success",
          text: "Our staff will get to you shortly.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please resubmit the form.",
        });
      }
    }
  };
  xmlhttp.open("GET", "./ajax/brochure.php" + url);
  xmlhttp.send();

  return false;
}

/* Google Maps */

// let exploreTour = document.getElementById('exploreTour');
// let googleVirtualMaps = document.getElementById('googleVirtualMaps');
// exploreTour.addEventListener('click', () => {
//   let overLayer = document.getElementById('overLayer');
//   overLayer.style.display = "none";
//   overLayer.style.zIndex = -1;
// });

// googleVirtualMaps.addEventListener(
//   'mouseleave', () => {
//     overLayer.style.display = "flex";
//     overLayer.style.zIndex = "1";
//   }
// );

// Remove Images and Background Images
/* let images = document.getElementsByTagName('img');
for (let index = 0; index < images.length; index++) {
  const element = images[index];
  element.src = '';
}

var tags = document.getElementsByTagName('*'),
    el;

for (var i = 0, len = tags.length; i < len; i++) {
    el = tags[i];
    if (window.getComputedStyle) {
        if( document.defaultView.getComputedStyle(el, null).getPropertyValue('background-image') !== 'none' ) {
          el.className += ' bg_found';  
          el.style.backgroundImage = '';
        }
    }
} */

// let virtual = document.getElementById('virtual_tour');
// 			virtual.addEventListener('click', () => {
// 				window.open('./target.html', '_blank');
// 			})

//       $(function() {
//         var tickerLength = $('.notificationContainer ul li').length;
//         var tickerHeight = $('.notificationContainer ul li').outerHeight();
//         $('.notificationContainer ul li:last-child').prependTo('.notificationContainer ul');
//         $('.notificationContainer ul').css('marginTop', -tickerHeight);

//         function moveTop() {
//           $('.notificationContainer ul').animate({
//             top: -tickerHeight
//           }, 600, function() {
//             $('.notificationContainer ul li:first-child').appendTo('.notificationContainer ul');
//             $('.notificationContainer ul').css('top', '');
//           });
//         }
//         setInterval(function() {
//           moveTop();
//         }, 3000);
//       });

/* Color Change */
let colorChange = [
  document.getElementById("colorChange1"),
  document.getElementById("colorChange2"),
  document.getElementById("colorChange3"),
];
let colors = ["rgb(48, 103, 180)", "var(--yellow-gmr)", "var(--red-gmr)"];
let colorNumber = 0;
for (let index = 0; index < colorChange.length; index++) {
  colorChange[index].style.color = colors[(colorNumber + index) % 3];
}
setInterval(() => {
  for (let index = 0; index < colorChange.length; index++) {
    colorChange[index].style.color = colors[(colorNumber + index) % 3];
  }
  colorNumber = ++colorNumber % 3;
}, 1000);
