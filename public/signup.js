const formDOM = document.querySelector('.auth-form')
const usernameInputDOM = document.querySelector('#username')
const emailInputDOM = document.querySelector('#email')
const passwordInputDOM = document.querySelector('#password')
const formAlertDOM = document.querySelector('.form-alert')

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const username = usernameInputDOM.value
  const email = emailInputDOM.value
  const password = passwordInputDOM.value

  formAlertDOM.style.display = 'block'
  formAlertDOM.textContent = 'Loading...'
  formAlertDOM.classList.remove('text-success', 'text-danger')

  try {
    const response = await axios.post('/api/v1/auth/register', {
      username,
      email,
      password,
    })

    if (response.data.user) {
      formAlertDOM.textContent = 'Account created successfully! Redirecting...'
      formAlertDOM.classList.add('text-success')
      // Redirect to tasks page after successful registration
      setTimeout(() => {
        window.location.href = 'index.html'
      }, 1500)
    } else {
      formAlertDOM.textContent = response.data.msg || 'Registration failed'
      formAlertDOM.classList.add('text-danger')
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.msg || 'An error occurred. Please try again.'
    formAlertDOM.textContent = errorMsg
    formAlertDOM.classList.add('text-danger')
  }

  setTimeout(() => {
    if (!formAlertDOM.classList.contains('text-success')) {
      formAlertDOM.style.display = 'none'
    }
  }, 3000)
})

