const loggedOutLinks = document.querySelectorAll('.logged-out')
const loggedInLinks = document.querySelectorAll('.logged-in')

const loginCheck = (user) => {
	if (user) {
		loggedInLinks.forEach((link) => (link.style.display = 'block'))
		loggedOutLinks.forEach((link) => (link.style.display = 'none'))
	} else {
		loggedInLinks.forEach((link) => (link.style.display = 'none'))
		loggedOutLinks.forEach((link) => (link.style.display = 'block'))
	}
}

/* Signup acctions */
const signupForm = document.querySelector('#signup-form')

signupForm.addEventListener('submit', (e) => {
	e.preventDefault()

	const email = signupForm['signup-email'].value
	const password = document.querySelector('#signup-password').value

	if (email === '' || password === '') {
		swal('Oops!', 'Complete all fields.', 'danger')
	} else {
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// reset form
				signupForm.reset()
				// close modal
				$('#signupModal').modal('hide')

				swal('Good job!', 'Welcome!!!', 'success')
			})
	}
})
/* Signup acctions */

/* Signin acctions */
const signinForm = document.querySelector('#login-form')
signinForm.addEventListener('submit', (e) => {
	e.preventDefault()

	const email = signinForm['login-email'].value
	const password = document.querySelector('#login-password').value

	auth
		.signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// reset form
			signinForm.reset()
			// close modal
			$('#signinModal').modal('hide')

			swal('Good job!!', 'Welcome!!!', 'success')
		})
		.catch((e) => {
			swal('Oops!!', `${e.message}`, 'error')
		})
})
/* Signin acctions */

const logout = document.querySelector('#logout')
logout.addEventListener('click', (e) => {
	e.preventDefault()

	auth.signOut().then(() => {
		console.log('Sign out')
	})
})

// google login
const google = document.querySelector('#googleButton')
google.addEventListener('click', (e) => {
	const provider = new firebase.auth.GoogleAuthProvider()

	auth
		.signInWithPopup(provider)
		.then((result) => {
			$('#signinModal').modal('hide')

			console.log('Google sign in ---> ', result)
		})
		.catch((e) => {
			console.error(e.message)
		})
})

// facebook login
const facebook = document.querySelector('#facebookButton')
facebook.addEventListener('click', (e) => {
	const provider = new firebase.auth.FacebookAuthProvider()

	auth
		.signInWithPopup(provider)
		.then((result) => {
			console.log(result)
			console.log('Faceboo sign in')
		})
		.catch((e) => {
			console.error(e.message)
		})
})

// posts
const postList = document.querySelector('#posts')
const setupPosts = (data) => {
	if (data.length) {
		let html = ''

		data.forEach((doc) => {
			// convertimos la data en json
			const post = doc.data()

			const li = `
        <li class="list-group-item border-success">
          <h3 class="text-danger">${post.title}</h3>
          <p class="text-info mt-3">
            ${post.description}
          </p>
        </li>
      `

			html += li
		})

		postList.innerHTML = html
	} else {
		postList.innerHTML =
			'<p class="text-center h3 text-info">Login to see Posts</p>'
	}
}

// events
// list for auth state changes
// se ejecuta cada vez que un usuario esta logeado o no
auth.onAuthStateChanged((user) => {
	if (user) {
		fs.collection('posts')
			.get()
			.then((snapshot) => {
				const data = snapshot.docs
				setupPosts(data)
				loginCheck(user)
			})
	} else {
		setupPosts([])
		loginCheck(user)
	}
})
