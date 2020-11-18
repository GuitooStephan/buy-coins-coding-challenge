"use strict";

function toggleMobileMenu() {
    var menu = document.getElementById( 'mobile-menu' );
    menu.style.display = (menu.style.display === 'none' || !menu.style.display) ? 'flex' : 'none';
}

function toggleLoader( show ) {
    var loader = document.getElementById( 'loader-container' );
    loader.style.display = 'none';

    if ( show ) {
        var loader = document.getElementById( 'loader-container' );
        loader.style.display = 'flex';

        var mainDiv = document.getElementById( 'main' );
        mainDiv.style.display = 'none';
    } else {
        var loader = document.getElementById( 'loader-container' );
        loader.style.display = 'none';

        var mainDiv = document.getElementById( 'main' );
        mainDiv.style.display = 'block';
    }
}

function toggleError( show ) {
    var loader = document.getElementById( 'loader-container' );
    loader.style.display = 'none';

    var mainDiv = document.getElementById( 'main' );
    mainDiv.style.display = 'none';

    if ( show ) {
        var mainDiv = document.getElementById( 'error-container' );
        mainDiv.style.display = 'block';
    } else {
        var mainDiv = document.getElementById( 'error-container' );
        mainDiv.style.display = 'none';
    }
}

function changeElementContent( id, value ) {
    var el = document.getElementById( id );
    el.innerText = value;
}

function updateStatus( id, emojiHTML, message ) {
    var statusContainer = document.getElementById( id );
    statusContainer.innerHTML = `
        <div class="status-circle">
            <div class="icon">
                ${emojiHTML}
            </div>
            <div class="info">${message}</div>
        </div>
    `;
} 

function changeImageSrc( id, source ) {
    var img = document.getElementById( id );
    img.src = source;
}

function requestGithubData( token ) {
    var body = JSON.stringify({
        query: `
            query {
                user(login: "GuitooStephan") {
                    id
                    avatarUrl
                    name
                    login
                    bio
                    status {
                        message
                        emojiHTML
                    }
                    repositories(first: 20, privacy: PUBLIC) {
                        totalCount
                        nodes {
                            name
                            description
                            languages(first: 1) {
                                nodes {
                                    color
                                    name
                                }
                            }
                            updatedAt
                            forkCount
                            stargazerCount
                        }
                    }
                }
            }`
    });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if( this.readyState == 4 && ( this.status == 500 || this.status == 401 ) ) {
            toggleError( true );
        }

        if (this.readyState == 4 && this.status == 200) {
            toggleLoader( false );

            var data = JSON.parse( this.responseText );

            // Update images src
            changeImageSrc( 'mobile-navbar-profile-picture', data.data.user.avatarUrl );
            changeImageSrc( 'desktop-navbar-profile-picture', data.data.user.avatarUrl );
            changeImageSrc( 'sticky-bar-profile-picture', data.data.user.avatarUrl );
            changeImageSrc( 'main-avatar', data.data.user.avatarUrl );

            // Change Elements content
            changeElementContent( 'full-name-div', data.data.user.name );
            changeElementContent( 'username-div', data.data.user.login );
            changeElementContent( 'sticky-bar-username', data.data.user.login );
            changeElementContent( 'bio-div', data.data.user.bio );
            changeElementContent( 'repo-count-container', data.data.user.repositories.totalCount );
            changeElementContent( 'mobile-repo-number-badge', data.data.user.repositories.totalCount );
            changeElementContent( 'desktop-repo-number-badge', data.data.user.repositories.totalCount );

            // Update Status
            updateStatus( 'mobile-status-container', data.data.user.status.emojiHTML, data.data.user.status.message );
            updateStatus( 'desktop-status-container', data.data.user.status.emojiHTML, data.data.user.status.message );

            // List repro
            var repoList = document.getElementById( 'repo-list' );
            var repos = data.data.user.repositories.nodes;
            if ( repos.length ) {
                var content = ``;
                repos.forEach( r => {
                    var languages = r.languages.nodes;
                    var languagesHTML = ``;
                    languages.forEach( l => {
                        languagesHTML += `
                            <span class="ml-0 mr-3">
                                <span class="repo-language-color" style="background-color: ${l.color}"></span>
                                <span>${l.name}</span>
                            </span>
                        `;
                    } );

                    var date = new Date( r.updatedAt );
                    var formatedDate = date.toLocaleDateString(undefined, {day:'numeric'}) + ' ' + date.toLocaleDateString(undefined, {month:'short'} );

                    content += `
                        <div class="item">
                            <div class="left">
                                <div class="repo-name"><a href="javascript:void(0)">${r.name}</a></div>
                                <div class="description">
                                    <p>${r.description}</p>
                                </div>
                                <div class="details">
                                    ${languagesHTML}
                                    <a class="mr-3" href="javascript:void(0)">
                                        <svg aria-label="star" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
                                        ${r.stargazerCount}
                                    </a>
                                    <a class="mr-3" href="javascript:void(0)">
                                        <svg aria-label="fork" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
                                        ${r.forkCount}
                                    </a>
                                    Updated on ${ formatedDate }
                                </div>
                            </div>
                            <div class="right">
                                <div class="text-right">
                                    <button>
                                        <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
                                        star
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                } );
                repoList.innerHTML = content;
            } else {
                repoList.innerHTML = `
                    <div class="repo-empty-state py-5 mt-4">
                        <h2 class="mb-1 text-center">${data.data.user.login} doesn’t have any public repositories yet.</h2>
                    </div>
                `;
            }
        }
    };

    xhttp.open('POST', 'https://api.github.com/graphql', true);
    xhttp.setRequestHeader( 'Authorization', `bearer ${token}` );
    xhttp.setRequestHeader( 'Content-type', 'application/json' );
    xhttp.send( body );
}

function fetchEnvVariables(){
    toggleError( false );
    toggleLoader( true );

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse( this.responseText );
            requestGithubData( data.access_token );
        }
    };
    xhttp.open('GET', '/.netlify/functions/variables', true);
    xhttp.send();
}

window.addEventListener('scroll', function(e) {
    var info = document.getElementById( 'information' );
    var stickyUserInfo = document.getElementById( 'user-profile-sticky-bar' );
    if ( window.scrollY >= info.offsetTop ) {
        if ( !stickyUserInfo.classList.contains( 'show' ) ) stickyUserInfo.classList.add( 'show' );
    } else {
        stickyUserInfo.classList.remove( 'show' );
    }
});

fetchEnvVariables();
