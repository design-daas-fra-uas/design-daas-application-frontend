import { useMemo } from 'react';
import * as Yup from 'yup';

import { emailSchema, newPasswordSchema } from '../utils/validation';

// Value of the group select while no group is chosen.
export const NO_GROUP = '0';

// Validation shared by every "create account" form: `adminSchema` has no group,
// `userSchema` additionally requires one.
export default function useAccountSchemas(t) {
  return useMemo(() => {
    const adminSchema = Yup.object().shape({
      name: Yup.string().trim().required(t('error-username-required', 'Username is required.')),
      email: emailSchema(t),
      password: newPasswordSchema(t),
    });
    const userSchema = adminSchema.shape({
      group: Yup.string()
        .notOneOf([NO_GROUP], t('error-group-required', 'Group is required.'))
        .required(t('error-group-required', 'Group is required.')),
    });
    return { adminSchema, userSchema };
  }, [t]);
}