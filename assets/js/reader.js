var reader = {
	db: null,

	setDB: function(db) {
		this.db = db;
	},

	fetchHandles: function() {
		var handlesExec = this.db.exec("SELECT `handle`.`ROWID`, `handle`.`id`, COUNT(handle_id) AS `message_count`" + 
			"FROM `handle`" + 
			"LEFT JOIN `message` ON `message`.`handle_id` = `handle`.`ROWID`" + 
			"GROUP BY `handle`.`ROWID`");
		var handles = handlesExec[0];

		return handles;
	},

	fetchSMSByHandle: function(handle_id) {
		var smsExec = this.db.exec("SELECT `message`.`ROWID`, `message`.`text`, `message`.`is_from_me`, `attachment`.`filename` " + 
			"FROM message " + 
			"LEFT JOIN message_attachment_join ON message.ROWID = message_id " + 
			"LEFT JOIN attachment ON attachment.ROWID = attachment_id " +
			"WHERE `message`.`handle_id` = '" + handle_id + "' " + 
			"ORDER BY `message`.`ROWID` DESC");
		var sms = smsExec[0];

		return sms;
	}
};

var smsFilesElement = document.getElementById("smsFile");
smsFilesElement.onchange = function() {
	var f = smsFilesElement.files[0],
		r = new FileReader();

    r.onload = function() {
        var Uints = new Uint8Array(r.result),
			db = new SQL.Database(Uints),
			handlesDOM = $("#handles"),	handlesResult = null, buffer = "";

		reader.setDB(db);
		handlesResult = reader.fetchHandles();

		for (var i = 0; i < handlesResult.values.length; i++) {
			var handle = handlesResult.values[i];

			buffer += '<li class="tab-switcher" data-vin="view-message-chain" data-sd="sl" data-handle-id="' + handle[0] + '">' + 
				'<div class="innerLi">' + 
					'<div class="big">' + handle[1] + ' </div>' + 
					'<div class="light">' + handle[2] + ' messages</div>' + 
				'</div>' + 
			'</li>';
		}

		handlesDOM.append(buffer);
    }
    r.readAsArrayBuffer(f);

    App.switchTab("view-home", "popin");
};

var htmlEntities = function(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

$('ul#handles').on('click', 'li', function() {
	var handle_id = $(this).data('handle-id'),
		smsResult = reader.fetchSMSByHandle(handle_id),
		smsDOM = $("#sms-messages"), buffer = "";

	$("#phone-number-header").text($(this).find('.innerLi .big').text());

	smsDOM.empty();

	for (var i = 0; i < smsResult.values.length; i++) {
		var sms = smsResult.values[i],
			fromWho = (sms[2] == "1") ? "from-me" : "from-them",
			messageBody = htmlEntities(sms[1]);

		if (sms[3] != null) {
			messageBody = "[ATTACHMENT HERE]";
		}

		buffer += '<div class="message-row"><div class="message"><div class="' + fromWho + '">' + 
			messageBody + 
		'</div></div></div>';
	}

	smsDOM.append(buffer);
});