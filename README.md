# use-singleton-react-state

A singleton version of React useState

![GitHub](https://img.shields.io/github/license/AndrewLawendy/use-singleton-react-state)
![GitHub package.json version](https://img.shields.io/github/package-json/v/AndrewLawendy/use-singleton-react-state)
![npm](https://img.shields.io/npm/dw/use-singleton-react-state)
![GitHub file size in bytes](https://img.shields.io/github/size/AndrewLawendy/use-singleton-react-state/src/index.ts)

[![NPM](https://nodei.co/npm/use-singleton-react-state.png?downloads=true)](https://nodei.co/npm/use-singleton-react-state/)

## Motivation

Working in many React projects, I, sometimes, need to access or modify a certain state created by another component, without the need to put the state the parent of this 2 components to avoid rerendering ont on the setter component. Examples will be shown further.

### Why not using React Context?

For a similar reason of not add the state on the top, to avoid rerendering on the setter component.

Let's have a look on the common use of context to understand more

```javascript
const { setContextValue } = useContext(appContext);
```

It seems harmless, it only set the data in the context, and you're not even consuming the value, but in fact you are.

The object destruction you're using for convention is simply consuming the context, and only using the setter property.

```javascript
const context = useContext(appContext); // { contextValue, setContextValue }
const { setContextValue } = context;
```

## Use cases

Let's say you have table, its filters and params, but at a specific occasion, you need to reset these filters.

Say your profile has multiple characters:

- Your first one has multiple pages in the table and you decided to switch character on page 2 from the header
- Your second character doesn't have much data to show int he table, only for the page 1, yet the request to the server was sent with page 2, so it returns _nothing_.

What you need here is to be able to reset the filters from the header component without the need to rerender the header component or any sibling.

## How to use

Say you have your custom hook `useFilers.ts`, basically you use it in the `ListFilter.tsx` and want to manipulate it as well from `Header.tsx`

```javascript
// useFilters.ts
import SingletonReactState from "use-singleton-react-state";

const {
  createSingletonStateHook,
  updateSingletonState: updateSingletonFilters,
  singletonState: filtersSingletonState,
} = SingletonReactState();

function useFilters<T>(
  initialValue: Partial<T>
): [T, (newFilters: Partial<T>) => void] {
  ...
}

export default createSingletonStateHook<typeof useFilters, true>(useFilters);
export { filtersSingletonState, updateSingletonFilters };
```

```javascript
// ListFilter.tsx
...
const [filters, updateFilters] = useFilters({ page: 1 });
...
```

```jsx
// Header.tsx
import { updateSingletonFilters } from "hooks/useFilters"

const Header = () => {
  ...

  <button onClick={() => updateSingletonFilters({ page: 1 })}>Reset Filter</button>
  ...
}
```

With this implementation `filtersSingletonState` will change with each file calling `useFilters`.

That means that `updateSingletonFilters` can be called from within other components to manipulate the state.

## Api for `createSingletonStateHook`

| Param | Type     | Description                   |
| ----- | -------- | ----------------------------- |
| `<T>` | Type     | The `typeof` your custom hook |
| hooks | Argument | The custom hook               |
