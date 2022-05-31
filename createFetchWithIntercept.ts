import { RequestInterceptor } from './RequestInterceptor';
import { ResponseInterceptor } from './ResponseInterceptor';

// Do something before sending request or after getting response
//
// origional request ==> request interceptors ==> final request
// --> origional response ==> response interceptors ==> final response
// --> user code
//
// @param requestInterceptor do something before sending request
// @param responseInterceptor do something after getting response
// @returns fetch with interceptors wrapper
export function createFetchWithIntercept(requestInterceptors: RequestInterceptor[], responseInterceptors: ResponseInterceptor[]) {
  const fetchWithIntercept: typeof fetch = (input, init) => {
    const request = new Request(input, init);
    // apply request interceptors
    // const finalRequest = requestInterceptors.reduce((curRequest, requestInterceptor) =>
    //   requestInterceptor(curRequest), request);

    let finalRequest: Request = request;
    for (let index = 0; index < requestInterceptors.length; index++) {
      const requestInterceptor = requestInterceptors[index];
      const candidate = requestInterceptor(finalRequest);
      if (candidate instanceof Response) {
        // never reject, for fetch only fails when network down.
        return Promise.resolve(candidate);
      }
      finalRequest = candidate;
    }

    const finalReaponse = fetch(finalRequest)
      .then(response =>
        // apply response interceptors
        responseInterceptors.reduce((curResponse, responseInterceptor) =>
          responseInterceptor(curResponse), response));
    return finalReaponse;
  };
  return fetchWithIntercept;
}
