// requestSubmit() polyfill - Safari doesn't support this natively
(function(prototype) {
  if (typeof prototype.requestSubmit == "function") return

  prototype.requestSubmit = function(submitter) {
    if (submitter) {
      validateSubmitter(submitter, this)
      submitter.click()
    } else {
      submitter = document.createElement("input")
      submitter.type = "submit"
      submitter.hidden = true
      this.appendChild(submitter)
      submitter.click()
      this.removeChild(submitter)
    }
  }

  function validateSubmitter(submitter, form) {
    submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'")
    submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button")
    submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError")
  }

  function raise(errorConstructor, message, name) {
    throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name)
  }
})(HTMLFormElement.prototype)

function checkUsername() {
  document.getElementsByClassName("w-form-fail")[0].style.display = 'none'
  console.log(document.getElementById("username"))
  let username = document.getElementById("username").value
  let url = "https://" + apiHost + "/check_user?user=" + username
  console.log(url)
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not 200 OK')
        console.log('API response: ' + text)
      }
      response.json().then(json => {
        //if (text == 'Validation Failure') {
        //  console.log('API response: ' + text)
        //  throw new Error('Submission validation error')
        //} else if (text == 'Slug missing') {
        //  console.log('API response: ' + text)
        //  throw new Error('Slug missing error')
        //}
	console.log(json.result.status)
        var signUpForm = document.getElementById("sign-up-form")
        // Override the default behavior of submit. We'll call it later
        signUpForm.addEventListener('submit', (e) => {
          $('html,body').scrollTop(0)
        })
        if (json.result.status == 1) {
	  console.log('username exists')
          document.getElementsByClassName("w-form-fail")[0].style.display = 'inherit'
        } else {
          // Submit forrm on API call success
          console.log('submiting form')
          signUpForm.requestSubmit()
        }
      }).catch( (error) => {
        console.log('Form submission failed ' + error)
        document.getElementsByClassName("w-form-fail")[0].style.display = 'inherit'
      })
  }).catch( (error) => {
    console.log('API call failed ' + error)
    document.getElementsByClassName("w-form-fail")[0].style.display = 'inherit'
  })
}

$(document).ready(function(){
  let submitButton = document.getElementById("submit-sign-up-form")
  submitButton.addEventListener("click", checkUsername)
})
