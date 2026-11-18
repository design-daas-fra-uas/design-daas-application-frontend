import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Sets the browser tab title to "<title> - DaaS - DESIGN", so every page has its
// own title (screen readers announce it when the page changes).
function useDocumentTitle(title) {
  const { t } = useTranslation();
  const suffix = t('app-name-suffix');

  useEffect(() => {
    document.title = title ? `${title} - ${suffix}` : suffix;
  }, [title, suffix]);
}

export default useDocumentTitle;
