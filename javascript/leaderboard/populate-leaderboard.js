if (document.readyState !== 'loading') {
    getLeaderboard()
} else {
    document.addEventListener('DOMContentLoaded', getLeaderboard)
}

function getLeaderboard() {
  let leaderboardNames = document.getElementsByClassName("leaderboard-name");
  let leaderboardUrl = "https://" + apiHost + "/leaders?limit=" + leaderboardNames.length
  fetch(leaderboardUrl).then(function(response) {
    return response.json()
  }).then(function(data) {
      populateLeaderboard(data)
  }).catch((error) => {
    console.log("Error retrieving leaderboard. API call failed.")
    console.error(error)
  })
}

function populateLeaderboard(leaderboardObj) {
  var leaderboardNames = document.getElementsByClassName("leaderboard-name")
  var leaderboardPoints = document.getElementsByClassName("leaderboard-points")
  var leaderboardLocationAdds = document.getElementsByClassName("leaderboard-location-add-count")
  var leaderboardVerifications = document.getElementsByClassName("leaderboard-verification-count")
  var leaderboardReports = document.getElementsByClassName("leaderboard-report-count")
  var leaderboardBadge = document.getElementsByClassName("leaderboard-badge")

  // Make sure response is sorted by points descending
  leaderboardObj['items'].sort(function(a, b) {
    return b.points - a.points;
  })

  // Populate text fields for each user
  for (i = 0; i < leaderboardNames.length; i++) {
    leaderboardNames[i].innerHTML = leaderboardObj.items[i]['username']
    leaderboardPoints[i].innerHTML = leaderboardObj.items[i]['points'].toLocaleString()
    leaderboardLocationAdds[i].innerHTML = leaderboardObj.items[i]['submissions'].toLocaleString()
    leaderboardVerifications[i].innerHTML = leaderboardObj.items[i]['verifications'].toLocaleString()
    leaderboardReports[i].innerHTML = leaderboardObj.items[i]['reports'].toLocaleString()
    // Wait for UserRank class to be defined, then set badge URL
    setBadgeURLSource(i, leaderboardObj.items[i]['points'], leaderboardBadge)
  }
}

function setBadgeURLSource(index, points, leaderboardBadge){
  if(typeof UserRank !== "undefined"){
    let userRank = new UserRank(points)
    leaderboardBadge[index].src = userRank.rankBadgeURL
    console.log(userRank.rankBadgeURL)
  }
  else{
    setTimeout(setBadgeURLSource, 250, index, points, leaderboardBadge)
  }
}
