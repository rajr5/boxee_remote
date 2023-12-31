debug = false

function setVolume(percent) {
    $.get(host + '/xbmcCmds/xbmcHttp?command=SetVolume(' + percent + ')', function(data) {
        return true;
    });
}

var volume = '';
// Returns current volume
function getVolume() {
    var result = null;
    $.ajax({
        url: host + '/xbmcCmds/xbmcHttp?command=GetVolume',
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(data) {
            result = data;
        } 
     });
    if (debug == true) { console.log("result: ", result); }
    volume = result.substr(11).split('<')[0];
    if (debug == true) { console.log("volume: ", volume); }
    return volume;
}

// Displays current volume in popup
function setVolumeDisplay() {
    volume = getVolume();
    if (debug == true) { console.log("Setting volume to: ", volume); }
    $("#volume").text(volume);
}

// Takes a positive or negative int to change volume
// Also updates volume display in popup
function volumeChange(percent) {
    volume = getVolume();
    if (debug == true) { console.log("Current volume: ", volume, " change: ", percent); }
    new_volume = parseInt(volume) + parseInt(percent);
    if (new_volume > 100) {
        new_volume = 100;
    }
    else if (new_volume < 0) {
        new_volume = 0;
    }
    if (debug == true) { console.log("New volume: ", new_volume); }
    $.get(host + '/xbmcCmds/xbmcHttp?command=SetVolume(' + new_volume + ')', function(data) {
        ;
    });
    $("#volume").text(new_volume);
}

function mute() {
    $.get(host + '/xbmcCmds/xbmcHttp?command=Mute', function(data) {
        return true;
    });
}

function pause() {
    $.get(host + '/xbmcCmds/xbmcHttp?command=Pause', function(data) {
        return true;
    });
}

function playNext() {
    $.get(host + '/xbmcCmds/xbmcHttp?command=PlayNext', function(data) {
        return true;
    });
}

function playPrev() {
    $.get(host + '/xbmcCmds/xbmcHttp?command=PlayPrev', function(data) {
        return true;
    });
}

function seekPercentage(percent) {
    $.get(host + '/xbmcCmds/xbmcHttp?command=SeekPercentage(' + percent + ')', function(data) {
        return true;
    });
}

// Get percent into TV/movie
function getPercentage() {
    $.get(host + '/xbmcCmds/xbmcHttp?command=GetPercentage', function(data) {
        var percent = data.substr(11).split('<')[0];
        if (debug == true) { console.log("Percent: ", percent); }
        return percent;
    });
}

// Button functions, simulates remote
function up() {
    $.get(host + '/xbmcCmds/xbmcHttp?command=SendKey(270)', function(data) {
        return true;
    });
}

function down() {
    $.get(host + '/xbmcCmds/xbmcHttp?command=SendKey(271)', function(data) {
        return true;
    });
}

function left() {
    $.get(host + '/xbmcCmds/xbmcHttp?command=SendKey(272)', function(data) {
        return true;
    });
}

function right() {
    $.get(host + '/xbmcCmds/xbmcHttp?command=SendKey(273)', function(data) {
        return true;
    });
}

function back() {
    $.get(host + '/xbmcCmds/xbmcHttp?command=SendKey(275)', function(data) {
        return true;
    });
}

function select() {
    $.get(host + '/xbmcCmds/xbmcHttp?command=SendKey(' + 61453 + ')', function(data) {
        return true;
    });
}

function sendKey(key) {
    $.get(host + '/xbmcCmds/xbmcHttp?command=SendKey(' + key + ')', function(data) {
        return true;
    });
}

// Set the host variable and store it in HTML5 local storage
function setHost() {
    host = $("#host_url").val()
    localStorage.setItem("boxee_url", host);
    if (debug == true) { console.log("new host is: ", host); }
}

// Default hostname and port
host = "http://boxeebox:8800";

$(document).ready(function() {
    if (debug == true) { console.log("Document ready, registering buttons"); }
    if (localStorage.getItem("boxee_url") === null) {
        localStorage.setItem("boxee_url", "http://boxeebox:8800");
    }
    host = localStorage.getItem("boxee_url");
    $("#host_url").val(host);
    $("#host_url_submit").click(function() {
        setHost();
    });
    // Register key presses as shortcuts, WASD for controls, RF for volume
    // Q for back, enter for select
    $("#body").bind("keypress", function(e) {
        if (debug == true) { console.log("keypress", e, e.target); }
        if (e.keyCode == 119) {
            // w
            up();
        }
        else if (e.keyCode == 97) {
            // a
            left();
        }
        else if (e.keyCode == 115) {
            // s
            down();
        }
        else if (e.keyCode == 100) {
            // d
            right();
        }
        else if (e.keyCode == 13) {
            // enter
            select();
        }
        else if (e.keyCode == 113) {
            // q
            back();
        }
        else if (e.keyCode == 114) {
            // r
            volumeChange("10");
        }
        else if (e.keyCode == 102) {
            // f
            volumeChange("-10");
        }
        if (debug == true) { console.log(e.keyCode, e); }
    });

    // Register click functions for popup buttons
    $("#btn_up").on("click", function() {
        up();
    });
    $("#btn_down").click(function () {
        down();
    });
    $("#btn_right").click(function () {
        right();
    });
    $("#btn_left").click(function () {
        left();
    });
    $("#btn_ok").click(function () {
        select(); 
    });
    $("#btn_back").click(function () {
        back(); 
    });
    $("#btn_volume_up").click(function () {
        volumeChange(10); 
    });
    $("#btn_volume_down").click(function () {
        volumeChange(-10); 
    });
    // Show current volume in popup
    setVolumeDisplay();
});
