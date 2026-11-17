// "Name A, Name B" for the given IDs, looked up in `items` ({ id, description });
// an item that is not (yet) loaded shows as "#<id>".
export const namesOf = (ids, items) =>
  (ids ?? []).map((id) => items?.find((item) => item.id === id)?.description ?? `#${id}`).join(', ');
