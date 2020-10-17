import { useState } from 'react'

const useFormHook = (state, validations, submitForm) => {
  const [values, setValues] = useState(state)
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState(false)

  const handleValidations = (name, newValues) => {
    const validationErrors = validations(name, newValues, errors)
    setErrors(validationErrors)
    setIsValid(!Object.keys(validationErrors).length)
  }

  const handleBlur = (e) => {
    e.preventDefault()
    const newValues = {
      ...values,
      [e.target.name]: e.target.value,
    }
    setValues(newValues)
    handleValidations(e.target.name, newValues)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const newValues = { ...values, [name]: value }
    setValues(newValues)
    handleValidations(name, newValues)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitForm(values)
  }

  return {
    values,
    errors,
    isValid,
    handleChange,
    handleSubmit,
    handleBlur,
  }
}

export default useFormHook
