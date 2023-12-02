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
        console.log(data.items[0].username)
        let navUsername = document.getElementById("nav-username")
        navUsername.innerText = data.items[0].username 
        let userRank = new UserRank(data.items[0].points)
        console.log(userRank.rank)
        console.log(userRank.rankBadgeURL)
        userRankBadge = document.getElementById('user-rank-badge')
        userRankBadge.src = userRank.rankBadgeURL 
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

    getRank(request) {
        if (this.points < 200) {
            var rank = 'unranked'
            var rankBadgeURL = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/62bc77546ff3769f0556670d_Dark-Badge2.svg'
        } else if (this.points < 500 ) {
            var rank = 'spotter'
            var rankBadgeURL = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fa42efe0379bf78d1570b2_R1%20Spotter%20A.svg'
        } else if (this.points < 2000 ) {
            var rank = 'forester'
            var rankBadgeURL = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fa42efb9f284a2d1a510ca_R2%20Forester%20A.svg'
        } else if (this.points < 4000 ) {
            var rank = 'outrider'
            var rankBadgeURL = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fa42ef0412abc870a69249_R3%20Outrider%20A.svg'
        } else if (this.points < 10000 ) {
            var rank = 'ranger'
            var rankBadgeURL = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fa42efc0cd30a67f18451b_R4%20Ranger%20A.svg'
        } else if (this.points >= 10000 ) {
            var rank = 'vanguard'
            var rankBadgeURL = 'https://uploads-ssl.webflow.com/5de4208c747d4127be796c74/65fa42ef45ec728e926c75e1_R5%20Vanguard%20A.svg'
        }
        if (request == 'rank') {
            return rank
        } else if ( request == 'badge-url') {
            return rankBadgeURL
        }
    }
}

wfLoggedinCookie = getCookie('wf_loggedin')
scUserUUIDCookie = getCookie('sc_user_uuid')
if (wfLoggedinCookie && !scUserUUIDCookie) {
  lookupUUID()
}

if (scUserUUIDCookie) {
    populateNavProfileDetails()
}
