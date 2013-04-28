// ==UserScript==
// @name        DobroHide
// @namespace   https://github.com/010011/dobroscript
// @description Долой мусор! Контролируйте отображаемые треды по их заголовкам.
// @include     http://dobrochan.ru/*
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.0
// @require     http://zeptojs.com/zepto.min.js
// ==/UserScript==

GM_registerMenuCommand("Настройка тредов", openInterface);
var HIDDEN_THREADS = loadSettings();

// close settings window and apply changes
function closeSettings() {
    var HIDDEN_THREADS = loadSettings();
    $('.rage_settings').remove();
    hideThreads(HIDDEN_THREADS);
}

// write settings to greasemonkey's variables
function saveSettings() {
    var threads = $('.rage_threads').val().split("\n");
    GM_setValue('rage_threads', JSON.stringify(threads));
    $('.rage_confirm').text('Схоронено').animate(
        {opacity:0},
        {
            duration:1000, complete:function(){
                $('.rage_confirm').text('').css('opacity',100);
            }
        }
    );
}

// load array of threads to hide from greasemonkey's variables
function loadSettings() {
    var threads = GM_getValue('rage_threads', false);
    if (threads) {
        return JSON.parse(threads);
    }
    else {
        return new Array('Впишите сюда заголовки тредов — по одному на линию. Например:', 'Понитред', 'Official™ Rozen Maiden Thread');
    }
}

// convert array to newline-separated text
function array2text(a) {
    var t = '';
    for (i in a) {
        t = t + a[i] + "\n";
    }
    return t.substring(0, t.length-1);
}

// open settings window and show hidden threads' titles
function openInterface() {
    var HIDDEN_THREADS = loadSettings();

    var settings = document.createElement('div');
    $(settings).addClass('rage_settings')
    $(settings).css({
        'z-index': '99999',
        'position': 'fixed',
        'top': '10px',
        'left': '50%',
        'width': '400px',
        'height': '460px',
        'padding': '10px',
        'margin-left': '-200px',
        'background-color': '#000'
    });
    $(settings).html('<h3 style="color: #fff">Автоматически скрывать:</h3>');

    var area = document.createElement('textarea');
    $(area).addClass('rage_threads');
    $(area).css({
        'width': '390px',
        'height': '340px',
        'margin-left': '0px',
        'margin-right': '5px',
        'margin-bottom': '10px'
    });
    var threads = array2text(HIDDEN_THREADS);
    $(area).text(threads);
    $(area).appendTo($(settings));

    var save = document.createElement('a');
    $(save).html('Схоронить');
    $(save).css({
        'color': '#f80'
    });
    $(save).click(function(){saveSettings();});
    $(save).appendTo($(settings));

    var close = document.createElement('a');
    $(close).html('Закрыть');
    $(close).css({
        'margin-left': '200px',
        'color': '#f80'
    })
    $(close).click(function(){closeSettings();});
    $(close).appendTo($(settings));

    $(settings).append('<br><span class="rage_confirm"></span>');
    $(settings).appendTo($('body'));
};

// add threads to doborchan's cookie and physicaly remove them
function hideThreads(hidden_threads) {
    var ops = $('.oppost label .replytitle');
    $.each(ops, function(key, thread) {
        var title = $(thread).text();
        if ($.inArray(title, hidden_threads) != -1) {
            var href = $(thread).parent().find('.hide').attr('href');
            var victim = $(thread).parent().parent().parent();
            victim.hide(); //thread
            victim.next().hide(); // break
            victim.next().next().hide(); // hr
            $.ajax({
                type: 'GET',
                url: 'http://dobrochan.ru' + href,
                success: function(){
                    console.log('Hidden: ' + title);
                }
            });
        }
    });
}

/**********************************************************************/

$(document).ready(function(){
    hideThreads(HIDDEN_THREADS);
});
