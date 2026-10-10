import * as Yup from 'yup';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Email must look like name@domain.tld.
export const emailSchema = (t) =>
  Yup.string()
    .trim()
    .required(t('error-email-required', 'Email is required.'))
    .matches(EMAIL_PATTERN, t('error-email-format', 'Enter a valid email address, e.g. name@example.com.'));

// Same rule as the hint shown in the form (password-detail-info). Not trimmed on purpose.
export const newPasswordSchema = (t) =>
  Yup.string()
    .required(t('error-password-required', 'Password is required.'))
    .min(8, t('error-password-length', 'Password must be at least 8 characters long.'))
    .matches(/[A-Z]/, t('error-password-upper', 'Password must contain at least one uppercase letter.'))
    .matches(/[a-z]/, t('error-password-lower', 'Password must contain at least one lowercase letter.'))
    .matches(/[^A-Za-z0-9\s]/, t('error-password-special', 'Password must contain at least one special character.'));
