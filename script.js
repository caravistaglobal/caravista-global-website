/*==================================================
  CARAVISTA GLOBAL EDUCATION
  Website Version 1.0
==================================================*/

document.addEventListener("DOMContentLoaded", function () {

    /*=========================================
      SMOOTH SCROLL
    =========================================*/

    const links = document.querySelectorAll('nav a[href^="#"]');

    links.forEach(link => {

        link.addEventListener("click", function (e) {

            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                window.scrollTo({

                    top: target.offsetTop - 80,

                    behavior: "smooth"

                });

            }

        });

    });

    /*=========================================
      HEADER SHADOW
    =========================================*/

    const header = document.querySelector("header");

    window.addEventListener("scroll", function () {

        if (window.scrollY > 20) {

            header.style.boxShadow = "0 8px 25px rgba(0,0,0,.15)";

        } else {

            header.style.boxShadow = "0 2px 15px rgba(0,0,0,.08)";

        }

    });

    /*=========================================
      ACTIVE NAVIGATION
    =========================================*/

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav a");

    window.addEventListener("scroll", function () {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 120;

            if (pageYOffset >= sectionTop) {

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    });

    /*=========================================
      FADE-IN ANIMATION
    =========================================*/

    const fadeItems = document.querySelectorAll("section");

    const observer = new IntersectionObserver(function(entries){

        entries.forEach(entry => {

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    },{

        threshold:0.15

    });

    fadeItems.forEach(item=>{

        item.classList.add("fade");

        observer.observe(item);

    });

    /*=========================================
      HERO BUTTON ANIMATION
    =========================================*/

    const buttons = document.querySelectorAll(".btn-primary,.btn-secondary");

    buttons.forEach(button=>{

        button.addEventListener("mouseenter",function(){

            this.style.transform="translateY(-4px) scale(1.03)";

        });

        button.addEventListener("mouseleave",function(){

            this.style.transform="translateY(0) scale(1)";

        });

    });

    /*=========================================
      SCROLL TO TOP BUTTON
    =========================================*/

    const topButton=document.createElement("button");

    topButton.innerHTML="↑";

    topButton.id="topButton";

    document.body.appendChild(topButton);

    Object.assign(topButton.style,{

        position:"fixed",

        bottom:"25px",

        right:"25px",

        width:"50px",

        height:"50px",

        border:"none",

        borderRadius:"50%",

        background:"#F4A300",

        color:"#fff",

        fontSize:"22px",

        cursor:"pointer",

        display:"none",

        zIndex:"9999",

        boxShadow:"0 10px 20px rgba(0,0,0,.25)",

        transition:"0.3s"

    });

    window.addEventListener("scroll",function(){

        if(window.scrollY>400){

            topButton.style.display="block";

        }else{

            topButton.style.display="none";

        }

    });

    topButton.addEventListener("click",function(){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

    /*=========================================
      FOOTER YEAR
    =========================================*/

    const footer=document.querySelector("footer");

    if(footer){

        const year=document.createElement("p");

        year.style.marginTop="20px";

        year.innerHTML="© "+new Date().getFullYear()+" CaraVista Global Education";

        footer.appendChild(year);

    }

    /*=========================================
      PAGE LOADED
    =========================================*/

    console.log("CaraVista Global Website Version 1.0 Loaded");

});

