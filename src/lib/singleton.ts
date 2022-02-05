type CustomHookType = <T, U = T>(
  initialValue: T
) => readonly [T, (newValue: U) => void];

const SingletonState = function () {
  let singletonCustomHook: unknown,
    singletonState: unknown,
    setSingletonState: (value: unknown) => void;

  const useEditableSingletonStateHook = (
    initialValue: unknown
  ): readonly [unknown, (value: unknown) => void] => {
    const [state, setState, ...rest] = (singletonCustomHook as CustomHookType)(
      initialValue
    );
    singletonState = state;
    setSingletonState = setState;

    return [singletonState, setSingletonState, ...rest];
  };

  const useSingletonStateHook = (
    initialValue: unknown
  ): readonly [unknown, (value: unknown) => void] => {
    const [state, setState, ...rest] = (singletonCustomHook as CustomHookType)(
      initialValue
    );

    if (setSingletonState === undefined) {
      singletonState = state;
      setSingletonState = setState;
    }

    return [singletonState, setSingletonState, ...rest];
  };

  const updateSingletonState = (newValue: unknown) => {
    setSingletonState?.(newValue);
  };

  const createSingletonStateHook = <Hook = CustomHookType>(
    customHook: Hook,
    enableReinitialize = false
  ): Hook => {
    singletonCustomHook = customHook;

    const useState = enableReinitialize
      ? useEditableSingletonStateHook
      : useSingletonStateHook;

    return useState as unknown as Hook;
  };

  return {
    createSingletonStateHook,
    singletonState,
    updateSingletonState,
  };
};

export default SingletonState;
