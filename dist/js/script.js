"use strict";

window.addEventListener("DOMContentLoaded", () => {
  // Tabs

  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

  function hideTabsContent() {
    tabsContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });

    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");
    tabs[i].classList.add("tabheader__item_active");
  }

  hideTabsContent();
  showTabContent();

  tabsParent.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabsContent();
          showTabContent(i);
        }
      });
    }
  });

  //Timer

  const deadline = "2022-04-03";

  function getTimeRemaning(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / (1000 * 60)) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaning(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock(".timer", deadline);

  // Modal

  const btnsOpenModal = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal");

  function openModal() {
    modal.classList.add("show");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerId);
  }

  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  btnsOpenModal.forEach((item) => {
    item.addEventListener("click", openModal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.getAttribute("data-close") == "") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 50000);

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight - 1
    ) {
      openModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }

  window.addEventListener("scroll", showModalByScroll);

  class MenuCard {
    constructor(data, parentSelector, ...classes) {
      this.srcimage = data.img;
      this.imagealt = data.altimg;
      this.title = data.title;
      this.description = data.descr;
      this.price = data.price;
      this.parent = document.querySelector(parentSelector);
      this.classes = classes;
      this.transfer = 27;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      const template = document.createElement("div");
      if (this.classes.length === 0) {
        this.template = "menu__item";
        template.classList.add(this.template);
      } else {
        this.classes.forEach((className) => template.classList.add(className));
      }

      template.innerHTML = `
            <img src=${this.srcimage} alt=${this.imagealt} />
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">
              ${this.description}
            </div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
              <div class="menu__item-cost">Цена:</div>
              <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
    `;
      this.parent.append(template);
    }
  }

  const arrMenuLocal = [
    {
      src: "img/tabs/vegy.jpg",
      alt: "vegy",
      title: 'Меню "Фитнес"',
      description:
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
      price: 9,
    },
    {
      src: "img/tabs/elite.jpg",
      alt: "elite",
      title: "Меню “Премиум”",
      description:
        "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты,фрукты - ресторанное меню без похода в ресторан!",
      price: 20,
    },
    {
      src: "img/tabs/post.jpg",
      alt: "post",
      title: 'Меню "Постное"',
      description:
        " Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля,овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
      price: 13,
    },
  ];

  const getData = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }
    return await res.json();
  };

  getData("http://localhost:3000/menu").then((res) => {
    createMenu(res);
    console.log(res);
  });

  function createMenu(arrMenu) {
    arrMenu.map((itemMenu) => {
      new MenuCard(itemMenu, ".menu .container", "menu__item").render();
    });
  }
  // createMenu(arrMenuLocal);

  // Forms

  const forms = document.querySelectorAll("form");
  const message = {
    loading: "img/form/spinner.svg",
    success: "Ваши данные отправлены",
    error: "Что-то пошло не так",
  };

  forms.forEach((form) => {
    bindPostData(form);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      body: data,
      headers: {
        "Content-type": "application/json",
      },
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
          display: block;
          margin: 0 auto;
      `;
      form.insertAdjacentElement("afterend", statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData(" http://localhost:3000/requests", json)
        .then((data) => {
          console.log(data);
          showThanksDilog(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksDilog(message.error);
          statusMessage.remove();
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  function showThanksDilog(message) {
    const prevModalDilog = document.querySelector(".modal__dialog");
    prevModalDilog.classList.add("hide");
    openModal();

    const currModelDilog = document.createElement("div");
    currModelDilog.classList.add("modal__dialog");
    currModelDilog.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
      </div>`;

    document.querySelector(".modal").append(currModelDilog);
    setTimeout(() => {
      currModelDilog.remove();
      prevModalDilog.classList.remove("hide");
      closeModal();
    }, 4000);
  }

  const slides = document.querySelectorAll(".offer__slide"),
    slider = document.querySelector(".offer__slider"),
    containerSlides = document.querySelector(".offer__slider-container"),
    wrapper = document.querySelector(".offer__slider-wrapper"),
    next = document.querySelector(".offer__slider-next"),
    prev = document.querySelector(".offer__slider-prev"),
    current = document.querySelector("#current"),
    total = document.querySelector("#total"),
    width = window.getComputedStyle(wrapper).width;

  containerSlides.style.width = 100 * slides.length + "%";
  containerSlides.style = `display: flex; width: ${
    100 * slides.length + "%"
  }; transition: 0.5s all`;
  wrapper.style.overflow = "hidden";

  slides.forEach((slide) => {
    slide.style.width = width;
  });

  let offset = 0;
  let slideIndex = 1;

  next.addEventListener("click", () => {
    if (
      offset == +width.slice(0, width.length - 2) * (slides.length - 1) &&
      slideIndex === slides.length
    ) {
      offset = 0;
      slideIndex = 1;
    } else {
      offset += +width.slice(0, width.length - 2);
      slideIndex++;
    }
    containerSlides.style.transform = `translateX(-${offset}px)`;
    current.textContent = getZero(slideIndex);
    dots.forEach((dot) => (dot.style.opacity = "0.5"));
    dots[slideIndex - 1].style.opacity = 1;
  });

  prev.addEventListener("click", () => {
    if (offset <= 0 && slideIndex <= 1) {
      offset = +width.slice(0, width.length - 2) * (slides.length - 1);
      slideIndex = slides.length;
    } else {
      offset -= +width.slice(0, width.length - 2);
      slideIndex--;
    }
    containerSlides.style.transform = `translateX(-${offset}px)`;
    current.textContent = getZero(slideIndex);
    dots.forEach((dot) => (dot.style.opacity = "0.5"));
    dots[slideIndex - 1].style.opacity = 1;
  });

  // let count = 0;
  // let slidesSum = 1;

  current.textContent = getZero(slideIndex);
  total.textContent = getZero(slides.length);

  // function hideContent(arr) {
  //   arr.forEach((item) => {
  //     item.classList.add("hide");
  //     item.classList.remove("show", "fade");
  //   });
  // }

  // function showContent(arr, i) {
  //   arr[i].classList.add("show", "fade");
  //   arr[i].classList.remove("hide");
  // }

  // function changeSlide() {
  //   slides.forEach((item, i) => {
  //     if (i === count) {
  //       hideContent(slides);
  //       showContent(slides, i);
  //       current.textContent = getZero(slidesSum);
  //     }
  //   });
  // }

  // hideContent(slides);
  // showContent(slides, 0);

  // next.addEventListener("click", () => {
  //   if (count >= slides.length - 1 && slidesSum >= slides.length) {
  //     count = 0;
  //     slidesSum = 1;
  //   } else {
  //     ++count;
  //     ++slidesSum;
  //   }
  //   changeSlide();
  // });

  // prev.addEventListener("click", () => {
  //   if (count <= 0) {
  //     count = 3;
  //     slidesSum = 4;
  //   } else {
  //     count--;
  //     slidesSum--;
  //   }
  //   changeSlide();
  // });

  // Dots

  slider.style.position = "relative";

  const indicators = document.createElement("ol"),
    dots = [];

  indicators.classList.add("carousel-indicators");
  slider.append(indicators);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("li");
    dot.setAttribute("data-slide-to", i + 1);
    dot.classList.add("dot");
    if (i == 0) {
      dot.style.opacity = 1;
    }

    indicators.append(dot);
    dots.push(dot);
    dots.forEach((dot) => (dot.style.opacity = "0.5"));
    dots[slideIndex - 1].style.opacity = 1;
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-slide-to");
      slideIndex = index;

      offset = +width.slice(0, width.length - 2) * (index - 1);
      containerSlides.style.transform = `translateX(-${offset}px)`;
      current.textContent = getZero(slideIndex);
      dots.forEach((dot) => (dot.style.opacity = "0.5"));
      dots[slideIndex - 1].style.opacity = 1;
    });
  });
});
