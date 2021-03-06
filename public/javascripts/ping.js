var handler;
var log_area;
var rps;
var mix;
var request_count = 0;
var rps_start = 0;

function updateRps() {
	if (!handler) {
		rps.html('0.00');
		return;
	}

	if (rps_start === 0) {
		rps_start = moment().valueOf();
		return;
	}

	var duration = (moment().valueOf() - rps_start) / 1000;
	if (duration <= 0) {
		return;
	}

	var rps_count = (request_count / duration).toFixed(2);
	rps.html(rps_count);
	request_count = 0;
	rps_start = moment().valueOf();
}

function appendLog(log) {
	log_area.val(moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ' - ' + log + '\n' + log_area.val().substr(0, 1300));
}

function makeRequest(rps) {
	rps = parseInt(rps);

	if (isNaN(rps)) {
		return;
	}

	if (handler) {
		clearInterval(handler);
	}

	if (rps === 0) {
		return;
	}

	handler = setInterval(function () {
		var body = {
			mix: mix.is(':checked'),
			a: 1,
			aa: false,
			aaaa: true
		};

		request_count++;
		$.ajax({
			url: '/ping',
			type: 'post',
			dataType: 'json',
			data: body,
			success: function (data) {
				appendLog('200 Success, response time: ' + data.response_time + 'ms');
			},
			error: function(err) {
				appendLog(err.status + ' ' + err.statusText);
			}
		});
	}, 1000 / rps)
}

$(function () {
	log_area = $('#log');
	rps = $('#rps');
	mix = $('#mix');

	setInterval(function(){
		updateRps();
	}, 1000);

	$('#request').find('label').on('click', function () {
		makeRequest($(this).find('input[name="request"]').val());
	});
});