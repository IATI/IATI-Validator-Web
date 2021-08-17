(function (window) {
  window.__env = window.__env || {};

  // API urls
  window.__env.baseUrl = "https://dev-validator.iatistandard.org/";

  // window.__env.validatorServicesUrl = "http://localhost:7071/api"
  window.__env.validatorServicesUrl = "https://dev-iati-api-gateway.azure-api.net/vs"

  // staging password
  window.__env.stagePass = null;

  // version display
   window.__env.valApiVersion = "2.0.0";
   window.__env.valServicesVersion = "2.0.0";
   window.__env.valWebVersion = "2.0.0";
})(this);
