import React from 'react'
import { Provider } from 'react-redux'
import Store from 'lib/store'
import App from 'next/app'
import { initSocketService } from "lib/services";
import { PersistGate } from 'redux-persist/lib/integration/react';

export const withRedux = (PageComponent, { ssr = true } = {}) => {
  const WithRedux = ({ initialReduxState, ...props }) => {

    const store = React.useMemo(() => {
      return Store(initialReduxState)
    }, []);

    React.useEffect(() => {
      initSocketService(store.dispatch);
    }, [])

    return (
      <Provider store={store}>
        <PersistGate persistor={store.__PERSISTOR} loading={null}>
        <PageComponent {...props} />
        </PersistGate>
      </Provider>
    )
  }

  // Make sure people don't use this HOC on _app.js level
  if (process.env.NODE_ENV !== 'production') {
    const isAppHoc =
      PageComponent === App || PageComponent.prototype instanceof App
    if (isAppHoc) {
      throw new Error('The withRedux HOC only works with PageComponents')
    }
  }

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component'

    WithRedux.displayName = `withRedux(${displayName})`
  }

  if (ssr || PageComponent.getInitialProps) {
    WithRedux.getInitialProps = async context => {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore = Store()

      // Provide the store to getInitialProps of pages
      context.reduxStore = reduxStore

      // Run getInitialProps from HOCed PageComponent
      const pageProps =
        typeof PageComponent.getInitialProps === 'function'
          ? await PageComponent.getInitialProps(context)
          : {}

      // Pass props to PageComponent
      return {
        ...pageProps,
        initialReduxState: reduxStore.getState()
      }
    }
  }

  return WithRedux
}

