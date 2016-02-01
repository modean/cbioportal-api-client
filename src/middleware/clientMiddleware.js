export default function clientMiddleware (reducer) {
  return ({dispatch, getState}) => {
    return (next) => (action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, reducer, next);
      }

      const { promise, types, ...rest } = action;
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST});
      return promise(dispatch, getState, reducer).then(
        (result) => next({...rest, result, type: SUCCESS}),
        (error) => next({...rest, error, type: FAILURE})
      ).catch((error)=> {
        console.error('MIDDLEWARE ERROR:', error);
        next({...rest, error, type: FAILURE});
      });
    };
  };
}
