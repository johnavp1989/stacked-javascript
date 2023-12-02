function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";")

    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=")

        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1])
        }
    }

    // Return null if not found
    return null
}

// Check for UUID element in DOM
function doesUUIDExist() {
    if (document.getElementById('user-account-frame').contentWindow.document.getElementById('uuid') !== null) {
	if (document.getElementById('user-account-frame').contentWindow.document.getElementById('uuid').value !== "") {
            return true
        }
    } else {
        return false
    }
}

// Keep checking iFrame until UUID field has been populated
function waitForIFrame() {
    return new Promise(function (resolve) {
        function checkIFrame() {
            let retries = 2
            if (doesUUIDExist()) {
                // Resolve the promise with the item reference
                resolve(document.getElementById('user-account-frame').contentWindow.document.getElementById('uuid').value)
            } else {
		if (retries > 0) {
		    retries--
                    // Continue checking until the item exists
                    setTimeout(checkIFrame, 500) // 1000 milliseconds = 1 second
                }
            }
        }

        checkIFrame()
    })
}

function lookupUUID() {
  let currentURLPath = window.location.pathname
  if (currentURLPath != "/log-in") {
      let i = document.createElement('iframe')
      i.style.display = 'none'
      i.src = '/user-account'
      i.id = 'user-account-frame'
      document.body.appendChild(i)

      waitForIFrame().then(function (uuid) {
          let today = new Date()
          let expireDate = new Date(today)
          expireDate.setDate(today.getDate()+7)
          document.cookie = "sc_user_uuid=" + uuid + ";expires=" + expireDate.toGMTString() + ";Secure"
      })
  }
}

function getUserProfileDetails() {
    let userProfileDetailsURL = "https://" + apiHost + "/user?uuid=" + scUserUUIDCookie
    console.log(userProfileDetailsURL)
    return fetch(userProfileDetailsURL)
        .then(response => response.json())
        .catch((error) => {
             console.log("Error retrieving leaderboard. API call failed.")
	     console.error(error)
	 })

}

function populateNavProfileDetails() {
    getUserProfileDetails().then(data => {
	console.log(data)
        let navUsername = document.getElementById("nav-username")
	if (navUsername != null) {
            navUsername.innerText = data.items[0].username
	}
        let navPoints = document.getElementById('nav-points')
	if (navPoints != null) {
            navPoints.innerText = data.items[0].points
	}
        let userRankBadge = document.getElementById('user-rank-badge')
	if (userRankBadge != null) {
            let userRank = new UserRank(data.items[0].points)
            userRankBadge.src = userRank.rankBadgeURL
	}

	// If this is the user-account page populate user-account details
	let accountPageUsername = document.getElementById("accountpage-username")
        if (accountPageUsername != null) {
            accountPageUsername.innerText = data.items[0].username
	}
	let accountPagePoints = document.getElementById("accountpage-points")
        if (accountPagePoints != null) {
            accountPagePoints.innerText = data.items[0].points
	}
	let accountPageSubmissions = document.getElementById("accountpage-submissions")
        if (accountPageSubmissions != null) {
            accountPageSubmissions.innerText = data.items[0].submissions
	}
	let accountPageVerifications = document.getElementById("accountpage-verifications")
        if (accountPageVerifications != null) {
            accountPageVerifications.innerText = data.items[0].verifications
	}
	let accountPageReports = document.getElementById("accountpage-reports")
        if (accountPageReports != null) {
            accountPageReports.innerText = data.items[0].reports
	}
	let accountPageBadge = document.getElementById("accountpage-badge")
        if (accountPageBadge != null) {
            let userRank = new UserRank(data.items[0].points)
	    console.log(userRank)
            accountPageBadge.src = userRank.rankBadgeURLBig
	}
    })
}

class UserRank {
    constructor(points) {
        this.points = points
    }

    get rank() {
        return this.getRank('rank')
    }

    get rankBadgeURL() {
        return this.getRank('badge-url')
    }

    get rankBadgeURLBig() {
        return this.getRank('badge-url-big')
    }

    getRank(request) {
        if (this.points < 200) {
            var rank = 'unranked'
            var rankBadgeURL = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fdf29d5e132676828fe58f_R0%20Camper%20B.svg'
            var rankBadgeURLBig = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/663bd5fe6e9ecee577252e74_R0%20Camper%20A.svg'
        } else if (this.points < 500 ) {
            var rank = 'spotter'
            var rankBadgeURL = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fdf29d2a519ba220935316_R1%20Spotter%20B.svg'
            var rankBadgeURLBig = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fa42efe0379bf78d1570b2_R1%20Spotter%20A.svg'
        } else if (this.points < 2000 ) {
            var rank = 'forester'
            var rankBadgeURL = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fdf29d0d26defd04903a1b_R2%20Forester%20B.svg'
            var rankBadgeURLBig = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fa42efb9f284a2d1a510ca_R2%20Forester%20A.svg'
        } else if (this.points < 4000 ) {
            var rank = 'outrider'
            var rankBadgeURL = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fdf29d207e0594174a262b_R3%20Outrider%20B.svg'
            var rankBadgeURLBig = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fa42ef0412abc870a69249_R3%20Outrider%20A.svg'
        } else if (this.points < 10000 ) {
            var rank = 'ranger'
            var rankBadgeURL = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fdf29db697634cfe344c3d_R4%20Ranger%20B.svg'
            var rankBadgeURLBig = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fa42efc0cd30a67f18451b_R4%20Ranger%20A.svg'
        } else if (this.points >= 10000 ) {
            var rank = 'vanguard'
            var rankBadgeURL = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fdf29d4d1c51e927eecc16_R5%20Vanguard%20B.svg'
            var rankBadgeURLBig = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fa42ef45ec728e926c75e1_R5%20Vanguard%20A.svg'
        }
        if (request == 'rank') {
            return rank
        } else if ( request == 'badge-url') {
            return rankBadgeURL
        } else if ( request == 'badge-url-big') {
            return rankBadgeURLBig
        }
    }
}

wfLoggedinCookie = getCookie('wf_loggedin')
scUserUUIDCookie = getCookie('sc_user_uuid')
if (wfLoggedinCookie && !scUserUUIDCookie) {
  lookupUUID()
} else {
  console.log("User not logged in and/or sc_user_uuid cookie not found")
}

if (scUserUUIDCookie) {
    populateNavProfileDetails()
}
