module.exports = class extends think.Controller {
  __before() {
    this.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
  }
};
