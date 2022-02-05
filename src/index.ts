type CustomHookType = <T, U = T>(
  initialValue: T
) => readonly [T, (newValue: U) => void];

function SingletonState() {
  let singletonCustomHook: unknown,
    singletonState: unknown,
    setSingletonState: (value: unknown) => void;

  const useSingletonStateHook = (
    initialValue: unknown
  ): readonly [unknown, (value: unknown) => void] => {
    const [state, setState, ...rest] = (singletonCustomHook as CustomHookType)(
      initialValue
    );
    singletonState = state;
    setSingletonState = setState;

    return [singletonState, setSingletonState, ...rest];
  };

  const updateSingletonState = (newValue: unknown) => {
    setSingletonState?.(newValue);
  };

  const createSingletonStateHook = <Hook = CustomHookType>(
    customHook: Hook
  ): Hook => {
    singletonCustomHook = customHook;

    return useSingletonStateHook as unknown as Hook;
  };

  return {
    createSingletonStateHook,
    singletonState,
    updateSingletonState,
  };
}

export default SingletonState;
