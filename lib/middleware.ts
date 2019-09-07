import querystring from "querystring";
import {
  HTTP_ACTION,
  REQUESTED,
  RECEIVED,
  FAILED,
  ApiActionOptions
} from "./redux/ApiAction";
/**
 *
 * @param _
 */
const promiseMiddleware = _ => next => action => {
  if (isPromise(action.promise)) {
    action.promise.then(
      res => {
        action.res = res;
        next(action);
      },
      error => {
        action.err = error;
        next(action);
      }
    );

    return;
  }

  next(action);
};
/**
 *
 * @param v
 */
function isPromise(v) {
  return v && typeof v.then === "function";
}
/**
 *
 * @param _
 */
const httpMiddleware = _ => next => action => {
  if (action[HTTP_ACTION]) {
    const { HTTP_ACTION, endpoint, type, HTTP_ACTION_CALLBACKS } = action;

    let fetchOptions: ApiActionOptions = {
      method: HTTP_ACTION.method,
      headers: HTTP_ACTION.headers || [],
      body: HTTP_ACTION.body || null,
      credentials: HTTP_ACTION.credentials
    };

    if (fetchOptions.body) {
      fetchOptions.body = querystring.stringify(fetchOptions.body);
    }

    next({
      type: type + REQUESTED
    });

    const workOnError = err => {
      if (HTTP_ACTION_CALLBACKS) {
        const { errorCallback } = HTTP_ACTION_CALLBACKS;
        if (errorCallback)
          errorCallback(err).then(e => {
            next({
              type: type + FAILED,
              error: e
            });
          });
      } else
        next({
          type: type + FAILED,
          error: err
        });
    };

    fetch(endpoint, fetchOptions)
      .then(data => {
        if (HTTP_ACTION_CALLBACKS) {
          const { successCallback } = HTTP_ACTION_CALLBACKS;
          if (successCallback) {
            successCallback(data)
              .then(res => {
                console.log("res object" + res);
                next({
                  type: type + RECEIVED,
                  payload: res
                });
              })
              .catch(err => workOnError(err));
          }
        } else
          next({
            type: type + RECEIVED,
            payload: data
          });
      })
      .catch(err => workOnError(err));
  } else return next(action);
};

export { promiseMiddleware, httpMiddleware };
