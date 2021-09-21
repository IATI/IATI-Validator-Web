(function (window) {
  window.__env = window.__env || {};

  // API urls
  window.__env.baseUrl = "https://prod-validator.iatistandard.org/";
  window.__env.validatorServicesUrl = "https://api.iatistandard.org/vs"

  // validator services api key
  window.__env.validatorServicesKeyName = 'Ocp-Apim-Subscription-Key';
  window.__env.validatorServicesKeyValue = '280182cc8cb8436cb94102f485034fd1';

  // staging password
  window.__env.stagePass = null;

  // guidance link baseUrl
  window.__env.guidanceLinkBaseUrl = 'https://iatistandard.org/en/iati-standard'
  
})(this);
