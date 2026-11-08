import * as Yup from 'yup';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Email must look like name@domain.tld.
export const emailSchema = (t) =>
  Yup.string()
    .trim()
    .required(t('error-email-required', 'Email is required.'))
    .matches(EMAIL_PATTERN, t('error-email-format', 'Enter a valid email address, e.g. name@example.com.'));

// Same rule as the backend and the hint shown in the form (password-detail-info). Not trimmed on purpose.
export const newPasswordSchema = (t) =>
  Yup.string()
    .required(t('error-password-required', 'Password is required.'))
    .min(8, t('error-password-length', 'Password must be 8-72 characters long.'))
    .max(72, t('error-password-length', 'Password must be 8-72 characters long.'))
    .matches(/[A-Z]/, t('error-password-upper', 'Password must contain at least one uppercase letter.'))
    .matches(/[a-z]/, t('error-password-lower', 'Password must contain at least one lowercase letter.'))
    .matches(/[0-9]/, t('error-password-digit', 'Password must contain at least one digit.'));
