import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';

const radioData = [
  {
    Id: 1,
    Description: 'jeden',
  },
  {
    Id: 2,
    Description: 'dva',
  },
  {
    Id: 3,
    Description: 'tri',
  },
];

const TableDemo = () => {
  const form = useForm({
    defaultValues: {
      people: [
        { name: 'test', age: 5, num: 2 },
        { name: 'test2', age: 5, num: undefined },
      ],
    },
    onSubmit: async ({ value }) => {
      console.log('onSubmit: ', value);
    },
    validators: {
      onChange: ({ value }) => {
        console.log('Form on change: ', value);
      },
    },
  });
  const { Field, handleSubmit, Subscribe, reset } = form;

  useEffect(() => {
    form.setFieldMeta('people[1].num', (prev) => ({
      ...prev,
      isTouched: true,
      isValid: false,
      errorMap: { onMount: 'Error on COL' },
    }));
    form.setFieldMeta('people[0]', (prev) => ({
      ...prev,
      isTouched: true,
      isValid: false,
      errorMap: { onMount: 'Error on ROW' },
    }));
    form.setFieldMeta('people', (prev) => ({
      ...prev,
      isTouched: true,
      isValid: false,
      errorMap: { onMount: 'Error on TABLE' },
    }));
  }, [form]);

  const verifyDuplicateValue = (
    arr: any[],
    objKey: string,
    errorMessage: string
  ): string | undefined => {
    const seen = new Set();
    const hasDuplicate = arr.some((item) => {
      if (seen.has(item[objKey])) return true;
      seen.add(item[objKey]);
      return false;
    });
    return hasDuplicate ? errorMessage : undefined;
  };

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return handleSubmit();
      }}
    >
      <h2>TableDemo</h2>

      <Field
        name="people"
        mode="array"
        validators={{
          onChange: ({ value }) => {
            console.log('on Table', value);
            return !value || value.length === 0
              ? 'At least one person is required'
              : verifyDuplicateValue(
                  value,
                  'age',
                  'Duplicate age values are not allowed'
                );
          },
        }}
      >
        {(table) => {
          return (
            <>
              {table.state.value.map((_, i) => {
                return (
                  <Field
                    key={i}
                    name={`people[${i}]`}
                    validators={{
                      onChange: ({ value }) => console.log('on Row', value),
                    }}
                  >
                    {(row) => {
                      console.log(row);
                      return (
                        <div className="my-4 grid grid-cols-3 gap-4">
                          <Field
                            name={`people[${i}].name`}
                            validators={{
                              onChange: ({ value }) => {
                                console.log(`on Col: #${value}#`);
                                return !value || value === ''
                                  ? 'Name is required'
                                  : undefined;
                              },
                            }}
                          >
                            {(col) => {
                              return (
                                <label>
                                  Name:
                                  <input
                                    type="text"
                                    className="disabled:text-fg-disabled read-only:text-body read-only:bg-tertiary bg-secondary-medium border-base-medium text-heading placeholder:text-body-subtle focus:border-border-brand hover:border-border-brand w-full rounded border px-2.5 py-1.5 pr-8 text-base"
                                    value={col.state.value}
                                    onChange={(e) =>
                                      col.handleChange(e.target.value)
                                    }
                                  />
                                  {col.state.meta.isTouched &&
                                  !col.state.meta.isValid ? (
                                    <p className="text-fg-danger-strong">
                                      {col.state.meta.errors.join(',')}
                                    </p>
                                  ) : null}
                                </label>
                              );
                            }}
                          </Field>
                          <Field
                            name={`people[${i}].age`}
                            validators={{
                              onChange: ({ value }) => {
                                console.log(`on Col: #${typeof value}#`);
                                return !value
                                  ? 'Age is required'
                                  : value < 3
                                    ? 'Cislo musi byt vetsi nez 2'
                                    : undefined;
                              },
                            }}
                          >
                            {(col) => {
                              return (
                                <label>
                                  Age:
                                  <input
                                    type="number"
                                    className="disabled:text-fg-disabled read-only:text-body read-only:bg-tertiary bg-secondary-medium border-base-medium text-heading placeholder:text-body-subtle focus:border-border-brand hover:border-border-brand w-full rounded border px-2.5 py-1.5 pr-8 text-base"
                                    value={col.state.value}
                                    onChange={(e) =>
                                      col.handleChange(Number(e.target.value))
                                    }
                                  />
                                  {col.state.meta.isTouched &&
                                  !col.state.meta.isValid ? (
                                    <p className="text-fg-danger-strong">
                                      {col.state.meta.errors.join(',')}
                                    </p>
                                  ) : null}
                                </label>
                              );
                            }}
                          </Field>
                          <Field
                            name={`people[${i}].num`}
                            validators={{
                              onChange: ({ value }) => {
                                console.log(`on Col: #${value}#`);
                                return !value ? 'Num is required' : undefined;
                              },
                            }}
                          >
                            {(col) => {
                              return (
                                <label>
                                  Num:
                                  <select
                                    className="disabled:text-fg-disabled bg-secondary-medium border-base-medium text-heading placeholder:text-body-subtle focus:border-border-brand hover:border-border-brand w-full rounded border px-2.5 py-1.5 text-base"
                                    onChange={(e) =>
                                      col.handleChange(Number(e.target.value))
                                    }
                                    value={col.state.value}
                                  >
                                    <option>-</option>
                                    {radioData.map((item) => (
                                      <option key={item.Id} value={item.Id}>
                                        {item.Description}
                                      </option>
                                    ))}
                                  </select>
                                  {col.state.meta.isTouched &&
                                  !col.state.meta.isValid ? (
                                    <p className="text-fg-danger-strong">
                                      {col.state.meta.errors.join(',')}
                                    </p>
                                  ) : null}
                                </label>
                              );
                            }}
                          </Field>

                          {row.state.meta.isTouched &&
                          !row.state.meta.isValid ? (
                            <p className="text-fg-danger-strong">
                              {row.state.meta.errors.join(',')}
                            </p>
                          ) : null}

                          <button
                            className="bg-danger hover:bg-danger-strong focus:bg-danger-strong focus:ring-danger-medium user-select-none col-span-3 inline-block min-w-9 cursor-pointer rounded px-2.5 py-1.5 text-center text-base font-medium text-white hover:text-white focus:ring-4 focus:outline-none"
                            onClick={() => {
                              table.removeValue(i);
                            }}
                            type="button"
                          >
                            Zrušit
                          </button>
                        </div>
                      );
                    }}
                  </Field>
                );
              })}

              {table.state.meta.isTouched && !table.state.meta.isValid ? (
                <p className="text-fg-danger-strong">
                  {table.state.meta.errors.join(',')}
                </p>
              ) : null}

              <button
                className="bg-brand hover:bg-brand-strong focus:bg-brand-strong focus:ring-brand-medium user-select-none inline-block min-w-9 cursor-pointer rounded px-2.5 py-1.5 text-center text-base font-medium text-white hover:text-white focus:ring-4 focus:outline-none"
                onClick={() =>
                  table.pushValue({ name: '', age: undefined, num: 1 })
                }
                type="button"
              >
                Add person
              </button>
            </>
          );
        }}
      </Field>
      <Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <>
            <button
              type="submit"
              // disabled={!canSubmit}
            >
              {isSubmitting ? '...' : 'Submit'}
            </button>
            <button
              type="reset"
              onClick={(e) => {
                // Avoid unexpected resets of form elements (especially <select> elements)
                e.preventDefault();
                reset();
              }}
            >
              Reset
            </button>
          </>
        )}
      />
    </form>
  );
};

export default TableDemo;
