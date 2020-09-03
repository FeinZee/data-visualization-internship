module.exports = class extends think.Controller {
  __before() {
    this.header("Access-Control-Allow-Origin", "http://localhost:8080");
  }
};
