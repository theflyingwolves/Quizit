var appID = '319389468245904';

window.fbAsyncInit = function() {
    FB.init({
        appId   : appID,
        oauth   : true,
        status  : true, // check login status
        cookie  : true, // enable cookies to allow the server to access the session
        xfbml   : true // parse XFBML
    });
};

function fb_login(callback){
    FB.login(function(response) {

        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            //console.log(response); // dump complete info
            access_token = response.authResponse.accessToken; //get access token
            user_id = response.authResponse.userID; //get FB UID
            FB.api('/me', function(response) {
                user_email = response.email; 
                user_birthday = response.birthday;
                console.log(user_email); //get user email
                console.log(user_birthday)
          // you can store this data into your database             
            });

            FB.api('/me/movies', function(response) {
                console.log("You like the following list of movies:");
                user_movies = response.data;
                console.log(response);
                for(var i = 0; i < user_movies.length; i++){
                  console.log(user_movies[i].name);
                }
            });

            FB.api('/me/friends', function(response) {
                console.log("You like the following list of friends:");
                user_movies = response.data;
                console.log(response);
                for(var i = 0; i < user_movies.length; i++){
                  console.log(user_movies[i].name);
                }
            });

            callback(response);
        } else {
            //user hit cancel button
            console.log('User cancelled login or did not fully authorize.');

        }
    }, {
        scope: 'publish_stream, email, user_birthday, user_likes, user_interests, user_tagged_places, user_friends'
    });
}

(function() {
    var e = document.createElement('script');
    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
}());