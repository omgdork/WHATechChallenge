import angular from 'angular';
import 'angular-ui-router';
import routesConfig from './routes';

import FileUploadOnChange from './app/directives/file-upload-on-change/file-upload-on-change';

import {main} from './app/main';

import './index.less';

angular
  .module('app', ['ui.router'])
  .config(routesConfig)
  .component('app', main)
  .directive('fileUploadOnChange', FileUploadOnChange.directiveFactory);
