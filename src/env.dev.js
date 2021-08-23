(function (window) {
  window.__env = window.__env || {};

  // API urls
  window.__env.baseUrl = "https://dev-validator.iatistandard.org/";

  // window.__env.validatorServicesUrl = "http://localhost:7071/api"
  window.__env.validatorServicesUrl = "https://dev-api.iatistandard.org/vs"

  window.__env.validatorServicesKeyName = 'Ocp-Apim-Subscription-Key';
  window.__env.validatorServicesKeyValue = 'f81a07a8e4e04a4894123167ac96f804';

  // staging password
  window.__env.stagePass = "reallybigsecret";

  // guidance link baseUrl
  window.__env.guidanceLinkBaseUrl = 'https://iatistandard.org/en/iati-standard'

})(this);
