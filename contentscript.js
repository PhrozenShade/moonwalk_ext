function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	sURLVariables = sPageURL.split('&'),
	sParameterName,
	i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
}
function saveState(params){
    return localStorage.setItem(serialHash, JSON.stringify(params));
}
function getState(){
    return JSON.parse(localStorage.getItem(serialHash));
}

var serialHash = window.location.pathname.split('/')[2]; // Хэш названия сериала
var episodeSelected = $('#episode > option:selected'); // Выбранный эпизод
var seasonSelected = $('#season > option:selected'); // Выбранная эпизод
var storage = getState(); // Получим объект из localstorage

var episode = +getUrlParameter('episode');
var season = +getUrlParameter('season');
if(storage && episode != storage.episode && season != storage.season){
	episode = +storage.episode;
	season = +storage.season;
    // Переход на серию, на которой закончили просмотр
    document.location.href = decodeURIComponent(window.location).split('?')[0]+'?season='+season+'&episode='+episode;
} 

saveState({season:season, episode:episode}); // Запишем объект в localstorage

$('#player').trigger('click'); // Начнем отсчет времени

setTimeout(function(){
	$('#launcher > span').trigger('click');
},13500); // Клик на лаунчер и начнем проигрывание

$('#serials_control').after('<div class=wrap><button id=FirstOne class=btn style=float:right>First</button><button id=prevOne class=btn><</button><button id=nextOne class=btn>></button></div>');

$('body').on('click', 'button', function(){
    if($(this).attr('id') === 'prevOne'){ // Предыдущая серия
    	if(episode !== 1) episode --;
    }else if($(this).attr('id') === 'nextOne'){ // Следующая серия
    	episode ++;
    	if((episodeSelected.next().length === 0) && (seasonSelected.next().length !== 0)){ // Если конец сезона - следующий
    		season++;
            episode = 1;
    	}
    }else{ // Начнем сначала
    	episode = 1;
    	season = 1;
    }
    document.location.href = decodeURIComponent(window.location).split('?')[0]+'?season='+season+'&episode='+episode; // Чистим от реферера, не красиво, но так проще :)
});