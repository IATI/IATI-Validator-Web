(function (window) {
  window.__env = window.__env || {};

  // API urls
  window.__env.baseUrl = "https://dev-validator.iatistandard.org/";

  // window.__env.validatorServicesUrl = "http://localhost:7071/api"
  // window.__env.validatorServicesUrl = "https://dev-api.iatistandard.org/vs"
  window.__env.validatorServicesUrl = "https://api.iatistandard.org/vs"

  window.__env.validatorServicesKeyName = 'Ocp-Apim-Subscription-Key';
  window.__env.validatorServicesKeyValue = '280182cc8cb8436cb94102f485034fd1';

  // staging password
  window.__env.stagePass = "reallybigsecret";

  // guidance link baseUrl
  window.__env.guidanceLinkBaseUrl = 'https://iatistandard.org/en/iati-standard'
  
  // version display
  window.__env.valApiVersion = "2.0.0";
  window.__env.valServicesVersion = "2.0.0";
  window.__env.valWebVersion = "2.0.0";
})(this);
