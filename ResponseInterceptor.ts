export interface ResponseInterceptor {
  (oldResponse: Response): Response
}

export abstract class ResponseInterceptorFactory {
  static createSideEffectResponseInterceptor(predicate: (response: Response) => boolean, callback: (response: Response) => void): ResponseInterceptor {
    return (response) => {
      if (predicate(response)) {
        callback(response);
      }
      return response;
    }
  }
}
