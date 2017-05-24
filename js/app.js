"use strict";
$(function(){
    const sessionHours = $("#session-hours"),
          sessionMinutes = $("#session-minutes"),
          sessionSeconds = $("#session-seconds"),
          breakHours = $("#break-hours"),
          breakMinutes = $("#break-minutes"),
          breakSeconds = $("#break-seconds"),
          sessionDisplayCountdown = $("#session-countdown"),
          breakDisplayCountdown = $("#break-countdown"),
          bell = new Audio("./libs/bell.mp3");;

    var counter = 0;

    var sessionTimer;
    var breakTimer;

    var sessionInterval;
    var breakInterval;

    var isContinued = true;

    $("#start-timer").on("click", function(){
        resetTimers();
        setTimers();
        startTimers();
    });

    $("#pause-timer").on("click", function(){
        isContinued = !isContinued;
        if(isContinued){
            $(this).text("Pause");
            $(this).addClass("btn-danger");
            $(this).removeClass("btn-success");
        } else {
            $(this).text("Continue");
            $(this).addClass("btn-success");
            $(this).removeClass("btn-danger");
        }
    });

    function setTimers(){
        sessionTimer = (+sessionHours.val() * 60 * 60) + (+sessionMinutes.val() * 60) + +sessionSeconds.val();
        sessionTimer = validationCheck(sessionTimer);
        breakTimer = (+breakHours.val() * 60 * 60) + (+breakMinutes.val() * 60) + +breakSeconds.val();
        breakTimer = validationCheck(breakTimer);
    }
    
    function startTimers(){
        sessionInterval = setInterval(() => {
            timerCounter(sessionTimer);
        }, 1000);
    }

    function timerCounter(timer){
        var timeLeft = timer - counter;
        if(isContinued){
            counter++;
        }
        if(sessionInterval){
            sessionDisplayCountdown.text(convertToHumanTime(timeLeft));
            if(timeLeft <= 0){
                clearInterval(sessionInterval);
                counter = 0;
                sessionInterval = undefined;
                bell.play();
                breakInterval = setInterval(() => {
                    timerCounter(breakTimer);
                }, 1000);
            }
        } else {
            breakDisplayCountdown.text(convertToHumanTime(timeLeft));
            if(timeLeft <= 0){
                clearInterval(breakInterval);
                counter = 0;
                breakInterval = undefined;
                bell.play();
                sessionInterval = setInterval(() => {
                    timerCounter(sessionTimer);
                }, 1000);
            }
        }
    }

    function convertToHumanTime(s){
        var hours = Math.floor((s / 60) / 60);
        var minutes = Math.floor(s / 60) % 60;
        var seconds = s % 60;

        return `${displayWithZero(hours)}:${displayWithZero(minutes)}:${displayWithZero(seconds)}`;
    }

    function displayWithZero(time){
        return time < 10 ? "0" + time : time;
    }

    function validationCheck(timer){
        if(!timer || timer < 0 || isNaN(timer)){
            timer = 1500;
        }
        return timer;
    }

    function resetTimers(){
        clearInterval(sessionInterval);
        clearInterval(breakInterval);
        counter = 0;
    }
})