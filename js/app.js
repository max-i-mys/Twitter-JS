let pageHash = window.location.hash.slice(1)
const appEl = document.getElementById('app')
const pagesEls = Array.from(appEl.children)
switchPage(pageHash)
const dateFormatter = new Intl.DateTimeFormat()
const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit'
})
let tweets = [
    {
        "id": 1618235474432,
        "timestamp": 1618235474432,
        "text": "1",
        "liked": false
    },
    {
        "id": 1618235478198,
        "timestamp": 1618235478198,
        "text": "2",
        "liked": true
    },
    {
        "id": 1618235485033,
        "timestamp": 1618235485033,
        "text": "3",
        "liked": false
    },
    {
        "id": 1618235488868,
        "timestamp": 1618235488868,
        "text": "4",
        "liked": true
    },
    {
        "id": 1618235491402,
        "timestamp": 1618235491402,
        "text": "5",
        "liked": false
    }
]


window.addEventListener('popstate', () => {
    console.log('POPSTATE');
    pageHash = window.location.hash.slice(1)
    console.log(pageHash);
    switchPage(pageHash)
})

// {
//     id: 1,
//     text: 'dskjfjk',
//     liked: true,
//     timestamp: 1654654654564,
// }

document.addEventListener('submit', event=> {
    event.preventDefault()
    const form = event.target
    const text = form.message.value
    if (!text || text.length > 140) {
        alert('Validation error!')
        return
    }
    if (pageHash === 'add') {
        const newTweet = {
            id: Date.now(),
            timestamp: Date.now(),
            text,
            liked: false
        }
        tweets.push(newTweet)
    }
    if (pageHash === 'edit') {
        
    }
    form.reset()
    renderTweets(tweets)
})

document.addEventListener('reset', () => {
    routePush('')
})

function renderTweets(tweetsArr) {

    appEl.querySelector('.tweet-list').innerHTML = 'tweets'
}

function createTweetHtml(tweetObj) {
    return `
    <div class="tweet ${tweetObj.liked ? 'liked' : ''} d-flex justify-content-between flex-wrap align-items-center p-2 mb-2 border" data-id="${tweetObj.id}">
        <p class="tweet-text w-75 m-0">text</p>
        <div class="tweet-actions w-25 d-flex align-items-center">
            <button data-action="like" class="btn btn-sm btn-primary mx-1">${tweetObj.liked ? 'Unlike' : 'Like'}</button>
            <button data-action="edit" class="btn btn-sm btn-secondary mx-1">Edit</button>
            <button data-action="remove" class="btn btn-sm btn-danger mx-1">Remove</button>
        </div>
        <small class="text-muted">${dateFormatter.format(tweetObj.timestamp)} ${timeFormatter.format(tweetObj.timestamp)}</small>
  </div>
    `
}





function routePush(route) {
    window.location.assign(`${window.location.origin}${window.location.pathname}#${route}`)
}

function switchPage(hash) {
    let route = hash || 'main'
    route += 'Page'
    pagesEls.forEach(page => {
        const match = page.id === route
        page.classList.toggle('hidden', !match)
    })
}


