// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

const formSchema = Yup.object().shape({
  username: Yup.string()
     .min(3, e.usernameMin)
     .max(20, e.usernameMax)
     .required(e.usernameRequired),
  favLanguage: Yup.string()
     .oneOf(['javascript', 'rust'], e.favLanguageOptions)
     .required(e.favLanguageRequired),
  favFood: Yup.string()
     .oneOf(['pizza', 'spaghetti', 'broccoli'], e.favFoodOptions)
     .required(e.favFoodRequired),
  agreement: Yup.boolean()
     .oneOf([true], e.agreementOptions)
     .required(e.agreementRequired),
});

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.

  const [formData, setFormData] = useState({
    username: '',
    favLanguage: '',
    favFood: '',
    agreement: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
  useEffect(() => {
    formSchema.isValid(formData).then((valid) => {
      setIsSubmitDisabled(!valid);
    });
  }, [formData]);

  const onChange = evt => {
    const { name, value, type, checked } = evt.target;

    // Handle checkbox input separately
    const newValue = type === 'checkbox' ? checked : value;

    // Update form data state
    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Validate the updated value and set errors
    Yup.reach(formSchema, name)
      .validate(newValue)
      .then(() => {
        // If the field is valid, remove any error for that field
        setErrors({
          ...errors,
          [name]: '',
        });
      })
      .catch(err => {
        // If the field is invalid, set the error message
        setErrors({
          ...errors,
          [name]: err.message,
        });
      });
  };

  const onSubmit = evt => {
    evt.preventDefault(); // Prevent default form submission behavior
    axios
      .post('https://webapis.bloomtechdev.com/registration', formData)
      .then(() => {
        setSuccessMessage('Success! Welcome, new user!');
        setErrorMessage('');
        setFormData({
          username: '',
          favLanguage: '',
          favFood: '',
          agreement: false,
        });
      })
      .catch(err => {
        setErrorMessage('Sorry! Username is taken.');
        setSuccessMessage('');
      });
  };

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      {successMessage && <h4 className="success">{successMessage}</h4>}
      {errorMessage && <h4 className="error">{errorMessage}</h4>}

      <form onSubmit={onSubmit}>
        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" placeholder="Type Username" value={formData.username} onChange={onChange} />
          <div className="validation">{errors.username}</div>
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input type="radio" name="favLanguage" value="javascript" checked={formData.favLanguage === 'javascript'} onChange={onChange} />
              JavaScript
            </label>
            <label>
              <input type="radio" name="favLanguage" value="rust" checked={formData.favLanguage === 'rust'} onChange={onChange} />
              Rust
            </label>
          </fieldset>
          <div className="validation">{errors.favLanguage}</div>
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" value={formData.favFood} onChange={onChange}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          <div className="validation">{errors.favFood}</div>
        </div>

        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" name="agreement" checked={formData.agreement} onChange={onChange} />
            Agree to our terms
          </label>
          <div className="validation">{errors.agreement}</div>
        </div>

        <div>
          <input type="submit" value="Register" disabled={isSubmitDisabled} />
        </div>
      </form>
    </div>
  );
}
