export class Non2xxResponseError extends Error {
  errorInfoObject = {};

  constructor(errorInfoObject, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Non2xxResponseError);
    }

    this.errorInfoObject = errorInfoObject;
  }
}
