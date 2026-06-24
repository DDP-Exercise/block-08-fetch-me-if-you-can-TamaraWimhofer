"use strict";

/*******************************************************
 *    Asynchronotrigger - 100p
 *
 *    This is your last assignment. Finish this to proof that
 *    you are a grown up now, who doesn't need to be held by
 *    the hand.
 *
 *    Create a users-class. Fetch the users, create Instances.
 *    - https://jsonplaceholder.typicode.com/users
 *
 *    Create a posts-class. Fetch the posts. create Instances.
 *    Assign them to the users (see userId in the posts).
 *    - https://jsonplaceholder.typicode.com/posts
 *
 *    Print the shit. Beautifully:
 *    List the 10 users. On click, expand them with their posts.
 *    Each Post should also have a Button to "load comments".
 *    Yes, you are correct. This is the perfect usecase for
 *    event-delegation! You can get the comments to a post from either
 *    - https://jsonplaceholder.typicode.com/posts/1/comments
 *    or
 *    - https://jsonplaceholder.typicode.com/comments?postId=1
 *    where "1" stands for the posts ID of course.
 *
 *    I believe in...
 *    You - 2026-06-09
 *  *******************************************************/

import { User } from './class.user.js';
import { Post } from './class.post.js';

const usersArray = [];

async function init() {
    const appContainer = document.createElement('div');
    appContainer.id = 'app';
    document.body.appendChild(appContainer);

    try {
        const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        const usersData = await usersResponse.json();

        usersData.forEach(u => {
            const newUser = new User(u.id, u.name, u.username, u.email, u.website);
            usersArray.push(newUser);
        });

        const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const postsData = await postsResponse.json();

        postsData.forEach(p => {
            const newPost = new Post(p.id, p.title, p.body);
            const user = usersArray.find(u => u.id === p.userId);
            if (user) {
                user.posts.push(newPost);
            }
        });

        renderUsers(appContainer);

        setupEventListeners(appContainer);

    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        appContainer.innerHTML = "<p>Daten konnten nicht geladen werden.</p>";
    }
}

function renderUsers(container) {
    container.innerHTML = usersArray.map(user => user.render()).join('');
}

function setupEventListeners(container) {
    container.addEventListener('click', async (event) => {
        const target = event.target;

        const userCard = target.closest('.user-card');

        if (userCard && target.tagName !== 'BUTTON' && target.tagName !== 'A') {
            const userId = userCard.dataset.userId;
            const postsContainer = document.getElementById(`user-posts-${userId}`);

            if (postsContainer.children.length === 1) {
                const user = usersArray.find(u => u.id == userId);
                const postsHtml = user.posts.map(post => post.render()).join('');
                postsContainer.insertAdjacentHTML('beforeend', postsHtml);
            }

            if (postsContainer.style.display === 'none') {
                postsContainer.style.display = 'block';
            } else {
                postsContainer.style.display = 'none';
            }
            return;
        }

        if (target.classList.contains('load-comments-btn')) {
            const postId = target.dataset.postId;
            const commentsContainer = document.getElementById(`post-comments-${postId}`);

            target.disabled = true;
            target.innerText = "Lade...";

            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
                const comments = await response.json();

                commentsContainer.innerHTML = comments.map(c => `
                    <div style="border-top: 1px dashed #ccc; padding: 5px 0;">
                        <strong>${c.name}</strong> (${c.email}):<br>
                        ${c.body}
                    </div>
                `).join('');

                target.remove();
            } catch (error) {
                console.error("Fehler beim Laden der Kommentare:", error);
                target.disabled = false;
                target.innerText = "Fehler - Erneut versuchen";
            }
        }
    });
}

init();