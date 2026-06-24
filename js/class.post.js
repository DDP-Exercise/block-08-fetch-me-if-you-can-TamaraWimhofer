"use strict";

/*******************************************************
 *  Posts
 *
 *  See: https://jsonplaceholder.typicode.com/posts
 *
 *  Your posts should have:
 *      -id
 *      -title
 *      -body
 *
 *  You can skip the userId, your users know their posts (see class.user.js)
 *
 *  posts should also have comments[] (see main.js).
 *
 *  When printing a post, don't forget to make a button that
 *  loads the comments for the post. Once they are loaded, print them.
 *  *******************************************************/

export class Post {
    constructor(id, title, body) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.comments = [];
    }

    render() {
        return `
            <div class="post-card" style="background: #f9f9f9; padding: 10px; margin: 5px 0; border-left: 3px solid #007BFF;">
                <h5>${this.title}</h5>
                <p>${this.body}</p>
                <button class="load-comments-btn" data-post-id="${this.id}">Kommentare laden</button>
                <div class="post-comments" id="post-comments-${this.id}" style="margin-top: 5px; font-size: 0.9em; color: #555;"></div>
            </div>
        `;
    }
}