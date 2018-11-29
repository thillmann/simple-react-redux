export interface Action<ActionType extends string = string, S = any> {
  type: ActionType;
  value?: S;
}
