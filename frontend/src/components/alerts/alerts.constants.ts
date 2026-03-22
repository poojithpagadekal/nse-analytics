export const ALERT_TYPES = [
  {
    value: "PRICE_CHANGE",
    label: "Price change",
    hint: "Triggers when closing price crosses your threshold",
  },
] as const;

export const CONDITIONS = [
  { value: "GT", label: "rises above" },
  { value: "LT", label: "falls below" },
  { value: "EQ", label: "equals" },
] as const;

export type AlertTypeValue = (typeof ALERT_TYPES)[number]["value"];
export type ConditionValue = (typeof CONDITIONS)[number]["value"];

export const ALERT_TYPE_LABELS: Record<AlertTypeValue, string> =
  Object.fromEntries(ALERT_TYPES.map((t) => [t.value, t.label])) as Record<
    AlertTypeValue,
    string
  >;

export const CONDITION_LABELS: Record<ConditionValue, string> =
  Object.fromEntries(CONDITIONS.map((c) => [c.value, c.label])) as Record<
    ConditionValue,
    string
  >;
