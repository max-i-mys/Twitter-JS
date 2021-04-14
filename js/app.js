let pageHash = window.location.hash.slice(1)
const appEl = document.getElementById("app")
const pagesEls = Array.from(appEl.children)
switchPage(pageHash)
const dateFormatter = new Intl.DateTimeFormat()
const timeFormatter = new Intl.DateTimeFormat(undefined, {
	hour: "2-digit",
	minute: "2-digit",
})

if (!localStorage.getItem("tweets")) {
	localStorage.setItem("tweets", JSON.stringify([]))
}

let tweets = JSON.parse(localStorage.getItem("tweets"))

renderTweets(tweets, "tweet-list")

window.addEventListener("popstate", () => {
	console.log("POPSTATE")
	pageHash = window.location.hash.slice(1)
	switchPage(pageHash)
	if (pageHash === "liked") {
		const likedTweets = tweets.filter(likedTweet => likedTweet.liked == true)
		console.log(likedTweets)
		renderTweets(likedTweets, "tweet-list-liked")
	}
})

function filterLikedTweet() {}

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
		localStorage.setItem("tweets", JSON.stringify(tweets))
	}
	if (pageHash === "edit") {
	}
	form.reset()
	renderTweets(tweets, "tweet-list")
})

document.addEventListener("reset", () => {
	routePush("")
})
//?--------------------Buttons action start-----------------------//
appEl.addEventListener("click", event => {
	//*------- Like/unlike start -------//
	const likeBtnEl = event.target.closest(".btn-like")
	let tweetId = null
	if (likeBtnEl) {
		tweetId = likeBtnEl.closest(".tweet").dataset.id
		tweets.forEach(tweet => {
			if (tweet["id"] == tweetId) {
				tweet.liked = !tweet.liked
			}
		})
	}
	//*------- Like/unlike end -------//
	//*------- Delete tweet start -------//
	const deleteBtn = event.target.closest(".btn-delete")
	if (deleteBtn) {
		tweetId = deleteBtn.closest(".tweet").dataset.id
		const indexTweet = tweets.findIndex(tweet => tweet["id"] == tweetId)
		tweets.splice(indexTweet, 1)
	}
	//*------- Delete tweet end -------//
	localStorage.setItem("tweets", JSON.stringify(tweets))
	renderTweets(tweets, "tweet-list")
})
//?--------------------Buttons action end-----------------------//
function renderTweets(tweetsArr, addClass) {
	const tweetListEl = appEl.querySelector(`.${addClass}`)
	tweetListEl.innerHTML = ""
	for (let i = 0; i < tweetsArr.length; i++) {
		tweetListEl.insertAdjacentHTML("afterbegin", createTweetHtml(tweetsArr[i]))
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
            <button data-action="like" class="btn btn-like btn-sm mx-1 ${
							tweetObj.liked ? "btn-outline-primary" : "btn-primary"
						}">${tweetObj.liked ? "Unlike" : "Like"}</button>
            <button data-action="edit" class="btn btn-sm btn-secondary mx-1">Edit</button>
            <button data-action="remove" class="btn btn-delete btn-sm btn-danger mx-1">Remove</button>
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
	let route = hash || "main"
	route += "Page"
	pagesEls.forEach(page => {
		const match = page.id === route
		page.classList.toggle("hidden", !match)
	})
}
