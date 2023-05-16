<script>
document.getElementById('log-in-button').addEventListener("click", userCookie)

function userCookie() {
   let userEmail = document.getElementById('wf-log-in-email').value
   let today = new Date()
   let expireDate = new Date(today)
   expireDate.setDate(today.getDate()+7)
   document.cookie = "user_email=" + userEmail + ";expires=" + expireDate.toGMTString() + ";Secure"
}
</script>
