const CLIENT_ID =
	"391762943773-9m31jfa75lk5o2fa3qe0evhpc7o90pmu.apps.googleusercontent.com"
const API_KEY = "AIzaSyCBemrBEoSgP2dIIhQHNCyZOlL16mJUJHc"
const DISCOVERY_DOC = "https://sheets.googleapis.com/$discovery/rest?version=v4"
const SCOPES = "https://www.googleapis.com/auth/spreadsheets"

let tokenClient
let gapiInited = false
let gisInited = false
function gapiLoaded() {
	gapi.load("client", intializeGapiClient)
}
async function intializeGapiClient() {
	await gapi.client.init({
		apiKey: API_KEY,
		discoveryDocs: [DISCOVERY_DOC],
	})
}

function gisLoaded() {
	tokenClient = google.accounts.oauth2.initTokenClient({
		client_id: CLIENT_ID,
		scope: SCOPES,
		callback: "", // defined later
	})
}
var isLogin = false
function handleAuthClick() {
	isLogin = true
	tokenClient.callback = async (resp) => {
		if (resp.error !== undefined) {
			throw resp
		}
	}
	if (gapi.client.getToken() === null) {
		tokenClient.requestAccessToken({ prompt: "consent" })
	} else {
		tokenClient.requestAccessToken({ prompt: "" })
		alert("done")
	}
}
let spreadsheetId = "13fTJSwrwRo9kPfKeoCjA_cobgLrmDtsTckq5AZBUlKE"

function execute() {
	if (isLogin == true) {
		let user_name = document.getElementById("uname").value
		let user_pass = document.getElementById("upsw").value
		let team_name = document.getElementById("uteam").value
		let team_weight = document.getElementById("uweight").value
		let team_size = document.getElementById("usize").value
		return gapi.client.sheets.spreadsheets.values
			.update({
				spreadsheetId: spreadsheetId,
				range: "data!A2:E33",
				includeValuesInResponse: false,
				responseDateTimeRenderOption: "FORMATTED_STRING",
				responseValueRenderOption: "FORMULA",
				valueInputOption: "USER_ENTERED",
				resource: {
					majorDimension: "DIMENSION_UNSPECIFIED",
					range: "data!A2:E33",
					values: [
						[
							user_name,
							user_pass,
							team_name,
							team_size + " cm",
							team_size + " kg",
						],
					],
				},
			})
			.then(
				function (response) {
					alert("Update success")
					document.getElementById("id01").style.display = "none"
					document.getElementById("uname").value = ""
					document.getElementById("upsw").value = ""
					document.getElementById("uteam").value = ""
					document.getElementById("textarea").value = ""
				},
				function (err) {
					alert("Execute error", err)
					document.getElementById("id01").style.display = "none"
					document.getElementById("uname").value = ""
					document.getElementById("upsw").value = ""
					document.getElementById("uteam").value = ""
					document.getElementById("textarea").value = ""
				},
			)
	} else {
		alert("Please click Green button above to login first")
		document.getElementById("id01").style.display = "none"
		document.getElementById("uname").value = ""
		document.getElementById("upsw").value = ""
		document.getElementById("uteam").value = ""
		document.getElementById("textarea").value = ""
	}
}
function getValues(index) {
	gapi.client.sheets.spreadsheets.values
		.get({
			spreadsheetId: spreadsheetId,
			range: "data!A" + index + ":E" + index,
		})
		.then((response) => {
			response.result.values.forEach((val) => {
				document.getElementById("uname").value = val[0]
				document.getElementById("upsw").value = val[1]
				document.getElementById("uteam").value = val[2]
			})
		})
}
let index = 1
let currentIndex = 0
function searchData() {
	let name = document.getElementById("textarea").value

	gapi.client.sheets.spreadsheets.values
		.get({
			spreadsheetId: spreadsheetId,
			range: "data!A2:E33",
		})
		.then((response) => {
			response.result.values.forEach((val) => {
				index++
				if (name == val[0] && val[0] != null) {
					document.getElementById("uname").value = ""
					document.getElementById("upsw").value = ""
					document.getElementById("uteam").value = ""
					document.getElementById("textarea").value = ""
					document.getElementById("id01").style.display = "block"
					getValues(index)
					index = 0
				}
			})
		})
}

function searchToggle(obj, evt) {
	var container = $(obj).closest(".search-wrapper")
	if (!container.hasClass("active")) {
		container.addClass("active")
		evt.preventDefault()
	} else if (
		container.hasClass("active") &&
		$(obj).closest(".input-holder").length == 0
	) {
		container.removeClass("active")
		container.find(".search-input").val("")
	}
}
