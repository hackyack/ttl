;(function () {
  /**
   * Loading screen
   * @constructor
  */
  function _Loading () {
    this.vue = new App.Vue({
      el: '.loading',
      data: {
        state: true
      }
    })
  }

  /**
   * Hide loading screen
  */
  _Loading.prototype.hide = function () {
    this.vue.$data.state = false
  }

  /**
   * Show loading screen
  */
  _Loading.prototype.show = function () {
    this.vue.$data.state = true
  }

  App.Loading = new _Loading()
})()
