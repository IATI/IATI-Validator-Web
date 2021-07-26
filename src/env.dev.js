(function (window) {
  window.__env = window.__env || {};

  // API urls
  window.__env.baseUrl = "http://stage.iativalidator.iatistandard.org";
  window.__env.apiDataworkBench =
    "http://stage.iativalidator.iatistandard.org/api/v1";

  // window.__env.validatorServicesUrl = "http://localhost:7071/api"
  window.__env.validatorServicesUrl = "https://dev-api.iatistandard.org/vs"

  // staging password
  window.__env.stagePass = "reallybigsecret";

  // guidance link baseUrl
  window.__env.guidanceLinkBaseUrl = 'https://iatistandard.org/en/iati-standard'
  
  // version display
  // window.__env.valActualVersion = "1.6.2";
  // window.__env.valServerVersion = "1.0.1";
  // window.__env.valWebVersion = "1.4.0";
})(this);
