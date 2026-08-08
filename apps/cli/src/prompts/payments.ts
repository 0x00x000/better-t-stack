import type { Auth, Backend, Frontend, Payments } from "../types";

export async function getPaymentsChoice(
  payments?: Payments,
  _auth?: Auth,
  _backend?: Backend,
  _frontends?: Frontend[],
  _previousValue?: Payments,
) {
  if (payments !== undefined) return payments;
  return "none" as Payments;
}
