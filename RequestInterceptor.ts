
export interface RequestInterceptor {
  (oldRequest: Request): Request | Response
}

type HeaderKey = string;
type HeaderValueOrFactory = string | (() => string);

export abstract class RequestInterceptorFactory {
  static createAppendHeaderRequestInterceptor(headers: Record<HeaderKey, HeaderValueOrFactory> | [HeaderKey, HeaderValueOrFactory][]): RequestInterceptor {
    return (oldRequest) => {
      // normalize to array
      let headerArrayFactory: [string, HeaderValueOrFactory][];
      if (!Array.isArray(headers)) {
        headerArrayFactory = Object.entries(headers);
      } else {
        headerArrayFactory = headers;
      }

      // get final value
      const headerArray = headerArrayFactory.map(([key, valueOrFactory]) => {
        const finalVlaue = typeof valueOrFactory === 'function' ? valueOrFactory() : valueOrFactory;
        return [key, finalVlaue];
      });

      // only add if not existing
      headerArray.forEach(([headerKey, headerValue]) => {
        if (!oldRequest.headers.has(headerKey)) {
          oldRequest.headers.set(headerKey, headerValue);
        }
      });
      return oldRequest;
    }
  }
}
