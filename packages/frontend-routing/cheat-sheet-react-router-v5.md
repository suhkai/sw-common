### [`Route`][route-v5]

### [`Router`][router-v5]

This is a lowlevel (or a superclass) of `<BrowserRouter>`, `<HashRouter>`, `<MemoryRouter>`, `<NativeRouter>`, `<StaticRouter>`.

1. The superclass of above Route Providers
2. Can optionally synchronize with a store like redux, (instead of using `windows.history`??)
3. This is for deep integration with these libs

This is actually brilliant

```jsx
import ReactDOM from "react-dom";
import { Router } from "react-router";  // no specific subclasse `BrowserRouter`, `HashRouter`, `MemoryRouter`, whatever
import { createBrowserHistory } from "history";

// this could be a custom implementation (not using window.history)
// but redux, or whatever....aslong as you keep the "contract" definition.
// in this case BrowerHistory is chosen

const history = createBrowserHistory(); 

ReactDOM.render(
  <Router history={history}>  // plugin your custom history stuff
    <App /> // render your app
  </Router>,
  node
);
```




### [`<StaticRouter>`][static-router-v5]


Is a Provider drop in replacement for the "regular" `<BrowserRouter>`

The rendered App jsx will use `<Route` and this is actually nice thing to detect changes(like redirect) when doing SSR.

Example

```jsx
import http from "http";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";

http
  .createServer((req, res) => {
    // of course there is no "useContext" on the ServerSide, so its just a {} object here
    const context = {};   // 

    const html = ReactDOMServer.renderToString(
    
     // 1. "location" prop is not an object like is used by "react-router"
     // 2. The resulting { url } prop put back in context shows it is a <Re
     
      <StaticRouter location={req.url} context={context}> // context is injected here so we can get the changes afterwards
        <App />
      </StaticRouter>
    
    );
    
    // 
    //

    // context.url: Will contain the URL to redirect to if a <Redirect> was used
    // 		In normal react)-router, location is an object no merely a string
    // was not immediately obvious in the code
    // context.url means redirect actually was called   
    if (context.url) {
      res.writeHead(302, {
        Location: context.url
      });
      res.end();
    } else {
      res.write(html);
      res.end();
    }
  })
  .listen(3000);
```  


### [`<Switch>`][switch-v5]

Switch works like a _"network-switch"_

It chooses one option out of several.

```jsx
<div>
    <Route path="/about">   // will render about
      <About />
    </Route>
    <Route path="/:user">  // will render with user = "about"
      <User />
    </Route>
    <Route>
      <div>.....</div>   // will render always (show 404 page?)
    </Route>
  </div>
```

With `<Swith>`  you pick the first valid one and ignore the rest

```jsx
<Switch>
	<Route exact path="/">
		<Home />
    	</Route>
	<Route path="/about">
      		<About />
	</Route>
	<Route path="/:user">
		<User />
	</Route>
	<Route>        
		<div>....</div>   // do we always need to have a catchall.????
	</Route>
</Switch>
```




### [`generatePath`][generate-path-v5]

takes 2 arguments,
- a string (uses format for `path-to-regexp` module)
- a params object

example;

```javascript
mport { generatePath } from "react-router";

generatePath("/user/:id/:entity(posts|comments)", {
  id: 1,
  entity: "posts"
});
// Will return /user/1/posts
``


### [`history`][history-npm-v5]

`react router` depends on the package [`remix-run/history`](https://github.com/remix-run/history)

### [`location`][location-v5]

```javascript
{
  key: 'ac3df4', // not with HashHistory!
  pathname: '/somewhere',
  search: '?some=search-string',
  hash: '#howdy',
  state: {
    [userDefined]: true
  }
}
```

Access it in:
- `props.location`
- `render` prop in `<Route/>` as `({ location }) => (..)`
- `children` prop in `<Route />` as `({ location }) => (..)`
- `withRouter` (injected as `props.location`

### [`match`]:[match-v5]

property from a `<Route/>` when the path matches as `props.match`:

```javascript
{
	parmas: { id: '123' },
	isExact: true,
	path: '/users/;id', (not sure about this)
	url: '/users/123' (not sure about this)
}
```

Access it in:
- `props.match`
- `render` prop in `<Route/>` as `({match}) => (..)`
- `children` prop in `<Route />` as `({match}) => (..)`
- `withRouter` (injected as `props.match`
- `matchPath` as return value
- `useRouteMatch` as return value



### [`matchPath`][match-path-router-v5]

using something akin to `<Route />` outiside the render cycle


```javascript
import { matchPath } from "react-router";

const match = matchPath("/users/123", {
  path: "/users/:id",
  exact: true,
  strict: false
});
/*
{
	parmas: { id: '123' },
	isExact: true,
	path: '/users/;id', (not sure about this)
	url: '/users/123' (not sure about this)
}
*/
```


### [`withRouter`][with-router-v5]


wrap your component "with"(pun)  withRouter to inject (`match`, `location` and `history`) props to the wrapped component

#### <result of WrappedComment withRouter()>.WrappedCompenent;
```javascript
// injected into props, but taken first from RouterContext,
// guess is like using hooks
// no changes if match, location, history changes
// NON react static methods and orios are copied to parent (wrapped component), this makes the wrappedcomponent look like the actual wrapped on.

function MyComposnt({ match, location, history,...rest }) => {
	.. do other stuff	
	return (<div>...</div>);
}

const MyComponentWithInjectedRouterVars = withRouter(MyComponent);
```

If you want to pass the wrapped component as a `ref` use the `wrappedComponentRef`

```jsx
<MyComponent wrappedComponentRef={c => (this.component = c)} />
```















[route-v5]: https://v5.reactrouter.com/web/api/Route
[router-v5]: https://v5.reactrouter.com/web/api/Router
[static-router-v5]: https://v5.reactrouter.com/web/api/StaticRouter
[switch-v5]: https://v5.reactrouter.com/web/api/Switch
[generate-path-v5]: https://v5.reactrouter.com/web/api/history
[match-v5]: https://v5.reactrouter.com/web/api/match
[with-router-v5]: https://v5.reactrouter.com/web/api/withRouter
[match-path-router-v5]: https://v5.reactrouter.com/web/api/matchPath
[location-v5]: https://v5.reactrouter.com/web/api/location
[history-npm-v5]: https://v5.reactrouter.com/web/api/history

