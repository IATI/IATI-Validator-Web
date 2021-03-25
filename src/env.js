(function (window) {
  window.__env = window.__env || {};

  // API url
  //window.__env.baseUrl = 'http://localhost:3000';
  //window.__env.baseUrl = 'https://iativalidator.iatistandard.org';
  //window.__env.baseUrl = 'http://stage.iativalidator.iatistandard.org';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  //window.__env.apiDataworkBench = 'http://localhost:3000/api/v1';
  //window.__env.apiDataworkBench = 'https://iativalidator.iatistandard.org/api/v1';
  window.__env.apiDataworkBench = 'http://stage.iativalidator.iatistandard.org/api/v1';


  window.__env.stagePass = null;

  //window.__env.valActualVersion = '1.6.2';
  //window.__env.valServerVersion = '1.0.1';
  //window.__env.valWebVersion = '1.4.0';
}(this));
