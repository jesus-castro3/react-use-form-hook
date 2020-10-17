import { renderHook, cleanup, act } from '@testing-library/react-hooks'
import useFormHook from '.'

describe('useFormHook', () => {
  let formValues
  const validationMessages = {
    name: 'Invalid Name',
    last: 'Invalid Last',
    zip: 'Invalid Zip',
    phone: 'Invalid Phone',
  }
  const validationsMock = (target, values, errors) => {
    const errorsCopy = { ...errors }
    if (target && !values[target].length) {
      errorsCopy[target] = validationMessages[target]
    } else {
      delete errorsCopy[target]
    }
    return errorsCopy
  }

  beforeEach(() => {
    formValues = {
      name: 'john',
      last: 'doe',
      phone: '123',
      zip: '12345',
    }
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should set initial form state', () => {
    const validationMock = jest.fn().mockReturnValue({})
    const { result } = renderHook(() => useFormHook(formValues, validationMock))
    const { values } = result.current
    expect(values.name).toBe('john')
    expect(values.last).toBe('doe')
    expect(values.phone).toBe('123')
    expect(values.zip).toBe('12345')
  })

  it('should handleChange', () => {
    const validationMock = jest.fn().mockReturnValue({})
    const { result } = renderHook(() => useFormHook(formValues, validationMock))
    expect(result.current.values.name).toBe('john')
    expect(result.current.values.last).toBe('doe')
    expect(result.current.values.phone).toBe('123')
    expect(result.current.values.zip).toBe('12345')

    act(() => {
      result.current.handleChange({ target: { value: 'jane', name: 'name' } })
    })
    act(() => {
      result.current.handleChange({ target: { value: 'dane', name: 'last' } })
    })

    expect(result.current.values.name).toBe('jane')
    expect(result.current.values.last).toBe('dane')
    expect(Object.keys(result.current.errors).length).toBe(0)
    // expect(validationMock).toHaveBeenCalledTimes(2);
  })

  it('should handleBlur', () => {
    const alwaysValidMock = jest.fn().mockReturnValue({})
    const { result } = renderHook(() =>
      useFormHook(formValues, alwaysValidMock),
    )
    expect(result.current.values.name).toBe('john')
    expect(result.current.values.last).toBe('doe')
    expect(result.current.values.phone).toBe('123')
    expect(result.current.values.zip).toBe('12345')

    act(() => {
      result.current.handleBlur({
        target: { value: '11111', name: 'phone' },
        preventDefault: jest.fn(),
      })
    })
    act(() => {
      result.current.handleBlur({
        target: { value: '99999', name: 'zip' },
        preventDefault: jest.fn(),
      })
    })

    expect(result.current.values.phone).toBe('11111')
    expect(result.current.values.zip).toBe('99999')
    expect(Object.keys(result.current.errors).length).toBe(0)
    // expect(alwaysValidMock).toHaveBeenCalledTimes(2);
  })

  it('should handleSubmit', () => {
    const alwaysValidMock = jest.fn().mockReturnValue({})
    const validationSubmit = jest.fn()
    const { result } = renderHook(() =>
      useFormHook(formValues, alwaysValidMock, validationSubmit),
    )
    expect(result.current.values.name).toBe('john')
    expect(result.current.values.last).toBe('doe')
    expect(result.current.values.phone).toBe('123')
    expect(result.current.values.zip).toBe('12345')

    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() })
    })

    expect(Object.keys(result.current.errors).length).toBe(0)
    // expect(alwaysValidMock).toHaveBeenCalledTimes(4);
    expect(validationSubmit).toHaveBeenCalledWith(result.current.values)
  })

  it('should handleChange, with errors', () => {
    const { result } = renderHook(() =>
      useFormHook(formValues, validationsMock),
    )
    expect(result.current.values.name).toBe('john')
    expect(result.current.values.last).toBe('doe')
    expect(result.current.values.phone).toBe('123')
    expect(result.current.values.zip).toBe('12345')

    act(() => {
      result.current.handleChange({ target: { value: '', name: 'name' } })
    })
    act(() => {
      result.current.handleChange({ target: { value: '', name: 'last' } })
    })

    expect(result.current.values.name).toBe('')
    expect(result.current.values.last).toBe('')
    expect(Object.keys(result.current.errors).length).toBe(2)
    expect(result.current.errors.name).toBe(validationMessages.name)
    expect(result.current.errors.last).toBe(validationMessages.last)
    expect(result.current.isValid).toBeFalsy()
  })

  it('should handleBlur, with errors', () => {
    const { result } = renderHook(() =>
      useFormHook(formValues, validationsMock),
    )
    expect(result.current.values.name).toBe('john')
    expect(result.current.values.last).toBe('doe')
    expect(result.current.values.phone).toBe('123')
    expect(result.current.values.zip).toBe('12345')

    act(() => {
      result.current.handleBlur({
        target: { value: '', name: 'phone' },
        preventDefault: jest.fn(),
      })
    })
    act(() => {
      result.current.handleBlur({
        target: { value: '', name: 'zip' },
        preventDefault: jest.fn(),
      })
    })
    act(() => {
      result.current.handleBlur({
        target: { value: '', name: 'name' },
        preventDefault: jest.fn(),
      })
    })

    expect(result.current.values.phone).toBe('')
    expect(result.current.values.zip).toBe('')
    expect(result.current.values.name).toBe('')
    expect(Object.keys(result.current.errors).length).toBe(3)
    expect(result.current.errors.phone).toBe(validationMessages.phone)
    expect(result.current.errors.zip).toBe(validationMessages.zip)
    expect(result.current.errors.name).toBe(validationMessages.name)
    expect(result.current.isValid).toBeFalsy()
  })

  it('should handleSubmit, with errors', () => {
    const validationSubmit = jest.fn()
    const { result } = renderHook(() =>
      useFormHook(formValues, validationsMock, validationSubmit),
    )
    expect(result.current.values.name).toBe('john')
    expect(result.current.values.last).toBe('doe')
    expect(result.current.values.phone).toBe('123')
    expect(result.current.values.zip).toBe('12345')

    act(() => {
      result.current.handleBlur({
        target: { value: '', name: 'phone' },
        preventDefault: jest.fn(),
      })
    })
    act(() => {
      result.current.handleBlur({
        target: { value: '', name: 'zip' },
        preventDefault: jest.fn(),
      })
    })
    act(() => {
      result.current.handleBlur({
        target: { value: '', name: 'name' },
        preventDefault: jest.fn(),
      })
    })

    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() })
    })

    expect(Object.keys(result.current.errors).length).toBe(3)
    expect(result.current.errors.phone).toBe(validationMessages.phone)
    expect(result.current.errors.zip).toBe(validationMessages.zip)
    expect(result.current.errors.name).toBe(validationMessages.name)
    expect(validationSubmit).toHaveBeenCalledWith(result.current.values)
    expect(result.current.isValid).toBeFalsy()
  })

  it('should handle validation criteria and return an error object', () => {
    const submitMock = jest.fn()
    const { result } = renderHook(() =>
      useFormHook(formValues, validationsMock, submitMock),
    )

    act(() => {
      result.current.handleChange({ target: { name: 'name', value: '' } })
    })
    act(() => {
      result.current.handleChange({ target: { name: 'phone', value: '' } })
    })

    expect(result.current.values.name).toBe('')
    expect(result.current.values.last).toBe('doe')
    expect(result.current.values.phone).toBe('')
    expect(result.current.values.zip).toBe('12345')
    expect(result.current.errors.name).toBe(validationMessages.name)
    expect(result.current.errors.phone).toBe(validationMessages.phone)
    expect(Object.keys(result.current.errors).length).toBe(2)
  })
})
