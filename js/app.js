let pageHash = window.location.hash.slice(1)
const appEl = document.getElementById("app")
//------
const mainPageEl = document.getElementById("mainPage")
const likedPageEl = document.getElementById("likedPage")
//------
const pagesEls = Array.from(appEl.children)

const dateFormatter = new Intl.DateTimeFormat()
const timeFormatter = new Intl.DateTimeFormat(undefined, {
	hour: "2-digit",
	minute: "2-digit",
})

if (!localStorage.getItem("tweets")) {
	localStorage.setItem("tweets", JSON.stringify([]))
}

let tweets = JSON.parse(localStorage.getItem("tweets"))
let currentPageEl = null
switchPage(pageHash)

window.addEventListener("storage", () => {
	console.log("storage!")
	tweets = JSON.parse(localStorage.getItem("tweets"))
	renderTweets(tweets, currentPageEl)
})
window.addEventListener("popstate", () => {
	// console.log("POPSTATE")
	pageHash = window.location.hash.slice(1)
	switchPage(pageHash)
})

document.addEventListener("submit", event => {
	event.preventDefault()
	const form = event.target
	const text = form.message.value
	if (!text || text.length > 140) {
		alert("Validation error!")
		return
	}
	if (pageHash === "add") {
		const newTweet = {
			id: Date.now(),
			timestamp: Date.now(),
			text,
			liked: false,
		}

		tweets.push(newTweet)
	}
	if (pageHash.startsWith("edit")) {
		const tweetId = +pageHash.split("/")[1]
		const tweet = tweets.find(tweet => tweet.id === tweetId)
		tweet.text = text
	}
	localStorage.setItem("tweets", JSON.stringify(tweets))
	form.reset()
})

document.addEventListener("reset", () => {
	routePush("")
})
//?--------------------Buttons action start-----------------------//
appEl.addEventListener("click", event => {
	const actionBtnEl = event.target.closest(".tweet-action-btn")
	if (actionBtnEl) {
		const tweetId = +actionBtnEl.closest(".tweet").dataset.id
		const tweetIdx = tweets.findIndex(tweet => tweet.id === tweetId)
		const actionType = actionBtnEl.dataset.action
		const tweet = tweets[tweetIdx]
		switch (actionType) {
			case "like":
				tweet.liked = !tweet.liked
				break
			case "edit":
				routePush(`edit/${tweetId}`)
				break
			case "remove":
				tweets.splice(tweetIdx, 1)
				break
		}
		renderTweets(tweets, currentPageEl)
		localStorage.setItem("tweets", JSON.stringify(tweets))
	}
})
//?--------------------Buttons action end-----------------------//
function renderTweets(tweetsArr, currentPage) {
	const tweetListEl = currentPage.querySelector(`.tweet-list`)
	if (tweetListEl) {
		tweetsArr.sort((a, b) => (a.timestamp - b.timestamp) * -1)
		let renderArray = []
		if (pageHash === "liked") {
			renderArray = tweetsArr.filter(tweet => tweet.liked)
		} else {
			renderArray = tweetsArr
		}
		let tweetsHtml = ""
		renderArray.forEach(tweet => (tweetsHtml += createTweetHtml(tweet)))
		tweetListEl.innerHTML = tweetsHtml
		console.log(tweetsArr)
	}
}

function createTweetHtml(tweetObj) {
	return `
    <div class="tweet ${
			tweetObj.liked ? "liked" : ""
		} d-flex justify-content-between flex-wrap align-items-center p-2 mb-2 border" data-id="${
		tweetObj.id
	}">
        <p class="tweet-text w-75 m-0">${tweetObj.text}</p>
        <div class="tweet-actions w-25 d-flex align-items-center justify-content-end h-100">
            <button data-action="like" class="btn tweet-action-btn btn-sm mx-1 ${
							tweetObj.liked ? "btn-outline-primary" : "btn-primary"
						}">${tweetObj.liked ? "Unlike" : "Like"}</button>
            <button data-action="edit" class="btn tweet-action-btn btn-sm btn-secondary mx-1">Edit</button>
            <button data-action="remove" class="btn tweet-action-btn btn-sm btn-danger mx-1">Remove</button>
        </div>
        <small class="text-muted">${dateFormatter.format(
					tweetObj.timestamp
				)} ${timeFormatter.format(tweetObj.timestamp)}</small>
  </div>
    `
}

function routePush(route) {
	window.location.assign(
		`${window.location.origin}${window.location.pathname}#${route}`
	)
}

function switchPage(hash) {
	let route = hash
	if (route === "") {
		route = "main"
	} else if (route.startsWith("edit")) {
		route = "edit"
	}
	pagesEls.forEach(page => {
		const match = page.id === `${route}Page`
		if (match) {
			currentPageEl = page
		}
		page.classList.toggle("hidden", !match)
	})
	renderTweets(tweets, currentPageEl)
	if (route === "edit") {
		const tweetId = +pageHash.split("/")[1]
		if (isNaN(tweetId)) {
			routePush("")
			return
		}
		const tweet = tweets.find(tweet => tweet.id === tweetId)
		const tweetText = tweet.text
		const textArea = currentPageEl.querySelector("textarea")
		textArea.value = tweetText
	}
}
