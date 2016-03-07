var Format = new _Format()

function _Torrent () {
  this.body = $('.list table tbody')
  this.table = $('.list').click(function () {
    $('.list .file').removeClass('selected')
  })
  this.actions = {
    remove: $('.top-menu .action #remove'),
    info: $('.top-menu .action #info')
  }

  this.timer = null
  this.refresh = 3000
}

_Torrent.prototype.getList = function () {
  var hash = document.location.hash.substring(1) ? document.location.hash.substring(1) : '/'
  var self = this
  $.post('/list-t', function (torrents) {
    torrents = JSON.parse(torrents)
    if (torrents.err) {
      var notif = new Pnotif()
      notif.init('top-right', "<p style='padding: 10px; margin: 0px; color:red;'>Action impossible: " + torrents.err + '</p>', 10000)
      notif.draw()
    } else {
      var current_scroll = $('body').scrollTop()

      self.list(torrents)

      $('body').scrollTop(current_scroll)
    }

  })
  clearTimeout(this.timer)
  this.timer = setTimeout(function () {
    self.getList()
  }, this.refresh)
}

_Torrent.prototype.list = function (torrents) {
  for (key in torrents) {
    this.append(torrents[key])
  }
}

_Torrent.prototype.append = function (torrent) {
  var self = this
  if ($('.list  .torrent[hash=' + torrent.hash + ']').length > 0) {
    var $torrent = $('.list .torrent[hash=' + torrent.hash + ']')
    $torrent.html('')
    var needToAppend = 0
  } else {
    var $torrent = $('<tr>').addClass('torrent button').attr('hash', torrent.hash)
    var needToAppend = 1
  }
  $torrent.click(function (event) {
    event.stopPropagation()
    $('.list .torrent').removeClass('selected')
    $(this).addClass('selected')

    self.setActions(torrent, {
      remove: true,
      info: true
    })
  })

  var $name = $('<td>').attr('id', 'name').text(Format.name(torrent.name.substring(0, 50))).appendTo($torrent)
  var $size = $('<td>').attr('id', 'size').text(Format.size(torrent.size)).appendTo($torrent)
  var $progress = $('<td>').attr('id', 'progress').append(
    $('<progress>').attr('max', 1).attr('value', torrent.progress),
    $('<p>').addClass('percent').text(Math.round(torrent.progress * 100) + '%'),
    $('<p>').addClass('remaining-time').text(Format.time(torrent.timeRemaining))
  ).appendTo($torrent)
  var $downspeed = $('<td>').attr('id', 'sdown').text(Format.speed(torrent.sdown)).appendTo($torrent)
  var $upspeed = $('<td>').attr('id', 'sup').text(Format.speed(torrent.sup)).appendTo($torrent)

  if (needToAppend) {
    this.body.append($torrent)
  }
}

_Torrent.prototype.setActions = function (torrent, actions) {
  for (var key in this.actions) {
    this.actions[key].addClass('hide').unbind()
  }

  if (actions.remove) {
    this.actions.remove.removeClass('hide').click(function () {
      if (confirm('Confirmer la suppression de ' + torrent.name + ' ?'))
        $.post('/remove-t', {
          hash: torrent.hash
        }, function (file) {
          file = JSON.parse(file)
          if (torrent.err) {
            var notif = new Pnotif()
            notif.init('top-right', "<p style='padding: 10px; margin: 0px; color:red;'>Action impossible: " + torrent.err + '</p>', 10000)
            notif.draw()
          } else {
            $('tr[hash="' + torrent.hash + '"]').remove()
          }
        })
    })
  }
  if (actions.info) {
    this.actions.info.removeClass('hide')
  }
}