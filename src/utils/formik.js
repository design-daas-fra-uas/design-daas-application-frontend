// The legacy admin/expert forms submit through `<Form onSubmit={handler}>` and
// keep their values in component state; Formik is only used for validation
// there, so its own `onSubmit` has nothing to do.
export const SUBMIT_HANDLED_BY_FORM = () => {};
