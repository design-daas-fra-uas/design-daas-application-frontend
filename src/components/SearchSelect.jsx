import { useId, useMemo, useRef, useState } from 'react';
import { Col } from 'react-bootstrap';
import { ErrorMessage, useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { Highlight } from './actions/Combobox';

const matchesQuery = (option, needle) =>
  !needle || [option.label, option.hint].some((text) => text?.toLowerCase().includes(needle));

// Searchable replacement for a <select> in a Formik form (ARIA 1.2 combobox with a listbox
// popup), for lists too long to scroll through. Unlike Combobox only listed options can be
// picked. `options` are `{ value, label, hint?, icon? }` with string values; the field holds
// one value, or with `multiple` an array of values that are shown as removable chips.
function SearchSelect({ id, name, options, multiple = false, placeholder, describedBy, invalid }) {
  const { t } = useTranslation();
  const [field, , helpers] = useField(name);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const inputRef = useRef(null);
  const listId = `${useId()}-list`;

  const selected = useMemo(
    () => (multiple ? (field.value ?? []) : field.value ? [field.value] : []),
    [field.value, multiple],
  );
  const needle = query.trim().toLowerCase();
  const visible = useMemo(() => options.filter((option) => matchesQuery(option, needle)), [options, needle]);
  const labelOf = (value) => options.find((option) => option.value === value)?.label ?? value;
  const optionId = (index) => `${listId}-${index}`;

  const show = () => {
    setOpen(true);
    setActive(-1);
  };
  const close = () => {
    setOpen(false);
    setActive(-1);
    setQuery('');
  };
  const setSelected = (values) => helpers.setValue(multiple ? values : (values[0] ?? ''));

  const choose = (option) => {
    if (!multiple) {
      setSelected([option.value]);
      close();
      return;
    }
    setSelected(
      selected.includes(option.value) ? selected.filter((v) => v !== option.value) : [...selected, option.value],
    );
  };
  const selectAllShown = () => setSelected([...new Set([...selected, ...visible.map((option) => option.value)])]);

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
      case 'Enter':
        if (open && active >= 0 && visible[active]) {
          event.preventDefault();
          choose(visible[active]);
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          event.stopPropagation(); // keeps the surrounding modal open
          close();
        }
        break;
      case 'Backspace':
        if (multiple && !query && selected.length) {
          setSelected(selected.slice(0, -1));
        }
        break;
      default:
        break;
    }
  };

  // Closed, a single select shows its choice in the input; open, the input is the search.
  const inputValue = !multiple && !open ? (selected[0] ? labelOf(selected[0]) : '') : query;

  return (
    <div className="search-select">
      {multiple && selected.length > 0 && (
        <ul className="select-chips" aria-label={t('select-selected', { count: selected.length })}>
          {selected.map((value) => (
            <li key={value} className="select-chip">
              <span>{labelOf(value)}</span>
              <button
                type="button"
                aria-label={`${t('select-remove')}: ${labelOf(value)}`}
                title={t('select-remove')}
                onClick={() => setSelected(selected.filter((v) => v !== value))}
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className={`combobox${open ? ' is-open' : ''}`}>
        <i className="fa-solid fa-magnifying-glass combobox-icon" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          className={`form-control combobox-input${invalid ? ' is-invalid' : ''}`}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          autoComplete="off"
          spellCheck="false"
          placeholder={placeholder ?? t('select-search')}
          value={inputValue}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(event.target.value.trim() ? 0 : -1);
          }}
          onFocus={show}
          onClick={() => !open && show()}
          onBlur={(event) => {
            close();
            field.onBlur(event);
          }}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className="combobox-button combobox-toggle"
          aria-label={t('select-toggle')}
          tabIndex={-1}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => (open ? close() : inputRef.current?.focus())}
        >
          <i className="fa-solid fa-chevron-down" aria-hidden="true" />
        </button>

        <div className="combobox-popup" hidden={!open}>
          <div className="combobox-count search-select-head">
            <span aria-hidden="true">{t('select-count', { count: visible.length, total: options.length })}</span>
            {multiple && (
              <span className="search-select-actions">
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={selectAllShown}
                  disabled={!visible.length}
                >
                  {t('select-all-shown')}
                </button>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setSelected([])}
                  disabled={!selected.length}
                >
                  {t('select-clear')}
                </button>
              </span>
            )}
          </div>
          <ul
            id={listId}
            role="listbox"
            aria-multiselectable={multiple || undefined}
            aria-label={t('select-toggle')}
            className="combobox-list"
          >
            {visible.map((option, index) => {
              const isSelected = selected.includes(option.value);
              return (
                <li
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  className={`combobox-option${index === active ? ' is-active' : ''}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(option)}
                >
                  {multiple ? (
                    <i
                      className={`${isSelected ? 'fa-solid fa-square-check' : 'fa-regular fa-square'} search-select-box`}
                      aria-hidden="true"
                    />
                  ) : (
                    option.icon && <i className={`fa-solid ${option.icon} combobox-option-icon`} aria-hidden="true" />
                  )}
                  <span className="combobox-option-text">
                    <span className="combobox-option-value">
                      <Highlight text={option.label} query={query.trim()} />
                    </span>
                    {option.hint && (
                      <span className="combobox-option-label">
                        <Highlight text={option.hint} query={query.trim()} />
                      </span>
                    )}
                  </span>
                  {!multiple && isSelected && <i className="fa-solid fa-check combobox-check" aria-hidden="true" />}
                </li>
              );
            })}
          </ul>
          {!visible.length && (
            <div className="combobox-state" role="status">
              {options.length ? t('select-no-match', { query: query.trim() }) : t('select-empty')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// SearchSelect with a label and the field's error, laid out like FormField.
export function SearchSelectField({ name, label, ...selectProps }) {
  const [, meta] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);
  return (
    <Col xs={12} className="form-group">
      <label htmlFor={name}>{label}</label>
      <SearchSelect id={name} name={name} describedBy={`${name}-error`} invalid={hasError} {...selectProps} />
      <div id={`${name}-error`} className="error-text" role={hasError ? 'alert' : undefined}>
        <ErrorMessage name={name} />
      </div>
    </Col>
  );
}

export default SearchSelect;
