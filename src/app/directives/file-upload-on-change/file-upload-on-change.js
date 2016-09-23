export default class FileUploadOnChange {
  constructor() {
    this.restrict = 'A';
  }

  link(scope, element, attrs) {
    const onChangeHandler = scope.$eval(attrs.fileUploadOnChange);

    element.on('change', onChangeHandler.bind(scope));
  }

  static directiveFactory() {
    FileUploadOnChange.instance = new FileUploadOnChange();
    return FileUploadOnChange.instance;
  }
}
