const content = $('content');
const sidebar = $('.sidebar');
const blockheight = 4.5; //the height of the graphical episode representations in em
let modalAnimationDone = true;
let animationPos = {top: 0, left: 0};
let lastmsSM;
let contentHeight;
let channels = [];
let programs = {};
let lokalaKanaler = [];
let lokalKanal = "P4 Stockholm";

function init() {
    console.time('init');
    sidebar.empty();
    content.empty();
    channels = [];
    var d = new Date(), e = new Date(d);
    var msSinceMidnight = e - d.setHours(0,0,0,0);

    content.append('<div class="timeindicator" style=";width:' + msSinceMidnight / 100000 + 'em;"></div>');

    scrollToNow();

    getJSON(channelsURL).then((data) => {
        for (var i in data.channels) {
            let channel = data.channels[i];
            if (channel.scheduleurl != undefined) {
                //setup a searchable JSON
                if (channel.name.match("(!?P4).")) {
                    lokalaKanaler.push(channel.name);
                }
                if (!channel.name.match("(?:P4).+") || channel.name.match(lokalKanal)) {
                    channel.name = channel.name;
                    channel.id = channel.id;
                    channel.topOffset = channels.length * blockheight;
                    channel.channeltype = channel.channeltype;
                    channel.scheduleurl = makeSSL(channel.scheduleurl);
                    channel.liveaudio.url = makeSSL(channel.liveaudio.url);
                    channel.color = "#" + channel.color;
                    channel.image = getVector(channel.image);
                    contentHeight = channels.length * blockheight;
                    sidebar.css('height', contentHeight + 'em');
                    $('.timeindicator').css('height', contentHeight + 'em');
                    channels.push(channel);
                    if (channel.scheduleurl != undefined && channel.name != 'Ekot sänder direkt') {
                        build(channel);
                    }
                }
            }
        }
    });
    console.timeEnd('init');
}

function build(channel) {
    getJSON(scheduleURL(channel.id, new Date())).then((data) => {
        api = data;
        content.append(channelTemplate(channel));
        const guide = $('#' + channel.id);
        let loadTime = new Date();
        sidebar.append(channelIconTemplate(channel));
        for (let j in api.schedule) {
            new Promise(function(resolve, reject) {
                let program = api.schedule[j];
                const programStart = standardizeTime(program.starttimeutc);
                const programEnd = standardizeTime(program.endtimeutc);

                if (programStart >= loadTime) {
                    program.fade = true;
                }

                program.duration = timeToEM(programEnd - programStart);
                program.absolutePos = timeToEM(programStart - new Date().setHours(0,0,0,0));
                program.starttime = readableTime(programStart);
                program.endtime = readableTime(programEnd);
                if (program.title == "Ekonyheter" || program.title == "Dagens Eko ") {
                    program.title = "Ekot";
                    program.programcolor = "#0065bd";
                    program.imageurl = ekotAlbumart;
                } else {
                    program.programcolor = getChannelColor(channel.id, channel.color);
                }
                programs[program.program.id] = program;
                guide.append(programTemplate(program));
            });
        }
    });
}


function expandProgram(e) {
    if (modalAnimationDone) {
        let program = $(e);
        let visibleModal = program.find('div');
        let programDetail = program.find('detail');
        if ($('.program-info').length > 0) {
            enableScroll();
            let previous = $('.program-info');
            if (previous.parent().hasClass('fadedprogram')) {
                previous.parent().animate({opacity: 0.5}, 600);
            }
            previous.find('detail').hide();
            previous.animate({top: animationPos.top, left: animationPos.left}, 0).promise().done(() => {
                previous.removeClass('program-info').css('position', '').css('z-index', '').css('top', '').css('left', '').fadeIn();
            });
        } else {
            try {
                gaSend('Episode detail', 'expand', visibleModal.find('p')[0].textContent);
            } catch (e) {
            }
            disableScroll();
            animationPos.left = visibleModal.css('left');
            animationPos.top = visibleModal.css('top');
            visibleModal.css({position: 'fixed','z-index': 1000,top: animationPos.top,left: animationPos.left});
            modalAnimationDone = false;
            if (program.hasClass('fadedprogram')) {
                program.animate({opacity: 1}, 100);
            }
            visibleModal.addClass('program-info');
            visibleModal.animate({top: 0, left: 0}, 200).promise().done(() => {
                programDetail.fadeIn();
            });
            modalAnimationDone = true;

            if (programDetail.length == 0) {
                getProgramData(program);
            }
        }
    }
}

function getProgramData(program) {
    let programDetail = program.find('detail');
    getJSON(episodeURL({'id': program.attr('eid')})).then(function (data) {
        data.episode.imageurl = makeSSL(data.episode.imageurl);
        program.find('div').append(programDetailTemplate(data.episode));
        programDetail.hide();
        if (modalAnimationDone) {
            programDetail.fadeIn();
        }
    }).catch((err) => {
        getJSON(programURL({'id': program.attr('pid')})).then(function (data) {
            data.imageurl = makeSSL(data.programimage);
            data.title = data.name;
            data.description = data.program.description;
            program.find('div').append(programDetailTemplate(data));
            programDetail.hide();
            if (modalAnimationDone) {
                programDetail.fadeIn();
            }
        }).catch((err)=> {
            console.log('404');
            program.find('div').append(programDetailTemplate({'description': 'Ingen information tillgänglig'}));
        });
    });
}

init();

setInterval(function() {
    var d = new Date(), e = new Date(d);
    var msSinceMidnight = e - d.setHours(0,0,0,0);
    if (msSinceMidnight < lastmsSM) {
        init();
    }
    lastmsSM = msSinceMidnight;
    $('.timeindicator').css('width', msSinceMidnight / 100000 + 'em');

    $('.fadedprogram').promise().done(function (faded) {
        const currTime = readableTime(new Date());
        for (var i = 0; faded.length > i; i++) {
            if (currTime >= $(faded[i]).find('.starttime').text()) {
                $(faded[i]).css('opacity', 0.5);
                $(faded[i]).removeClass('fadedprogram');
                $(faded[i]).animate({opacity: 1}, 500)
            }
        }
    });
}, 10000);

window.addEventListener('beforeinstallprompt', function(e) {
    // beforeinstallprompt Event fired
    e.preventDefault();
});
