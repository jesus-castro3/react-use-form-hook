# react-use-form-hook

> tiny form hook validator

[![NPM](https://img.shields.io/npm/v/react-use-form-hook.svg)](https://www.npmjs.com/package/react-use-form-hook) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-use-form-hook
```

## Usage

```jsx
import React, { Component } from 'react';

import useForm from 'react-use-form-hook';

function YourComponent() {
  const {
    values,
    errors,
    isValid,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useForm(yourStateObj, validationsFn, submitFn);

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        value={values.firstName}
        onBlur={handleBlur}
      />
      { errors.firstName && <span>{errors.firstName}</span>}
      <input
        name="lastName"
        value={values.lastName}
        onBlur={handleBlur}
      />
      { errors.lastName && <span>{errors.lastName}</span>}
      <button type="submit" disabled={isValid}></button>
    </form>
  )
}
```

## License

MIT © [jesus-castro3](https://github.com/jesus-castro3)
