// ==UserScript==
// @name        DobroResponse
// @namespace   https://github.com/010011/dobroscript
// @description Добавляет список ответов к посту
// @include     http://dobrochan.ru/*
// @grant       none
// @version     1
// @require     http://zeptojs.com/zepto.min.js
// ==/UserScript==

// generate reply link with popup
function reply_link(to_post, from_post) {
    var a = document.createElement('a');
    // ) and #i are dirty hacks for valid links in op post
    // Узнать, почему на лоре крешится onmouseover
    var onMouse = $(to_post).attr('onmouseover').replace($(to_post).text().substring(2) + ')', from_post  + ')');
    var href =    $(to_post).attr('href').replace('#i' + $(to_post).text().substring(2), '#i' + from_post);
    $(a).attr({
        'onMouseOver': onMouse,
        'href': href
    });
    $(a).text('>>' + from_post);
    return $(a);
}

// append reply link to post body
function append_reply(to_post, from_post) {
    var post = $('#post_' + $(to_post).text().substring(2) + ' .postbody .message');
    var replies = post.find('p.replies');
    // check if post already has reply block
    if (replies.length > 0) {
        $(replies).append('&nbsp;', reply_link(to_post, from_post));
    }
    else {
        // create reply block in post body
        var replies = document.createElement('p');
        $(replies).addClass('replies');
        $(replies).css({
            'margin-top': '15px',
            'font-size': '12px',
            'color': '#444'
        });
        $(replies).html('Ответы:');
        $(replies).append('&nbsp;', reply_link(to_post, from_post));
        $(replies).appendTo(post);
    }
}

$(document).ready(function(){
    // all messages on page
    var posts = $('.message');
    $.each(posts, function(ind, post){
        // current post number
        var from_post = $(post).parent().parent().find('a').attr('name').substring(1);
        // links to previous posts
        var links = $(post).find('a:contains(">>")');
        $.each(links, function(ind, to_post) {
            append_reply(to_post, from_post);
        });
    });
});
