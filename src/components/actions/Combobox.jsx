import { useId, useMemo, useRef, useState } from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

// Splits `text` around the first case-insensitive match of `query`, so the match can be marked.
export function Highlight({ text, query }) {
  const index = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (index < 0) {
    return text;
  }
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export const matches = (item, query) => {
  const needle = query.trim().toLowerCase();
  return !needle || [item.value, item.label].some((text) => text?.toLowerCase().includes(needle));
};

// Searchable text input with a list of suggestions (ARIA 1.2 combobox with a listbox popup).
// `items` are `{ value, label, badge }` (badge: `{ key, values }` for t()); any typed value
// stays allowed, so an object that is
// not listed can still be used. `status` is 'loading' | 'loaded' | 'error'.
function Combobox({ id, name, items, status, describedBy }) {
  const { t } = useTranslation();
  const [field, , helpers] = useField(name);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef(null);
  const listId = `${useId()}-list`;

  const value = field.value ?? '';
  // An exact pick shows the whole list again, so the choice can be changed without clearing.
  const query = items.some((item) => item.value === value) ? '' : value;
  const visible = useMemo(() => items.filter((item) => matches(item, query)), [items, query]);
  const optionId = (index) => `${listId}-${index}`;

  const show = () => {
    setOpen(true);
    setActive(visible.findIndex((item) => item.value === value));
  };
  const close = () => {
    setOpen(false);
    setActive(-1);
  };
  const choose = (item) => {
    helpers.setValue(item.value);
    close();
  };
  const move = (step) => {
    if (!open) {
      show();
      return;
    }
    if (visible.length) {
      setActive((index) => (index + step + visible.length) % visible.length);
    }
  };

  const onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
      case 'End':
        if (open && visible.length) {
          event.preventDefault();
          setActive(event.key === 'Home' ? 0 : visible.length - 1);
        }
        break;
      case 'Enter':
        if (open && active >= 0 && visible[active]) {
          event.preventDefault();
          choose(visible[active]);
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          close();
        } else if (value) {
          helpers.setValue('');
        }
        break;
      default:
        break;
    }
  };

  let state = null;
  if (status === 'loading') {
    state = t('combobox-loading');
  } else if (status === 'error') {
    state = t('combobox-error');
  } else if (!visible.length) {
    state = items.length ? t('combobox-no-match', { query: query.trim() }) : t('combobox-empty');
  }

  return (
    <div className={`combobox${open ? ' is-open' : ''}`}>
      <i className="fa-solid fa-magnifying-glass combobox-icon" aria-hidden="true" />
      <input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        className="form-control combobox-input"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        spellCheck="false"
        placeholder={t('combobox-placeholder')}
        value={value}
        onChange={(event) => {
          helpers.setValue(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={show}
        onClick={show}
        onBlur={(event) => {
          close();
          field.onBlur(event);
        }}
        onKeyDown={onKeyDown}
      />
      {value && (
        <button
          type="button"
          className="combobox-button combobox-clear"
          aria-label={t('combobox-clear')}
          title={t('combobox-clear')}
          tabIndex={-1}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            helpers.setValue('');
            inputRef.current?.focus();
          }}
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      )}
      <button
        type="button"
        className="combobox-button combobox-toggle"
        aria-label={t('combobox-toggle')}
        tabIndex={-1}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          if (open) {
            close();
          } else {
            inputRef.current?.focus();
            show();
          }
        }}
      >
        <i className="fa-solid fa-chevron-down" aria-hidden="true" />
      </button>

      <div className="combobox-popup" hidden={!open}>
        {status === 'loaded' && items.length > 0 && (
          <div className="combobox-count" aria-hidden="true">
            {t('combobox-count', { count: visible.length, total: items.length })}
          </div>
        )}
        <ul id={listId} role="listbox" aria-label={t('combobox-toggle')} className="combobox-list">
          {visible.map((item, index) => (
            <li
              key={item.value}
              id={optionId(index)}
              role="option"
              aria-selected={item.value === value}
              className={`combobox-option${index === active ? ' is-active' : ''}`}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(item)}
            >
              <i className="fa-brands fa-docker combobox-option-icon" aria-hidden="true" />
              <span className="combobox-option-text">
                <span className="combobox-option-value">
                  <Highlight text={item.value} query={query.trim()} />
                </span>
                {item.label && (
                  <span className="combobox-option-label">
                    <Highlight text={item.label} query={query.trim()} />
                  </span>
                )}
              </span>
              {item.badge && <span className="combobox-badge">{t(item.badge.key, item.badge.values)}</span>}
              {item.value === value && <i className="fa-solid fa-check combobox-check" aria-hidden="true" />}
            </li>
          ))}
        </ul>
        {state && (
          <div className={`combobox-state${status === 'error' ? ' is-error' : ''}`} role="status">
            {state}
          </div>
        )}
      </div>
    </div>
  );
}

export default Combobox;
